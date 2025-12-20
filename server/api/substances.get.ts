// server/api/substances.get.ts
import { createError, getQuery } from "h3";
import { readdir, readFile } from "fs/promises";
import { join } from "path";
import Fuse from "fuse.js";

import type { Substance } from "~/types/substance";

/** 内部用：検索しやすい形に少しだけ拡張（返却時には落とす） */
type SubstanceInternal = Substance & {
  __searchText: string;
  __categoriesNorm: string[];
  __jpStatus?: string;
};

type SubstanceIndexItem = Pick<
  Substance,
  "id" | "name" | "summary" | "categories" | "legal"
>;

function toStr(v: unknown): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return typeof v[0] === "string" ? v[0] : "";
  return "";
}

function normalizeText(input: string): string {
  return input
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function splitCsv(input: string): string[] {
  const norm = normalizeText(input);
  if (!norm) return [];
  return norm.split(",").map((s) => s.trim()).filter(Boolean);
}

function buildSearchText(doc: Substance): string {
  const parts: string[] = [
    doc.id,
    doc.name?.ja,
    doc.name?.en,
    ...(Array.isArray(doc.aliases) ? doc.aliases : []),
    doc.summary,
    ...(Array.isArray(doc.effects) ? doc.effects : []),
    ...(Array.isArray(doc.warnings) ? doc.warnings : []),
  ].filter((x): x is string => typeof x === "string" && x.length > 0);

  return normalizeText(parts.join(" / "));
}

function toIndexItem(doc: Substance): SubstanceIndexItem {
  return {
    id: doc.id,
    name: doc.name,
    summary: doc.summary,
    categories: doc.categories,
    legal: doc.legal,
  };
}

/** ---- 簡易キャッシュ（同一プロセス内） ---- */
let CACHE:
  | {
      loadedAt: number;
      docs: SubstanceInternal[];
      fuse: Fuse<SubstanceInternal>;
    }
  | undefined;

const CACHE_TTL_MS = 30_000; // 30秒（お好みで）

async function loadSubstancesFromDisk(): Promise<SubstanceInternal[]> {
  const dirPath = join(process.cwd(), "content", "substances");

  let files: string[];
  try {
    files = await readdir(dirPath);
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: "Substances directory not found: content/substances",
    });
  }

  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const loaded = await Promise.all(
    jsonFiles.map(async (filename) => {
      const filePath = join(dirPath, filename);
      try {
        const raw = await readFile(filePath, "utf-8");
        const doc = JSON.parse(raw) as Substance;

        if (!doc || typeof doc.id !== "string" || !doc.name?.ja) return null;

        const categories = Array.isArray(doc.categories) ? doc.categories : [];
        const categoriesNorm = categories.map((c) => normalizeText(String(c)));

        const jpStatus = doc.legal?.jp?.status
          ? String(doc.legal.jp.status)
          : undefined;

        const internal: SubstanceInternal = {
          ...doc,
          __searchText: buildSearchText(doc),
          __categoriesNorm: categoriesNorm,
          __jpStatus: jpStatus ? normalizeText(jpStatus) : undefined,
        };

        return internal;
      } catch {
        // 壊れたJSONが混じっても全体を落とさない
        return null;
      }
    })
  );

  return loaded.filter((x): x is SubstanceInternal => x !== null);
}

function createFuse(docs: SubstanceInternal[]) {
  return new Fuse(docs, {
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.35, // 0.3〜0.4が辞書用途で扱いやすい
    minMatchCharLength: 2,
    keys: [
      { name: "name.ja", weight: 5 },
      { name: "aliases", weight: 4 },
      { name: "name.en", weight: 3 },
      { name: "id", weight: 3 },
      { name: "summary", weight: 2 },
      { name: "effects", weight: 1 },
      { name: "warnings", weight: 1 },
      // 最後の保険：結合済みテキスト（表記ゆれ吸収の足し）
      { name: "__searchText", weight: 0.8 },
    ],
  });
}

async function getCachedIndex() {
  const now = Date.now();
  if (CACHE && now - CACHE.loadedAt < CACHE_TTL_MS) return CACHE;

  const docs = await loadSubstancesFromDisk();
  const fuse = createFuse(docs);

  CACHE = { loadedAt: now, docs, fuse };
  return CACHE;
}

/** ---- API本体 ----
 * GET /api/substances?q=...&category=stimulant,entactogen&status=麻薬&limit=200
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const q = normalizeText(toStr(query.q));
  const categoriesNorm = splitCsv(toStr(query.category));
  const statusNorm = normalizeText(toStr(query.status)); // 任意：麻薬/指定薬物など

  const limit =
    typeof query.limit === "string" && /^\d+$/.test(query.limit)
      ? Math.min(parseInt(query.limit, 10), 500)
      : 200;

  const { docs, fuse } = await getCachedIndex();

  const categoryFilterOn = categoriesNorm.length > 0;
  const statusFilterOn = !!statusNorm;

  const passFilters = (doc: SubstanceInternal) => {
    if (categoryFilterOn) {
      const ok = categoriesNorm.some((c) => doc.__categoriesNorm.includes(c));
      if (!ok) return false;
    }
    if (statusFilterOn) {
      if (!doc.__jpStatus) return false;
      if (doc.__jpStatus !== statusNorm) return false;
    }
    return true;
  };

  // qなし：一覧（フィルタのみ）
  if (!q) {
    const results = docs
      .filter(passFilters)
      .map((d) => toIndexItem(d))
      .sort((a, b) => (a.name?.ja ?? a.id).localeCompare(b.name?.ja ?? b.id, "ja"))
      .slice(0, limit);

    return {
      total: results.length,
      q: undefined,
      category: categoriesNorm.length ? categoriesNorm.join(",") : undefined,
      status: statusNorm || undefined,
      results,
    };
  }

  // qあり：Fuse検索 → フィルタ → 上位limit
  // フィルタで減る可能性があるので、少し多めに拾う
  const preLimit = Math.min(limit * 10, 2000);

  const searched = fuse.search(q, { limit: preLimit });

  const filtered = searched
    .map((r) => ({ item: r.item, score: r.score ?? 1 }))
    .filter(({ item }) => passFilters(item))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map(({ item }) => toIndexItem(item));

  return {
    total: filtered.length,
    q,
    category: categoriesNorm.length ? categoriesNorm.join(",") : undefined,
    status: statusNorm || undefined,
    results: filtered,
  };
});

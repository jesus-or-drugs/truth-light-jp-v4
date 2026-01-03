#!/usr/bin/env node
/**
 * CSV（法規制元帳） -> Substance JSON（_scheme.json 互換）
 *
 * 方針:
 * - CSVは「編集しやすいフラット構造」のまま維持
 * - 変換時に _scheme.json（テンプレ）へマッピングして、キーずれを解消
 * - _scheme.json に無い列（note/status/effective_date_ja など）は出力しない
 *
 * 出力:
 * - デフォルト: 1行=1ファイル（outDir配下に <id>.json を生成）
 * - 互換用: 出力先が .json の場合は 1ファイルに rows[] として束ねて出力
 *
 * 使い方:
 *   # 1行=1ファイル（推奨）
 *   node scripts/legal_csv_to_json.mjs data/legal/narcotics_and_psychoactive_drugs_list.csv data/substances
 *
 *   # 1ファイル出力（従来に近い）
 *   node scripts/legal_csv_to_json.mjs data/legal/narcotics_and_psychoactive_drugs_list.csv data/legal/narcotics_and_psychoactive_drugs_list.json
 *
 * オプション:
 *   --scheme <path>  テンプレ(_scheme.json)のパス（default: data/_scheme.json）
 *   --dry-run        書き込みせずログだけ
 *   --limit N        先頭N行だけ
 *   --offset N       N行スキップして開始
 */

import fs from "node:fs";
import path from "node:path";

function parseCSV(text, delimiter = ",") {
  // BOM除去 + 改行統一
  text = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        // "" -> " のエスケープ
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      continue;
    }

    if (c === delimiter) {
      row.push(field);
      field = "";
      continue;
    }

    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += c;
  }

  // 最終行
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function clean(s) {
  const v = (s ?? "").trim();
  return v === "" ? null : v;
}

function deepClone(obj) {
  // Node18+: structuredClone があれば使う
  // （なければ JSON roundtrip）
  if (typeof globalThis.structuredClone === "function") return globalThis.structuredClone(obj);
  return JSON.parse(JSON.stringify(obj));
}

function toId(s) {
  const v = clean(s);
  if (!v) return null;
  return v
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_\-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function toISODate(s) {
  const v = clean(s);
  if (!v) return null;
  const m = v.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  if (!Number.isFinite(y) || !Number.isFinite(mo) || !Number.isFinite(d)) return null;
  return `${String(y).padStart(4, "0")}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function splitAliases(...candidates) {
  const out = [];
  const seen = new Set();

  for (const c of candidates) {
    const v = clean(c);
    if (!v) continue;

    // ; / ； / 、 / / / ／ を区切りにする（カンマはIUPACで死ぬので使わない）
    const parts = v
      .split(/[;；、/／]+/g)
      .map((x) => x.trim().replace(/\s+/g, " "))
      .filter(Boolean);

    for (const p of parts) {
      if (!seen.has(p)) {
        seen.add(p);
        out.push(p);
      }
    }
  }

  return out;
}

function addIndex(map, key, row) {
  if (!key) return;
  if (!map[key]) map[key] = [];
  map[key].push(row);
}

function mapCsvRowToSubstance(obj, scheme) {
  const out = deepClone(scheme);

  // CSV columns (expected)
  const commonName = clean(obj["common_name"]);
  const officialName = clean(obj["official_name"]);
  const systematicName = clean(obj["systematic_name"]);

  const aliases = splitAliases(obj["aliases"]);
  // official_name は legal.jp.official_name に入るが、
  // common_name と違うなら aliases にも入れておく（検索の利便性）
  if (officialName && officialName !== commonName && !aliases.includes(officialName)) aliases.unshift(officialName);

  const pubchemCid = clean(obj["pubchem_cid"]) ? String(clean(obj["pubchem_cid"])) : "";
  const inchiKey = clean(obj["inchi_key"]);
  const smiles = clean(obj["smiles"]);

  // id
  const id =
    toId(commonName) ||
    toId(officialName) ||
    toId(systematicName) ||
    (pubchemCid ? `pubchem_${pubchemCid}` : null) ||
    (inchiKey ? `inchikey_${inchiKey}` : null);

  out.id = id ?? out.id ?? "";
  out.common_name = commonName ?? officialName ?? out.common_name ?? "";

  // systematic_name のキー表記ゆれ対応
  // - 新: systematic_name
  // - 旧: "systematic name"（スペース入り）
  if (Object.prototype.hasOwnProperty.call(out, "systematic_name")) {
    out.systematic_name = systematicName ?? out.systematic_name ?? "";
  } else if (Object.prototype.hasOwnProperty.call(out, "systematic name")) {
    out["systematic name"] = systematicName ?? out["systematic name"] ?? "";
  }
  out.aliases = aliases;

  // identifiers
  out.identifiers = out.identifiers ?? {};
  out.identifiers.pubchem_cid = pubchemCid ?? "";
  out.identifiers.inchi_key = inchiKey ?? "";
  out.identifiers.smiles = smiles ?? "";

  // legal.jp
  out.legal = out.legal ?? {};
  out.legal.jp = out.legal.jp ?? {};
  out.legal.jp.law_number = clean(obj["law_number"]) ?? "";
  out.legal.jp.law_category = clean(obj["law_category"]) ?? "";
  out.legal.jp.official_name = officialName ?? "";
  // effective_date_ja は使わない（計算用途のみ）
  out.legal.jp.effective_date = toISODate(obj["effective_date"]) ?? "";
  out.legal.jp.source_link = clean(obj["source_link"]) ?? "";

  // _scheme.json に無いもの（note/status/effective_date_ja など）は無視
  return out;
}

function stripUnknownKeys(obj, scheme) {
  // “テンプレを clone して埋める”方式なので原則不要だが、
  // 万一 scheme に無いキーが混ざっても除去できるようにしておく。
  const walk = (o, s) => {
    if (Array.isArray(s)) return Array.isArray(o) ? o : [];
    if (s && typeof s === "object") {
      const out = {};
      for (const k of Object.keys(s)) out[k] = walk(o?.[k], s[k]);
      return out;
    }
    return o ?? s;
  };
  return walk(obj, scheme);
}

function parseArgs(argv) {
  const args = {
    input: argv[2],
    output: argv[3],
    schemePath: "data/_scheme.json",
    dryRun: false,
    limit: null,
    offset: 0,
    keepDuplicates: false,
  };
  for (let i = 4; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--scheme") args.schemePath = argv[++i];
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--limit") args.limit = Number(argv[++i]);
    else if (a === "--offset") args.offset = Number(argv[++i]);
    else if (a === "--keep-duplicates") args.keepDuplicates = true;
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  const input = args.input ?? "data/legal/scheduled_substances.csv";
  const output = args.output ?? "data/substances";
  const schemePath = args.schemePath;

  const absIn = path.resolve(input);
  const absOut = path.resolve(output);
  const absScheme = path.resolve(schemePath);

  if (!fs.existsSync(absIn)) {
    console.error(`Input not found: ${absIn}`);
    process.exit(1);
  }

  if (!fs.existsSync(absScheme)) {
    console.error(`Scheme not found: ${absScheme}`);
    console.error(`(hint) pass --scheme <path> or place _scheme.json at data/_scheme.json`);
    process.exit(1);
  }

  const scheme = JSON.parse(fs.readFileSync(absScheme, "utf8"));

  const csvText = fs.readFileSync(absIn, "utf8");
  const table = parseCSV(csvText);

  if (!table.length) {
    console.error("CSV is empty.");
    process.exit(1);
  }

  const headers = table[0].map((h) => (h ?? "").trim());
  const substances = [];

  const offset = Number.isFinite(args.offset) ? Math.max(0, args.offset) : 0;
  const limit = Number.isFinite(args.limit) && args.limit > 0 ? args.limit : null;
  let kept = 0;

  for (let i = 1; i < table.length; i++) {
    if (i - 1 < offset) continue;
    const cells = table[i];
    // 空行スキップ
    if (!cells || cells.every((c) => !String(c ?? "").trim())) continue;

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j];
      if (!key) continue;
      obj[key] = cells[j] ?? "";
    }
    const substance = stripUnknownKeys(mapCsvRowToSubstance(obj, scheme), scheme);
    substances.push(substance);
    kept++;
    if (limit && kept >= limit) break;
  }

  // 出力
  const isBundle = absOut.toLowerCase().endsWith(".json");

  if (args.dryRun) {
    console.log(`[dry-run] parsed=${substances.length} (offset=${offset}, limit=${limit ?? "-"})`);
    console.log(`[dry-run] output=${absOut} (${isBundle ? "bundle" : "dir"})`);
    console.log(`[dry-run] scheme=${absScheme}`);
    return;
  }

  if (isBundle) {
    // 互換: 1ファイル
    const byPubchemCid = {};
    const byInchiKey = {};
    for (const s of substances) {
      addIndex(byPubchemCid, clean(s?.identifiers?.pubchem_cid), s);
      addIndex(byInchiKey, clean(s?.identifiers?.inchi_key), s);
    }

    const out = {
      meta: {
        generated_at: new Date().toISOString(),
        source_csv: input,
        scheme: schemePath,
        row_count: substances.length,
      },
      rows: substances,
      index: {
        by_pubchem_cid: byPubchemCid,
        by_inchi_key: byInchiKey,
      },
    };

    fs.mkdirSync(path.dirname(absOut), { recursive: true });
    fs.writeFileSync(absOut, JSON.stringify(out, null, 2), "utf8");
    console.log(`OK: ${substances.length} rows -> ${absOut}`);
    console.log(`index: pubchem_cid=${Object.keys(byPubchemCid).length}, inchi_key=${Object.keys(byInchiKey).length}`);
    return;
  }

// 推奨: 1行=1ファイル
  fs.mkdirSync(absOut, { recursive: true });

  const seen = new Map(); // baseId -> count
  let overwrote = 0;
  let wrote = 0;

  for (const s of substances) {
    const baseId = clean(s.id);
    if (!baseId) {
      console.warn("skip: missing id", { common_name: s.common_name, official_name: s?.legal?.jp?.official_name });
      continue;
    }

    const prev = seen.get(baseId) ?? 0;
    const next = prev + 1;
    seen.set(baseId, next);

    let id = baseId;

    if (next > 1) {
      if (args.keepDuplicates) {
        // すべて残したい場合は id をユニーク化して別ファイルに出す
        id = `${baseId}__${next}`;
        s.id = id;
      } else {
        // デフォルトは同一idを上書き（=1物質=1ファイル運用）
        overwrote++;
      }
    }

    const p = path.join(absOut, `${id}.json`);
    fs.writeFileSync(p, JSON.stringify(s, null, 2), "utf8");
    wrote++;
  }

  const uniqueFiles = args.keepDuplicates ? wrote : seen.size;
  const collisions = substances.length - seen.size;

  if (args.keepDuplicates) {
    console.log(`OK: ${substances.length} rows -> ${uniqueFiles} files (kept duplicates; collisions=${collisions}) -> ${absOut}`);
  } else {
    console.log(`OK: ${substances.length} rows -> ${uniqueFiles} files (collisions=${collisions}, overwrote=${overwrote}) -> ${absOut}`);
    if (collisions > 0) {
      console.log(`hint: 同じ id に正規化された行があり、後の行で上書きされています。全行を残すなら --keep-duplicates を付けてください。`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

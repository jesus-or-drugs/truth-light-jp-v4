#!/usr/bin/env node
/**
 * CSV（法規制元帳） -> JSON（1ファイル）
 * - RFC4180 っぽい引用符対応の簡易CSVパーサ内蔵（カンマを含む列でも壊れない）
 * - aliases / official_name の ; 区切りなどを配列化
 * - pubchem_cid は文字列に正規化
 * - index.by_pubchem_cid / index.by_inchikey も同梱（JOIN高速化用）
 *
 * 使い方:
 *   node scripts/legal_csv_to_json.mjs data/legal/scheduled_substances.csv data/legal/scheduled_substances.json
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

function normalizeRow(obj) {
  const noRaw = clean(obj["No."] ?? obj["No"] ?? obj["no"]);
  const no = noRaw && /^\d+$/.test(noRaw) ? Number(noRaw) : null;

  const officialRaw = clean(obj["official_name"]);
  const officialTokens = splitAliases(officialRaw);
  const official = officialTokens[0] ?? officialRaw;

  // aliases列 + official_name の“2個目以降”も aliases 扱いにする（情報落とさない）
  const aliases = splitAliases(obj["aliases"], officialTokens.slice(1).join(";"));

  const pubchemCid = clean(obj["pubchem_cid"]) ? String(clean(obj["pubchem_cid"])) : null;
  const inchikey = clean(obj["inchi_key"] ?? obj["inchikey"] ?? obj["InChIKey"]);
  const smiles = clean(obj["smiles"]);

  const lawCategory = clean(obj["law_category"]) ?? clean(obj["law_category.1"]);
  const category = clean(obj["category"]) ?? lawCategory;

  const row = {
    no,
    law_category: lawCategory,
    category,
    iupac_name: clean(obj["iupac_name"]),
    official_name: official ?? null,
    official_name_raw: officialRaw,
    ...(aliases.length ? { aliases } : {}),
    regulation_date: toISODate(obj["regulation_date"]),
    designated_date_ja: clean(obj["designated_date_ja"]),
    effective_date: toISODate(obj["effective_date"]),
    gazette_date: toISODate(obj["gazette_date"]),
    source_link: clean(obj["source_link"]),
    note: clean(obj["note"]),
  };

  const identifiers = {
    ...(pubchemCid ? { pubchem_cid: pubchemCid } : {}),
    ...(inchikey ? { inchikey } : {}),
    ...(smiles ? { smiles } : {}),
  };
  if (Object.keys(identifiers).length) row.identifiers = identifiers;

  return row;
}

async function main() {
  const input = process.argv[2] ?? "data/legal/scheduled_substances.csv";
  const output = process.argv[3] ?? "data/legal/scheduled_substances.json";

  const absIn = path.resolve(input);
  const absOut = path.resolve(output);

  if (!fs.existsSync(absIn)) {
    console.error(`Input not found: ${absIn}`);
    process.exit(1);
  }

  const csvText = fs.readFileSync(absIn, "utf8");
  const table = parseCSV(csvText);

  if (!table.length) {
    console.error("CSV is empty.");
    process.exit(1);
  }

  const headers = table[0].map((h) => (h ?? "").trim());
  const rows = [];

  for (let i = 1; i < table.length; i++) {
    const cells = table[i];
    // 空行スキップ
    if (!cells || cells.every((c) => !String(c ?? "").trim())) continue;

    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      const key = headers[j];
      if (!key) continue;
      obj[key] = cells[j] ?? "";
    }
    rows.push(normalizeRow(obj));
  }

  const byPubchemCid = {};
  const byInchikey = {};

  for (const r of rows) {
    const ids = r.identifiers ?? {};
    addIndex(byPubchemCid, ids.pubchem_cid, r);
    addIndex(byInchikey, ids.inchikey, r);
  }

  const out = {
    meta: {
      generated_at: new Date().toISOString(),
      source_csv: input,
      row_count: rows.length,
      indexed_pubchem_cid: Object.keys(byPubchemCid).length,
      indexed_inchikey: Object.keys(byInchikey).length,
    },
    rows,
    index: {
      by_pubchem_cid: byPubchemCid,
      by_inchikey: byInchikey,
    },
  };

  fs.mkdirSync(path.dirname(absOut), { recursive: true });
  fs.writeFileSync(absOut, JSON.stringify(out, null, 2), "utf8");

  console.log(`OK: ${rows.length} rows -> ${absOut}`);
  console.log(`index: pubchem_cid=${Object.keys(byPubchemCid).length}, inchikey=${Object.keys(byInchikey).length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

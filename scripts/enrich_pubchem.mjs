// scripts/enrich_pubchem.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + "\n", "utf-8");
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function mergeUnique(existing = [], incoming = []) {
  return uniq([...(existing ?? []), ...(incoming ?? [])].filter(Boolean));
}

function toArray(x) {
  if (!x) return [];
  return Array.isArray(x) ? x : [x];
}

function parseArgs(argv) {
  const args = {
    dir: "data/substances",
    dryRun: false,
    force: false,
    throttleMs: 250, // <= 5 req/sec (PubChem policy guidance)
    maxSynonyms: 200,
    maxAliases: 30, // aliases に入れる上限（フィルタ後）
    only: null,

    // ★追加：上書きしたい時だけ使う
    overwriteSystematic: false,
    overwriteAliases: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--force") args.force = true;
    else if (a === "--dir") args.dir = argv[++i];
    else if (a === "--throttle-ms") args.throttleMs = Number(argv[++i] ?? 250);
    else if (a === "--max-synonyms") args.maxSynonyms = Number(argv[++i] ?? 200);
    else if (a === "--max-aliases") args.maxAliases = Number(argv[++i] ?? 30);
    else if (a === "--only") args.only = argv[++i];

    else if (a === "--overwrite-systematic") args.overwriteSystematic = true;
    else if (a === "--overwrite-aliases") args.overwriteAliases = true;
  }
  return args;
}

// Simple on-disk cache to reduce PubChem load
function loadCache(cachePath) {
  try {
    return readJson(cachePath);
  } catch {
    return {};
  }
}

function saveCache(cachePath, cache) {
  fs.mkdirSync(path.dirname(cachePath), { recursive: true });
  writeJson(cachePath, cache);
}

async function fetchJson(url, { throttleMs, cache, cacheKey }) {
  if (cacheKey && cache[cacheKey]) return cache[cacheKey];

  const res = await fetch(url, {
    headers: {
      "User-Agent": "truth-light-jp (PubChem enrichment script)",
      "Accept": "application/json,text/plain,*/*",
    },
  });

  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}\n${text.slice(0, 300)}`);
    }
    throw new Error(`Non-JSON response for ${url}\n${text.slice(0, 300)}`);
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}\n${text.slice(0, 300)}`);
  }

  if (cacheKey) cache[cacheKey] = data;

  await sleep(throttleMs);
  return data;
}

function pickQueryName(substance) {
  // Prefer English name; fallback to Japanese name; fallback to common_name; fallback to id
  return (
    substance?.name_en ||
    substance?.name_ja ||
    substance?.common_name ||
    substance?.name ||
    substance?.id ||
    null
  );
}

function extractCidsFromPugResult(obj) {
  const cids = obj?.IdentifierList?.CID;
  return Array.isArray(cids) ? cids.map((n) => String(n)) : [];
}

function normalizeIdentifiers(identifiers) {
  const out = { ...(identifiers ?? {}) };

  // ありがちな揺れ吸収
  if (out.inchi_key && !out.inchikey) out.inchikey = out.inchi_key;
  if (out.inchikey && !out.inchi_key) out.inchi_key = out.inchikey;

  if (out.pubchemCID && !out.pubchem_cid) out.pubchem_cid = out.pubchemCID;
  if (out.pubchem_cid && !out.pubchemCID) out.pubchemCID = out.pubchem_cid;

  return out;
}

function getSystematicName(obj) {
  return obj?.["systematic name"] ?? obj?.systematic_name ?? null;
}

function setSystematicName(obj, val) {
  if (!val) return;
  // “どっちのキーでも参照できる”ように両方入れる（好みで片方だけでもOK）
  obj["systematic name"] = val;
  obj.systematic_name = val;
}

function sanitizeSynonymsForAliases(syns) {
  const cleaned = (syns ?? [])
    .map((s) => String(s).trim())
    .filter(Boolean)
    .filter((s) => s.length <= 80)
    .filter((s) => !/^inchi=/i.test(s))
    .filter((s) => !/^smiles\s*:/i.test(s))
    .filter((s) => !/^\d+(\-\d+)*$/.test(s)) // ただの数字/ハイフン列
    .filter((s) => !/^cid\s*\d+$/i.test(s));

  // 大文字小文字の重複潰し
  const seen = new Set();
  const out = [];
  for (const s of cleaned) {
    const k = s.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(s);
  }
  return out;
}

async function resolveCid({ identifiers, name, throttleMs, cache }) {
  const base = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";

  if (identifiers?.pubchem_cid) return { cid: String(identifiers.pubchem_cid), candidates: [] };

  if (identifiers?.inchikey) {
    const ik = encodeURIComponent(String(identifiers.inchikey));
    const url = `${base}/compound/inchikey/${ik}/cids/JSON`;
    const data = await fetchJson(url, { throttleMs, cache, cacheKey: `inchikey:${ik}` });
    const candidates = extractCidsFromPugResult(data);
    if (candidates.length === 1) return { cid: candidates[0], candidates };
    return { cid: null, candidates };
  }

  if (identifiers?.smiles) {
    const smi = encodeURIComponent(String(identifiers.smiles));
    const url = `${base}/compound/smiles/${smi}/cids/JSON`;
    const data = await fetchJson(url, { throttleMs, cache, cacheKey: `smiles:${smi}` });
    const candidates = extractCidsFromPugResult(data);
    if (candidates.length === 1) return { cid: candidates[0], candidates };
    return { cid: null, candidates };
  }

  if (name) {
    const q = encodeURIComponent(String(name));
    const url = `${base}/compound/name/${q}/cids/JSON`;
    const data = await fetchJson(url, { throttleMs, cache, cacheKey: `name:${q}` });
    const candidates = extractCidsFromPugResult(data);
    if (candidates.length === 1) return { cid: candidates[0], candidates };
    return { cid: null, candidates };
  }

  return { cid: null, candidates: [] };
}

async function fetchProperties(cid, { throttleMs, cache }) {
  const base = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";

  // ★IUPACName を追加
  const props = [
    "MolecularFormula",
    "MolecularWeight",
    "CanonicalSMILES",
    "IsomericSMILES",
    "InChI",
    "InChIKey",
    "IUPACName",
  ].join(",");

  const url = `${base}/compound/cid/${encodeURIComponent(cid)}/property/${props}/JSON`;
  const data = await fetchJson(url, { throttleMs, cache, cacheKey: `props:${cid}:${props}` });

  const p = data?.PropertyTable?.Properties?.[0] ?? null;
  return p;
}

async function fetchSynonyms(cid, { throttleMs, cache }) {
  const base = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
  const url = `${base}/compound/cid/${encodeURIComponent(cid)}/synonyms/JSON`;
  const data = await fetchJson(url, { throttleMs, cache, cacheKey: `syn:${cid}` });

  const info = data?.InformationList?.Information?.[0];
  const syns = info?.Synonym;
  return Array.isArray(syns) ? syns.map(String) : [];
}

function ensureShape(obj, idFromFile) {
  const out = { ...obj };
  out.id = out.id ?? idFromFile;

  out.identifiers = normalizeIdentifiers(out.identifiers ?? out.identifier ?? {});
  delete out.identifier;

  out.refs = toArray(out.refs ?? out.references ?? []);
  delete out.references;

  out.aliases = toArray(out.aliases);
  out.categories = toArray(out.categories);

  return out;
}

async function enrichOneFile(
  filePath,
  { dryRun, force, throttleMs, maxSynonyms, maxAliases, overwriteSystematic, overwriteAliases, cache }
) {
  const id = path.basename(filePath).replace(/\.json$/i, "");
  const raw = ensureShape(readJson(filePath), id);

  const name = pickQueryName(raw);

  const before = JSON.stringify(raw);

  const { cid, candidates } = await resolveCid({
    identifiers: raw.identifiers,
    name,
    throttleMs,
    cache,
  });

  if (!cid) {
    if (candidates.length > 1 && force) {
      raw.identifiers.pubchem_cid = candidates[0];
      raw.pubchem_candidates = candidates;
    } else {
      raw.pubchem_candidates = candidates;
      return {
        id,
        changed: false,
        skipped: true,
        reason: candidates.length > 1 ? "multiple CIDs" : "no CID",
      };
    }
  } else {
    raw.identifiers.pubchem_cid = raw.identifiers.pubchem_cid ?? cid;
  }

  const cidFinal = String(raw.identifiers.pubchem_cid);

  // Fetch props
  const props = await fetchProperties(cidFinal, { throttleMs, cache });
  if (props) {
    raw.identifiers.inchikey = raw.identifiers.inchikey ?? props.InChIKey ?? null;
    raw.identifiers.inchi_key = raw.identifiers.inchi_key ?? raw.identifiers.inchikey ?? null;

    raw.identifiers.smiles =
      raw.identifiers.smiles ??
      props.CanonicalSMILES ??
      props.IsomericSMILES ??
      null;

    raw.molecular_formula = raw.molecular_formula ?? props.MolecularFormula ?? null;
    raw.molecular_weight = raw.molecular_weight ?? props.MolecularWeight ?? null;

    raw.smiles_canonical = raw.smiles_canonical ?? props.CanonicalSMILES ?? null;
    raw.smiles_isomeric = raw.smiles_isomeric ?? props.IsomericSMILES ?? null;

    // ★systematic name (IUPACName)
    const currentSys = getSystematicName(raw);
    const nextSys = props.IUPACName ?? null;

    if (nextSys) {
      const shouldWrite =
        overwriteSystematic ||
        currentSys == null ||
        String(currentSys).trim() === "";

      if (shouldWrite) setSystematicName(raw, nextSys);
    }
  }

  // Fetch synonyms
  const syns = await fetchSynonyms(cidFinal, { throttleMs, cache });

  if (syns.length) {
    // 既存どおり：フルは synonyms_pubchem に
    raw.synonyms_pubchem = mergeUnique(raw.synonyms_pubchem ?? [], syns).slice(0, maxSynonyms);

    // ★aliases に“使えそうなやつ”だけ入れる
    const usable = sanitizeSynonymsForAliases(syns).slice(0, maxAliases);

    const shouldWriteAliases = overwriteAliases || (raw.aliases?.length ?? 0) === 0;
    if (shouldWriteAliases) {
      raw.aliases = mergeUnique(overwriteAliases ? [] : raw.aliases, usable);
    } else {
      // aliases が既にある場合は「足すだけ」
      raw.aliases = mergeUnique(raw.aliases, usable);
    }
  }

  // Add refs
  const pubchemUrl = `https://pubchem.ncbi.nlm.nih.gov/compound/${cidFinal}`;
  raw.refs = mergeUnique(raw.refs, [pubchemUrl]);

  const after = JSON.stringify(raw);
  const changed = before !== after;

  if (changed && !dryRun) writeJson(filePath, raw);

  return { id, changed, skipped: false, cid: cidFinal };
}

async function main() {
  const args = parseArgs(process.argv);

  const srcDir = path.join(ROOT, args.dir);
  const cachePath = path.join(ROOT, ".cache/pubchem.json");
  const cache = loadCache(cachePath);

  if (!fs.existsSync(srcDir)) {
    console.error(`[enrich] dir not found: ${srcDir}`);
    process.exit(1);
  }

  let files = fs
    .readdirSync(srcDir)
    .filter((f) => f.endsWith(".json"))
    .filter((f) => !f.startsWith("_"));
  if (args.only) {
    const onlyFile = args.only.endsWith(".json") ? args.only : `${args.only}.json`;
    files = files.filter((f) => f === onlyFile);
  }

  let changedCount = 0;
  let skippedCount = 0;

  for (const f of files) {
    const filePath = path.join(srcDir, f);
    try {
      const r = await enrichOneFile(filePath, {
        dryRun: args.dryRun,
        force: args.force,
        throttleMs: args.throttleMs,
        maxSynonyms: args.maxSynonyms,
        maxAliases: args.maxAliases,
        overwriteSystematic: args.overwriteSystematic,
        overwriteAliases: args.overwriteAliases,
        cache,
      });

      if (r.skipped) {
        skippedCount++;
        console.log(`[skip] ${r.id}: ${r.reason}`);
      } else if (r.changed) {
        changedCount++;
        console.log(`[ok]   ${r.id}: CID=${r.cid} (updated)`);
      } else {
        console.log(`[ok]   ${r.id}: CID=${r.cid} (no change)`);
      }
    } catch (e) {
      skippedCount++;
      console.warn(`[warn] ${f}: ${e?.message ?? e}`);
    }
  }

  saveCache(cachePath, cache);

  console.log(`[enrich] done. changed=${changedCount}, skipped=${skippedCount}, dryRun=${args.dryRun}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

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
    throttleMs: 250, // <= 5 req/sec (PubChem policy guidance) :contentReference[oaicite:2]{index=2}
    maxSynonyms: 200,
    only: null, // optional: enrich single id/file
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") args.dryRun = true;
    else if (a === "--force") args.force = true;
    else if (a === "--dir") args.dir = argv[++i];
    else if (a === "--throttle-ms") args.throttleMs = Number(argv[++i] ?? 250);
    else if (a === "--max-synonyms") args.maxSynonyms = Number(argv[++i] ?? 200);
    else if (a === "--only") args.only = argv[++i];
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
      // polite UA
      "User-Agent": "truth-light-jp (PubChem enrichment script)",
      "Accept": "application/json,text/plain,*/*",
    },
  });

  // PubChem sometimes returns non-JSON error bodies; handle gracefully
  const text = await res.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    // keep raw text in error
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}\n${text.slice(0, 300)}`);
    }
    throw new Error(`Non-JSON response for ${url}\n${text.slice(0, 300)}`);
  }

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url}\n${text.slice(0, 300)}`);
  }

  if (cacheKey) cache[cacheKey] = data;

  // Throttle (PubChem recommends limiting request volume) :contentReference[oaicite:3]{index=3}
  await sleep(throttleMs);
  return data;
}

function pickQueryName(substance) {
  // Prefer English name; fallback to Japanese name; fallback to id
  return (
    substance?.name_en ||
    substance?.name_ja ||
    substance?.name ||
    substance?.id ||
    null
  );
}

function extractCidsFromPugResult(obj) {
  // Typical PUG-REST CID list: { IdentifierList: { CID: [ ... ] } }
  const cids = obj?.IdentifierList?.CID;
  return Array.isArray(cids) ? cids.map((n) => String(n)) : [];
}

async function resolveCid({ identifiers, name, throttleMs, cache }) {
  const base = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";

  // If already have CID, trust it
  if (identifiers?.pubchem_cid) return { cid: String(identifiers.pubchem_cid), candidates: [] };

  // If have InChIKey, ask PubChem by inchikey → cids
  if (identifiers?.inchikey) {
    const ik = encodeURIComponent(String(identifiers.inchikey));
    const url = `${base}/compound/inchikey/${ik}/cids/JSON`;
    const data = await fetchJson(url, { throttleMs, cache, cacheKey: `inchikey:${ik}` });
    const candidates = extractCidsFromPugResult(data);
    if (candidates.length === 1) return { cid: candidates[0], candidates };
    return { cid: null, candidates };
  }

  // If have SMILES, ask PubChem by smiles → cids
  if (identifiers?.smiles) {
    const smi = encodeURIComponent(String(identifiers.smiles));
    const url = `${base}/compound/smiles/${smi}/cids/JSON`;
    const data = await fetchJson(url, { throttleMs, cache, cacheKey: `smiles:${smi}` });
    const candidates = extractCidsFromPugResult(data);
    if (candidates.length === 1) return { cid: candidates[0], candidates };
    return { cid: null, candidates };
  }

  // Else: by name → cids (PubChem tutorial uses /compound/name/{name}/cids) :contentReference[oaicite:4]{index=4}
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
  // PUG-REST property endpoint is /compound/cid/{cid}/property/Prop1,Prop2/.../JSON :contentReference[oaicite:5]{index=5}
  const props = [
    "MolecularFormula",
    "MolecularWeight",
    "CanonicalSMILES",
    "IsomericSMILES",
    "InChI",
    "InChIKey",
  ].join(",");
  const url = `${base}/compound/cid/${encodeURIComponent(cid)}/property/${props}/JSON`;
  const data = await fetchJson(url, { throttleMs, cache, cacheKey: `props:${cid}:${props}` });

  const p = data?.PropertyTable?.Properties?.[0] ?? null;
  return p;
}

async function fetchSynonyms(cid, { throttleMs, cache }) {
  const base = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
  // Synonyms endpoint exists; tutorial shows TXT format: /compound/cid/{cid}/synonyms/TXT :contentReference[oaicite:6]{index=6}
  // JSON also supported by PUG-REST services. We'll request JSON.
  const url = `${base}/compound/cid/${encodeURIComponent(cid)}/synonyms/JSON`;
  const data = await fetchJson(url, { throttleMs, cache, cacheKey: `syn:${cid}` });

  // Typical: { InformationList: { Information: [ { CID, Synonym: [...] } ] } }
  const info = data?.InformationList?.Information?.[0];
  const syns = info?.Synonym;
  return Array.isArray(syns) ? syns.map(String) : [];
}

function ensureShape(obj, idFromFile) {
  const out = { ...obj };
  out.id = out.id ?? idFromFile;

  out.identifiers = out.identifiers ?? out.identifier ?? {};
  // normalize: some files may use `identifier`
  delete out.identifier;

  out.refs = toArray(out.refs ?? out.references ?? []);
  delete out.references;

  out.aliases = toArray(out.aliases);
  out.categories = toArray(out.categories);

  return out;
}

async function enrichOneFile(filePath, { dryRun, force, throttleMs, maxSynonyms, cache }) {
  const id = path.basename(filePath).replace(/\.json$/i, "");
  const raw = ensureShape(readJson(filePath), id);

  const name = pickQueryName(raw);

  const before = JSON.stringify(raw);

  // Resolve CID
  const { cid, candidates } = await resolveCid({
    identifiers: raw.identifiers,
    name,
    throttleMs,
    cache,
  });

  if (!cid) {
    // If multiple candidates, skip unless --force
    if (candidates.length > 1 && force) {
      raw.identifiers.pubchem_cid = candidates[0];
      raw.pubchem_candidates = candidates;
    } else {
      raw.pubchem_candidates = candidates;
      return { id, changed: false, skipped: true, reason: candidates.length > 1 ? "multiple CIDs" : "no CID" };
    }
  } else {
    raw.identifiers.pubchem_cid = raw.identifiers.pubchem_cid ?? cid;
  }

  const cidFinal = String(raw.identifiers.pubchem_cid);

  // Fetch props
  const props = await fetchProperties(cidFinal, { throttleMs, cache });
  if (props) {
    // Only fill missing; never overwrite explicit human edits
    raw.identifiers.inchikey = raw.identifiers.inchikey ?? props.InChIKey ?? null;

    // prefer existing SMILES if set
    raw.identifiers.smiles =
      raw.identifiers.smiles ??
      props.CanonicalSMILES ??
      props.IsomericSMILES ??
      null;

    raw.molecular_formula = raw.molecular_formula ?? props.MolecularFormula ?? null;
    raw.molecular_weight = raw.molecular_weight ?? props.MolecularWeight ?? null;

    // Optional: store both SMILES variants
    raw.smiles_canonical = raw.smiles_canonical ?? props.CanonicalSMILES ?? null;
    raw.smiles_isomeric = raw.smiles_isomeric ?? props.IsomericSMILES ?? null;
  }

  // Fetch synonyms (store separately from curated aliases)
  const syns = await fetchSynonyms(cidFinal, { throttleMs, cache });
  if (syns.length) {
    raw.synonyms_pubchem = mergeUnique(raw.synonyms_pubchem ?? [], syns)
      .slice(0, maxSynonyms);
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

  let files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".json"));
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

  console.log(
    `[enrich] done. changed=${changedCount}, skipped=${skippedCount}, dryRun=${args.dryRun}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

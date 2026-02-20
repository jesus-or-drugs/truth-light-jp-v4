// scripts/gen.mjs
// last modified: 2025.12.31
// scripts/gen.mjs
// scripts/gen.mjs
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const srcDir = path.join(root, "data/substances")
const outDir = path.join(root, "public/data")
const outFile = path.join(outDir, "all_substances.json")

fs.mkdirSync(outDir, { recursive: true })

const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".json"))

const list = []

for (const file of files) {
  const filePath = path.join(srcDir, file)
  const fileId = file.replace(/\.json$/, "")

  let rawText
  let raw

  try {
    rawText = fs.readFileSync(filePath, "utf-8")
    raw = JSON.parse(rawText)
  } catch (err) {
    console.error("❌ JSON parse error")
    console.error(`   File : ${filePath}`)
    console.error(`   Error: ${err.message}`)

    // 先頭数行を表示（デバッグ用）
    if (rawText) {
      console.error("   Preview:")
      console.error(
        rawText
          .split("\n")
          .slice(0, 10)
          .map((l, i) => `${i + 1}: ${l}`)
          .join("\n")
      )
    }

    process.exit(1) // ← 問題があったら即止める
  }

  // ===== ここから下は元の処理 =====

  const id = raw.id ?? fileId

  const commonName =
    raw.common_name ??
    raw.commonName ??
    raw.name_en ??
    raw.name_ja ??
    raw.name ??
    id

  const systematicName =
    raw["systematic name"] ??
    raw.systematic_name ??
    raw.systematicName ??
    raw.systematic ??
    ""

  const identifiersSrc = raw.identifiers ?? raw.identifier ?? {}
  const identifiers = {
    pubchem_cid: identifiersSrc.pubchem_cid ?? raw.pubchem_cid ?? raw.pubchemCid ?? "",
    inchi_key: identifiersSrc.inchi_key ?? raw.inchi_key ?? raw.inchiKey ?? "",
    smiles: identifiersSrc.smiles ?? raw.smiles ?? "",
  }

  const aliases = Array.isArray(raw.aliases)
    ? raw.aliases
    : raw.aliases
      ? [raw.aliases]
      : []

  const categories = Array.isArray(raw.categories)
    ? raw.categories
    : raw.categories
      ? [raw.categories]
      : []

  const legal = raw.legal ?? {}
  const summary = raw.summary ?? raw.description ?? ""
  const history = raw.history ?? ""
  const effects = raw.effects ?? {}
  const external_resources = raw.external_resources ?? raw.externalResources ?? {}
  const refs = raw.refs ?? raw.references ?? []

  list.push({
    id,
    name: commonName,
    common_name: commonName,
    systematic_name: systematicName,
    aliases,
    categories,
    legal,
    identifiers,
    pubchemCid: identifiers.pubchem_cid,
    inchiKey: identifiers.inchi_key,
    summary,
    history,
    effects,
    external_resources,
    refs,
  })
}

fs.writeFileSync(outFile, JSON.stringify(list, null, 2), "utf-8")
console.log(`✅ [gen] wrote ${list.length} substances -> ${outFile}`)

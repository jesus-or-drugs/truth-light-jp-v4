// scripts/gen.mjs
// last modified: 2025.12.31
// scripts/gen.mjs
import fs from "node:fs"
import path from "node:path"

// Collect all JSON files in data/substances and build a normalized list JSON
const root = process.cwd()

const srcDir = path.join(root, "data/substances")
const outDir = path.join(root, "public/data")
const outFile = path.join(outDir, "all_substances.json")

fs.mkdirSync(outDir, { recursive: true })

const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".json"))

const list = files.map((file) => {
  const fileId = file.replace(/\.json$/, "")
  const raw = JSON.parse(fs.readFileSync(path.join(srcDir, file), "utf-8"))

  // 基本
  const id = raw.id ?? fileId

  // 新スキーマ: common_name / "systematic name"
  const commonName =
    raw.common_name ?? raw.commonName ?? raw.name_en ?? raw.name_ja ?? raw.name ?? id

  const systematicName =
    raw["systematic name"] ??
    raw.systematic_name ??
    raw.systematicName ??
    raw.systematic ??
    ""

  // identifiers は identifiers / identifier どちらでも拾う（互換）
  const identifiersSrc = raw.identifiers ?? raw.identifier ?? {}
  const identifiers = {
    pubchem_cid: identifiersSrc.pubchem_cid ?? raw.pubchem_cid ?? raw.pubchemCid ?? "",
    inchi_key: identifiersSrc.inchi_key ?? raw.inchi_key ?? raw.inchiKey ?? "",
    smiles: identifiersSrc.smiles ?? raw.smiles ?? "",
  }

  // 配列は念の為ガード
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

  // legal は新スキーマだと { jp: {...}, ... } の形
  const legal = raw.legal ?? {}

  // 追加情報（そのまま通す）
  const summary = raw.summary ?? raw.description ?? ""
  const history = raw.history ?? ""
  const effects = raw.effects ?? {}
  const external_resources = raw.external_resources ?? raw.externalResources ?? {}
  const refs = raw.refs ?? raw.references ?? []

  // list / sort 用に “扱いやすいキー” も同梱（後方互換）
  return {
    id,
    name: commonName, // 一覧側で data-sort="name" を使うならこれが安定
    common_name: commonName,
    systematic_name: systematicName,

    aliases,
    categories,
    legal,

    identifiers,
    pubchemCid: identifiers.pubchem_cid, // 便利キー（data-sort="pubchemCid"等）
    inchiKey: identifiers.inchi_key,

    summary,
    history,
    effects,
    external_resources,
    refs,
  }
})

fs.writeFileSync(outFile, JSON.stringify(list, null, 2), "utf-8")
console.log(`[gen] wrote ${list.length} substances -> ${outFile}`)

// scripts/gen.mjs
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()

const srcDir = path.join(root, "data/substances")
const outDir = path.join(root, "public/data")
const outFile = path.join(outDir, "substances.json")

fs.mkdirSync(outDir, { recursive: true })

const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".json"))

const list = files.map((file) => {
  const id = file.replace(/\.json$/, "")
  const raw = JSON.parse(fs.readFileSync(path.join(srcDir, file), "utf-8"))

  // “表示に必要な最低限”だけ整形（テーマ変えてもここは安定）
  return {
    id,
    name_ja: raw.name_ja ?? raw.name ?? id,
    name_en: raw.name_en ?? raw.name ?? id,
    aliases: raw.aliases ?? [],
    categories: raw.categories ?? [],
    legal: raw.legal ?? [], // ここは最初は手で入れてもOK（あとでCSV結合に進化可能）
    identifiers: {
      pubchem_cid: raw.identifier?.pubchem_cid ?? raw.pubchem_cid ?? null,
      smiles: raw.identifier?.smiles ?? raw.smiles ?? null,
    },
    summary: raw.summary ?? raw.description ?? "",
    refs: raw.refs ?? raw.references ?? [],
  }
})

fs.writeFileSync(outFile, JSON.stringify(list, null, 2), "utf-8")
console.log(`[gen] wrote ${list.length} substances -> ${outFile}`)

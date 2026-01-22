// scripts/gen_substance_ids.mjs
import fs from "node:fs"
import path from "node:path"

const root = process.cwd()
const srcDir = path.join(root, "data/substances")
const outDir = path.join(root, "public/data")
const outFile = path.join(outDir, "substance_ids.json")

fs.mkdirSync(outDir, { recursive: true })

const files = fs.readdirSync(srcDir)
const ids = files
  .filter((f) => f.endsWith(".json"))
  .filter((f) => !f.startsWith("_")) // _scheme.json など
  .filter((f) => !f.startsWith(".")) // .DS_Store など
  .map((f) => f.replace(/\.json$/, ""))

fs.writeFileSync(outFile, JSON.stringify(ids), "utf-8")

console.log(`✅ wrote ${ids.length} ids -> ${outFile}`)

// scripts/copy-ketcher.mjs
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const pkgRoot = path.join(root, "node_modules", "ketcher-standalone");

// ketcher-standalone の配布形が環境で微妙に違うことがあるので候補を複数見る
const candidates = ["standalone", "dist", "build", ""].map((p) => path.join(pkgRoot, p));
const srcDir = candidates.find((p) => fs.existsSync(p) && fs.statSync(p).isDirectory());

if (!srcDir) {
  console.error("ketcher-standalone の配置が見つかりません:", candidates);
  process.exit(1);
}

const outDir = path.join(root, "public", "ketcher");
fs.mkdirSync(outDir, { recursive: true });

fs.cpSync(srcDir, outDir, { recursive: true });
console.log(`✅ Copied Ketcher from ${srcDir} -> ${outDir}`);

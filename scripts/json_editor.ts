#!/usr/bin/env node
/**
 * scripts/json_edit.ts
 * - show: print JSON (single or all), optionally list JSON Pointer paths
 * - set: set value by JSON Pointer (keys immutable; cannot add/rename keys)
 * - rename: rename file to <new_id>.json and set json.id = new_id (id key must exist)
 * - sync-id-to-filename: for each json, set json.id to filename stem (id key must exist)
 *
 * No external deps.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

type JsonValue = null | boolean | number | string | JsonValue[] | { [k: string]: JsonValue };

type GlobalOpts = {
  dir: string;
  includeScheme: boolean;
  noBackup: boolean;
  dryRun: boolean;
  printAfter: boolean;
};

function die(msg: string, code = 1): never {
  console.error(msg);
  process.exit(code);
}

function isJsonFile(name: string) {
  return name.toLowerCase().endsWith(".json");
}

async function loadJson(filePath: string): Promise<JsonValue> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as JsonValue;
}

async function saveJson(filePath: string, data: JsonValue, backup: boolean): Promise<void> {
  if (backup) {
    try {
      await fs.copyFile(filePath, `${filePath}.bak`);
    } catch {
      // ignore if file doesn't exist
    }
  }
  const tmp = `${filePath}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf-8");
  await fs.rename(tmp, filePath);
}

function prettyPrint(data: JsonValue) {
  console.log(JSON.stringify(data, null, 2));
}

/** JSON Pointer utilities: /a/b/0/c */
function parsePointer(ptr: string): string[] {
  if (ptr === "" || ptr === "/") return [];
  if (!ptr.startsWith("/")) throw new Error("path は JSON Pointer 形式で '/a/b/0' のように指定してください");
  const parts = ptr.split("/").slice(1).map((p) => p.replaceAll("~1", "/").replaceAll("~0", "~"));
  return parts;
}

function pointerEscape(k: string) {
  return k.replaceAll("~", "~0").replaceAll("/", "~1");
}

function listPaths(root: JsonValue, prefix = ""): string[] {
  const out: string[] = [];
  if (Array.isArray(root)) {
    root.forEach((v, i) => {
      const p = `${prefix}/${i}`;
      out.push(p);
      out.push(...listPaths(v, p));
    });
  } else if (root && typeof root === "object") {
    for (const [k, v] of Object.entries(root)) {
      const p = `${prefix}/${pointerEscape(k)}`;
      out.push(p);
      out.push(...listPaths(v, p));
    }
  }
  return out;
}

function getParentAndKey(root: JsonValue, pointer: string): { parent: JsonValue; last: string } {
  const parts = parsePointer(pointer);
  if (parts.length === 0) throw new Error("root 自体の置換は不可です。/key のように指定してください。");

  const parentParts = parts.slice(0, -1);
  const last = parts[parts.length - 1];

  let cur: JsonValue = root;

  for (const p of parentParts) {
    if (Array.isArray(cur)) {
      if (!/^\d+$/.test(p)) throw new Error(`配列に対して非数値インデックスです: ${p}`);
      const idx = Number(p);
      if (idx < 0 || idx >= cur.length) throw new Error(`配列インデックス範囲外: ${idx}`);
      cur = cur[idx];
      continue;
    }
    if (cur && typeof cur === "object") {
      if (!(p in cur)) throw new Error(`存在しないキーです（途中パスが見つかりません）: ${p}`);
      cur = (cur as any)[p];
      continue;
    }
    throw new Error(`途中パスで到達した値が dict/list ではありません: ${typeof cur}`);
  }

  return { parent: cur, last };
}

/** keys immutable: cannot add new keys; can only overwrite existing leaf value */
function setValue(root: JsonValue, pointer: string, newValue: JsonValue): void {
  const { parent, last } = getParentAndKey(root, pointer);

  if (Array.isArray(parent)) {
    if (!/^\d+$/.test(last)) throw new Error(`配列に対して非数値インデックスです: ${last}`);
    const idx = Number(last);
    if (idx < 0 || idx >= parent.length) throw new Error(`配列インデックス範囲外: ${idx}`);
    parent[idx] = newValue;
    return;
  }

  if (parent && typeof parent === "object") {
    if (!(last in parent)) throw new Error(`存在しないキーです（追加は禁止）: ${last}`);
    (parent as any)[last] = newValue;
    return;
  }

  throw new Error(`指定先の親が dict/list ではありません: ${typeof parent}`);
}

function coerceValue(valueStr: string): JsonValue {
  const s = valueStr.trim();

  // booleans / null
  if (s.toLowerCase() === "true") return true;
  if (s.toLowerCase() === "false") return false;
  if (s.toLowerCase() === "null" || s.toLowerCase() === "none") return null;

  // number
  if (/^-?\d+(\.\d+)?([eE]-?\d+)?$/.test(s)) {
    const n = Number(s);
    if (!Number.isNaN(n)) return n;
  }

  // JSON literal object/array
  if ((s.startsWith("{") && s.endsWith("}")) || (s.startsWith("[") && s.endsWith("]"))) {
    try {
      return JSON.parse(s) as JsonValue;
    } catch {
      // fallthrough
    }
  }

  // if user includes quotes, parse as JSON string
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    try {
      // JSON only accepts double quotes; handle single quotes quickly:
      if (s.startsWith("'") && s.endsWith("'")) return s.slice(1, -1);
      return JSON.parse(s) as JsonValue;
    } catch {
      return s;
    }
  }

  return valueStr; // raw string
}

/** argv parsing (no deps) */
function pullOption(argv: string[], flag: string, fallback?: string): string | undefined {
  const idx = argv.indexOf(flag);
  if (idx === -1) return fallback;
  if (idx + 1 >= argv.length) die(`${flag} の値がありません`);
  const val = argv[idx + 1];
  argv.splice(idx, 2);
  return val;
}

function pullFlag(argv: string[], flag: string): boolean {
  const idx = argv.indexOf(flag);
  if (idx === -1) return false;
  argv.splice(idx, 1);
  return true;
}

async function iterJsonFiles(dir: string, excludeScheme: boolean): Promise<string[]> {
  const entries = await fs.readdir(dir);
  return entries
    .filter((n) => isJsonFile(n))
    .filter((n) => (excludeScheme ? n !== "_scheme.json" : true))
    .sort()
    .map((n) => path.join(dir, n));
}

/** commands */
async function cmdShow(opts: GlobalOpts, argv: string[]) {
  const all = pullFlag(argv, "--all");
  const pathsFlag = pullFlag(argv, "--paths");

  const excludeScheme = !opts.includeScheme;

  if (all) {
    const files = await iterJsonFiles(opts.dir, excludeScheme);
    for (const f of files) {
      console.log("=".repeat(80));
      console.log(`[${path.basename(f)}]`);
      const data = await loadJson(f);
      prettyPrint(data);
      if (pathsFlag) {
        console.log("\n--- paths (JSON Pointer) ---");
        for (const p of listPaths(data)) console.log(p);
      }
    }
    return;
  }

  const file = argv[0];
  if (!file) die("show: file を指定してください（例: show am_2201.json）");
  const target = path.resolve(opts.dir, file);

  const data = await loadJson(target);
  prettyPrint(data);

  if (pathsFlag) {
    console.log("\n--- paths (JSON Pointer) ---");
    for (const p of listPaths(data)) console.log(p);
  }
}

async function cmdSet(opts: GlobalOpts, argv: string[]) {
  const file = argv[0];
  const pointer = argv[1];
  const valueStr = argv[2];

  if (!file || !pointer || valueStr === undefined) {
    die(`set: 使い方\n  set <file.json> </path/to/key> <value>`);
  }

  const target = path.resolve(opts.dir, file);
  const data = await loadJson(target);

  const newVal = coerceValue(valueStr);
  try {
    setValue(data, pointer, newVal);
  } catch (e: any) {
    die(`set error: ${e?.message ?? String(e)}`);
  }

  if (opts.printAfter) prettyPrint(data);

  if (opts.dryRun) {
    console.log(`[dry-run] would write: ${path.basename(target)}`);
    return;
  }
  await saveJson(target, data, !opts.noBackup);
}

async function cmdRename(opts: GlobalOpts, argv: string[]) {
  const file = argv[0];
  const newId = argv[1]?.trim();

  if (!file || !newId) {
    die(`rename: 使い方\n  rename <file.json> <new_id>`);
  }

  const target = path.resolve(opts.dir, file);
  const data = await loadJson(target);

  if (!(data && typeof data === "object" && !Array.isArray(data))) {
    die("rename: JSONのトップがオブジェクトではありません");
  }
  if (!("id" in data)) {
    die("rename: 'id' キーがありません（追加は禁止のため中断）");
  }

  (data as any).id = newId;

  const newPath = path.resolve(opts.dir, `${newId}.json`);

  if (opts.printAfter) prettyPrint(data);

  if (opts.dryRun) {
    console.log(`[dry-run] rename: ${path.basename(target)} -> ${path.basename(newPath)}`);
    return;
  }

  // 先に保存→後でリネーム
  await saveJson(target, data, !opts.noBackup);

  if (path.resolve(newPath) !== path.resolve(target)) {
    try {
      await fs.access(newPath);
      die(`rename: 既に存在します: ${path.basename(newPath)}（上書き禁止）`);
    } catch {
      // ok
    }
    await fs.rename(target, newPath);
  }
}

async function cmdSyncIdToFilename(opts: GlobalOpts) {
  const excludeScheme = !opts.includeScheme;
  const files = await iterJsonFiles(opts.dir, excludeScheme);

  if (files.length === 0) {
    console.log("対象JSONがありません");
    return;
  }

  for (const f of files) {
    const stem = path.basename(f, ".json");
    const data = await loadJson(f);

    if (!(data && typeof data === "object" && !Array.isArray(data))) {
      console.log(`[skip] ${path.basename(f)}: top-level が object じゃない`);
      continue;
    }
    if (!("id" in data)) {
      console.log(`[skip] ${path.basename(f)}: 'id' キーがない（追加禁止）`);
      continue;
    }

    if ((data as any).id === stem) {
      console.log(`[ok]   ${path.basename(f)}: id already '${stem}'`);
      continue;
    }

    (data as any).id = stem;

    if (opts.dryRun) {
      console.log(`[dry-run] ${path.basename(f)}: set id -> '${stem}'`);
      continue;
    }

    await saveJson(f, data, !opts.noBackup);
    console.log(`[done] ${path.basename(f)}: set id -> '${stem}'`);
  }
}

function usage() {
  console.log(`
Usage:
  json_edit --dir <dir> <command> [args...]

Commands:
  show <file.json> [--paths]
  show --all [--paths]
  set <file.json> </json/pointer/path> <value>
  rename <file.json> <new_id>
  sync-id-to-filename

Global options:
  --dir <dir>            target directory (default: .)
  --include-scheme       include _scheme.json
  --no-backup            do not create .bak
  --dry-run              do not write / rename
  --print-after          print JSON after update (set/rename)
`);
}

async function main() {
  const argv = process.argv.slice(2);

  const opts: GlobalOpts = {
    dir: pullOption(argv, "--dir", ".")!,
    includeScheme: pullFlag(argv, "--include-scheme"),
    noBackup: pullFlag(argv, "--no-backup"),
    dryRun: pullFlag(argv, "--dry-run"),
    printAfter: pullFlag(argv, "--print-after"),
  };

  const cmd = argv.shift();
  if (!cmd) {
    usage();
    process.exit(1);
  }

  try {
    if (cmd === "show") return await cmdShow(opts, argv);
    if (cmd === "set") return await cmdSet(opts, argv);
    if (cmd === "rename") return await cmdRename(opts, argv);
    if (cmd === "sync-id-to-filename") return await cmdSyncIdToFilename(opts);

    usage();
    die(`Unknown command: ${cmd}`);
  } catch (e: any) {
    die(e?.message ?? String(e));
  }
}

main();

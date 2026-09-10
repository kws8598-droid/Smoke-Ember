import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const CHUNK_DIR = join(ROOT, "data", "chunks");
const ORIGIN = "https://plum-honey-silver-wave.grok.me";

function countLocalRecipes() {
  let n = 0;
  for (let i = 0; i < 23; i++) {
    const file = join(CHUNK_DIR, `recipes-${String(i).padStart(2, "0")}.json`);
    if (!existsSync(file)) continue;
    try {
      const rows = JSON.parse(readFileSync(file, "utf8"));
      if (Array.isArray(rows)) n += rows.length;
    } catch {}
  }
  return n;
}

function alreadyPopulated() {
  return countLocalRecipes() >= 80;
}

function parseJsString(src, i) {
  const q = src[i];
  let j = i + 1;
  let out = "";
  while (j < src.length) {
    const ch = src[j];
    if (ch === "\\") {
      const n = src[j + 1];
      if (n === "n") out += "\n";
      else if (n === "t") out += "\t";
      else if (n === "r") out += "\r";
      else out += n;
      j += 2;
      continue;
    }
    if (ch === q) return { value: out, next: j + 1 };
    out += ch;
    j++;
  }
  throw new Error("unterminated string");
}

function parseValue(src, i) {
  while (i < src.length && /\s/.test(src[i])) i++;
  const ch = src[i];
  if (ch === "`" || ch === "'" || ch === '"') {
    const s = parseJsString(src, i);
    return { value: s.value, next: s.next };
  }
  if (ch === "{") return parseObject(src, i);
  if (ch === "[") return parseArray(src, i);
  if (src.startsWith("true", i)) return { value: true, next: i + 4 };
  if (src.startsWith("false", i)) return { value: false, next: i + 5 };
  if (src.startsWith("null", i)) return { value: null, next: i + 4 };
  const m = src.slice(i).match(/^-?(?:\d+\.?\d*|\.\d+)/);
  if (m) return { value: Number(m[0]), next: i + m[0].length };
  throw new Error("bad value at " + i + ": " + src.slice(i, i + 40));
}

function parseObject(src, i) {
  i++;
  const obj = {};
  while (i < src.length) {
    while (i < src.length && /[\s,]/.test(src[i])) i++;
    if (src[i] === "}") return { value: obj, next: i + 1 };
    let key;
    if (src[i] === "`" || src[i] === "'" || src[i] === '"') {
      const s = parseJsString(src, i);
      key = s.value;
      i = s.next;
    } else {
      const m = src.slice(i).match(/^[A-Za-z_][\w]*/);
      if (!m) throw new Error("bad key at " + i);
      key = m[0];
      i += key.length;
    }
    while (i < src.length && /\s/.test(src[i])) i++;
    if (src[i] !== ":") throw new Error("expected : at " + i);
    i++;
    const v = parseValue(src, i);
    obj[key] = v.value;
    i = v.next;
  }
  throw new Error("unterminated object");
}

function parseArray(src, i) {
  i++;
  const arr = [];
  while (i < src.length) {
    while (i < src.length && /[\s,]/.test(src[i])) i++;
    if (src[i] === "]") return { value: arr, next: i + 1 };
    if (src.startsWith("...", i)) {
      i += 3;
      while (i < src.length && /[A-Za-z0-9_$]/.test(src[i])) i++;
      continue;
    }
    const v = parseValue(src, i);
    arr.push(v.value);
    i = v.next;
  }
  throw new Error("unterminated array");
}

function collectArrays(js) {
  const names = ["h_", "g_", "v_", "T_", "__"];
  const found = {};
  for (const name of names) {
    const token = name + "=[";
    const idx = js.indexOf(token);
    if (idx === -1) continue;
    try {
      const parsed = parseArray(js, idx + name.length + 1);
      if (Array.isArray(parsed.value) && parsed.value[0]?.slug) found[name] = parsed.value;
    } catch (err) {
      console.warn("failed", name, err.message);
    }
  }
  return found;
}

function uniqueBySlug(rows) {
  const seen = new Set();
  const out = [];
  const drop = new Set(["texas-pecan-pie", "smoked-quail", "quail"]);
  for (const row of rows) {
    if (!row?.slug || seen.has(row.slug)) continue;
    const hay = `${row.slug} ${row.title || ""}`.toLowerCase();
    if (drop.has(row.slug) || hay.includes("quail")) continue;
    seen.add(row.slug);
    out.push(row);
  }
  return out;
}

function writeChunks(recipes) {
  mkdirSync(CHUNK_DIR, { recursive: true });
  const size = 5;
  let part = 0;
  for (let i = 0; i < recipes.length; i += size) {
    writeFileSync(join(CHUNK_DIR, `recipes-${String(part).padStart(2, "0")}.json`), JSON.stringify(recipes.slice(i, i + size)));
    part++;
  }
  for (let i = part; i < 23; i++) {
    writeFileSync(join(CHUNK_DIR, `recipes-${String(i).padStart(2, "0")}.json`), "[]");
  }
  writeFileSync(join(ROOT, "data", "recipes.json"), JSON.stringify(recipes));
  const third = Math.ceil(recipes.length / 3);
  writeFileSync(join(ROOT, "data", "recipes-part-0.json"), JSON.stringify(recipes.slice(0, third)));
  writeFileSync(join(ROOT, "data", "recipes-part-1.json"), JSON.stringify(recipes.slice(third, third * 2)));
  writeFileSync(join(ROOT, "data", "recipes-part-2.json"), JSON.stringify(recipes.slice(third * 2)));
  console.log("wrote", recipes.length, "recipes in", part, "chunks");
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 25000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(url + " " + res.status);
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

if (alreadyPopulated()) {
  console.log("recipe chunks already present");
  process.exit(0);
}

try {
  const html = await fetchText(ORIGIN + "/");
  const assets = [...html.matchAll(/\/assets\/(index-[^"']+\.js)/g)].map((m) => m[1]);
  const file = assets[0] || "index-DKup1FYr.js";
  const js = await fetchText(ORIGIN + "/assets/" + file);
  const arrays = collectArrays(js);
  const combined = uniqueBySlug([
    ...(arrays.T_ || []),
    ...(arrays.__ || []),
    ...(arrays.h_ || []),
    ...(arrays.g_ || []),
    ...(arrays.v_ || []),
  ]);
  if (combined.length < 80) throw new Error("extractor found only " + combined.length + " recipes");
  writeChunks(combined);
} catch (err) {
  console.warn("extractor skipped:", err.message);
  process.exit(0);
}

import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dest = join(process.cwd(), "public", "icons");
mkdirSync(dest, { recursive: true });

const files = ["icon-192.png", "icon-512.png", "apple-touch-icon.png"];
for (const name of files) {
  const path = join(dest, name);
  if (existsSync(path)) continue;
  const b64 = readFileSync(join(here, "icons", name + ".b64"), "utf8").trim();
  writeFileSync(path, Buffer.from(b64, "base64"));
}

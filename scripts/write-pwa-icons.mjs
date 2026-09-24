import { mkdirSync, writeFileSync, existsSync, readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const iconDest = join(process.cwd(), "public", "icons");
mkdirSync(iconDest, { recursive: true });

const icons = ["icon-192.png", "icon-512.png", "apple-touch-icon.png"];
for (const name of icons) {
  const path = join(iconDest, name);
  if (existsSync(path)) continue;
  const b64Path = join(here, "icons", name + ".b64");
  if (!existsSync(b64Path)) continue;
  const b64 = readFileSync(b64Path, "utf8").trim();
  writeFileSync(path, Buffer.from(b64, "base64"));
}

const photoSrc = join(here, "photos");
const photoDest = join(process.cwd(), "public", "images");
mkdirSync(photoDest, { recursive: true });
if (existsSync(photoSrc)) {
  for (const name of readdirSync(photoSrc)) {
    if (!name.endsWith(".b64")) continue;
    const outName = name.slice(0, -4);
    const outPath = join(photoDest, outName);
    if (existsSync(outPath)) continue;
    const b64 = readFileSync(join(photoSrc, name), "utf8").trim();
    writeFileSync(outPath, Buffer.from(b64, "base64"));
  }
}

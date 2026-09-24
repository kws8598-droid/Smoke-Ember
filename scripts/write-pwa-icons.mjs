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
const imageDest = join(process.cwd(), "public", "images");
const foodDest = join(process.cwd(), "public", "food");
mkdirSync(imageDest, { recursive: true });
mkdirSync(foodDest, { recursive: true });
if (existsSync(photoSrc)) {
  for (const name of readdirSync(photoSrc)) {
    if (!name.endsWith(".b64")) continue;
    const outName = name.slice(0, -4);
    const b64 = readFileSync(join(photoSrc, name), "utf8").trim();
    if (!b64 || b64 === "PLACEHOLDER") continue;
    const buf = Buffer.from(b64, "base64");
    const imagePath = join(imageDest, outName);
    const foodPath = join(foodDest, outName);
    if (!existsSync(imagePath)) writeFileSync(imagePath, buf);
    if (!existsSync(foodPath)) writeFileSync(foodPath, buf);
  }
}

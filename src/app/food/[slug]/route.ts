import { readFile } from "fs/promises";
import { join } from "path";
import packIndex from "@/data/pack-index.json";

const FALLBACK: Record<string, string> = {
  "smoked-prime-rib": "central-texas-brisket",
  "smoked-beef-cheeks": "point-burnt-ends",
  "smoked-picanha": "santa-maria-tri-tip",
  "carolina-whole-hog": "championship-pulled-pork",
  "smoked-picnic-shoulder": "monroe-county-shoulder",
  "country-style-pork-ribs": "dry-rub-spare-ribs",
  "city-ham-on-the-pit": "applewood-smoked-bacon",
  "spatchcock-pit-chicken": "alabama-white-sauce-chicken",
  "smoked-chicken-wings": "competition-chicken-thighs",
  "competition-chicken-halves": "herb-butter-smoked-turkey",
  "smoked-duck": "herb-butter-smoked-turkey",
  "smoked-quail": "competition-chicken-thighs",
  "jalapeno-cheddar-sausage": "texas-hot-guts",
  "texas-hot-links": "texas-hot-guts",
  "pit-smoked-trout": "cedar-plank-salmon",
  "cabrito-shoulder": "owensboro-mutton",
  "corn-pudding": "smoked-creamed-corn",
  "bread-and-butter-pickles": "pit-pickled-onions",
  "competition-box-garnish": "pepper-vinegar-slaw",
  "competition-chicken-mop": "cajun-butter-mop",
  "peach-pit-sauce": "blackberry-pit-sauce",
  "cherry-cola-glaze": "kansas-city-molasses-sauce",
  "butter-poultry-injection": "championship-pork-injection",
};

const CAT: Record<string, { fill: string; ink: string; label: string }> = {
  beef: { fill: "#8a3220", ink: "#f3ebe2", label: "BEEF" },
  pork: { fill: "#b45a32", ink: "#f3ebe2", label: "PORK" },
  poultry: { fill: "#c47a2e", ink: "#1a1410", label: "POULTRY" },
  venison: { fill: "#5a2c20", ink: "#f3ebe2", label: "VENISON" },
  mutton: { fill: "#6e3228", ink: "#f3ebe2", label: "MUTTON" },
  gator: { fill: "#4e6a2c", ink: "#f3ebe2", label: "GATOR" },
  fish: { fill: "#c45c3a", ink: "#f3ebe2", label: "FISH" },
  sausage: { fill: "#8e241c", ink: "#f3ebe2", label: "SAUSAGE" },
  sides: { fill: "#b48a2e", ink: "#1a1410", label: "SIDES" },
  rubs: { fill: "#8a5a22", ink: "#f3ebe2", label: "RUBS" },
  sauces: { fill: "#9a1c18", ink: "#f3ebe2", label: "SAUCES" },
  desserts: { fill: "#a86a30", ink: "#1a1410", label: "DESSERTS" },
};

function guessCat(slug: string) {
  if (/brisket|tri-tip|burnt-ends|plate-rib|prime-rib|picanha|cheek|burger|meatloaf|chili|pot-roast|lamb/.test(slug)) return "beef";
  if (/pork|rib|bacon|ham|hog|picnic|shoulder|butt/.test(slug)) return "pork";
  if (/chicken|turkey|duck|quail|poultry/.test(slug)) return "poultry";
  if (/venison|burgoo/.test(slug)) return "venison";
  if (/mutton|cabrito/.test(slug)) return "mutton";
  if (/gator/.test(slug)) return "gator";
  if (/salmon|trout|fish/.test(slug)) return "fish";
  if (/sausage|guts|links/.test(slug)) return "sausage";
  if (/rub|seasoning|spg|dalmatian/.test(slug)) return "rubs";
  if (/sauce|mop|glaze|dip|injection|salsa|chile$/.test(slug)) return "sauces";
  if (/pudding|cobbler|pie/.test(slug)) return "desserts";
  return "sides";
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function svgPlate(slug: string) {
  const cat = guessCat(slug);
  const theme = CAT[cat];
  const title = titleFromSlug(slug);
  const hueShift = slug.split("").reduce((n, c) => n + c.charCodeAt(0), 0) % 24;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <rect width="800" height="500" fill="#100c09"/>
  <rect x="0" y="${40 + (hueShift % 8)}" width="800" height="18" fill="#1a1410"/>
  <rect x="0" y="${90 + (hueShift % 10)}" width="800" height="12" fill="#16100c"/>
  <rect x="48" y="48" width="704" height="404" rx="22" fill="#1a1410"/>
  <rect x="70" y="70" width="660" height="300" rx="18" fill="${theme.fill}"/>
  <ellipse cx="250" cy="210" rx="110" ry="70" fill="#1a1410" opacity="0.18"/>
  <ellipse cx="540" cy="230" rx="140" ry="80" fill="#f3ebe2" opacity="0.10"/>
  <rect x="70" y="300" width="660" height="70" fill="#100c09" opacity="0.25"/>
  <text x="92" y="400" fill="#c45c26" font-family="Georgia, serif" font-size="14" letter-spacing="3">${theme.label}</text>
  <text x="92" y="438" fill="#f3ebe2" font-family="Georgia, serif" font-size="28">${escapeXml(title)}</text>
</svg>`;
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function fromB64(name: string) {
  const encoded = await readFile(join(process.cwd(), "src/data/food", `${name}.b64`), "utf8");
  if (!encoded.trim()) throw new Error("empty");
  return encoded;
}

async function fromPack(name: string) {
  const packName = (packIndex as Record<string, string>)[name];
  if (!packName) throw new Error("no pack");
  const raw = await readFile(join(process.cwd(), "src/data/packs", packName), "utf8");
  const pack = JSON.parse(raw) as Record<string, string>;
  const encoded = pack[name];
  if (!encoded) throw new Error("missing in pack");
  return encoded;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const safe = slug.replace(/[^a-z0-9-]/g, "");
  const names = [safe, FALLBACK[safe]].filter(Boolean) as string[];
  for (const name of names) {
    for (const loader of [fromPack, fromB64]) {
      try {
        const encoded = await loader(name);
        return new Response(Buffer.from(encoded, "base64"), {
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } catch {
        continue;
      }
    }
  }
  return new Response(svgPlate(safe), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

import { readFile } from "fs/promises";
import { join } from "path";
import photoMap from "@/data/photo-map.json";
import photoKeys from "@/data/photo-keys.json";

function guessKind(slug: string) {
  if (/cobbler/.test(slug)) return "cobbler";
  if (/pie/.test(slug)) return "pie";
  if (/pudding/.test(slug)) return "pudding";
  if (/brisket/.test(slug)) return "brisket";
  if (/plate-rib|short-rib|prime-rib/.test(slug)) return "beef-rib";
  if (/burnt-end/.test(slug)) return "ends";
  if (/rib/.test(slug)) return "ribs";
  if (/pulled|shoulder|hog|butt|picnic/.test(slug)) return "pulled";
  if (/bacon|ham/.test(slug)) return "bacon";
  if (/burger|meatloaf/.test(slug)) return "burger";
  if (/chili|burgoo/.test(slug)) return "chili";
  if (/tri-tip|picanha|backstrap|loin/.test(slug)) return "steak";
  if (/lamb|mutton|cabrito/.test(slug)) return "lamb";
  if (/wing/.test(slug)) return "wings";
  if (/thigh|chicken|spatchcock/.test(slug)) return "chicken";
  if (/turkey/.test(slug)) return "turkey";
  if (/duck|quail/.test(slug)) return "duck";
  if (/gator/.test(slug)) return "gator";
  if (/salmon|trout/.test(slug)) return "fish";
  if (/sausage|guts|links/.test(slug)) return "sausage";
  if (/white-sauce/.test(slug)) return "white-sauce";
  if (/mustard|gold/.test(slug)) return "mustard";
  if (/vinegar|lexington|injection/.test(slug)) return "vinegar";
  if (/black-bbq|blackberry/.test(slug)) return "black-sauce";
  if (/sauce|mop|glaze|salsa|chile$/.test(slug)) return "red-sauce";
  if (/dalmatian|spg|seasoning/.test(slug)) return "salt-pepper";
  if (/rub/.test(slug)) return "rub";
  if (/mac|grits|pimento/.test(slug)) return "mac";
  if (/slaw|pickle|cabbage|garnish/.test(slug)) return "slaw";
  if (/potato/.test(slug)) return "potato";
  if (/cornbread/.test(slug)) return "cornbread";
  if (/collard/.test(slug)) return "greens";
  if (/hush/.test(slug)) return "pups";
  if (/corn/.test(slug)) return "corn";
  if (/bean/.test(slug)) return "beans";
  return "plate";
}

function dishSvg(slug: string) {
  const kind = guessKind(slug);
  const title = slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
  const palettes: Record<string, [string, string, string]> = {
    cobbler: ["#c45c26", "#e8a04a", "#6a2a10"],
    pie: ["#6b3a18", "#c47a2e", "#2a1810"],
    pudding: ["#f3ebe2", "#e8d27a", "#8a6a32"],
    brisket: ["#4a2214", "#c45c26", "#1a0c08"],
    "beef-rib": ["#3a1a10", "#8a3220", "#1a0c08"],
    ends: ["#6a2410", "#c45c26", "#1a0c08"],
    ribs: ["#5a2414", "#b45a32", "#1a0c08"],
    pulled: ["#8a4a28", "#d4a070", "#2a140c"],
    bacon: ["#8a2418", "#e8a070", "#2a0c08"],
    burger: ["#5a2a14", "#c45c26", "#1a0c08"],
    chili: ["#7a1c10", "#c45c26", "#2a0c08"],
    steak: ["#6a2014", "#c45c26", "#1a0c08"],
    lamb: ["#5a2c20", "#a86a40", "#1a0c08"],
    wings: ["#b45a20", "#e8a04a", "#2a1408"],
    chicken: ["#c47a2e", "#f3ebe2", "#2a1808"],
    turkey: ["#b45a20", "#f3ebe2", "#2a1808"],
    duck: ["#8a3210", "#c45c26", "#1a0c08"],
    gator: ["#4e6a2c", "#c4b07a", "#1a1408"],
    fish: ["#c45c3a", "#f3c4a0", "#2a1408"],
    sausage: ["#8e241c", "#c45c26", "#1a0c08"],
    "white-sauce": ["#f3ebe2", "#d8d0c4", "#2a241c"],
    mustard: ["#c4a02a", "#e8d27a", "#2a1c08"],
    vinegar: ["#c47a2e", "#f3ebe2", "#2a1808"],
    "black-sauce": ["#2a1810", "#6a3220", "#100c09"],
    "red-sauce": ["#9a1c18", "#c45c26", "#1a0c08"],
    "salt-pepper": ["#d8d0c4", "#2a241c", "#1a1410"],
    rub: ["#8a5a22", "#c45c26", "#1a1408"],
    mac: ["#e8c46a", "#f3ebe2", "#2a1c08"],
    slaw: ["#8aaa4a", "#f3ebe2", "#1a1408"],
    potato: ["#e8d27a", "#f3ebe2", "#2a1c08"],
    cornbread: ["#c47a2e", "#e8c46a", "#2a1408"],
    greens: ["#3a5a20", "#8aaa4a", "#101408"],
    pups: ["#c47a2e", "#e8c46a", "#2a1408"],
    corn: ["#e8c46a", "#c45c26", "#2a1408"],
    beans: ["#6a3220", "#c45c26", "#1a0c08"],
    plate: ["#c45c26", "#f3ebe2", "#1a1410"],
  };
  const [fill, hi, lo] = palettes[kind] ?? palettes.plate;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <rect width="800" height="500" fill="#100c09"/>
  <ellipse cx="400" cy="250" rx="280" ry="160" fill="${lo}"/>
  <ellipse cx="400" cy="240" rx="210" ry="120" fill="${fill}"/>
  <ellipse cx="360" cy="210" rx="90" ry="50" fill="${hi}" opacity="0.35"/>
  <text x="400" y="430" text-anchor="middle" fill="#c45c26" font-family="Georgia, serif" font-size="13" letter-spacing="3">${kind.toUpperCase()}</text>
  <text x="400" y="462" text-anchor="middle" fill="#f3ebe2" font-family="Georgia, serif" font-size="22">${title.replace(/&/g, "&amp;")}</text>
</svg>`;
}

async function fromPack(key: string) {
  const packName = (photoKeys as Record<string, string>)[key];
  if (!packName) throw new Error("no pack");
  const raw = await readFile(join(process.cwd(), "src/data/packs", packName), "utf8");
  const pack = JSON.parse(raw) as Record<string, string>;
  const encoded = pack[key];
  if (!encoded) throw new Error("missing");
  return encoded;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const safe = slug.replace(/[^a-z0-9-]/g, "");
  const key = (photoMap as Record<string, string>)[safe] ?? safe;
  try {
    const encoded = await fromPack(key);
    return new Response(Buffer.from(encoded, "base64"), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response(dishSvg(safe), {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
}

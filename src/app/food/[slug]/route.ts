import photoMap from "@/data/photo-map.json";

type MapFile = Record<string, string>;

function guessKind(slug: string) {
  if (/cobbler/.test(slug)) return "cobbler";
  if (/pie/.test(slug)) return "pie";
  if (/pudding/.test(slug)) return "pudding";
  if (/brisket/.test(slug)) return "brisket";
  if (/plate-rib|prime-rib/.test(slug)) return "beef-rib";
  if (/burnt-end/.test(slug)) return "ends";
  if (/rib/.test(slug)) return "ribs";
  if (/pulled|shoulder|hog|picnic/.test(slug)) return "pulled";
  if (/bacon|ham/.test(slug)) return "bacon";
  if (/burger|meatloaf/.test(slug)) return "burger";
  if (/chili|burgoo/.test(slug)) return "chili";
  if (/tri-tip|picanha|backstrap/.test(slug)) return "steak";
  if (/lamb|mutton|cabrito/.test(slug)) return "lamb";
  if (/wing/.test(slug)) return "wings";
  if (/chicken|spatchcock|thigh/.test(slug)) return "chicken";
  if (/turkey/.test(slug)) return "turkey";
  if (/duck|quail/.test(slug)) return "duck";
  if (/gator/.test(slug)) return "gator";
  if (/salmon|trout/.test(slug)) return "fish";
  if (/sausage|guts|links/.test(slug)) return "sausage";
  if (/white-sauce/.test(slug)) return "white-sauce";
  if (/mustard|gold/.test(slug)) return "mustard";
  if (/vinegar|lexington|injection/.test(slug)) return "vinegar";
  if (/sauce|mop|glaze|salsa/.test(slug)) return "red-sauce";
  if (/dalmatian|spg/.test(slug)) return "salt-pepper";
  if (/rub|seasoning/.test(slug)) return "rub";
  if (/mac|grits|pimento/.test(slug)) return "mac";
  if (/slaw|pickle|cabbage|garnish/.test(slug)) return "slaw";
  if (/potato/.test(slug)) return "potato";
  if (/cornbread|hush/.test(slug)) return "cornbread";
  if (/collard/.test(slug)) return "greens";
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
  const palettes: Record<string, [string, string]> = {
    cobbler: ["#c45c26", "#e8a04a"],
    pie: ["#6b3a18", "#c47a2e"],
    pudding: ["#e8d27a", "#f3ebe2"],
    brisket: ["#4a2214", "#c45c26"],
    "beef-rib": ["#3a1a10", "#8a3220"],
    ends: ["#6a2410", "#c45c26"],
    ribs: ["#5a2414", "#b45a32"],
    pulled: ["#8a4a28", "#d4a070"],
    bacon: ["#8a2418", "#e8a070"],
    burger: ["#5a2a14", "#c45c26"],
    chili: ["#7a1c10", "#c45c26"],
    steak: ["#6a2014", "#c45c26"],
    lamb: ["#5a2c20", "#a86a40"],
    wings: ["#b45a20", "#e8a04a"],
    chicken: ["#c47a2e", "#f3ebe2"],
    turkey: ["#b45a20", "#f3ebe2"],
    duck: ["#8a3210", "#c45c26"],
    gator: ["#4e6a2c", "#c4b07a"],
    fish: ["#c45c3a", "#f3c4a0"],
    sausage: ["#8e241c", "#c45c26"],
    "white-sauce": ["#f3ebe2", "#d8d0c4"],
    mustard: ["#c4a02a", "#e8d27a"],
    vinegar: ["#c47a2e", "#f3ebe2"],
    "red-sauce": ["#9a1c18", "#c45c26"],
    "salt-pepper": ["#d8d0c4", "#2a241c"],
    rub: ["#8a5a22", "#c45c26"],
    mac: ["#e8c46a", "#f3ebe2"],
    slaw: ["#8aaa4a", "#f3ebe2"],
    potato: ["#e8d27a", "#f3ebe2"],
    cornbread: ["#c47a2e", "#e8c46a"],
    greens: ["#3a5a20", "#8aaa4a"],
    corn: ["#e8c46a", "#c45c26"],
    beans: ["#6a3220", "#c45c26"],
    plate: ["#c45c26", "#f3ebe2"],
  };
  const [fill, hi] = palettes[kind] ?? palettes.plate;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <rect width="800" height="500" fill="#100c09"/>
  <ellipse cx="400" cy="230" rx="240" ry="140" fill="${fill}"/>
  <ellipse cx="350" cy="200" rx="90" ry="48" fill="${hi}" opacity="0.4"/>
  <text x="400" y="430" text-anchor="middle" fill="#c45c26" font-family="Georgia, serif" font-size="13" letter-spacing="3">${kind.toUpperCase()}</text>
  <text x="400" y="462" text-anchor="middle" fill="#f3ebe2" font-family="Georgia, serif" font-size="22">${title.replace(/&/g, "&amp;")}</text>
</svg>`;
}

async function remote(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "SmokeEmber/1.0 (competition BBQ recipe app)" },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(String(res.status));
  const buf = Buffer.from(await res.arrayBuffer());
  const type = res.headers.get("content-type") || "image/jpeg";
  if (!type.startsWith("image/")) throw new Error("not image");
  return { buf, type };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const safe = slug.replace(/[^a-z0-9-]/g, "");
  const url = (photoMap as MapFile)[safe];
  if (url) {
    try {
      const { buf, type } = await remote(url);
      return new Response(buf, {
        headers: {
          "Content-Type": type,
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch {
      // fall through
    }
  }
  return new Response(dishSvg(safe), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

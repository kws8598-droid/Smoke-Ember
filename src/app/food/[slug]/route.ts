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
  const names = [safe, FALLBACK[safe], "alabama-white-sauce"].filter(Boolean) as string[];
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
  return new Response("missing plate", { status: 404 });
}

import { readFile } from "fs/promises";
import { join } from "path";
import packIndex from "@/data/pack-index.json";
import photoMap from "@/data/photo-map.json";

type MapFile = Record<string, string>;

const ALIASES: Record<string, string> = {
  "poor-mans-brisket": "poor-man-s-brisket",
  "copycat-pf-changs-spare-ribs": "copycat-p-f-chang-s-spare-ribs",
};

function namesFor(slug: string) {
  const safe = slug.replace(/[^a-z0-9-]/g, "");
  return Array.from(new Set([safe, ALIASES[safe]].filter(Boolean))) as string[];
}

async function fromPack(name: string) {
  const packName = (packIndex as Record<string, string>)[name];
  if (!packName) throw new Error("no pack");
  const raw = await readFile(join(process.cwd(), "src/data/packs", packName), "utf8");
  const pack = JSON.parse(raw) as Record<string, string>;
  const encoded = pack[name];
  if (!encoded) throw new Error("missing in pack");
  return Buffer.from(encoded.replace(/\s+/g, ""), "base64");
}

async function fromB64(name: string) {
  const encoded = await readFile(join(process.cwd(), "src/data/food", `${name}.b64`), "utf8");
  if (!encoded.trim()) throw new Error("empty");
  return Buffer.from(encoded.replace(/\s+/g, ""), "base64");
}

async function fromPublic(name: string) {
  return await readFile(join(process.cwd(), "public/food", `${name}.jpg`));
}

async function remote(url: string) {
  const res = await fetch(url, {
    headers: { "User-Agent": "SmokeEmber/1.0 (competition BBQ recipe app)" },
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(String(res.status));
  const type = res.headers.get("content-type") || "image/jpeg";
  if (!type.startsWith("image/")) throw new Error("not image");
  return { buf: Buffer.from(await res.arrayBuffer()), type };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const names = namesFor(slug);

  for (const name of names) {
    for (const loader of [fromPack, fromB64, fromPublic]) {
      try {
        const buf = await loader(name);
        if (buf.length) {
          return new Response(buf, {
            headers: {
              "Content-Type": "image/jpeg",
              "Cache-Control": "public, max-age=86400",
            },
          });
        }
      } catch {
        // next source
      }
    }
  }

  for (const name of names) {
    const url = (photoMap as MapFile)[name];
    if (!url) continue;
    try {
      const { buf, type } = await remote(url);
      return new Response(buf, {
        headers: {
          "Content-Type": type,
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch {
      // next
    }
  }

  return new Response("missing plate", { status: 404 });
}

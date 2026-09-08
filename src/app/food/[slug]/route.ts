import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const safe = slug.replace(/[^a-z0-9-]/g, "");
  try {
    const encoded = await readFile(
      join(process.cwd(), "src/data/food", `${safe}.b64`),
      "utf8"
    );
    return new Response(Buffer.from(encoded, "base64"), {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("missing plate", { status: 404 });
  }
}

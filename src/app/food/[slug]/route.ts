import { NextResponse } from "next/server";
import { getRecipe } from "@/lib/data";
export function GET(req: Request, { params }: { params: { slug: string } }) {
  const recipe = getRecipe(params.slug);
  const target = recipe?.image || `/images/${params.slug}.jpg`;
  return NextResponse.redirect(new URL(target, req.url), 307);
}

import { NextResponse } from "next/server";
import { getLiveRecipes } from "@/lib/live";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const recipes = await getLiveRecipes();
  return NextResponse.json(
    { recipes },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

import { NextResponse } from "next/server";
import { getLiveRecipes } from "@/lib/live";

export const revalidate = 600;

export async function GET() {
  const recipes = await getLiveRecipes();
  return NextResponse.json(
    { recipes },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}

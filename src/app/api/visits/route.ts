import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const noStore = { "Cache-Control": "no-store, max-age=0" };

// GET: read the current count without incrementing.
export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_visits")
      .select("count")
      .eq("id", 1)
      .single();
    if (error) throw error;
    const count = typeof data?.count === "number" ? data.count : 0;
    return NextResponse.json({ count }, { headers: noStore });
  } catch {
    return NextResponse.json({ count: null }, { headers: noStore });
  }
}

// POST: count one visit, return the new total.
export async function POST() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("increment_site_visits");
    if (error) throw error;
    const count = typeof data === "number" ? data : 0;
    return NextResponse.json({ count }, { headers: noStore });
  } catch {
    return NextResponse.json({ count: null }, { headers: noStore });
  }
}

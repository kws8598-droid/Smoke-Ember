import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { productionOrigin, safeNextPath } from "@/lib/supabase/redirect";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const origin = productionOrigin();

  const supabase = createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/login?error=callback&next=${encodeURIComponent(next)}`);
  }

  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      type: (type as "email" | "magiclink") || "email",
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/login?error=callback&next=${encodeURIComponent(next)}`);
  }

  return NextResponse.redirect(`${origin}/login?error=missing_code&next=${encodeURIComponent(next)}`);
}

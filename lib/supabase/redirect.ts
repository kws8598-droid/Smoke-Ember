export const PRODUCTION_ORIGIN = "https://smoke-ember.vercel.app";

const ALLOWED_NEXT = new Set(["/admin"]);

export function safeNextPath(next?: string | null): string {
  if (!next) return "/admin";
  if (!next.startsWith("/") || next.startsWith("//")) return "/admin";
  if (next.includes("\\") || next.includes(":")) return "/admin";
  const path = next.split("?")[0].split("#")[0];
  if (path === "/admin" || path.startsWith("/admin/")) return path;
  if (ALLOWED_NEXT.has(path)) return path;
  return "/admin";
}

export function productionOrigin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv && fromEnv.startsWith("https://") && !fromEnv.includes("localhost")) {
    return fromEnv;
  }
  return PRODUCTION_ORIGIN;
}

export function emailRedirectTo(next?: string | null): string {
  const dest = safeNextPath(next);
  return `${productionOrigin()}/auth/callback?next=${encodeURIComponent(dest)}`;
}

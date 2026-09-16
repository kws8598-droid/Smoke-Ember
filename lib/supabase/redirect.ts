export const PRODUCTION_ORIGIN = "https://smoke-ember.vercel.app";
export const PRODUCTION_EMAIL_REDIRECT =
  "https://smoke-ember.vercel.app/auth/callback?next=/admin";
export const PRODUCTION_RESET_REDIRECT =
  "https://smoke-ember.vercel.app/auth/callback?next=/reset-password";

export function safeNextPath(next?: string | null): string {
  if (!next) return "/admin";
  if (!next.startsWith("/") || next.startsWith("//")) return "/admin";
  if (next.includes("\\") || next.includes(":")) return "/admin";
  const path = next.split("?")[0].split("#")[0];
  if (path === "/reset-password") return "/reset-password";
  if (path === "/admin" || path.startsWith("/admin/")) return path;
  return "/admin";
}

export function productionOrigin(): string {
  return PRODUCTION_ORIGIN;
}

export function emailRedirectTo(_next?: string | null): string {
  return PRODUCTION_EMAIL_REDIRECT;
}

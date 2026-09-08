import recipes0 from "@/data/recipes-part-0.json";
import recipes1 from "@/data/recipes-part-1.json";
import recipes2 from "@/data/recipes-part-2.json";
import wisdomJson from "@/data/wisdom.json";
import type { Recipe, Wisdom } from "./types";

export const recipes = [...recipes0, ...recipes1, ...recipes2] as Recipe[];
export const wisdom = wisdomJson as Wisdom[];

export const proteins = ["all","beef","pork","poultry","sausage","fish","venison","mutton","gator","sides","rubs","sauces"] as const;

export function getRecipe(slug: string) { return recipes.find((r) => r.slug === slug); }
export function getWisdom(slug: string) { return wisdom.find((w) => w.slug === slug); }
export function desserts() { return recipes.filter((r) => r.protein === "desserts"); }
export function sides() { return recipes.filter((r) => r.protein === "sides"); }

export function formatHours(h: { min: number; max: number }) {
  const fmt = (n: number) => (n < 1 ? `${Math.round(n * 60)} min` : String(n).replace(/\.0$/, ""));
  if (h.max < 1) return `${Math.round(h.min * 60)}–${Math.round(h.max * 60)} min`;
  if (h.min === h.max) return h.min < 1 ? fmt(h.min) : `${fmt(h.min)} hrs`;
  return `${fmt(h.min)}–${fmt(h.max)} hrs`;
}

export function difficultyLabel(d: string) {
  if (d === "weeknight") return "Weeknight";
  if (d === "weekend") return "Weekend cook";
  if (d === "all-day") return "All-day pit";
  return d;
}

export function regionLabel(r: string) {
  const map: Record<string, string> = { texas: "Texas", "kansas-city": "Kansas City", carolina: "Carolina", memphis: "Memphis", alabama: "Alabama", california: "California", kentucky: "Kentucky", florida: "Florida", mississippi: "Mississippi", louisiana: "Louisiana", chicago: "Chicago", maryland: "Maryland", southwest: "Southwest", pacific: "Pacific Northwest", georgia: "Georgia" };
  return map[r] || r;
}

export function related(recipe: Recipe, n = 3) {
  return recipes.filter((r) => r.slug !== recipe.slug && (r.region === recipe.region || r.protein === recipe.protein) && r.protein !== "desserts").slice(0, n);
}

export function filterRecipes(opts: { protein?: string; time?: string; q?: string; includeDesserts?: boolean }) {
  let list = recipes.slice();
  if (!opts.includeDesserts) list = list.filter((r) => r.protein !== "desserts");
  if (opts.protein && opts.protein !== "all") list = list.filter((r) => r.protein === opts.protein);
  if (opts.time === "2h") list = list.filter((r) => r.hours.max <= 2.5);
  if (opts.time === "afternoon") list = list.filter((r) => r.hours.max > 2.5 && r.hours.max <= 8);
  if (opts.time === "all-day") list = list.filter((r) => r.hours.min >= 8 || r.hours.max > 8);
  if (opts.q) {
    const q = opts.q.toLowerCase();
    list = list.filter((r) => r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.region.includes(q) || r.protein.includes(q));
  }
  return list;
}

const IMG_ORIGIN = process.env.NEXT_PUBLIC_IMG_ORIGIN ?? "https://plum-honey-silver-wave.grok.me";
export function img(path: string) {
  const p = !path ? "/images/brisket.jpg" : path.startsWith("/") ? path : `/${path}`;
  return `${IMG_ORIGIN}${p}`;
}

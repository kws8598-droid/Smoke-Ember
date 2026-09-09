import recipes0 from "@/data/chunks/recipes-00.json";
import recipes1 from "@/data/chunks/recipes-01.json";
import recipes2 from "@/data/chunks/recipes-02.json";
import recipes3 from "@/data/chunks/recipes-03.json";
import recipes4 from "@/data/chunks/recipes-04.json";
import recipes5 from "@/data/chunks/recipes-05.json";
import recipes6 from "@/data/chunks/recipes-06.json";
import recipes7 from "@/data/chunks/recipes-07.json";
import recipes8 from "@/data/chunks/recipes-08.json";
import recipes9 from "@/data/chunks/recipes-09.json";
import recipes10 from "@/data/chunks/recipes-10.json";
import recipes11 from "@/data/chunks/recipes-11.json";
import recipes12 from "@/data/chunks/recipes-12.json";
import recipes13 from "@/data/chunks/recipes-13.json";
import recipes14 from "@/data/chunks/recipes-14.json";
import recipes15 from "@/data/chunks/recipes-15.json";
import recipes16 from "@/data/chunks/recipes-16.json";
import recipes17 from "@/data/chunks/recipes-17.json";
import recipes18 from "@/data/chunks/recipes-18.json";
import recipes19 from "@/data/chunks/recipes-19.json";
import recipes20 from "@/data/chunks/recipes-20.json";
import recipes21 from "@/data/chunks/recipes-21.json";
import recipes22 from "@/data/chunks/recipes-22.json";
import wisdomJson from "@/data/wisdom.json";
import type { Recipe, Wisdom } from "./types";

export const recipes = [
  ...recipes0, ...recipes1, ...recipes2, ...recipes3, ...recipes4,
  ...recipes5, ...recipes6, ...recipes7, ...recipes8, ...recipes9,
  ...recipes10, ...recipes11, ...recipes12, ...recipes13, ...recipes14,
  ...recipes15, ...recipes16, ...recipes17, ...recipes18, ...recipes19,
  ...recipes20, ...recipes21, ...recipes22,
] as Recipe[];
export const wisdom = wisdomJson as Wisdom[];

export const proteins = [
  "all","beef","pork","poultry","sausage","fish","venison","mutton","gator","sides","rubs","sauces",
] as const;

export const regionCopy: Record<string, { label: string; line: string; image: string }> = {
  texas: { label: "Texas", line: "Salt, pepper, post oak. The meat is the sauce.", image: "/images/brisket.jpg" },
  "kansas-city": { label: "Kansas City", line: "Burnt ends, molasses, a bottle on the table.", image: "/images/kc-ribs.jpg" },
  carolina: { label: "The Carolinas", line: "Whole hog, vinegar, no tomato in sight.", image: "/images/pulled-pork.jpg" },
  memphis: { label: "Memphis", line: "Dry dust or wet mop — you pick.", image: "/images/memphis-ribs.jpg" },
  california: { label: "California", line: "Red oak, garlic, a tri-tip off the coals.", image: "/images/tri-tip.jpg" },
  alabama: { label: "Alabama", line: "White sauce. Don't write an essay.", image: "/images/white-chicken.jpg" },
  louisiana: { label: "Louisiana", line: "Cayenne, butter, a bird that argues.", image: "/images/turkey.jpg" },
  kentucky: { label: "Kentucky", line: "Black sauce. Mutton if you can get it.", image: "/images/owensboro-dip.jpg" },
  mississippi: { label: "Mississippi", line: "Sweet tomato in the Delta. Gator when you can get it.", image: "/images/mississippi-sweet-ribs.jpg" },
  florida: { label: "Florida", line: "Sweet tomato, a squeeze of orange.", image: "/images/florida-sweet-ribs.jpg" },
  georgia: { label: "Georgia", line: "Championship pork. Inject, wrap, pull.", image: "/images/championship-pulled-pork.jpg" },
  chicago: { label: "Chicago", line: "Mild or hot. White bread is the utensil.", image: "/images/chicago-sauce.jpg" },
  southwest: { label: "Southwest", line: "Chile is the sauce. Not ketchup.", image: "/images/hatch-elote.jpg" },
  maryland: { label: "Maryland", line: "Rare pit beef, tiger sauce, a Kaiser roll.", image: "/images/tiger-sauce.jpg" },
  pacific: { label: "Pacific Northwest", line: "Alder and salmon. Don't make ham.", image: "/images/salmon.jpg" },
};

export function getRecipe(slug: string) { return recipes.find((r) => r.slug === slug); }
export function getWisdom(slug: string) { return wisdom.find((w) => w.slug === slug); }
export function desserts() { return recipes.filter((r) => r.protein === "desserts"); }
export function sides() { return recipes.filter((r) => r.protein === "sides"); }
export function pantry() { return recipes.filter((r) => r.protein === "rubs" || r.protein === "sauces"); }

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

export function regionLabel(r: string) { return regionCopy[r]?.label || r; }

export function related(recipe: Recipe, n = 3) {
  return recipes.filter((r) => r.slug !== recipe.slug && (r.region === recipe.region || r.protein === recipe.protein)).slice(0, n);
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
    list = list.filter((r) =>
      r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.story.toLowerCase().includes(q) ||
      r.region.includes(q) || r.protein.includes(q) || r.wood.toLowerCase().includes(q)
    );
  }
  return list;
}

export function img(path: string) {
  if (!path) return "/images/brisket.jpg";
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

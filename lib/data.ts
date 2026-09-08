import recipes0 from "@/data/recipes-part-0.json";
import recipes1 from "@/data/recipes-part-1.json";
import recipes2 from "@/data/recipes-part-2.json";
import wisdomJson from "@/data/wisdom.json";
import type { Recipe, Wisdom } from "./types";

export const recipes = [...recipes0, ...recipes1, ...recipes2] as Recipe[];
export const wisdom = wisdomJson as Wisdom[];

export const proteins = ["all","beef","pork","poultry","sausage","fish","venison","mutton","gator","sides","rubs","sauces"] as const;

export const regionCopy: Record<string, { label: string; line: string; image: string }> = {
  texas: { label: "Texas", line: "Salt, pepper, post oak. The meat is the sauce.", image: "/images/brisket.jpg" },
  "kansas-city": { label: "Kansas City", line: "Burnt ends, molasses, a bottle on the table.", image: "/images/kc-ribs.jpg" },
  carolina: { label: "The Carolinas", line: "Whole hog, vinegar, no tomato in sight.", image: "/images/pulled-pork.jpg" },
  memphis: { label: "Memphis", line: "Dry dust or wet mop \u2014 you pick.", image: "/images/memphis-ribs.jpg" },
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
  if (h.max < 1) return `${Math.round(h.min * 60)}\u2013${Math.round(h.max * 60)} min`;
  if (h.min === h.max) return h.min < 1 ? fmt(h.min) : `${fmt(h.min)} hrs`;
  return `${fmt(h.min)}\u2013${fmt(h.max)} hrs`;
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
    list = list.filter((r) => r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.story.toLowerCase().includes(q) || r.region.includes(q) || r.protein.includes(q) || r.wood.toLowerCase().includes(q));
  }
  return list;
}

export function img(path: string) {
  if (!path) return "/images/brisket.jpg";
  if (path.startsWith("http")) return path;
  return path.startsWith("/") ? path : `/${path}`;
}

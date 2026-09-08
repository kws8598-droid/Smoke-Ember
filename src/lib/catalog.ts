import { getRecipe as getCoreRecipe, recipes as coreRecipes, type Recipe } from "./recipes";
import { moreRecipes } from "./more-recipes";

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const play: Record<string, Pick<Recipe, "fire" | "wood" | "time" | "yield" | "ingredients" | "method">> = {
  Beef: { fire: "250-275F", wood: "Post oak or hickory", time: "6-12 hours", yield: "1 roast", ingredients: ["Beef", "Salt", "Pepper"], method: ["Season.", "Smoke until tender.", "Rest and slice."] },
  Pork: { fire: "250-275F", wood: "Hickory or apple", time: "5-10 hours", yield: "1 shoulder or rack", ingredients: ["Pork", "Salt", "Pepper", "Rub"], method: ["Season.", "Smoke.", "Rest, then slice or pull."] },
  Poultry: { fire: "300-325F", wood: "Pecan or apple", time: "1-3 hours", yield: "1 bird", ingredients: ["Chicken or duck", "Salt", "Pepper"], method: ["Dry the skin.", "Cook hot enough to render.", "Rest."] },
  Sausage: { fire: "250F then a hot kiss", wood: "Post oak", time: "2 hours", yield: "5 lb", ingredients: ["Grind", "Salt", "Chile", "Casings"], method: ["Stuff.", "Smoke to 150-155F.", "Blister the casing."] },
  Fish: { fire: "350F", wood: "Alder", time: "25-40 minutes", yield: "1 fish", ingredients: ["Fish", "Salt", "Butter"], method: ["Season.", "Smoke until it flakes."] },
  Mutton: { fire: "250-275F", wood: "Hickory or oak", time: "8-10 hours", yield: "1 shoulder", ingredients: ["Goat or mutton", "Salt", "Pepper"], method: ["Season.", "Smoke and mop.", "Slice or pull."] },
  Sides: { fire: "Pit or stovetop", wood: "Whatever is burning", time: "20-90 minutes", yield: "1 pan", ingredients: ["The named ingredients", "Salt"], method: ["Cook until it can sit next to fat meat."] },
  Sauces: { fire: "None or a short simmer", wood: "None", time: "10-30 minutes", yield: "About 2 cups", ingredients: ["Acid", "Fat or tomato", "Salt", "Heat"], method: ["Whisk or reduce until balanced."] },
};

const added: Recipe[] = moreRecipes.map(([title, category, summary, note]) => {
  const base = play[category] ?? play.Sides;
  return {
    title,
    category,
    protein: category,
    slug: slugify(title),
    summary,
    note,
    ...base,
  };
});

export type { Recipe };
export const recipes: Recipe[] = [...coreRecipes, ...added];
export function getRecipe(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug) ?? getCoreRecipe(slug);
}

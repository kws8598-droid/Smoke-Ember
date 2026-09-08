import { getRecipe as getCoreRecipe, recipes as coreRecipes, type Recipe } from "./recipes";
import { moreRecipes } from "./more-recipes";

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const play: Record<string, Pick<Recipe, "fire" | "wood" | "time" | "yield" | "ingredients" | "method">> = {
  Beef: {
    fire: "250-275F",
    wood: "Post oak or hickory",
    time: "6-12 hours",
    yield: "1 roast",
    ingredients: ["Beef roast", "Kosher salt", "Coarse black pepper"],
    method: ["Trim and season the night before.", "Smoke until the bark sets.", "Wrap only if the cook needs a push.", "Rest, then slice across the grain."]
  },
  Pork: {
    fire: "250-275F",
    wood: "Hickory or apple",
    time: "5-10 hours",
    yield: "1 shoulder or rack",
    ingredients: ["Pork", "Salt", "Pepper", "Rub"],
    method: ["Season all sides.", "Smoke until bark sets.", "Wrap only if tenderness stalls.", "Rest, then slice or pull."]
  },
  Poultry: {
    fire: "300-325F",
    wood: "Pecan or apple",
    time: "1-3 hours",
    yield: "1 bird",
    ingredients: ["Chicken or duck", "Salt", "Pepper"],
    method: ["Dry the skin.", "Cook hot enough to render.", "Sauce off the fire if the sauce is mayo-based.", "Rest."]
  },
  Sausage: {
    fire: "250F then a hot kiss",
    wood: "Post oak",
    time: "2 hours",
    yield: "5 lb",
    ingredients: ["Grind with about 25% fat", "Salt", "Chile", "Casings"],
    method: ["Mix until sticky. Stuff.", "Smoke to 150-155F.", "Blister the casing over hotter coals."]
  },
  Fish: {
    fire: "350F",
    wood: "Alder",
    time: "25-40 minutes",
    yield: "1 fish",
    ingredients: ["Fish", "Salt", "Butter"],
    method: ["Season.", "Smoke until the thickest part just flakes."]
  },
  Mutton: {
    fire: "250-275F",
    wood: "Hickory or oak",
    time: "8-10 hours",
    yield: "1 shoulder",
    ingredients: ["Goat or mutton", "Salt", "Pepper"],
    method: ["Season.", "Smoke and mop.", "Slice or pull when it gives."]
  },
  Sides: {
    fire: "Pit or stovetop",
    wood: "Whatever is burning",
    time: "20-90 minutes",
    yield: "1 pan",
    ingredients: ["The named ingredients", "Salt"],
    method: ["Cook until it can sit next to fat meat."]
  },
  Sauces: {
    fire: "None or a short simmer",
    wood: "None",
    time: "10-30 minutes",
    yield: "About 2 cups",
    ingredients: ["Acid", "Fat or tomato", "Salt", "Heat"],
    method: ["Whisk or reduce until balanced."]
  },
  Desserts: {
    fire: "375F oven or skillet on the pit",
    wood: "None, or a short pecan kiss",
    time: "30-70 minutes",
    yield: "1 pan or pie",
    ingredients: ["Fruit or pecans", "Sugar", "Butter", "A starch or crust"],
    method: ["Build the dessert.", "Bake until set and browned.", "Cool before a clean slice."]
  }
};

const coreSlugs = new Set(coreRecipes.map((recipe) => recipe.slug));

const added: Recipe[] = moreRecipes
  .map(([title, category, summary, note]) => {
    const slug = slugify(title);
    const base = play[category] ?? play.Sides;
    return {
      title,
      category,
      protein: category,
      slug,
      image: `/food/${slug}?v=6`,
      summary,
      note,
      ...base
    };
  })
  .filter((recipe) => !coreSlugs.has(recipe.slug));

export type { Recipe };
export const recipes: Recipe[] = [...coreRecipes, ...added];
export function getRecipe(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug) ?? getCoreRecipe(slug);
}

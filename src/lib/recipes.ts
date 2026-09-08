import book0 from "@/data/recipe-book-0.json";
import book1 from "@/data/recipe-book-1.json";
import book2 from "@/data/recipe-book-2.json";

export type Recipe = {
  title: string;
  category: string;
  protein: string;
  slug: string;
  summary: string;
  fire: string;
  wood: string;
  time: string;
  yield: string;
  ingredients: string[];
  method: string[];
  note: string;
};

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

type Seed = {
  title: string;
  category: string;
  summary: string;
  fire: string;
  wood: string;
  time: string;
  yield: string;
  ingredients: string[];
  method: string[];
  note: string;
};

export const recipes: Recipe[] = ([...book0, ...book1, ...book2] as Seed[]).map((entry) => ({
  ...entry,
  protein: entry.category,
  slug: slugify(entry.title),
}));

export function getRecipe(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug);
}

export function recipesByCategory() {
  return recipes.reduce<Record<string, Recipe[]>>((groups, recipe) => {
    groups[recipe.category] = groups[recipe.category] ?? [];
    groups[recipe.category].push(recipe);
    return groups;
  }, {});
}

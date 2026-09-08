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

import book from "./recipe-book.json";

export const recipes: Recipe[] = (book as Omit<Recipe, "protein" | "slug">[]).map((entry) => ({
  ...entry,
  protein: entry.category,
  slug: slugify(entry.title),
}));

export function getRecipe(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug);
}

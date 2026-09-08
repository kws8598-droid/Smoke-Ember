import book from "@/data/recipe-book.json";

export type Recipe = {
  title: string;
  category: string;
  protein: string;
  slug: string;
  image: string;
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

export const recipes: Recipe[] = (book as Seed[]).map((entry) => {
  const slug = slugify(entry.title);
  return {
    ...entry,
    protein: entry.category,
    slug,
    image: `/food/${slug}?v=6`,
  };
});

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

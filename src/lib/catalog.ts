import { getRecipe as getCoreRecipe, recipes as coreRecipes, type Recipe } from "./recipes";

export type { Recipe };
export const recipes: Recipe[] = coreRecipes;
export function getRecipe(slug: string) {
  return recipes.find((recipe) => recipe.slug === slug) ?? getCoreRecipe(slug);
}

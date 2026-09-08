import { recipes } from "@/lib/catalog";
import RecipesBrowser from "./RecipesBrowser";

export const metadata = { title: "Recipes" };

export default function RecipesPage() {
  return (
    <main className="page">
      <p className="kicker">The book</p>
      <h1>Recipes</h1>
      <p className="lede">
        {recipes.length} cooks, grouped the way a pit sheet should be. Beef through dessert.
      </p>
      <RecipesBrowser recipes={recipes} />
    </main>
  );
}

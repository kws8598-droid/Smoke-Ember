import Link from "next/link";
import { recipes } from "@/lib/recipes";

const categories = Array.from(new Set(recipes.map((recipe) => recipe.category)));

export const metadata = { title: "Recipes" };

export default function RecipesPage() {
  return (
    <main className="page">
      <p className="kicker">The book</p>
      <h1>Recipes</h1>
      <p className="lede">Every cook on the list, grouped the way a pit sheet should be.</p>
      {categories.map((category) => (
        <section className="stack" key={category}>
          <h2>{category}</h2>
          <div className="grid">
            {recipes.filter((recipe) => recipe.category === category).map((recipe) => (
              <Link className="card" key={recipe.slug} href={`/recipes/${recipe.slug}`}>
                <img className="card-photo" src={`/food/${recipe.slug}.jpg`} alt={recipe.title} />
                <p className="meta">{recipe.category}</p>
                <h2>{recipe.title}</h2>
                <p>{recipe.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}

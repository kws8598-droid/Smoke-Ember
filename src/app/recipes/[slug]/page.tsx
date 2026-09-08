import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipe, recipes } from "@/lib/recipes";

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  return { title: recipe?.title ?? "Recipe" };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  return (
    <main className="page">
      <p className="kicker">{recipe.category}</p>
      <h1>{recipe.title}</h1>
      <p className="lede">{recipe.summary}</p>
      <section className="stack">
        <article className="panel">
          <p className="meta">Working notes</p>
          <p>Full method cards are still being written. Until then: salt early, smoke clean, rest longer than your pride wants, and sauce after the bark is set.</p>
        </article>
        <Link href="/recipes">Back to the book</Link>
      </section>
    </main>
  );
}

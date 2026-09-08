import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipe, recipes } from "@/lib/recipes";

export function generateStaticParams() {
  return recipes.map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  return {
    title: recipe?.title ?? "Recipe",
    openGraph: recipe
      ? { images: [{ url: `/food/${recipe.slug}.jpg`, alt: recipe.title }] }
      : undefined,
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipe(slug);
  if (!recipe) notFound();

  const related = recipes
    .filter((item) => item.category === recipe.category && item.slug !== recipe.slug)
    .slice(0, 3);

  return (
    <main className="page">
      <p className="kicker">{recipe.category}</p>
      <h1>{recipe.title}</h1>
      <p className="lede">{recipe.summary}</p>
      <img className="hero-photo" src={`/food/${recipe.slug}.jpg`} alt={recipe.title} />

      <dl className="specs">
        <div><dt>Fire</dt><dd>{recipe.fire}</dd></div>
        <div><dt>Wood</dt><dd>{recipe.wood}</dd></div>
        <div><dt>Time</dt><dd>{recipe.time}</dd></div>
        <div><dt>Yield</dt><dd>{recipe.yield}</dd></div>
      </dl>

      <section className="stack">
        <article className="panel">
          <p className="meta">On the board</p>
          <ul className="list">
            {recipe.ingredients.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <p className="meta">Method</p>
          <ol className="steps">
            {recipe.method.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <article className="panel">
          <p className="meta">Pit note</p>
          <p>{recipe.note}</p>
        </article>
      </section>

      {related.length > 0 ? (
        <section className="stack">
          <p className="meta">Same side of the box</p>
          <div className="grid">
            {related.map((item) => (
              <Link className="card" key={item.slug} href={`/recipes/${item.slug}`}>
                <img className="card-photo" src={`/food/${item.slug}.jpg`} alt={item.title} />
                <p className="meta">{item.category}</p>
                <h2>{item.title}</h2>
                <p>{item.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <p className="back">
        <Link href="/recipes">Back to the book</Link>
      </p>
    </main>
  );
}

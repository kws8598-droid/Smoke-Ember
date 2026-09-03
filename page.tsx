import Link from "next/link";
import { recipes } from "@/lib/recipes";
import { brand } from "@/lib/brand";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <p className="kicker">{brand.tagline}</p>
        <h1>Competition fire. No fluff.</h1>
        <p className="lede">
          Mops that lacquer chicken, injections that keep pork honest, and the ugly-truth notes
          that actually survive a Saturday turn-in.
        </p>
      </section>
      <section className="grid">
        {recipes.map((recipe) => (
          <Link className="card" key={recipe.slug} href={`/recipes/${recipe.slug}`}>
            <p className="meta">
              {recipe.category} · {recipe.protein}
            </p>
            <h2>{recipe.title}</h2>
            <p>{recipe.summary}</p>
          </Link>
        ))}
        <Link className="card" href="/tips">
          <p className="meta">Pit notes</p>
          <h2>Tips that keep you out of the swamp</h2>
          <p>Skin schedule, injection discipline, rest, salt, and how the box actually gets judged.</p>
        </Link>
      </section>
    </main>
  );
}

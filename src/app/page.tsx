import Link from "next/link";
import { recipes } from "@/lib/recipes";
import { brand } from "@/lib/brand";

const featured = recipes
  .filter((recipe) => ["Beef", "Pork", "Poultry"].includes(recipe.category))
  .slice(0, 8);

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <p className="kicker">{brand.tagline}</p>
        <h1>Competition fire. No fluff.</h1>
        <p className="lede">
          Mops that lacquer chicken, injections that keep pork honest, and the ugly-truth notes that actually survive a Saturday turn-in.
        </p>
      </section>
      <section className="grid">
        {featured.map((recipe) => (
          <Link className="card" key={recipe.slug} href={`/recipes/${recipe.slug}`}>
            <img className="card-photo" src={`/food/${recipe.slug}`} alt={recipe.title} />
            <p className="meta">{recipe.category}</p>
            <h2>{recipe.title}</h2>
            <p>{recipe.summary}</p>
          </Link>
        ))}
        <Link className="card" href="/recipes">
          <p className="meta">Full book</p>
          <h2>Every recipe on the pit list</h2>
          <p>Beef through dessert. Rubs, sauces, sides, and the weird meat that wins county fairs.</p>
        </Link>
        <Link className="card" href="/tips">
          <p className="meta">Pit notes</p>
          <h2>Tips that keep you out of the swamp</h2>
          <p>Skin schedule, injection discipline, rest, salt, and how the box actually gets judged.</p>
        </Link>
      </section>
    </main>
  );
}

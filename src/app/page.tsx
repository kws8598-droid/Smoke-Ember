import Link from "next/link";
import { recipes } from "@/lib/catalog";
import { brand } from "@/lib/brand";

const featured = recipes
  .filter((recipe) => ["Beef", "Pork", "Poultry", "Gator"].includes(recipe.category))
  .slice(0, 8);

const categories = Array.from(new Set(recipes.map((recipe) => recipe.category)));

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <img
          className="hero-photo stall-cover"
          src="/food/hero-smoker?v=9"
          alt="Offset smoker at dusk"
        />
        <p className="kicker">{brand.tagline}</p>
        <h1>Competition fire. No fluff.</h1>
        <p className="lede">
          {recipes.length} cooks. The plates from the pit site now cover the book — brisket, ribs, sauces, sides, the stall.
        </p>
        <p className="chips home-chips">
          {categories.map((category) => (
            <Link className="chip" key={category} href="/recipes">
              {category}
            </Link>
          ))}
        </p>
      </section>
      <section className="grid">
        {featured.map((recipe) => (
          <Link className="card" key={recipe.slug} href={`/recipes/${recipe.slug}`}>
            <img className="card-photo" src={`/food/${recipe.slug}?v=9`} alt={recipe.title} />
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
          <img className="card-photo" src="/food/the-stall?v=9" alt="The stall" />
          <p className="meta">Fire school</p>
          <h2>The stall is not a problem</h2>
          <p>Wrap for the clock, not for fear. The probe parked at 160 is weather, not failure.</p>
        </Link>
      </section>
    </main>
  );
}

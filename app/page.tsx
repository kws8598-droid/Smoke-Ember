import Link from "next/link";
import TonightPicker from "@/components/TonightPicker";
import RecipeCard from "@/components/RecipeCard";
import { desserts, getRecipe, sides, wisdom, img } from "@/lib/data";
const featured = ["memphis-dry-ribs", "santa-maria-tri-tip", "alabama-white-chicken", "central-texas-brisket"];
const quotes = ["Thin blue smoke or go home.", "The stall is not a problem.", "Bark is a crust you earn."];
export default function HomePage() {
  const cards = featured.map((s) => getRecipe(s)).filter(Boolean);
  const sideCards = sides().slice(0, 6);
  const sweet = desserts().slice(0, 6);
  return (
    <main>
      <section className="relative min-h-[88vh] overflow-hidden">
        <img src={img("/images/hero-dusk.jpg")} alt="Fire in the pit" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-24 md:grid-cols-2 md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-ember-hot">The pit is lit</p>
            <h1 className="mt-3 font-display text-6xl italic leading-[0.95] text-cream md:text-7xl">Pull up a chair.</h1>
            <p className="mt-5 max-w-md text-lg text-parchment/90">Pick how long you have. Smoke and Ember hands you a cook that actually fits tonight.</p>
            <div className="mt-8 flex items-center gap-4">
              <Link href="/recipes" className="rounded-full bg-ember px-5 py-2.5 text-sm text-cream hover:bg-ember-hot">See all recipes →</Link>
              <Link href="/wisdom" className="text-sm text-parchment hover:text-cream">Cooking tips</Link>
            </div>
          </div>
          <TonightPicker />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">The cook that sorts you out</p>
        <h2 className="mt-2 font-display text-4xl italic text-cream">Featured pits</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">{cards.map((r) => r && <RecipeCard key={r.slug} recipe={r} large />)}</div>
      </section>
      <section className="bg-bark py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs uppercase tracking-[0.22em] text-subtle">Fire school</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">{quotes.map((q) => <blockquote key={q} className="font-display text-2xl italic text-cream">“{q}”</blockquote>)}</div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">{wisdom.slice(0, 4).map((w) => (
            <Link key={w.slug} href={`/wisdom/${w.slug}`} className="rounded-2xl border border-white/5 p-5 hover:border-ember/40">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ember">{w.kicker}</p>
              <h3 className="mt-1 font-display text-2xl">{w.title}</h3>
              <p className="mt-2 text-sm text-parchment/80">{w.summary}</p>
            </Link>
          ))}</div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.22em] text-subtle">Pitmaster sides</p><h2 className="mt-2 font-display text-4xl italic">The plate around the meat</h2></div><Link href="/recipes?protein=sides" className="text-sm text-ember hover:text-ember-hot">All sides</Link></div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{sideCards.map((r) => <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="flex items-end justify-between"><div><p className="text-xs uppercase tracking-[0.22em] text-subtle">Southern desserts</p><h2 className="mt-2 font-display text-4xl italic">Close the plate</h2></div><Link href="/desserts" className="text-sm text-ember hover:text-ember-hot">All desserts</Link></div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{sweet.map((r) => <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
    </main>
  );
}

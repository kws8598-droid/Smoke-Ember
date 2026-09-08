import Link from "next/link";
import TonightPicker from "@/components/TonightPicker";
import RecipeCard from "@/components/RecipeCard";
import { desserts, getRecipe, pantry, regionCopy, recipes, sides, wisdom } from "@/lib/data";

const featured = ["memphis-dry-ribs", "santa-maria-tri-tip", "alabama-white-chicken", "central-texas-brisket"];
const quotes = [
  { text: "Thin blue smoke or go home.", slug: "clean-fire" },
  { text: "The stall is not a problem.", slug: "the-stall" },
  { text: "Bark is a crust you earn.", slug: "building-bark" },
];
const house = ["ember-house-rub", "ember-molasses-sauce", "honey-mustard-onion-sauce", "memphis-wet-sauce", "raspberry-chipotle-sauce", "sweet-vinegar-sauce"];

export default function HomePage() {
  const cards = featured.map((s) => getRecipe(s)).filter(Boolean);
  const extraSides = ["mustard-potato-salad", "potlikker-collards", "memphis-bbq-spaghetti", "hush-puppies", "alabama-cheese-grits", "cajun-dirty-rice"].map((s) => getRecipe(s)).filter(Boolean);
  const extraSweet = ["banana-pudding", "texas-sheet-cake", "red-velvet-cake", "southern-pound-cake", "fried-peach-pies", "pecan-pralines"].map((s) => getRecipe(s)).filter(Boolean);
  const extraBottles = house.map((s) => getRecipe(s)).filter(Boolean);
  return (
    <main>
      <section className="relative min-h-[88vh] overflow-hidden">
        <img src="/images/hero-dusk.jpg" alt="Fire in the pit" className="hero-still absolute inset-0 h-full w-full object-cover" />
        <video className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover sm:block" autoPlay muted loop playsInline preload="metadata" poster="/images/hero-dusk.jpg" aria-hidden>
          <source src="/videos/hero-fire.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-24 md:grid-cols-2 md:items-end sm:min-h-[88vh]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-ember">The pit is lit</p>
            <h1 className="mt-3 font-display text-5xl italic leading-[0.95] text-cream sm:text-7xl">Pull up a chair.</h1>
            <p className="mt-5 max-w-md text-lg text-parchment/90">Pick how long you have. Smoke and Ember hands you a cook that actually fits tonight.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/recipes" className="inline-flex h-11 items-center rounded-full bg-ember px-5 text-sm text-cream hover:bg-ember-hot">See all recipes \u2192</Link>
              <Link href="/wisdom" className="text-sm text-parchment hover:text-cream">Cooking tips</Link>
            </div>
          </div>
          <TonightPicker />
        </div>
      </section>
      <section className="border-y border-white/5 bg-bark py-10">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-3">
          {quotes.map((q) => (
            <Link key={q.slug} href={`/wisdom/${q.slug}`} className="group">
              <blockquote className="font-display text-2xl italic text-cream group-hover:text-ember">\u201c{q.text}\u201d</blockquote>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-subtle">Fire school</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">The cook that sorts you out</p>
        <h2 className="mt-2 font-display text-4xl italic text-cream">Featured pits</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">{cards.map((r) => r && <RecipeCard key={r.slug} recipe={r} large />)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-subtle">Pitmaster sides</p><h2 className="mt-2 font-display text-4xl italic">The plate around the meat</h2></div><Link href="/recipes?protein=sides" className="text-sm text-ember hover:text-ember-hot">All sides</Link></div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{(extraSides.length ? extraSides : sides().slice(0,6)).map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-subtle">Southern desserts</p><h2 className="mt-2 font-display text-4xl italic">Close the plate</h2></div><Link href="/desserts" className="text-sm text-ember hover:text-ember-hot">All desserts</Link></div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{(extraSweet.length ? extraSweet : desserts().slice(0,6)).map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-subtle">House bottles</p><h2 className="mt-2 font-display text-4xl italic">Rubs and sauces</h2></div><Link href="/recipes?protein=sauces" className="text-sm text-ember hover:text-ember-hot">All pantry</Link></div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{(extraBottles.length ? extraBottles : pantry().slice(0,6)).map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
      <section className="bg-bark py-16">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs uppercase tracking-[0.22em] text-subtle">The map</p>
          <h2 className="mt-2 font-display text-4xl italic">Regional schools</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(regionCopy).map(([id, meta]) => (
            <Link key={id} href={`/recipes?region=${id}`} className="overflow-hidden rounded-2xl border border-white/5">
              <div className="relative h-36"><img src={meta.image} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" /><div className="absolute bottom-3 left-3 right-3"><h3 className="font-display text-2xl italic text-cream">{meta.label}</h3><p className="text-sm text-parchment/85">{meta.line}</p></div></div>
            </Link>
          ))}</div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">Fire school</p>
        <h2 className="mt-2 font-display text-4xl italic">Notes from the pit</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">{wisdom.slice(0, 6).map((w) => (
          <Link key={w.slug} href={`/wisdom/${w.slug}`} className="rounded-2xl border border-white/5 p-5 hover:border-ember/40">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ember">{w.kicker}</p>
            <h3 className="mt-1 font-display text-2xl">{w.title}</h3>
            <p className="mt-2 text-sm text-parchment/80">{w.summary}</p>
          </Link>
        ))}</div>
        <p className="mt-6 text-sm text-subtle">{recipes.length} original cooks. No invented plates.</p>
      </section>
    </main>
  );
}

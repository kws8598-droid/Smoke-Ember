import Image from "next/image";
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
const house = ["ember-house-rub", "ember-molasses-sauce", "ember-finishing-glaze", "honey-mustard-onion-sauce", "memphis-wet-sauce", "raspberry-chipotle-sauce"];
const spookySlugs = ["jack-o-lantern-stuffed-peppers", "halloween-mummy-poppers", "halloween-smoked-pumpkin-pie", "candy-apple-pork-belly", "halloween-mummy-meatloaf", "halloween-bat-wings", "halloween-stuffed-mini-pumpkins", "halloween-smoked-cider", "halloween-snack-mix", "candy-apple-bbq-chicken"];

export default function HomePage() {
  const cards = featured.map((s) => getRecipe(s)).filter(Boolean);
  const extraSides = ["cast-iron-green-beans", "mustard-potato-salad", "potlikker-collards", "memphis-bbq-spaghetti", "hush-puppies", "alabama-cheese-grits"].map((s) => getRecipe(s)).filter(Boolean);
  const extraSweet = ["banana-pudding", "texas-sheet-cake", "red-velvet-cake", "southern-pound-cake", "fried-peach-pies", "pecan-pralines"].map((s) => getRecipe(s)).filter(Boolean);
  const extraBottles = house.map((s) => getRecipe(s)).filter(Boolean);
  const spooky = spookySlugs.map((s) => getRecipe(s)).filter(Boolean);
  return (
    <main className="relative">
      {/* Weathered store-wood backdrop, like the country store wall in the header picture */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image src="/images/homepage-wood-bg.jpg" alt="" fill sizes="100vw" className="object-cover contrast-[1.12]" />
        <div className="absolute inset-0 bg-ink/45" />
      </div>
      <section className="relative overflow-hidden sm:min-h-[88vh]">
        {/* Mobile: spooky Halloween night video at the top for October, picker card sits below it */}
        <div className="relative aspect-[4/3] w-full sm:hidden">
          <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline preload="metadata" poster="/images/halloween-hero-night-poster.jpg" aria-hidden>
            <source src="/videos/halloween-hero-night.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
            <p className="text-[27px] font-extrabold leading-[1.1] text-cream">Pick how long you have.</p>
            <p className="mt-1 text-[16px] leading-6 text-parchment/90">Smoke and Ember hands you a cook that actually fits tonight.</p>
          </div>
        </div>
        {/* Desktop: full-bleed hero */}
        <Image src="/images/hero-bbq-pitrow-v2.jpg" alt="Pitmasters tending smokers and brick pits at a fall barbecue" fill priority sizes="100vw" className="hero-still hidden object-cover sm:block" />
        <video className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover sm:block" autoPlay muted loop playsInline preload="metadata" poster="/images/halloween-hero-night-poster.jpg" aria-hidden>
          <source src="/videos/halloween-hero-night.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 hidden bg-gradient-to-t from-ink via-ink/55 to-ink/20 sm:block" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:grid sm:min-h-[88vh] sm:items-end sm:gap-10 sm:pb-16 sm:pt-24 md:grid-cols-2">
          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-[0.28em] text-ember">The pit is lit</p>
            <h1 className="mt-3 font-display text-5xl italic leading-[0.95] text-cream glow-ember sm:text-7xl">Pull up a chair.</h1>
            <p className="mt-5 max-w-md text-lg text-parchment">Pick how long you have. Smoke and Ember hands you a cook that actually fits tonight.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/recipes" className="inline-flex h-11 items-center rounded-full bg-ember px-5 text-sm text-cream hover:bg-ember-hot">See all recipes →</Link>
              <Link href="/wisdom" className="text-sm text-parchment hover:text-cream">Cooking tips</Link>
            </div>
          </div>
          <div className="mb-6 flex items-center gap-7 sm:hidden">
            <Link href="/recipes" className="inline-flex h-11 items-center rounded-full bg-ember px-5 text-sm text-cream hover:bg-ember-hot">See all recipes →</Link>
            <Link href="/wisdom" className="text-sm text-parchment hover:text-cream">Cooking tips</Link>
          </div>
          <TonightPicker />
        </div>
      </section>
      {spooky.length > 0 && (
        <section className="relative overflow-hidden">
          <Image src="/images/halloween-banner.jpg" alt="Halloween barbecue at night with glowing jack-o'-lanterns" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
          <div className="relative mx-auto max-w-6xl px-4 py-14">
            <p className="text-xs uppercase tracking-[0.22em] text-ember">October at the pit</p>
            <h2 className="mt-2 font-display text-4xl italic text-cream glow-ember">Halloween smokes</h2>
            <p className="mt-2 max-w-xl text-parchment/85">Spooky-season cooks for the Halloween table — carve, wrap, smoke, repeat.</p>
            <div className="mt-4 grid gap-0 md:grid-cols-2">{spooky.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
          </div>
        </section>
      )}
      <section className="relative bg-bark/85 py-4">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs uppercase tracking-[0.22em] text-subtle">The map</p>
          <h2 className="mt-2 font-display text-4xl italic glow-ember">Regional flavors</h2>
          <div className="mt-3 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(regionCopy).map(([id, meta]) => (
            <Link key={id} href={`/recipes?region=${id}`} className="overflow-hidden rounded-2xl border border-white/5">
              <div className="relative h-36"><Image src={meta.image} alt="" fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" /><div className="absolute bottom-3 left-3 right-3"><h3 className="font-display text-2xl italic text-cream">{meta.label}</h3><p className="text-sm text-parchment/85">{meta.line}</p></div></div>
            </Link>
          ))}</div>
        </div>
      </section>
      <section className="relative border-y border-white/5 bg-bark/85 py-4">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 lg:grid-cols-3">
          {quotes.map((q) => (
            <Link key={q.slug} href={`/wisdom/${q.slug}`} className="group">
              <blockquote className="font-display text-2xl italic text-cream group-hover:text-ember">“{q.text}”</blockquote>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-subtle">Fire school</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-2">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">The cook that sorts you out</p>
        <h2 className="mt-2 font-display text-4xl italic text-cream glow-ember">Featured pits</h2>
        <div className="mt-3 grid gap-0 md:grid-cols-2">{cards.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-2">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-subtle">Pitmaster sides</p><h2 className="mt-2 font-display text-4xl italic glow-ember">The plate around the meat</h2></div><Link href="/recipes?protein=sides" className="text-sm text-ember hover:text-ember-hot">All sides</Link></div>
        <div className="mt-3 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">{(extraSides.length ? extraSides : sides().slice(0,6)).map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-2">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-subtle">Southern desserts</p><h2 className="mt-2 font-display text-4xl italic glow-ember">Close the plate</h2></div><Link href="/desserts" className="text-sm text-ember hover:text-ember-hot">All desserts</Link></div>
        <div className="mt-3 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">{(extraSweet.length ? extraSweet : desserts().slice(0,6)).map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-2">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-subtle">House bottles</p><h2 className="mt-2 font-display text-4xl italic glow-ember">Rubs and sauces</h2></div><Link href="/recipes?protein=sauces" className="text-sm text-ember hover:text-ember-hot">All pantry</Link></div>
        <div className="mt-3 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">{(extraBottles.length ? extraBottles : pantry().slice(0,6)).map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-2">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">Fire school</p>
        <h2 className="mt-2 font-display text-4xl italic glow-ember">Notes from the pit</h2>
        <div className="mt-3 grid gap-0 md:grid-cols-2">{wisdom.slice(0, 6).map((w) => (
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

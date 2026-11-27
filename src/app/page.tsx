import Image from "next/image";
import Link from "next/link";
import TonightPicker from "@/components/TonightPicker";
import CookCalculator from "@/components/CookCalculator";
import InstallBanner from "@/components/InstallBanner";
import RecipeCard from "@/components/RecipeCard";
import { desserts, getRecipe, pantry, regionCopy, recipes, sides, wisdom } from "@/lib/data";

const featured = ["memphis-dry-ribs", "santa-maria-tri-tip", "alabama-white-chicken", "central-texas-brisket"];
const quotes = [
  { text: "Thin blue smoke or go home.", slug: "clean-fire" },
  { text: "The stall is not a problem.", slug: "the-stall" },
  { text: "Bark is a crust you earn.", slug: "building-bark" },
];
const house = ["ember-house-rub", "ember-molasses-sauce", "ember-finishing-glaze", "honey-mustard-onion-sauce", "memphis-wet-sauce", "raspberry-chipotle-sauce"];
const christmasSlugs = ["ember-prime-rib-roast", "ember-cherry-dr-pepper-double-smoked-ham", "cherry-dr-pepper-turkey", "lebkuchen", "eggnog-pie", "christmas-snack-mix", "ember-christmas-jelly-nougat", "bienenstich", "vanillekipferl", "black-forest-cheesecake", "ember-christmas-stollen", "ember-sugar-cookie-pull-apart-bread", "smoked-prime-rib", "ember-4-cheese-skillet-mac"];
const gameSlugs = ["smoked-venison-backstrap", "bacon-wrapped-venison-bites", "smoked-alligator-tail", "smoked-duck", "smoked-venison-jerky", "deer-camp-sweet-heat-chili"];
const breadSlugs = ["ember-parker-house-rolls", "ember-sweet-potato-rolls", "ember-classic-yeast-dinner-rolls", "ember-potato-rolls", "ember-honey-butter-rolls", "ember-buttermilk-biscuits", "ember-cathead-biscuits", "skillet-cornbread", "hush-puppies"];

export default function HomePage() {
  const cards = featured.map((s) => getRecipe(s)).filter(Boolean);
  const extraSides = ["cast-iron-green-beans", "mustard-potato-salad", "potlikker-collards", "memphis-bbq-spaghetti", "hush-puppies", "alabama-cheese-grits"].map((s) => getRecipe(s)).filter(Boolean);
  const extraSweet = ["banana-pudding", "texas-sheet-cake", "red-velvet-cake", "southern-pound-cake", "fried-peach-pies", "pecan-pralines"].map((s) => getRecipe(s)).filter(Boolean);
  const extraBottles = house.map((s) => getRecipe(s)).filter(Boolean);
  const christmas = christmasSlugs.map((s) => getRecipe(s)).filter(Boolean).slice(0, 6);
  const gameCards = gameSlugs.map((s) => getRecipe(s)).filter(Boolean);
  const breadCards = breadSlugs.map((s) => getRecipe(s)).filter(Boolean).slice(0, 6);
  return (
    <main id="top" className="relative">
      {/* Weathered store-wood backdrop, like the country store wall in the header picture */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <Image src="/images/homepage-wood-bg.jpg" alt="" fill sizes="100vw" className="object-cover contrast-[1.12]" />
        <div className="absolute inset-0 bg-ink/45" />
      </div>
      <section className="relative overflow-hidden sm:min-h-[88vh]">
        {/* Mobile: Halloween still at the top for October, picker card sits below it */}
        <div className="relative aspect-[4/3] w-full sm:hidden">
          <Image src="/images/christmas-hero.jpg" alt="Downtown street at Christmas, old cars, lights strung across the street, folks shopping in the snow" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-5 pb-5">
            <p className="text-[27px] font-extrabold leading-[1.1] text-cream">Pick how long you have.</p>
            <p className="mt-1 text-[16px] leading-6 text-parchment/90">Smoke and Ember hands you a cook that actually fits tonight.</p>
            <p className="mt-2 text-lg font-semibold leading-6 text-parchment">{recipes.length} free barbecue recipes — pick one and cook it.</p>
          </div>
        </div>
        {/* Desktop: full-bleed Halloween hero for October */}
        <Image src="/images/christmas-hero.jpg" alt="Downtown street at Christmas, old cars, lights strung across the street, folks shopping in the snow" fill priority sizes="100vw" className="hero-still hidden object-cover sm:block" />
        <div className="absolute inset-0 hidden bg-gradient-to-t from-ink via-ink/55 to-ink/20 sm:block" />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:grid sm:min-h-[88vh] sm:items-end sm:gap-10 sm:pb-28 sm:pt-24 md:grid-cols-2">
          <div className="hidden sm:block">
            <p className="text-xs uppercase tracking-[0.28em] text-ember">The pit is lit</p>
            <h1 className="mt-3 font-display text-5xl italic leading-[0.95] text-cream glow-ember sm:text-7xl">Pull up a chair.</h1>
            <p className="mt-5 max-w-md text-lg text-parchment">Pick how long you have. Smoke and Ember hands you a cook that actually fits tonight.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/recipes" className="inline-flex h-11 items-center rounded-full bg-ember px-5 text-sm text-cream hover:bg-ember-hot">See all recipes →</Link>
              <Link href="/wisdom" className="text-sm text-parchment hover:text-cream">Cooking tips</Link>
              <a href="#calculator" className="inline-flex h-11 items-center rounded-full border border-ember px-5 text-sm font-semibold text-cream hover:bg-ember/20">Cook calculator</a>
            </div>
          </div>
          <div className="mb-6 flex flex-wrap items-center gap-4 sm:hidden">
            <Link href="/recipes" className="inline-flex h-11 items-center rounded-full bg-ember px-5 text-sm text-cream hover:bg-ember-hot">See all recipes →</Link>
            <Link href="/wisdom" className="text-sm text-parchment hover:text-cream">Cooking tips</Link>
            <a href="#calculator" className="inline-flex h-11 items-center rounded-full border border-ember px-5 text-sm font-semibold text-cream hover:bg-ember/20">Cook calculator</a>
          </div>
          <TonightPicker />
        </div>
      </section>
      <section className="relative mx-auto max-w-6xl px-4 pt-6">
        <form action="/recipes" method="get" role="search" className="flex gap-2">
          <label htmlFor="home-search" className="sr-only">Search recipes</label>
          <input id="home-search" name="q" type="search" placeholder="Search recipes — try brisket, turkey, or cobbler" className="h-14 min-w-0 flex-1 rounded-full border-2 border-ember/50 bg-bark px-5 text-base text-cream outline-none placeholder:text-subtle focus:border-ember" />
          <button type="submit" className="inline-flex h-14 shrink-0 items-center rounded-full bg-ember px-6 text-base font-semibold text-cream hover:bg-ember-hot">Search</button>
        </form>
        <nav aria-label="Jump to a section" className="mt-3 flex flex-wrap items-center gap-2">
          <span className="py-2 text-base font-semibold text-subtle">Jump to:</span>
          <a href="#christmas" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Christmas</a>
          <a href="#wild-game" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Wild Game</a>
          <a href="#sides" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Sides</a>
          <a href="#breads" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Breads</a>
          <a href="#desserts" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Desserts</a>
          <a href="#rubs" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Rubs &amp; Sauces</a>
          <a href="#calculator" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Calculator</a>
        </nav>
      </section>
      <section className="relative mx-auto max-w-6xl px-4 pt-8">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">What this is</p>
        <h2 className="mt-2 font-display text-4xl italic text-cream glow-ember">Pull up a chair.</h2>
        <p className="mt-3 max-w-3xl text-lg leading-8 text-parchment">I&apos;ve been smoking meat for 20 years, and as I get older I can&apos;t remember things like I used to — times, and how to do certain things. Even I need a gentle reminder from time to time. That&apos;s what this app is for. It&apos;s my notes, written down so I don&apos;t have to hold it all in my head. 456 free barbecue recipes, a cook calculator, cooking tips, and a little bluegrass while you cook — all in one place, for anybody who needs a reminder like I do.</p>
      </section>
      <section className="relative mx-auto max-w-6xl px-4 pt-6" aria-label="What&apos;s in here">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">What&apos;s in here</p>
        <nav aria-label="Table of contents" className="mt-3 flex flex-wrap gap-2">
          <Link href="/recipes" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">All recipes</Link>
          <a href="#christmas" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Christmas</a>
          <a href="#wild-game" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Wild Game</a>
          <a href="#sides" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Sides</a>
          <a href="#breads" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Breads</a>
          <a href="#desserts" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Desserts</a>
          <a href="#rubs" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Rubs &amp; Sauces</a>
          <a href="#calculator" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Cook calculator</a>
          <a href="#top" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Tonight picker</a>
          <Link href="/wisdom" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Cooking tips</Link>
          <Link href="/cooks" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">My Cooks</Link>
          <Link href="/competitions" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Competitions</Link>
          <Link href="/temp-chart" className="rounded-full border border-ember/40 bg-ember/20 px-4 py-2 text-base font-semibold text-cream hover:bg-ember/30">Temperature chart</Link>
        </nav>
      </section>
      <CookCalculator />
      <InstallBanner />
      {christmas.length > 0 && (
        <section id="christmas" className="relative scroll-mt-40 overflow-hidden">
          <Image src="/images/christmas-banner.jpg" alt="Christmas table with golden ham, glowing tree, and snow outside the window" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent" />
          <div className="relative mx-auto max-w-6xl px-4 py-14">
            <p className="text-xs uppercase tracking-[0.22em] text-ember">December at the pit</p>
            <h2 className="mt-2 font-display text-4xl italic text-cream glow-ember">A Smoke-Ember Christmas</h2>
            <p className="mt-2 max-w-xl text-parchment/85">Holiday cooks for the table — prime rib, Christmas sweets, and everything in between, all with a little smoke on it.</p>
            <div className="mt-4 grid gap-0 md:grid-cols-2">{christmas.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
            <p className="mt-4"><Link href="/recipes" className="text-sm font-semibold text-ember hover:text-ember-hot">See all recipes →</Link></p>
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
      <section id="wild-game" className="mx-auto max-w-6xl scroll-mt-40 px-4 pb-2">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-subtle">Wild game</p><h2 className="mt-2 font-display text-4xl italic glow-ember">From the woods to the pit</h2></div><Link href="/wild-game" className="text-sm text-ember hover:text-ember-hot">All game</Link></div>
        <div className="mt-3 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">{gameCards.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
      <section id="sides" className="mx-auto max-w-6xl scroll-mt-40 px-4 pb-2">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-subtle">Pitmaster sides</p><h2 className="mt-2 font-display text-4xl italic glow-ember">The plate around the meat</h2></div><Link href="/recipes?protein=sides" className="text-sm text-ember hover:text-ember-hot">All sides</Link></div>
        <div className="mt-3 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">{(extraSides.length ? extraSides : sides().slice(0,6)).map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
      <section id="breads" className="mx-auto max-w-6xl scroll-mt-40 px-4 pb-2">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-subtle">Breads &amp; biscuits</p><h2 className="mt-2 font-display text-4xl italic glow-ember">Bread for the table</h2></div><Link href="/breads" className="text-sm text-ember hover:text-ember-hot">All breads</Link></div>
        <div className="mt-3 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">{breadCards.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
      <section id="desserts" className="mx-auto max-w-6xl scroll-mt-40 px-4 pb-2">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-subtle">Southern desserts</p><h2 className="mt-2 font-display text-4xl italic glow-ember">Close the plate</h2></div><Link href="/desserts" className="text-sm text-ember hover:text-ember-hot">All desserts</Link></div>
        <div className="mt-3 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">{(extraSweet.length ? extraSweet : desserts().slice(0,6)).map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
      <section id="rubs" className="mx-auto max-w-6xl scroll-mt-40 px-4 pb-2">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.22em] text-subtle">House bottles</p><h2 className="mt-2 font-display text-4xl italic glow-ember">Rubs and sauces</h2></div><Link href="/recipes?protein=sauces" className="text-sm text-ember hover:text-ember-hot">All pantry</Link></div>
        <div className="mt-3 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">{(extraBottles.length ? extraBottles : pantry().slice(0,6)).map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}</div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-2">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">Fire school</p>
        <h2 className="mt-2 font-display text-4xl italic glow-ember">Notes from the pit</h2>
        <div className="mt-3 grid gap-0 md:grid-cols-2">{wisdom.slice(0, 6).map((w) => (
          <Link key={w.slug} href={`/wisdom/${w.slug}`} className="group overflow-hidden rounded-2xl border border-white/5 bg-bark hover:border-ember/40">
            <div className="relative h-36">
              <Image src={w.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            </div>
            <div className="p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-ember">{w.kicker}</p>
              <h3 className="mt-1 font-display text-2xl group-hover:text-ember-hot">{w.title}</h3>
              <p className="mt-2 text-sm text-parchment/80">{w.summary}</p>
            </div>
          </Link>
        ))}</div>
        <p className="mt-6 text-sm text-subtle">{recipes.length} original cooks. No invented plates.</p>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-2">
        <Link href="/competitions" className="group relative block overflow-hidden rounded-2xl border border-white/5 hover:border-ember/40">
          <div className="relative h-44 sm:h-56">
            <Image src="/images/competitions-header.jpg" alt="BBQ competition with smokers and trophies" fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ember">Hit the road</p>
            <h2 className="mt-1 font-display text-3xl italic text-cream group-hover:text-ember-hot">Competition Calendar</h2>
            <p className="mt-1 text-sm text-parchment/80">KCBS and MBN cook-offs across the South, Texas to Virginia — updated monthly.</p>
          </div>
        </Link>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-2">
        <Link href="/cooks" className="group block overflow-hidden rounded-2xl border border-ember/30 bg-bark hover:border-ember/60">
          <div className="p-5 sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ember">New</p>
            <h2 className="mt-1 font-display text-3xl italic text-cream group-hover:text-ember-hot">My Cooks Notebook</h2>
            <p className="mt-1 text-sm text-parchment/80">Track your cooks — running timer, timestamped notes, temps, wraps — and keep profiles of your cookers with their hot zones and quirks. Lives on your device.</p>
          </div>
        </Link>
      </section>
    </main>
  );
}

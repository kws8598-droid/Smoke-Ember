"use client";

import RecipeCard from "@/components/RecipeCard";
import { useLiveCatalog } from "@/components/LiveCatalog";

const venisonSlugs = [
  "smoked-venison-backstrap",
  "amish-pulled-venison",
  "kentucky-burgoo",
  "bacon-wrapped-venison-bites",
  "smoked-venison-jerky",
  "deer-camp-smoked-venison-stew",
  "smoked-venison-shepherds-pie",
  "smoke-and-ember-venison-pot-roast",
  "smoked-venison-summer-sausage",
  "deer-camp-sweet-heat-chili",
  "venison-pineapple-bratwurst",
  "jalapeno-cheddar-venison-sausage",
  "venison-snack-sticks",
  "venison-pork-onion-bombs",
];
const smallGameSlugs = [
  "smoked-rabbit",
];
const waterSlugs = [
  "smoked-duck",
  "smoked-alligator-tail",
  "blackened-gator-bites",
  "gator-sauce-piquante",
  "smoked-frog-legs",
];

export default function GamePage() {
  const { recipes } = useLiveCatalog();
  const bySlug = (s: string) => recipes.find((r) => r.slug === s);
  const venison = venisonSlugs.map(bySlug).filter(Boolean);
  const water = waterSlugs.map(bySlug).filter(Boolean);
  const small = smallGameSlugs.map(bySlug).filter(Boolean);
  const total = venison.length + water.length + small.length;
  return (
    <main className="relative">
      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">Wild game</p>
        <h1 className="mt-2 font-display text-5xl italic">From the Woods to the Pit</h1>
        <p className="mt-3 max-w-xl text-parchment/80">
          The cooks that start with a hunt — deer, duck, gator, and frog legs, smoked the
          Smoke &amp; Ember way. Kelly has eaten buffalo, elk, rabbit, deer, and squirrel.
          Folks call him redneck for it. He does not care.
        </p>
        <div className="mt-6 rounded-2xl border border-ember/30 bg-bark p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ember">The lean rule</p>
          <p className="mt-2 font-display text-xl italic text-cream">
            &ldquo;Most game is so lean, you are going to have to inject it — that is just
            how it is.&rdquo;
          </p>
          <p className="mt-2 text-sm text-parchment/80">
            Wild meat has near no fat to protect it on a long cook. An injection keeps it
            juicy without covering up the wild flavor. That is not cheating — that is how
            you keep wild meat wild <em>and</em> worth eating. Kelly&apos;s way: beef
            broth with melted butter whisked in, injected warm — the broth carries the
            butterfat straight into the leanest cuts.
          </p>
        </div>
        <p className="mt-6 text-sm text-subtle">{total} game cooks</p>
        <h2 className="mt-8 font-display text-3xl italic">Venison</h2>
        <p className="mt-2 max-w-xl text-parchment/80">
          The backbone of this page — backstrap to snack sticks, and every deer-camp pot
          in between.
        </p>
        <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
          {venison.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}
        </div>
        <h2 className="mt-12 font-display text-3xl italic">Water &amp; Swamp</h2>
        <p className="mt-2 max-w-xl text-parchment/80">
          Duck off the water, gator out of the swamp, and frog legs for whoever gigs them.
        </p>
        <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
          {water.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}
        </div>
        <h2 className="mt-12 font-display text-3xl italic">Small Game</h2>
        <p className="mt-2 max-w-xl text-parchment/80">
          Rabbit now, squirrel when its turn comes — brined, smoked, and braised
          tender, the country way.
        </p>
        <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
          {small.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}
        </div>
        <div className="mt-12 rounded-2xl border border-white/5 bg-bark p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ember">Still to come</p>
          <p className="mt-2 text-sm text-parchment/80">
            Squirrel, elk, buffalo, grouse, ring-neck pheasant, and prairie
            chicken — added one at a time as Kelly cooks them and gives the verdict.
            Nothing goes on this page he has not put over his own fire.
          </p>
        </div>
      </div>
    </main>
  );
}

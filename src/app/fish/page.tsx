"use client";

import Image from "next/image";
import RecipeCard from "@/components/RecipeCard";
import BackButton from "@/components/BackButton";
import { useLiveCatalog } from "@/components/LiveCatalog";
import FishingForecast from "@/components/FishingForecast";
import TrophyCatch from "@/components/TrophyCatch";

const smokedFishSlugs = [
  "cedar-plank-salmon",
  "smoked-trout",
  "abbys-lemon-pepper-trout",
  "megan-and-davids-smoked-catfish",
  "smoked-baja-fish-tacos",
  "parrotfish-coconut",
];

const shellfishSlugs = [
  "smoked-shrimp-poboy",
  "key-west-shrimp",
  "ember-smoked-stone-crab",
  "smoked-crawfish-bowl",
  "smoked-crawfish-hand-pies",
];

const dipsSlugs = [
  "fish-dip",
  "ember-smoked-mullet-dip",
  "smoked-oyster-casserole",
];

export default function FishPage() {
  const { recipes } = useLiveCatalog();
  const bySlug = (s: string) => recipes.find((r) => r.slug === s);
  const smokedFish = smokedFishSlugs.map(bySlug).filter(Boolean);
  const shellfish = shellfishSlugs.map(bySlug).filter(Boolean);
  const dips = dipsSlugs.map(bySlug).filter(Boolean);
  const total = smokedFish.length + shellfish.length + dips.length;
  return (
    <main className="relative">
      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <BackButton fallback="/" />
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">Fish &amp; seafood</p>
        <h1 className="mt-2 font-display text-5xl italic">From the Water to the Smoker</h1>
        <p className="mt-3 max-w-xl text-parchment/80">
          Salmon and trout, catfish and crawfish, and the dips that go with them —
          smoked the Smoke &amp; Ember way. Check the forecast before you head out,
          and send Kelly your best catch for the gallery.
        </p>
        <div className="relative mt-8 h-48 overflow-hidden rounded-2xl border border-white/10 sm:h-64">
          <Image src="/images/fish-banner.jpg" alt="Fisherman holding up a stringer of catfish by a creek at sunrise" fill sizes="100vw" className="object-cover" loading="lazy" />
        </div>
        <div className="mt-8">
          <FishingForecast />
        </div>
        <div className="mt-6 rounded-2xl border border-ember/30 bg-bark p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ember">The fish rule</p>
          <p className="mt-2 font-display text-xl italic text-cream">
            Fish takes smoke fast — light wood, gentle heat, and pull it when it
            flakes apart easy.
          </p>
          <p className="mt-2 text-sm text-parchment/80">
            There is not much fat to protect a fillet on a long cook, and overcooked
            fish is dry fish. A light hand with the wood and a watchful eye beats
            heavy smoke every time.
          </p>
        </div>
        <p className="mt-6 text-sm text-subtle">{total} fish cooks</p>
        <h2 className="mt-8 font-display text-3xl italic">Smoked Fish</h2>
        <p className="mt-2 max-w-xl text-parchment/80">
          Salmon, trout, and catfish — light wood, gentle heat, and off the pit
          while it is still juicy.
        </p>
        <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
          {smokedFish.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}
        </div>
        <h2 className="mt-12 font-display text-3xl italic">Shrimp, Crab &amp; Crawfish</h2>
        <p className="mt-2 max-w-xl text-parchment/80">
          The shellfish end of the pit — quick cooks, big flavor, and plenty of
          butter.
        </p>
        <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
          {shellfish.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}
        </div>
        <h2 className="mt-12 font-display text-3xl italic">Dips &amp; Casserole</h2>
        <p className="mt-2 max-w-xl text-parchment/80">
          What to do with the catch once it is smoked — dips for the table and a
          casserole for the crowd.
        </p>
        <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
          {dips.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}
        </div>
        <TrophyCatch />
        <div className="mt-10">
          <BackButton fallback="/" />
        </div>
      </div>
    </main>
  );
}

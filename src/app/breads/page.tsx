"use client";

import Image from "next/image";
import RecipeCard from "@/components/RecipeCard";
import BackButton from "@/components/BackButton";
import { useLiveCatalog } from "@/components/LiveCatalog";

const yeastRollsSlugs = [
  "ember-parker-house-rolls",
  "ember-sweet-potato-rolls",
];

const cornbreadSlugs = [
  "skillet-cornbread",
  "hush-puppies",
];

export default function BreadsPage() {
  const { recipes } = useLiveCatalog();
  const bySlug = (s: string) => recipes.find((r) => r.slug === s);
  const yeastRolls = yeastRollsSlugs.map(bySlug).filter(Boolean);
  const cornbread = cornbreadSlugs.map(bySlug).filter(Boolean);
  const total = yeastRolls.length + cornbread.length;
  return (
    <main className="relative">
      <div className="relative mx-auto max-w-6xl px-4 py-12">
        <BackButton fallback="/" />
        <p className="text-xs uppercase tracking-[0.22em] text-subtle">Breads &amp; biscuits</p>
        <h1 className="mt-2 font-display text-5xl italic">Bread for the Table</h1>
        <p className="mt-3 max-w-xl text-parchment/80">
          Yeast rolls, biscuits, and cornbread for the barbecue table — the bread
          that belongs next to the meat, made the Smoke &amp; Ember way.
        </p>
        <div className="relative mt-8 h-48 overflow-hidden rounded-2xl border border-white/10 sm:h-64">
          <Image src="/images/breads-banner.jpg" alt="Basket of golden dinner rolls, cast-iron cornbread, and biscuits on a wooden table" fill sizes="100vw" className="object-cover" loading="lazy" />
        </div>
        <p className="mt-6 text-sm text-subtle">{total} breads</p>
        <h2 className="mt-8 font-display text-3xl italic">Yeast Rolls</h2>
        <p className="mt-2 max-w-xl text-parchment/80">
          Soft rolls for the table — folded Parker House and deep-gold sweet potato.
        </p>
        <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
          {yeastRolls.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}
        </div>
        <h2 className="mt-12 font-display text-3xl italic">Cornbread &amp; Quick Breads</h2>
        <p className="mt-2 max-w-xl text-parchment/80">
          Cast-iron cornbread and hush puppies — the wedges and bites that chase
          beans and greens.
        </p>
        <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
          {cornbread.map((r) => r && <RecipeCard key={r.slug} recipe={r} />)}
        </div>
        <div className="mt-12 rounded-2xl border border-white/5 bg-bark p-5">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ember">Still to come</p>
          <p className="mt-2 text-sm text-parchment/80">
            Classic dinner rolls, potato rolls, honey butter rolls, and buttermilk
            biscuits — added as Kelly posts them.
          </p>
        </div>
        <div className="mt-10">
          <BackButton fallback="/" />
        </div>
      </div>
    </main>
  );
}

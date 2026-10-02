"use client";

import RecipeCard from "@/components/RecipeCard";
import { useLiveCatalog } from "@/components/LiveCatalog";

export default function DessertsPage() {
  const { recipes } = useLiveCatalog();
  const list = recipes.filter((r) => r.protein === "desserts");
  const appalachian = list.filter((r) => r.region === "appalachia");
  const rest = list.filter((r) => r.region !== "appalachia");
  return (
    <main className="relative">
      {/* Candy-stripe awning backdrop for Bub & Sissy's Sweet Shop */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <img src="/images/sweet-shop-awning-bg.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/50" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">Close the plate</p>
      <h1 className="mt-2 font-display text-5xl italic">Desserts</h1>
      <p className="mt-3 max-w-xl text-parchment/80">The Southern closers that belong after a pit plate.</p>
      <p className="mt-6 text-sm text-subtle">{list.length} sweets</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <img src="/images/desserts-banner.jpg" alt="Bub and Sissy's Sweet Shop — vintage counter with pies, cakes and candy jars" className="h-48 w-full object-cover sm:h-64" loading="lazy" />
      </div>
      <p className="mt-4 text-center font-display text-lg italic text-[#ff8a3d]">
        Bub &amp; Sissy&apos;s Sweet Shop &mdash; featuring Oliver&apos;s Oreos
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
      </div>
      {appalachian.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-3xl italic">Appalachian Candies</h2>
          <p className="mt-2 max-w-xl text-parchment/80">Mountain candy — molasses, black walnuts, and sorghum. Not necessarily barbecue.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {appalachian.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </>
      )}
      </div>
    </main>
  );
}

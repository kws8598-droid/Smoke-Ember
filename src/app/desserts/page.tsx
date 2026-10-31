"use client";

import Image from "next/image";
import BackButton from "@/components/BackButton";
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
        <Image src="/images/sweet-shop-awning-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink/50" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-12">
      <BackButton fallback="/" />
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">Close the plate</p>
      <h1 className="mt-2 font-display text-5xl italic">Desserts</h1>
      <p className="mt-3 max-w-xl text-parchment/80">The Southern closers that belong after a pit plate.</p>
      <p className="mt-6 text-sm text-subtle">{list.length} sweets</p>
      <div className="relative mt-6 h-48 overflow-hidden rounded-2xl border border-white/10 sm:h-64">
        <Image src="/images/desserts-banner.jpg" alt="Bub and Sissy's Sweet Shop — vintage counter with pies, cakes and candy jars" fill sizes="100vw" className="object-cover" loading="lazy" />
      </div>
      <p className="mt-4 text-center font-display text-lg italic text-[#ff8a3d]">
        Bub &amp; Sissy&apos;s Sweet Shop &mdash; featuring Oliver&apos;s Oreos
      </p>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="text-center">
          <Image src="/images/oliver-portrait.jpg" alt="Oliver" width={800} height={1067} className="aspect-[3/4] w-full rounded-2xl border border-white/10 object-cover" />
          <p className="mt-2 font-display text-lg italic text-cream">Oliver</p>
        </div>
        <div className="text-center">
          <Image src="/images/brooklyn-portrait.jpg" alt="Brooklyn" width={800} height={1067} className="aspect-[3/4] w-full rounded-2xl border border-white/10 object-cover" />
          <p className="mt-2 font-display text-lg italic text-cream">Brooklyn</p>
        </div>
        <div className="text-center">
          <Image src="/images/preston-portrait.jpg" alt="Preston" width={800} height={1067} className="aspect-[3/4] w-full rounded-2xl border border-white/10 object-cover" />
          <p className="mt-2 font-display text-lg italic text-cream">Preston</p>
        </div>
        <div className="text-center">
          <Image src="/images/finn-portrait.jpg" alt="Finn" width={800} height={1067} className="aspect-[3/4] w-full rounded-2xl border border-white/10 object-cover" />
          <p className="mt-2 font-display text-lg italic text-cream">Finn</p>
        </div>
      </div>
      <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((r) => (
          <RecipeCard key={r.slug} recipe={r} />
        ))}
      </div>
      {appalachian.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-3xl italic">Appalachian Candies</h2>
          <p className="mt-2 max-w-xl text-parchment/80">Mountain candy — molasses, black walnuts, and sorghum. Not necessarily barbecue.</p>
          <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">
            {appalachian.map((r) => (
              <RecipeCard key={r.slug} recipe={r} />
            ))}
          </div>
        </>
      )}
      <div className="mt-10">
        <BackButton fallback="/" />
      </div>
      </div>
    </main>
  );
}

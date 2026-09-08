"use client";
import { useEffect, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import { getSaved } from "@/components/SaveButton";
import { recipes } from "@/lib/data";
export default function SavedPage() {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => setSlugs(getSaved()), []);
  const list = recipes.filter((r) => slugs.includes(r.slug));
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">This device</p>
      <h1 className="mt-2 font-display text-5xl italic">Saved</h1>
      <p className="mt-3 text-parchment/80">Cooks you marked. Lives in the browser, not the cloud.</p>
      {list.length === 0 ? <p className="mt-10 text-subtle">Nothing saved yet. Open a cook and hit Save.</p> : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((r) => <RecipeCard key={r.slug} recipe={r} />)}</div>
      )}
    </main>
  );
}

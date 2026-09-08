"use client";
import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import { filterRecipes, proteins } from "@/lib/data";
function RecipesInner() {
  const params = useSearchParams();
  const [protein, setProtein] = useState(params.get("protein") || "all");
  const [q, setQ] = useState("");
  const [time, setTime] = useState("all");
  const list = useMemo(() => filterRecipes({ protein, q, time: time === "all" ? undefined : time }), [protein, q, time]);
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">The book</p>
      <h1 className="mt-2 font-display text-5xl italic">Recipes</h1>
      <p className="mt-3 max-w-xl text-parchment/80">Regional cooks, pantry bottles, and the sides that make a plate.</p>
      <div className="mt-8 flex flex-wrap gap-2">{proteins.map((p) => (
        <button key={p} onClick={() => setProtein(p)} className={`rounded-full px-3 py-1.5 text-sm capitalize ${protein === p ? "bg-ember text-cream" : "bg-ash text-parchment"}`}>{p}</button>
      ))}</div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {["all", "2h", "afternoon", "all-day"].map((t) => (
          <button key={t} onClick={() => setTime(t)} className={`rounded-full px-3 py-1 text-xs ${time === t ? "bg-cream text-ink" : "text-subtle"}`}>{t === "all" ? "Any time" : t === "2h" ? "2 hours" : t === "afternoon" ? "Afternoon" : "All day"}</button>
        ))}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the book…" className="ml-auto rounded-full border border-white/10 bg-bark px-4 py-1.5 text-sm outline-none focus:border-ember" />
      </div>
      <p className="mt-6 text-sm text-subtle">{list.length} cooks</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((r) => <RecipeCard key={r.slug} recipe={r} />)}</div>
    </main>
  );
}
export default function RecipesPage() { return <Suspense><RecipesInner /></Suspense>; }

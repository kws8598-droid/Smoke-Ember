"use client";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import RecipeCard from "@/components/RecipeCard";
import { filterRecipes, proteins, regionCopy } from "@/lib/data";
import { useLiveCatalog } from "@/components/LiveCatalog";
function RecipesInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [protein, setProtein] = useState(params.get("protein") || "all");
  const [region, setRegion] = useState(params.get("region") || "all");
  const [q, setQ] = useState("");
  const [time, setTime] = useState("all");
  useEffect(() => {
    setProtein(params.get("protein") || "all");
    setRegion(params.get("region") || "all");
  }, [params]);
  useEffect(() => {
    document.body.classList.toggle("theme-venison", protein === "venison");
    document.body.classList.toggle("theme-fish", protein === "fish");
    document.body.classList.toggle("theme-pork", protein === "pork");
    document.body.classList.toggle("theme-beef", protein === "beef");
    // poultry camp
    document.body.classList.toggle("theme-poultry", protein === "poultry");
    document.body.classList.toggle("theme-mutton", protein === "mutton");
    document.body.classList.toggle("theme-sauces", protein === "sauces");
    return () => {
      document.body.classList.remove("theme-venison");
      document.body.classList.remove("theme-fish");
      document.body.classList.remove("theme-pork");
      document.body.classList.remove("theme-beef");
      document.body.classList.remove("theme-poultry");
      document.body.classList.remove("theme-mutton");
      document.body.classList.remove("theme-sauces");
    };
  }, [protein]);
  function replaceFilters(nextProtein: string, nextRegion: string) {
    const next = new URLSearchParams(params.toString());
    if (!nextProtein || nextProtein === "all") next.delete("protein");
    else next.set("protein", nextProtein);
    if (!nextRegion || nextRegion === "all") next.delete("region");
    else next.set("region", nextRegion);
    const qs = next.toString();
    router.replace(qs ? `/recipes?${qs}` : "/recipes", { scroll: false });
  }
  function selectProtein(nextProtein: string) {
    setProtein(nextProtein);
    replaceFilters(nextProtein, region);
  }
  function selectRegion(nextRegion: string) {
    setRegion(nextRegion);
    replaceFilters(protein, nextRegion);
  }
  const { recipes: liveRecipes } = useLiveCatalog();
  const list = useMemo(() => {
    let rows = filterRecipes({ protein, q, time: time === "all" ? undefined : time, includeDesserts: protein === "all" ? false : protein === "desserts" }, liveRecipes);
    if (region !== "all") rows = rows.filter((r) => r.region === region);
    rows.sort((a, b) => a.title.localeCompare(b.title));
    return rows;
  }, [protein, q, time, region, liveRecipes]);
  return (
    <main className="relative">
      {/* BBQ joint wall backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <Image src="/images/recipes-page-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink/60" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">The book</p>
      <h1 className="mt-2 font-display text-5xl italic">Recipes</h1>
      <p className="mt-3 max-w-xl text-parchment/80">Regional cooks, pantry bottles, and the sides that make a plate.</p>
      {protein === "venison" && (
        <>
          <div className="relative mt-8 h-48 overflow-hidden rounded-2xl border border-white/10 sm:h-64">
            <Image src="/images/venison-banner.jpg" alt="Whitetail buck in a smoky forest at dawn" fill sizes="100vw" className="object-cover" loading="lazy" />
          </div>
          <p className="mt-4 text-center font-display text-lg italic text-[#ff8a3d]">
            This page is dedicated to Harold Caldwell, Steve Holt, and Freddie Wash.
          </p>
        </>
      )}
      {protein === "poultry" && (
        <div className="relative mt-8 h-48 overflow-hidden rounded-2xl border border-white/10 sm:h-64">
            <Image src="/images/poultry-banner.jpg" alt="Smoked turkey on a rustic harvest table" fill sizes="100vw" className="object-cover" loading="lazy" />
          </div>
      )}
      {protein === "mutton" && (
        <div className="relative mt-8 h-48 overflow-hidden rounded-2xl border border-white/10 sm:h-64">
            <Image src="/images/mutton-banner.jpg" alt="Mutton shoulders on a vintage Kentucky barbecue joint brick pit" fill sizes="100vw" className="object-cover" loading="lazy" />
          </div>
      )}
      {protein === "sauces" && (
        <div className="relative mt-8 h-48 overflow-hidden rounded-2xl border border-white/10 sm:h-64">
            <Image src="/images/sauces-banner.jpg" alt="Wooden shelves lined with vintage barbecue sauce bottles and jars" fill sizes="100vw" className="object-cover" loading="lazy" />
          </div>
      )}
      {protein === "beef" && (
        <div className="relative mt-8 h-48 overflow-hidden rounded-2xl border border-white/10 sm:h-64">
            <Image src="/images/beef-banner.jpg" alt="Juicy brisket on an offset smoker with smoke rolling" fill sizes="100vw" className="object-cover" loading="lazy" />
          </div>
      )}
      {protein === "pork" && (
        <div className="relative mt-8 h-48 overflow-hidden rounded-2xl border border-white/10 sm:h-64">
            <Image src="/images/pork-banner-table.jpg" alt="Farmhouse table spread with pulled pork, glazed ribs, bacon, ham, and pork chops" fill sizes="100vw" className="object-cover" loading="lazy" />
          </div>
      )}
      {protein === "fish" && (
        <div className="relative mt-8 h-48 overflow-hidden rounded-2xl border border-white/10 sm:h-64">
            <Image src="/images/fish-banner.jpg" alt="Old fisherman holding a stringer of catfish by the creek" fill sizes="100vw" className="object-cover" loading="lazy" />
          </div>
      )}
      <div className="mt-8 flex flex-wrap gap-2">{proteins.map((p) => (
        <button key={p} onClick={() => selectProtein(p)} className={`h-11 rounded-full px-3 text-sm capitalize ${protein === p ? "bg-ember text-cream" : "bg-ash text-parchment"}`}>{p === "all" ? "All" : p}</button>
      ))}</div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => selectRegion("all")} className={`h-11 rounded-full px-3 text-xs ${region === "all" ? "bg-cream text-ink" : "text-subtle"}`}>Any region</button>
        {Object.entries(regionCopy).map(([id, meta]) => (
          <button key={id} onClick={() => selectRegion(id)} className={`h-11 rounded-full px-3 text-xs ${region === id ? "bg-cream text-ink" : "text-subtle"}`}>{meta.label}</button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {["all", "2h", "afternoon", "all-day"].map((t) => (
          <button key={t} onClick={() => setTime(t)} className={`h-11 rounded-full px-3 text-xs ${time === t ? "bg-cream text-ink" : "text-subtle"}`}>{t === "all" ? "Any time" : t === "2h" ? "2 hours" : t === "afternoon" ? "Afternoon" : "All day"}</button>
        ))}
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the book…" className="h-11 min-w-[12rem] flex-1 rounded-full border border-white/10 bg-bark px-4 text-sm outline-none focus:border-ember" />
      </div>
      <p className="mt-6 text-sm text-subtle">{list.length} cooks</p>
      <div className="mt-6 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">{list.map((r) => <RecipeCard key={r.slug} recipe={r} />)}</div>
      </div>
    </main>
  );
}
export default function RecipesPage() { return <Suspense><RecipesInner /></Suspense>; }

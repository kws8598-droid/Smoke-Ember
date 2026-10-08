"use client";
import { useMemo, useState } from "react";
import profiles from "@/data/flavor-profiles.json";

interface Profile { name: string; category: string; flavor: string; heat: number; bbq: string; pairs: string; }

const CATS = [
  { id: "all", label: "All" },
  { id: "herb", label: "Herbs" },
  { id: "spice", label: "Spices" },
  { id: "pepper", label: "Peppers" },
  { id: "seasoning", label: "Salt & umami" },
];

function HeatDots({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-1" title={`Heat ${n}/5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-2 w-2 rounded-full ${i <= n ? "bg-ember" : "bg-white/15"}`} />
      ))}
    </span>
  );
}

export default function FlavorProfilesPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return (profiles as Profile[]).filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (!query) return true;
      return (p.name + " " + p.flavor + " " + p.bbq).toLowerCase().includes(query);
    });
  }, [q, cat]);
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">Fire school</p>
      <h1 className="mt-2 font-display text-5xl italic">Flavor profiles</h1>
      <p className="mt-3 max-w-xl text-parchment/80">
        What herbs, spices, and peppers actually taste like — and where they earn their keep on the pit.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search… (try “smoky” or “beef”)"
          className="min-w-0 flex-1 rounded-xl border border-white/15 bg-bark px-4 py-2.5 text-cream placeholder:text-subtle"
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {CATS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`rounded-full px-4 py-2 text-sm ${cat === c.id ? "bg-ember font-semibold text-ink" : "border border-white/15 text-parchment hover:border-ember"}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {list.map((p) => (
          <div key={p.name} className="rounded-2xl border border-white/10 bg-bark p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-2xl text-cream">{p.name}</h2>
              <HeatDots n={p.heat} />
            </div>
            <p className="mt-2 text-parchment/90">{p.flavor}</p>
            <p className="mt-3 text-sm text-parchment/80"><span className="uppercase tracking-[0.14em] text-ember text-[11px]">On the pit — </span>{p.bbq}</p>
            <p className="mt-2 text-sm text-subtle"><span className="uppercase tracking-[0.14em] text-[11px]">Pairs with — </span>{p.pairs}</p>
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="mt-10 text-subtle">Nothing matches. Try a shorter search.</p>}
    </main>
  );
}

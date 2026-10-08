"use client";
import { useMemo, useState } from "react";
import chart from "@/data/temp-chart.json";

interface Item { cut: string; pull: string; rest: string; }
interface Group { group: string; items: Item[]; }

export default function TempChartPage() {
  const [q, setQ] = useState("");
  const groups = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return chart as Group[];
    return (chart as Group[])
      .map((g) => ({ ...g, items: g.items.filter((i) => (i.cut + " " + i.pull).toLowerCase().includes(query)) }))
      .filter((g) => g.items.length > 0);
  }, [q]);
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">Fire school</p>
      <h1 className="mt-2 font-display text-5xl italic">Temp cheat sheet</h1>
      <p className="mt-3 max-w-xl text-parchment/80">
        Pull temps and rest times for everything on the pit. When in doubt, trust the probe — not the clock.
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search… (try “brisket” or “145”)"
        className="mt-6 w-full rounded-xl border border-white/15 bg-bark px-4 py-2.5 text-cream placeholder:text-subtle"
      />
      {groups.map((g) => (
        <section key={g.group} className="mt-10">
          <h2 className="text-xs uppercase tracking-[0.22em] text-ember">{g.group}</h2>
          <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
            {g.items.map((i, idx) => (
              <div key={i.cut} className={`grid grid-cols-[1fr_auto] gap-3 px-4 py-3 sm:grid-cols-[1.2fr_1fr_1fr] ${idx % 2 ? "bg-bark/60" : "bg-bark"}`}>
                <p className="font-semibold text-cream">{i.cut}</p>
                <p className="text-right text-parchment/90 sm:text-left"><span className="sm:hidden text-subtle text-xs uppercase">Pull </span>{i.pull}</p>
                <p className="col-span-2 text-sm text-subtle sm:col-span-1 sm:text-right"><span className="sm:hidden uppercase text-xs">Rest </span>{i.rest}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
      {groups.length === 0 && <p className="mt-10 text-subtle">Nothing matches. Try a shorter search.</p>}
      <p className="mt-10 text-sm text-subtle italic">Temps are pull temps — carryover finishes the job during the rest. Probe-tender beats a number every time on brisket, butts, and ribs.</p>
    </main>
  );
}

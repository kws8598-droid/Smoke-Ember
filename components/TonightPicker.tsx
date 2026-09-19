"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { filterRecipes, formatHours } from "@/lib/data";
import { useLiveCatalog } from "@/components/LiveCatalog";

const times = [
  { id: "2h", label: "2 hours" },
  { id: "afternoon", label: "An afternoon" },
  { id: "all-day", label: "All day" },
];

const chips = [
  { id: "beef", label: "Beef" },
  { id: "pork", label: "Pork" },
  { id: "poultry", label: "Poultry" },
  { id: "fish", label: "Fish" },
  { id: "venison", label: "Venison" },
  { id: "mutton", label: "Mutton" },
  { id: "gator", label: "Gator" },
  { id: "sides", label: "Sides" },
];

export default function TonightPicker() {
  const [time, setTime] = useState("afternoon");
  const [protein, setProtein] = useState("beef");
  const { recipes: liveRecipes } = useLiveCatalog();
  const picks = useMemo(() => filterRecipes({ protein, time }, liveRecipes).slice(0, 3), [protein, time, liveRecipes]);

  return (
    <div className="order-2 rounded-[30px] border border-white/10 bg-ink/80 p-5 backdrop-blur-md shadow-2xl sm:p-6 md:order-none">
      <p className="text-sm uppercase tracking-[0.22em] text-subtle">What’s for tonight</p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {times.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTime(t.id)}
            className={`min-h-12 rounded-full px-2 text-sm sm:px-4 ${time === t.id ? "bg-cream text-ink" : "bg-ash text-parchment"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-x-1 gap-y-2">
        {chips.map((p) => (
          <Link
            key={p.id}
            href={`/recipes?protein=${p.id}`}
            onClick={() => setProtein(p.id)}
            className={`flex min-h-12 items-center justify-center rounded-full px-1 text-sm ${protein === p.id ? "bg-ember/20 text-ember" : "text-parchment/80 hover:text-cream"}`}
          >
            {p.label}
          </Link>
        ))}
      </div>
      <div className="mt-5 divide-y divide-white/10">
        {picks.length === 0 && <p className="py-4 text-sm text-subtle">Nothing in that window. Loosen the clock.</p>}
        {picks.map((r) => (
          <Link key={r.slug} href={`/recipes/${r.slug}`} className="flex min-h-11 items-baseline justify-between gap-4 py-3 hover:text-ember-hot">
            <span className="text-cream">{r.title}</span>
            <span className="shrink-0 text-sm text-subtle">{formatHours(r.hours)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

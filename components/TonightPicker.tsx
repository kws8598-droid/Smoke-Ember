"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { filterRecipes, formatHours, proteins } from "@/lib/data";
const times = [{ id: "2h", label: "2 hours" }, { id: "afternoon", label: "An afternoon" }, { id: "all-day", label: "All day" }];
export default function TonightPicker() {
  const [time, setTime] = useState("afternoon");
  const [protein, setProtein] = useState("all");
  const picks = useMemo(() => filterRecipes({ protein, time }).slice(0, 3), [protein, time]);
  return (
    <div className="rounded-3xl border border-white/10 bg-ink/70 p-5 backdrop-blur-md shadow-2xl">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">What's for tonight</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {times.map((t) => (
          <button key={t.id} onClick={() => setTime(t.id)} className={`rounded-full px-3 py-1.5 text-sm ${time === t.id ? "bg-cream text-ink" : "bg-ash text-parchment"}`}>{t.label}</button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {proteins.filter((p) => !["rubs", "sauces"].includes(p)).map((p) => (
          <button key={p} onClick={() => setProtein(p)} className={`rounded-full px-3 py-1 text-xs capitalize ${protein === p ? "bg-ember text-cream" : "text-parchment/80 hover:text-cream"}`}>{p === "all" ? "Anything" : p}</button>
        ))}
      </div>
      <div className="mt-5 divide-y divide-white/10">
        {picks.length === 0 && <p className="py-4 text-sm text-subtle">Nothing in that window. Loosen the clock.</p>}
        {picks.map((r) => (
          <Link key={r.slug} href={`/recipes/${r.slug}`} className="flex items-baseline justify-between gap-4 py-3 hover:text-ember-hot">
            <span className="text-cream">{r.title}</span>
            <span className="shrink-0 text-sm text-subtle">{formatHours(r.hours)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

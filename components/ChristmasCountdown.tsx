"use client";
import { useEffect, useState } from "react";

const TARGET = new Date("2026-12-25T00:00:00-05:00").getTime();

type Parts = { d: number; h: number; m: number; s: number };

function parts(): Parts {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor(diff / 3600000) % 24,
    m: Math.floor(diff / 60000) % 60,
    s: Math.floor(diff / 1000) % 60,
  };
}

export default function ChristmasCountdown() {
  const [t, setT] = useState<Parts | null>(null);
  useEffect(() => {
    setT(parts());
    const id = setInterval(() => setT(parts()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!t) return null;
  const cells: [number, string][] = [
    [t.d, "days"],
    [t.h, "hours"],
    [t.m, "mins"],
    [t.s, "secs"],
  ];
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-cream/80">Christmas in</span>
      {cells.map(([v, label]) => (
        <span key={label} className="rounded-lg border border-ember/40 bg-black/30 px-3 py-1 text-center">
          <span className="block font-display text-2xl leading-none text-cream">{v}</span>
          <span className="block text-[10px] uppercase tracking-widest text-parchment/70">{label}</span>
        </span>
      ))}
    </div>
  );
}

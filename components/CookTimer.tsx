"use client";
import { useEffect, useMemo, useState } from "react";
import type { Milestone } from "@/lib/types";
export default function CookTimer({ slug, milestones }: { slug: string; milestones?: Milestone[] }) {
  const key = `ember-cook-${slug}`;
  const [started, setStarted] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) { const p = JSON.parse(raw); setStarted(p.started ?? null); setDone(p.done ?? []); } } catch {}
  }, [key]);
  useEffect(() => { if (!started) return; const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [started]);
  function persist(nextStarted: number | null, nextDone: string[]) { localStorage.setItem(key, JSON.stringify({ started: nextStarted, done: nextDone })); }
  const elapsed = useMemo(() => {
    if (!started) return "00:00:00";
    const s = Math.floor((now - started) / 1000);
    return `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  }, [now, started]);
  return (
    <div className="rounded-2xl border border-white/10 bg-bark p-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-subtle">On the pit</p>
      <h3 className="mt-1 font-display text-2xl text-cream">Start this cook</h3>
      <p className="mt-2 text-sm text-parchment/80">A running timer with the checkpoints pitmasters actually use — saved on this device.</p>
      {started ? <p className="mt-4 font-display text-3xl tabular-nums text-ember-hot">{elapsed}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => { const t = Date.now(); setStarted(t); persist(t, done); }} className="h-11 rounded-full bg-ember px-4 text-sm text-cream hover:bg-ember-hot">{started ? "Restart" : "Start cook"}</button>
        {started && <button onClick={() => { setStarted(null); persist(null, done); }} className="h-11 rounded-full border border-white/15 px-4 text-sm">Clear</button>}
      </div>
      {milestones && milestones.length > 0 && (
        <ul className="mt-5 space-y-2">{milestones.map((m) => (
          <li key={m.id}><label className="flex cursor-pointer items-start gap-2 text-sm">
            <input type="checkbox" checked={done.includes(m.id)} onChange={() => { const next = done.includes(m.id) ? done.filter((d) => d !== m.id) : [...done, m.id]; setDone(next); persist(started, next); }} className="mt-1 accent-ember" />
            <span><span className="text-cream">{m.label}</span><span className="block text-subtle">{m.hint}</span></span>
          </label></li>
        ))}</ul>
      )}
      <p className="mt-4 text-xs text-subtle">Timer and notes stay on this device.</p>
    </div>
  );
}

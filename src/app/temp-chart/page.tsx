"use client";
import { useMemo, useState } from "react";
import chart from "@/data/temp-chart.json";
import estimator from "@/data/time-estimator.json";

interface Item { cut: string; pull: string; rest: string; }
interface Group { group: string; items: Item[]; }
interface Est { cut: string; pit: string; rate: number | null; unit: string; fixed?: string; note: string; }

function fmt(mins: number) {
  const h = Math.floor(mins / 60), m = Math.round(mins % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function Estimator() {
  const [cutIdx, setCutIdx] = useState(0);
  const [lbs, setLbs] = useState("10");
  const e = (estimator as Est[])[cutIdx];
  const w = parseFloat(lbs);
  const est = useMemo(() => {
    if (e.rate == null || !w || w <= 0) return null;
    const mid = w * e.rate;
    return `${fmt(mid * 0.85)} – ${fmt(mid * 1.15)}`;
  }, [e, w]);
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-bark p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-subtle">Cut</span>
          <select value={cutIdx} onChange={(ev) => setCutIdx(Number(ev.target.value))}
            className="mt-2 w-full rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-cream">
            {(estimator as Est[]).map((x, i) => <option key={x.cut} value={i}>{x.cut}</option>)}
          </select>
        </label>
        {e.rate != null ? (
          <label className="block">
            <span className="text-xs uppercase tracking-[0.18em] text-subtle">Weight (lbs)</span>
            <input value={lbs} onChange={(ev) => setLbs(ev.target.value)} inputMode="decimal"
              className="mt-2 w-full rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-cream" />
          </label>
        ) : <div className="flex items-end pb-1"><p className="text-sm text-subtle">This one cooks by feel, not weight.</p></div>}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-ink/60 p-4"><p className="text-[11px] uppercase tracking-[0.18em] text-subtle">Pit</p><p className="mt-1 text-xl font-semibold text-cream">{e.pit}</p></div>
        <div className="rounded-xl bg-ink/60 p-4"><p className="text-[11px] uppercase tracking-[0.18em] text-subtle">Est. time</p><p className="mt-1 text-xl font-semibold text-ember">{e.rate != null ? (est ?? "—") : (e.fixed ?? "—")}</p></div>
        <div className="rounded-xl bg-ink/60 p-4"><p className="text-[11px] uppercase tracking-[0.18em] text-subtle">Plus rest</p><p className="mt-1 text-xl font-semibold text-cream">~1 hr</p></div>
      </div>
      <p className="mt-4 text-sm text-parchment/80">{e.note}</p>
      <p className="mt-2 text-sm italic text-subtle">Estimate only — the probe decides when it's done.</p>
    </div>
  );
}

export default function TempChartPage() {
  const [tab, setTab] = useState<"temps" | "time">("temps");
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
      <h1 className="mt-2 font-display text-5xl italic">Pit tools</h1>
      <p className="mt-3 max-w-xl text-parchment/80">
        Temps, rest times, and cook-time estimates. When in doubt, trust the probe — not the clock.
      </p>
      <div className="mt-6 flex gap-2">
        {(["temps", "time"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm ${tab === t ? "bg-ember font-semibold text-ink" : "border border-white/15 text-parchment hover:border-ember"}`}>
            {t === "temps" ? "Temp cheat sheet" : "Time estimator"}
          </button>
        ))}
      </div>
      {tab === "time" ? <Estimator /> : (<>
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
      </>)}
    </main>
  );
}

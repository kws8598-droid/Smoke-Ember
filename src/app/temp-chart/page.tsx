"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  const tooBig = !!(w && w > 150);
  const est = useMemo(() => {
    if (e.rate == null || !w || w <= 0 || tooBig) return null;
    const mid = w * e.rate;
    return `${fmt(mid * 0.85)} – ${fmt(mid * 1.15)}`;
  }, [e, w, tooBig]);
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
      {tooBig && (
        <p className="mt-2 text-sm font-semibold text-ember">
          Whoa — {Math.round(w)} lbs? That&apos;s a whole cow, not a cut. Try again with the weight of just the meat. 😄
        </p>
      )}
      <p className="mt-2 text-sm italic text-subtle">Estimate only — the probe decides when it&apos;s done.</p>
    </div>
  );
}

type Meat = { key: string; label: string; yield?: number; per?: number; unit: "lbs" | "racks" | "links" };

const MEATS: Meat[] = [
  { key: "brisket", label: "Brisket", yield: 0.55, unit: "lbs" },
  { key: "pork", label: "Pork butt", yield: 0.6, unit: "lbs" },
  { key: "turkey", label: "Turkey", yield: 0.5, unit: "lbs" },
  { key: "chicken", label: "Chicken", yield: 0.65, unit: "lbs" },
  { key: "ribs", label: "Pork ribs", per: 1.75, unit: "racks" },
  { key: "sausage", label: "Sausage links", per: 0.25, unit: "links" },
];

function Portions() {
  const [adults, setAdults] = useState("10");
  const [kids, setKids] = useState("0");
  const [hungry, setHungry] = useState(false);
  const [picked, setPicked] = useState<string[]>(["brisket", "pork"]);
  const a = parseFloat(adults) || 0;
  const k = parseFloat(kids) || 0;
  const folks = a + k * 0.5;
  const portion = hungry ? 0.5 : 1 / 3;
  const toggle = (key: string) =>
    setPicked((p) => (p.includes(key) ? p.filter((x) => x !== key) : [...p, key]));
  const result = useMemo(() => {
    if (folks <= 0 || picked.length === 0) return null;
    const finished = folks * portion;
    const share = finished / picked.length;
    const lines = MEATS.filter((m) => picked.includes(m.key)).map((m) => {
      if (m.unit === "lbs") return { label: m.label, unit: m.unit, buy: Math.ceil((share / (m.yield ?? 0.6)) * 2) / 2, finished: share };
      return { label: m.label, unit: m.unit, buy: Math.ceil(share / (m.per ?? 1)), finished: share };
    });
    const rawTotal = lines.filter((l) => l.unit === "lbs").reduce((s, l) => s + l.buy, 0);
    return { finished, lines, rawTotal };
  }, [folks, portion, picked]);
  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-bark p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-subtle">Adults</span>
          <input value={adults} onChange={(ev) => setAdults(ev.target.value)} inputMode="decimal"
            className="mt-2 w-full rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-cream" />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.18em] text-subtle">Kids (count half)</span>
          <input value={kids} onChange={(ev) => setKids(ev.target.value)} inputMode="decimal"
            className="mt-2 w-full rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-cream" />
        </label>
        <div>
          <span className="text-xs uppercase tracking-[0.18em] text-subtle">Appetite</span>
          <div className="mt-2 flex gap-2">
            <button onClick={() => setHungry(false)}
              className={`rounded-full px-4 py-2.5 text-sm ${!hungry ? "bg-ember font-semibold text-ink" : "border border-white/15 text-parchment hover:border-ember"}`}>Standard</button>
            <button onClick={() => setHungry(true)}
              className={`rounded-full px-4 py-2.5 text-sm ${hungry ? "bg-ember font-semibold text-ink" : "border border-white/15 text-parchment hover:border-ember"}`}>Hungry</button>
          </div>
        </div>
      </div>
      <p className="mt-5 text-xs uppercase tracking-[0.18em] text-subtle">Meats</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {MEATS.map((m) => (
          <button key={m.key} onClick={() => toggle(m.key)}
            className={`rounded-full px-4 py-2 text-sm ${picked.includes(m.key) ? "bg-ember font-semibold text-ink" : "border border-white/15 text-parchment hover:border-ember"}`}>{m.label}</button>
        ))}
      </div>
      {result ? (<>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-ink/60 p-4"><p className="text-[11px] uppercase tracking-[0.18em] text-subtle">Finished meat</p><p className="mt-1 text-xl font-semibold text-cream">{result.finished.toFixed(1)} lbs</p></div>
          <div className="rounded-xl bg-ink/60 p-4"><p className="text-[11px] uppercase tracking-[0.18em] text-subtle">Raw to buy</p><p className="mt-1 text-xl font-semibold text-ember">{result.rawTotal > 0 ? `${result.rawTotal} lbs` : "—"}</p></div>
          <div className="rounded-xl bg-ink/60 p-4"><p className="text-[11px] uppercase tracking-[0.18em] text-subtle">Per person</p><p className="mt-1 text-xl font-semibold text-cream">{hungry ? "½ lb" : "⅓ lb"}</p></div>
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          {result.lines.map((l) => (
            <div key={l.label} className="grid grid-cols-[1fr_auto] gap-3 bg-bark px-4 py-3">
              <p className="font-semibold text-cream">{l.label}</p>
              <p className="text-right text-parchment/90">Buy {l.buy} {l.unit} <span className="text-subtle">(~{l.finished.toFixed(1)} lb finished)</span></p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-parchment/80">When in doubt, cook extra. Leftover barbecue is a gift, not a problem.</p>
      </>) : (
        <p className="mt-6 text-sm text-subtle">{folks <= 0 ? "Tell me how many folks are coming." : "Pick at least one meat."}</p>
      )}
      <p className="mt-2 text-sm italic text-subtle">Planning figures: brisket keeps about 55% of its raw weight, pork butt about 60%, turkey about half, chicken about 65%. A rack of ribs eats out to about 1¾ lb, a link to about ¼ lb. Sides are extra — figure about a half-cup per person per side. Estimate only.</p>
    </div>
  );
}

export default function TempChartPage() {
  const router = useRouter();
  const goBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push("/");
  };
  const [tab, setTab] = useState<"temps" | "time" | "portions">("temps");
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
      <button onClick={goBack} className="rounded-full border border-white/15 px-4 py-2 text-sm text-parchment hover:border-ember">← Back</button>
      <p className="mt-4 text-xs uppercase tracking-[0.22em] text-subtle">Fire school</p>
      <h1 className="mt-2 font-display text-5xl italic">Pit tools</h1>
      <p className="mt-3 max-w-xl text-parchment/80">
        Temps, rest times, cook-time estimates, and how much to cook for a crowd. When in doubt, trust the probe — not the clock.
      </p>
      <div className="mt-6 flex gap-2">
        {(["temps", "time", "portions"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm ${tab === t ? "bg-ember font-semibold text-ink" : "border border-white/15 text-parchment hover:border-ember"}`}>
            {t === "temps" ? "Temp cheat sheet" : t === "time" ? "Time estimator" : "Portion calculator"}
          </button>
        ))}
      </div>
      {tab === "time" ? <Estimator /> : tab === "portions" ? <Portions /> : (<>
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
      <button onClick={goBack} className="mt-10 rounded-full border border-white/15 px-4 py-2 text-sm text-parchment hover:border-ember">← Back</button>
    </main>
  );
}

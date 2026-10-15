"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLiveCatalog } from "@/components/LiveCatalog";
import type { Milestone } from "@/lib/types";

/* ---------- types & storage ---------- */

type Note = { t: number; text: string };
type TempEntry = { t: number; label: string; value: string };
type Cooker = { id: string; name: string; hotZones: string; coldZones: string; quirks: string };
type Cook = {
  id: string;
  name: string;
  recipeSlug?: string;
  cookerId?: string;
  wood: string;
  rub: string;
  targetTemp: string;
  startedAt: number;
  endedAt?: number;
  notes: Note[];
  temps: TempEntry[];
  wraps: Note[];
  done: string[];
};

const COOKERS_KEY = "ember-cookers";
const LOG_KEY = "ember-cook-log";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {}
}
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const fmtTime = (t: number) =>
  new Date(t).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const fmtClock = (t: number) =>
  new Date(t).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

function useElapsed(startedAt: number | null) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!startedAt) return;
    const i = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(i);
  }, [startedAt]);
  return useMemo(() => {
    if (!startedAt) return "00:00:00";
    const s = Math.floor((now - startedAt) / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }, [now, startedAt]);
}

const inputCls =
  "w-full rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-cream placeholder:text-subtle";
const labelCls = "mb-1 block text-xs uppercase tracking-[0.18em] text-subtle";
const btnPrimary = "rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-ink hover:bg-ember-hot";
const btnGhost = "rounded-full border border-white/15 px-4 py-2 text-sm text-parchment hover:border-ember";

/* ---------- cookers ---------- */

function CookersTab() {
  const [cookers, setCookers] = useState<Cooker[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [hot, setHot] = useState("");
  const [cold, setCold] = useState("");
  const [quirks, setQuirks] = useState("");
  useEffect(() => setCookers(load<Cooker[]>(COOKERS_KEY, [])), []);
  const persist = (next: Cooker[]) => {
    setCookers(next);
    save(COOKERS_KEY, next);
  };
  function reset() {
    setEditing(null);
    setName("");
    setHot("");
    setCold("");
    setQuirks("");
  }
  function submit() {
    const n = name.trim();
    if (!n) return;
    if (editing) {
      persist(cookers.map((c) => (c.id === editing ? { ...c, name: n, hotZones: hot.trim(), coldZones: cold.trim(), quirks: quirks.trim() } : c)));
    } else {
      persist([...cookers, { id: uid(), name: n, hotZones: hot.trim(), coldZones: cold.trim(), quirks: quirks.trim() }]);
    }
    reset();
  }
  function startEdit(c: Cooker) {
    setEditing(c.id);
    setName(c.name);
    setHot(c.hotZones);
    setCold(c.coldZones);
    setQuirks(c.quirks);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-bark p-5">
        <h2 className="font-display text-2xl text-cream">{editing ? "Edit cooker" : "Add your cooker"}</h2>
        <p className="mt-1 text-sm text-parchment/80">
          Every grill cooks different. Learn your hot zones, your cold zones, your quirks — write them down here.
        </p>
        <div className="mt-4 space-y-3">
          <div>
            <label className={labelCls}>Cooker name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. My Weber kettle" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Hot zones</label>
            <input value={hot} onChange={(e) => setHot(e.target.value)} placeholder="e.g. Right side runs 25° hot" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Cold zones</label>
            <input value={cold} onChange={(e) => setCold(e.target.value)} placeholder="e.g. Back left lags behind" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Quirks & behavior</label>
            <textarea value={quirks} onChange={(e) => setQuirks(e.target.value)} placeholder="e.g. Burns through charcoal fast in wind — add a half chimney at hour 3" rows={3} className={inputCls} />
          </div>
          <div className="flex gap-2">
            <button onClick={submit} className={btnPrimary}>{editing ? "Save changes" : "Add cooker"}</button>
            {editing && <button onClick={reset} className={btnGhost}>Cancel</button>}
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {cookers.length === 0 && <p className="text-subtle">No cookers yet. Add the one you cook on most.</p>}
        {cookers.map((c) => (
          <div key={c.id} className="rounded-2xl border border-white/10 bg-bark p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl text-cream">{c.name}</h3>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => startEdit(c)} className="text-sm text-subtle hover:text-cream">Edit</button>
                <button
                  onClick={() => { if (confirm(`Delete ${c.name}?`)) persist(cookers.filter((x) => x.id !== c.id)); }}
                  className="text-sm text-subtle hover:text-cream"
                >
                  Delete
                </button>
              </div>
            </div>
            {c.hotZones && <p className="mt-2 text-sm"><span className="text-ember-hot">Hot zones:</span> <span className="text-parchment/90">{c.hotZones}</span></p>}
            {c.coldZones && <p className="mt-1 text-sm"><span className="text-ember-hot">Cold zones:</span> <span className="text-parchment/90">{c.coldZones}</span></p>}
            {c.quirks && <p className="mt-1 text-sm text-parchment/80">{c.quirks}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- active cook ---------- */

function ActiveCook({ cook, onUpdate, onFinish, milestones }: {
  cook: Cook;
  onUpdate: (c: Cook) => void;
  onFinish: () => void;
  milestones: Milestone[];
}) {
  const elapsed = useElapsed(cook.startedAt);
  const [note, setNote] = useState("");
  const [tempLabel, setTempLabel] = useState("");
  const [tempValue, setTempValue] = useState("");
  const [wrap, setWrap] = useState("");
  function addNote() {
    const t = note.trim();
    if (!t) return;
    onUpdate({ ...cook, notes: [...cook.notes, { t: Date.now(), text: t }] });
    setNote("");
  }
  function addTemp() {
    const v = tempValue.trim();
    if (!v) return;
    onUpdate({ ...cook, temps: [...cook.temps, { t: Date.now(), label: tempLabel.trim() || "Pit", value: v }] });
    setTempLabel("");
    setTempValue("");
  }
  function addWrap() {
    const t = wrap.trim();
    if (!t) return;
    onUpdate({ ...cook, wraps: [...cook.wraps, { t: Date.now(), text: t }] });
    setWrap("");
  }
  function toggleMilestone(id: string) {
    const done = cook.done.includes(id) ? cook.done.filter((d) => d !== id) : [...cook.done, id];
    onUpdate({ ...cook, done });
  }
  return (
    <div className="rounded-2xl border border-ember/40 bg-bark p-5">
      <p className="text-[11px] uppercase tracking-[0.22em] text-ember-hot">On the pit now</p>
      <h2 className="mt-1 font-display text-3xl text-cream">{cook.name}</h2>
      <p className="mt-1 text-sm text-subtle">Started {fmtTime(cook.startedAt)}</p>
      <p className="mt-3 font-display text-4xl tabular-nums text-ember-hot">{elapsed}</p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-parchment/80">
        {cook.wood && <span>Wood: {cook.wood}</span>}
        {cook.rub && <span>Rub: {cook.rub}</span>}
        {cook.targetTemp && <span>Target: {cook.targetTemp}</span>}
      </div>

      {milestones.length > 0 && (
        <div className="mt-5">
          <p className={labelCls}>Checkpoints</p>
          <ul className="space-y-2">
            {milestones.map((m) => (
              <li key={m.id}>
                <label className="flex cursor-pointer items-start gap-2 text-sm">
                  <input type="checkbox" checked={cook.done.includes(m.id)} onChange={() => toggleMilestone(m.id)} className="mt-1 accent-ember" />
                  <span><span className="text-cream">{m.label}</span><span className="block text-subtle">{m.hint}</span></span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5">
        <p className={labelCls}>Log a note</p>
        <div className="flex gap-2">
          <input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNote()}
            placeholder="e.g. Spritzed with apple juice" className={`${inputCls} min-w-0 flex-1`} />
          <button onClick={addNote} className="shrink-0 rounded-xl bg-ember px-4 font-semibold text-ink">Log</button>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className={labelCls}>Log a temp</p>
          <div className="flex gap-2">
            <input value={tempLabel} onChange={(e) => setTempLabel(e.target.value)} placeholder="Pit / flat / thigh" className={`${inputCls} min-w-0 flex-1`} />
            <input value={tempValue} onChange={(e) => setTempValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTemp()}
              placeholder="°F" inputMode="numeric" className={`${inputCls} w-20 shrink-0`} />
            <button onClick={addTemp} className="shrink-0 rounded-xl border border-white/15 px-3 text-sm">Add</button>
          </div>
        </div>
        <div>
          <p className={labelCls}>Log a wrap</p>
          <div className="flex gap-2">
            <input value={wrap} onChange={(e) => setWrap(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addWrap()}
              placeholder="e.g. Wrapped in butcher paper" className={`${inputCls} min-w-0 flex-1`} />
            <button onClick={addWrap} className="shrink-0 rounded-xl border border-white/15 px-3 text-sm">Add</button>
          </div>
        </div>
      </div>

      {(cook.notes.length > 0 || cook.temps.length > 0 || cook.wraps.length > 0) && (
        <div className="mt-5 space-y-1.5 text-sm">
          {[...cook.temps].reverse().map((t, i) => (
            <p key={`t${i}`} className="text-parchment/90"><span className="text-subtle">{fmtClock(t.t)}</span> · 🌡 {t.label}: {t.value}°F</p>
          ))}
          {[...cook.wraps].reverse().map((w, i) => (
            <p key={`w${i}`} className="text-parchment/90"><span className="text-subtle">{fmtClock(w.t)}</span> · 🎁 {w.text}</p>
          ))}
          {[...cook.notes].reverse().map((n, i) => (
            <p key={`n${i}`} className="text-parchment/90"><span className="text-subtle">{fmtClock(n.t)}</span> · {n.text}</p>
          ))}
        </div>
      )}

      <button onClick={() => { if (confirm("Finish this cook?")) onFinish(); }} className={`${btnPrimary} mt-6`}>
        Finish cook
      </button>
    </div>
  );
}

/* ---------- cooks tab ---------- */

function CooksTab() {
  const { recipes } = useLiveCatalog();
  const [cookers, setCookers] = useState<Cooker[]>([]);
  const [cooks, setCooks] = useState<Cook[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [recipeSlug, setRecipeSlug] = useState("");
  const [cookerId, setCookerId] = useState("");
  const [wood, setWood] = useState("");
  const [rub, setRub] = useState("");
  const [targetTemp, setTargetTemp] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setCookers(load<Cooker[]>(COOKERS_KEY, []));
    setCooks(load<Cook[]>(LOG_KEY, []));
  }, []);
  const persist = (next: Cook[]) => {
    setCooks(next);
    save(LOG_KEY, next);
  };

  const active = cooks.find((c) => !c.endedAt);
  const past = cooks.filter((c) => c.endedAt).sort((a, b) => (b.endedAt ?? 0) - (a.endedAt ?? 0));
  const sortedRecipes = useMemo(() => [...recipes].sort((a, b) => a.title.localeCompare(b.title)), [recipes]);
  const activeMilestones: Milestone[] = useMemo(() => {
    if (!active?.recipeSlug) return [];
    return recipes.find((r) => r.slug === active.recipeSlug)?.milestones ?? [];
  }, [active, recipes]);

  function startCook() {
    const n = name.trim();
    if (!n) return;
    const c: Cook = {
      id: uid(), name: n,
      recipeSlug: recipeSlug || undefined,
      cookerId: cookerId || undefined,
      wood: wood.trim(), rub: rub.trim(), targetTemp: targetTemp.trim(),
      startedAt: Date.now(), notes: [], temps: [], wraps: [], done: [],
    };
    persist([c, ...cooks]);
    setName(""); setRecipeSlug(""); setCo
...[truncated 5380 chars]
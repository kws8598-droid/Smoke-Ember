"use client";

import { useState } from "react";

// Starting estimates — plain pitmaster rules of thumb, not a timer.
// The stall can add time, and the meat still needs its rest.
type MeatRate = {
  id: string;
  label: string;
  temp: string;
  hrsPerLb?: readonly [number, number];
  minPerLb?: number;
  fixedHrs?: readonly [number, number];
  perPersonLb: number;
};
const MEATS: MeatRate[] = [
  { id: "brisket", label: "Brisket", temp: "225–250°F", hrsPerLb: [1, 1.5], perPersonLb: 0.75 },
  { id: "pork-butt", label: "Pork butt", temp: "225–250°F", hrsPerLb: [1, 1.5], perPersonLb: 0.75 },
  { id: "turkey", label: "Whole turkey", temp: "300–325°F", minPerLb: 13, perPersonLb: 1 },
  { id: "chicken", label: "Whole chicken", temp: "300–325°F", minPerLb: 20, perPersonLb: 0.75 },
  { id: "turkey-breast", label: "Turkey breast (boneless)", temp: "250°F", minPerLb: 20, perPersonLb: 0.5 },
  { id: "spare-ribs", label: "Spare ribs", temp: "225–250°F", fixedHrs: [5, 6], perPersonLb: 1 },
];

function fmtHours(h: number) {
  if (h < 1) return `${Math.round(h * 60)} minutes`;
  const whole = Math.floor(h);
  const min = Math.round((h - whole) * 60);
  if (min === 0) return whole === 1 ? "1 hour" : `${whole} hours`;
  return `${whole} hour${whole === 1 ? "" : "s"} ${min} min`;
}

function fmtLb(lb: number) {
  const rounded = Math.round(lb * 2) / 2;
  return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
}

export default function CookCalculator() {
  const [mode, setMode] = useState<"time" | "amount">("time");
  const [meatId, setMeatId] = useState(MEATS[0].id);
  const [weight, setWeight] = useState("12");
  const [guests, setGuests] = useState("10");
  const meat = MEATS.find((m) => m.id === meatId) ?? MEATS[0];

  const weightNum = Math.max(0, Number(weight) || 0);
  const guestsNum = Math.max(0, Math.floor(Number(guests) || 0));

  let timeResult: string;
  if (meat.fixedHrs) {
    timeResult = `About ${meat.fixedHrs[0]}–${meat.fixedHrs[1]} hours on the pit — the 2-2-1 way: 2 hours smoke, 2 wrapped, 1 to finish.`;
  } else if (meat.hrsPerLb) {
    timeResult = `About ${fmtHours(weightNum * meat.hrsPerLb[0])} to ${fmtHours(weightNum * meat.hrsPerLb[1])} on the pit at ${meat.temp}.`;
  } else if (meat.minPerLb) {
    timeResult = `About ${fmtHours((weightNum * meat.minPerLb) / 60)} on the pit at ${meat.temp}.`;
  } else {
    timeResult = "";
  }
  const amountResult = `Buy about ${fmtLb(guestsNum * meat.perPersonLb)} lb.`;

  return (
    <section id="calculator" className="mx-auto max-w-6xl scroll-mt-40 px-4 py-2" aria-label="Cook calculator">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">Do the math</p>
      <h2 className="mt-2 font-display text-4xl italic text-cream glow-ember">Cook calculator</h2>
      <p className="mt-2 max-w-xl text-parchment/85">How long will it take — or how much do you need for the table?</p>
      <div className="mt-3 rounded-2xl border border-white/5 bg-bark p-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("time")}
            className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold ${mode === "time" ? "border-ember bg-ember text-cream" : "border-white/15 text-parchment hover:text-cream"}`}
          >
            How long will it take?
          </button>
          <button
            type="button"
            onClick={() => setMode("amount")}
            className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold ${mode === "amount" ? "border-ember bg-ember text-cream" : "border-white/15 text-parchment hover:text-cream"}`}
          >
            How much do I need?
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <label className="min-w-44 flex-1">
            <span className="text-sm text-parchment/80">What are you cooking?</span>
            <select
              value={meatId}
              onChange={(e) => setMeatId(e.target.value)}
              className="mt-1 h-12 w-full rounded-full border border-white/15 bg-ink px-4 text-base text-cream outline-none focus:border-ember"
            >
              {MEATS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </label>
          {mode === "time" ? (
            <label className="w-32">
              <span className="text-sm text-parchment/80">Weight (lb)</span>
              <input
                type="number"
                min="0"
                step="0.5"
                inputMode="decimal"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="mt-1 h-12 w-full rounded-full border border-white/15 bg-ink px-4 text-base text-cream outline-none focus:border-ember"
              />
            </label>
          ) : (
            <label className="w-32">
              <span className="text-sm text-parchment/80">How many folks?</span>
              <input
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="mt-1 h-12 w-full rounded-full border border-white/15 bg-ink px-4 text-base text-cream outline-none focus:border-ember"
              />
            </label>
          )}
        </div>
        <p className="mt-4 font-display text-2xl italic text-cream">
          {mode === "time" ? timeResult : amountResult}
        </p>
        <p className="mt-2 text-sm text-subtle">
          Estimates, not a timer — the stall can add time, and rest it before you slice.
        </p>
      </div>
    </section>
  );
}

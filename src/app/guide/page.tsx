import Link from "next/link";
import { regionCopy, recipes } from "@/lib/data";
export const metadata = { title: "Guide" };
const schools = [
  { href: "/wisdom/clean-fire", title: "Thin blue smoke", line: "White billowing smoke is unburned wood." },
  { href: "/wisdom/the-stall", title: "Ride the stall", line: "Evaporation, not failure. Wrap for the clock." },
  { href: "/wisdom/building-bark", title: "Earn the bark", line: "If it rubs off, you never had it." },
  { href: "/wisdom/probe-tender", title: "Probe, don't worship a number", line: "203\u00b0F is a rumor. Butter is the law." },
];
export default function GuidePage() {
  const counts = Object.fromEntries(Object.keys(regionCopy).map((id) => [id, recipes.filter((r) => r.region === id).length]));
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">How to use the book</p>
      <h1 className="mt-2 font-display text-5xl italic">Guide</h1>
      <p className="mt-3 max-w-2xl text-parchment/80">Pick a time, pick a protein, cook the original recipe \u2014 not a generic template. Fire school sits next to the plate.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">{schools.map((s) => (
        <Link key={s.href} href={s.href} className="rounded-2xl border border-white/5 p-5 hover:border-ember/40"><h2 className="font-display text-2xl italic">{s.title}</h2><p className="mt-2 text-sm text-parchment/80">{s.line}</p></Link>
      ))}</div>
      <h2 className="mt-14 font-display text-3xl italic">Regions</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(regionCopy).map(([id, meta]) => (
        <Link key={id} href={`/recipes?region=${id}`} className="rounded-2xl border border-white/5 p-5 hover:border-ember/40">
          <h3 className="font-display text-2xl text-cream">{meta.label}</h3>
          <p className="mt-1 text-parchment/80">{meta.line}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-subtle">{counts[id]} cooks</p>
        </Link>
      ))}</div>
    </main>
  );
}

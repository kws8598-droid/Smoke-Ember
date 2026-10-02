import Link from "next/link";
import Image from "next/image";
import { regionCopy, recipes } from "@/lib/data";
export const metadata = { title: "Guide" };
const schools = [
  { href: "/wisdom/clean-fire", title: "Thin blue smoke", line: "White billowing smoke is unburned wood.", image: "/images/hero-smoker.jpg" },
  { href: "/wisdom/the-stall", title: "Ride the stall", line: "Evaporation, not failure. Wrap for the clock.", image: "/images/embers.jpg" },
  { href: "/wisdom/building-bark", title: "Earn the bark", line: "If it rubs off, you never had it.", image: "/images/brisket.jpg" },
  { href: "/wisdom/probe-tender", title: "Probe, don't worship a number", line: "203\u00b0F is a rumor. Butter is the law.", image: "/images/brisket.jpg" },
];
export default function GuidePage() {
  const counts = Object.fromEntries(Object.keys(regionCopy).map((id) => [id, recipes.filter((r) => r.region === id).length]));
  return (
    <main className="relative">
      {/* Open cookbook backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <img src="/images/guide-page-bg.jpg" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/65" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">How to use the book</p>
      <h1 className="mt-2 font-display text-5xl italic">Guide</h1>
      <p className="mt-3 max-w-2xl text-parchment/80">Pick a time, pick a protein, cook the original recipe — not a generic template. Fire school sits next to the plate.</p>
      <div className="mt-10 grid gap-4 md:grid-cols-2">{schools.map((s) => (
        <Link key={s.href} href={s.href} className="group overflow-hidden rounded-2xl border border-white/5 bg-bark hover:border-ember/40"><div className="relative h-40"><Image src={s.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" /></div><div className="p-5"><h2 className="font-display text-2xl italic group-hover:text-ember-hot">{s.title}</h2><p className="mt-2 text-sm text-parchment/80">{s.line}</p></div></Link>
      ))}</div>
      <h2 className="mt-14 font-display text-3xl italic">Regions</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(regionCopy).map(([id, meta]) => (
        <Link key={id} href={`/recipes?region=${id}`} className="rounded-2xl border border-white/5 p-5 hover:border-ember/40">
          <h3 className="font-display text-2xl text-cream">{meta.label}</h3>
          <p className="mt-1 text-parchment/80">{meta.line}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-subtle">{counts[id]} cooks</p>
        </Link>
      ))}</div>
      </div>
    </main>
  );
}

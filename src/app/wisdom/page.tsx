import Image from "next/image";
import Link from "next/link";
import { wisdom } from "@/lib/data";
export const metadata = { title: "Fire school" };
export default function WisdomPage() {
  return (
    <main className="relative">
      {/* Glowing embers backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <Image src="/images/tips-page-bg.jpg" alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-ink/60" />
      </div>
      <div className="relative mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">Fire school</p>
      <h1 className="mt-2 font-display text-5xl italic">Cooking tips</h1>
      <p className="mt-3 max-w-xl text-parchment/80">The stall, the bark, the fire, the rest. Notes the pit actually teaches.</p>
      <Link href="/flavor-profiles" className="mt-6 flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-ember/30 bg-bark p-5 hover:border-ember/60">
        <div><p className="text-[11px] uppercase tracking-[0.18em] text-ember">Reference</p><h2 className="mt-1 font-display text-2xl">Flavor profiles</h2><p className="mt-2 text-sm text-parchment/80">What herbs, spices, and peppers actually taste like — and where they earn their keep on the pit.</p></div>
        <span className="shrink-0 text-2xl text-ember">→</span>
      </Link>
      <Link href="/temp-chart" className="mt-4 flex items-center justify-between gap-4 overflow-hidden rounded-2xl border border-ember/30 bg-bark p-5 hover:border-ember/60">
        <div><p className="text-[11px] uppercase tracking-[0.18em] text-ember">Reference</p><h2 className="mt-1 font-display text-2xl">Temp cheat sheet</h2><p className="mt-2 text-sm text-parchment/80">Pull temps and rest times for everything on the pit.</p></div>
        <span className="shrink-0 text-2xl text-ember">→</span>
      </Link>
      <div className="mt-10 grid gap-5 md:grid-cols-2">{wisdom.map((w) => (
        <Link key={w.slug} href={`/wisdom/${w.slug}`} className="overflow-hidden rounded-2xl border border-white/5 bg-bark hover:border-ember/40">
          <div className="relative h-40"><Image src={w.image} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" /></div>
          <div className="p-5"><p className="text-[11px] uppercase tracking-[0.18em] text-ember">{w.kicker}</p><h2 className="mt-1 font-display text-2xl">{w.title}</h2><p className="mt-2 text-sm text-parchment/80">{w.summary}</p></div>
        </Link>
      ))}</div>
      </div>
    </main>
  );
}

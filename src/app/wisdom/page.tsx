import Link from "next/link";
import { wisdom } from "@/lib/data";
export const metadata = { title: "Fire school" };
export default function WisdomPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">Fire school</p>
      <h1 className="mt-2 font-display text-5xl italic">Cooking tips</h1>
      <p className="mt-3 max-w-xl text-parchment/80">The stall, the bark, the fire, the rest. Notes the pit actually teaches.</p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">{wisdom.map((w) => (
        <Link key={w.slug} href={`/wisdom/${w.slug}`} className="overflow-hidden rounded-2xl border border-white/5 bg-bark hover:border-ember/40">
          <div className="relative h-40"><img src={w.image} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" /></div>
          <div className="p-5"><p className="text-[11px] uppercase tracking-[0.18em] text-ember">{w.kicker}</p><h2 className="mt-1 font-display text-2xl">{w.title}</h2><p className="mt-2 text-sm text-parchment/80">{w.summary}</p></div>
        </Link>
      ))}</div>
    </main>
  );
}

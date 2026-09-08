import Link from "next/link";
import { img, wisdom } from "@/lib/data";
export const metadata = { title: "Fire school" };
export default function WisdomIndex() {
  const [featured, ...rest] = wisdom;
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">Fire school</p>
      <h1 className="mt-2 font-display text-5xl italic">Tips</h1>
      <p className="mt-3 max-w-xl text-parchment/80">Short reads on stall, bark, dirty smoke, and rest.</p>
      {featured && (
        <Link href={`/wisdom/${featured.slug}`} className="mt-10 grid overflow-hidden rounded-3xl border border-white/5 md:grid-cols-2">
          <img src={img(featured.image)} alt="" className="h-72 w-full object-cover md:h-full" />
          <div className="bg-bark p-8">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ember">{featured.kicker}</p>
            <h2 className="mt-2 font-display text-3xl">{featured.title}</h2>
            <p className="mt-3 text-parchment/80">{featured.summary}</p>
            <p className="mt-4 text-sm text-subtle">{featured.readMinutes} min read</p>
          </div>
        </Link>
      )}
      <div className="mt-8 grid gap-5 md:grid-cols-2">{rest.map((w) => (
        <Link key={w.slug} href={`/wisdom/${w.slug}`} className="overflow-hidden rounded-2xl border border-white/5 bg-bark hover:border-ember/40">
          <img src={img(w.image)} alt="" className="h-48 w-full object-cover" />
          <div className="p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ember">{w.kicker}</p>
            <h3 className="mt-1 font-display text-2xl">{w.title}</h3>
            <p className="mt-2 text-sm text-parchment/80">{w.summary}</p>
          </div>
        </Link>
      ))}</div>
    </main>
  );
}

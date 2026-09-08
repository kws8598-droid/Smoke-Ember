import Link from "next/link";
import { notFound } from "next/navigation";
import { getWisdom, img, wisdom } from "@/lib/data";
export function generateStaticParams() { return wisdom.map((w) => ({ slug: w.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const w = getWisdom(params.slug);
  return { title: w?.title ?? "Tip" };
}
export default function WisdomPage({ params }: { params: { slug: string } }) {
  const w = getWisdom(params.slug);
  if (!w) notFound();
  return (
    <main>
      <section className="relative min-h-[40vh] overflow-hidden">
        <img src={img(w.image)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/25" />
        <div className="relative mx-auto max-w-3xl px-4 pb-10 pt-28">
          <Link href="/wisdom" className="text-sm text-parchment/80">← All tips</Link>
          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-ember">{w.kicker}</p>
          <h1 className="mt-2 font-display text-5xl italic text-cream">{w.title}</h1>
          <p className="mt-4 text-lg text-parchment/90">{w.summary}</p>
          <p className="mt-3 text-sm text-subtle">{w.readMinutes} min read</p>
        </div>
      </section>
      <article className="mx-auto max-w-3xl px-4 py-12">
        {w.body.map((block, i) => (
          <section key={i} className="mb-8">
            {block.heading && <h2 className="mb-3 font-display text-3xl italic text-cream">{block.heading}</h2>}
            <p className="text-lg leading-relaxed text-parchment/90">{block.text}</p>
          </section>
        ))}
        {w.takeaways && w.takeaways.length > 0 && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-bark p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-ember">Take it to the pit</p>
            <ul className="mt-3 space-y-2 text-parchment/90">{w.takeaways.map((t) => <li key={t}>• {t}</li>)}</ul>
          </div>
        )}
      </article>
    </main>
  );
}

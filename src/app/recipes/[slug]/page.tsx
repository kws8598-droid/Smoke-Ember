import Link from "next/link";
import { notFound } from "next/navigation";
import CookTimer from "@/components/CookTimer";
import SaveButton from "@/components/SaveButton";
import RecipeCard from "@/components/RecipeCard";
import { difficultyLabel, formatHours, getRecipe, recipes, regionLabel, related } from "@/lib/data";

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}
export function generateMetadata({ params }: { params: { slug: string } }) {
  const r = getRecipe(params.slug);
  return { title: r?.title ?? "Recipe" };
}
export default function RecipePage({ params }: { params: { slug: string } }) {
  const r = getRecipe(params.slug);
  if (!r) notFound();
  const more = related(r);
  return (
    <main>
      <section className="relative min-h-[52vh] overflow-hidden">
        <img src={r.image} alt={r.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/20" />
        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-28">
          <Link href="/recipes" className="text-sm text-parchment/80 hover:text-cream">\u2190 All recipes</Link>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.16em] text-parchment">
            <span className="rounded-full bg-black/40 px-2 py-1">{regionLabel(r.region)}</span>
            <span className="rounded-full bg-black/40 px-2 py-1 capitalize">{r.protein}</span>
            <span className="rounded-full bg-black/40 px-2 py-1">{difficultyLabel(r.difficulty)}</span>
          </div>
          <div className="mt-4 flex items-start justify-between gap-4">
            <h1 className="font-display text-4xl italic text-cream sm:text-6xl">{r.title}</h1>
            <SaveButton slug={r.slug} />
          </div>
          <p className="mt-2 text-sm text-subtle">{r.school}</p>
          <p className="mt-4 max-w-2xl text-lg text-parchment/90">{r.story}</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[["Time", formatHours(r.hours)], ["Pit", r.pitTemp], ["Done", r.finish], ["Wood", r.wood]].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-white/10 bg-bark p-4">
                <p className="text-[11px] uppercase tracking-[0.18em] text-subtle">{k}</p>
                <p className="mt-1 text-sm text-cream">{v}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-subtle">Serves {r.servings}.</p>
          <h2 className="mt-12 font-display text-3xl italic">Ingredients</h2>
          <p className="mt-1 text-sm text-subtle">Check them off as you go.</p>
          {r.ingredients?.map((g) => (
            <div key={g.group} className="mt-6">
              <h3 className="text-xs uppercase tracking-[0.18em] text-ember">{g.group}</h3>
              <ul className="mt-2 space-y-2">{g.items.map((item) => (
                <li key={item} className="flex gap-2 text-parchment/90"><input type="checkbox" className="mt-1 accent-ember" /><span>{item}</span></li>
              ))}</ul>
            </div>
          ))}
          <h2 className="mt-12 font-display text-3xl italic">Steps</h2>
          <ol className="mt-6 space-y-8">{r.steps?.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[auto_1fr] gap-4">
              <span className="font-display text-2xl text-ember">{String(i + 1).padStart(2, "0")}</span>
              <div><h3 className="text-xl text-cream">{s.title}</h3><p className="mt-2 whitespace-pre-wrap text-parchment/85">{s.body}</p></div>
            </li>
          ))}</ol>
          {r.proTips && r.proTips.length > 0 && (
            <>
              <h2 className="mt-12 font-display text-3xl italic">Pitmaster tips</h2>
              <div className="mt-6 space-y-4">{r.proTips.map((t) => (
                <blockquote key={t.voice} className="border-l-2 border-ember pl-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-ember">{t.voice}</p>
                  <p className="mt-1 text-parchment/90">{t.text}</p>
                </blockquote>
              ))}</div>
            </>
          )}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start"><CookTimer slug={r.slug} milestones={r.milestones} /></aside>
      </section>
      {more.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <h2 className="font-display text-3xl italic">You might also like</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">{more.map((m) => <RecipeCard key={m.slug} recipe={m} />)}</div>
        </section>
      )}
    </main>
  );
}

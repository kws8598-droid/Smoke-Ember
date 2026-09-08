import RecipeCard from "@/components/RecipeCard";
import { desserts } from "@/lib/data";
export const metadata = { title: "Desserts" };
export default function DessertsPage() {
  const list = desserts();
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">Close the plate</p>
      <h1 className="mt-2 font-display text-5xl italic">Desserts</h1>
      <p className="mt-3 max-w-xl text-parchment/80">The Southern closers that belong after a pit plate.</p>
      <p className="mt-6 text-sm text-subtle">{list.length} sweets</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((r) => <RecipeCard key={r.slug} recipe={r} />)}</div>
    </main>
  );
}

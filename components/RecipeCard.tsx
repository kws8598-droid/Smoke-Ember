"use client";
import Link from "next/link";
import type { Recipe } from "@/lib/types";
import { formatHours, img, regionLabel } from "@/lib/data";
import { useLiveRecipe } from "@/components/LiveCatalog";
export default function RecipeCard({ recipe, large = false }: { recipe: Recipe; large?: boolean }) {
  const live = useLiveRecipe(recipe);
  const href = live.protein === "desserts" ? `/desserts/${live.slug}` : `/recipes/${live.slug}`;
  return (
    <Link href={href} className="group overflow-hidden rounded-2xl border border-white/5 bg-bark transition hover:border-ember/40">
      <div className={`relative overflow-hidden ${large ? "h-64" : "h-44"}`}>
        <img src={img(live.image)} alt={live.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
        <span className="absolute bottom-3 left-3 text-[11px] uppercase tracking-[0.18em] text-parchment">{regionLabel(live.region)}</span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-xl text-cream group-hover:text-ember-hot">{live.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-parchment/80">{live.summary}</p>
        <p className="mt-3 text-xs uppercase tracking-[0.16em] text-subtle">{formatHours(live.hours)}{live.wood ? ` \u00b7 ${live.wood}` : ""}</p>
      </div>
    </Link>
  );
}

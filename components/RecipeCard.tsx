"use client";
import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/lib/types";
import { formatHours, img, regionLabel } from "@/lib/data";
import { useLiveRecipe } from "@/components/LiveCatalog";

const diffStyles: Record<string, string> = {
  easy: "bg-[#33502f]/90 text-[#c9e8c2]",
  medium: "bg-ember/90 text-ink",
  hard: "bg-[#8a2b1d]/95 text-[#ffd9c7]",
};

export default function RecipeCard({ recipe, large = false }: { recipe: Recipe; large?: boolean }) {
  const live = useLiveRecipe(recipe);
  const href = live.protein === "desserts" ? `/desserts/${live.slug}` : `/recipes/${live.slug}`;
  const diff = (live.difficulty || "").toLowerCase();
  const badge = diffStyles[diff] || "bg-ash/90 text-parchment";
  return (
    <Link href={href} className="group overflow-hidden rounded-2xl border border-white/5 bg-bark transition duration-300 hover:-translate-y-1 hover:border-ember/40 hover:shadow-[0_10px_36px_rgba(196,92,38,0.22)]">
      <div className={`relative overflow-hidden ${large ? "h-64" : "h-44"}`}>
        <Image src={img(live.image)} alt={live.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
        <span className="absolute bottom-3 left-3 text-[11px] uppercase tracking-[0.18em] text-parchment">{regionLabel(live.region)}</span>
        {diff ? (
          <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${badge}`}>{diff}</span>
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="font-display text-xl text-cream group-hover:text-ember-hot">{live.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-parchment/80">{live.summary}</p>
        <p className="mt-3 text-xs uppercase tracking-[0.16em] text-subtle">{formatHours(live.hours)}{live.wood ? ` \u00b7 ${live.wood}` : ""}</p>
      </div>
    </Link>
  );
}

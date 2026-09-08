import { desserts, getRecipe } from "@/lib/data";
import RecipePage, { generateMetadata as recipeMeta } from "@/app/recipes/[slug]/page";
import { notFound } from "next/navigation";
export function generateStaticParams() { return desserts().map((r) => ({ slug: r.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) { return recipeMeta({ params }); }
export default function DessertRecipe({ params }: { params: { slug: string } }) {
  const r = getRecipe(params.slug);
  if (!r || r.protein !== "desserts") notFound();
  return <RecipePage params={params} />;
}

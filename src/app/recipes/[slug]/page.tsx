import { notFound } from "next/navigation";
import RecipeView from "@/components/RecipeView";
import { getRecipe, recipes } from "@/lib/data";
import { getLiveRecipe } from "@/lib/live";

export const revalidate = 0;

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const r = (await getLiveRecipe(params.slug)) ?? getRecipe(params.slug);
  return { title: r?.title ?? "Recipe" };
}

export default async function RecipePage({ params }: { params: { slug: string } }) {
  const r = (await getLiveRecipe(params.slug)) ?? getRecipe(params.slug);
  if (!r) notFound();
  return <RecipeView recipe={r} />;
}

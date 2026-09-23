import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RecipeView from "@/components/RecipeView";
import { getRecipe, recipes } from "@/lib/data";
import { getLiveRecipe } from "@/lib/live";

export const revalidate = 0;

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const r = (await getLiveRecipe(params.slug)) ?? getRecipe(params.slug);
  if (!r) return { title: "Recipe" };
  const description = r.summary || r.story;
  const image = r.image || "/og.jpg";
  return {
    title: r.title,
    description,
    openGraph: {
      title: r.title,
      description,
      type: "article",
      images: [{ url: image, alt: r.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: r.title,
      description,
      images: [image],
    },
  };
}

export default async function RecipePage({ params }: { params: { slug: string } }) {
  const r = (await getLiveRecipe(params.slug)) ?? getRecipe(params.slug);
  if (!r) notFound();
  return <RecipeView recipe={r} />;
}

import RecipePage, { generateMetadata } from "../../recipes/[slug]/page";
import { recipes } from "@/lib/data";
export { generateMetadata };
export function generateStaticParams() {
  return recipes.filter((r) => r.protein === "desserts").map((r) => ({ slug: r.slug }));
}
export default RecipePage;

import type { Recipe } from "./types";
import { recipes as builtinRecipes } from "./data";

export type RecipeOverrideRow = {
  slug: string;
  recipe?: unknown;
  data?: unknown;
  updated_at?: string;
};

export function unwrapOverride(row: RecipeOverrideRow | Record<string, unknown> | null | undefined): Partial<Recipe> | null {
  if (!row || typeof row !== "object") return null;
  const raw = (row as RecipeOverrideRow).recipe ?? (row as RecipeOverrideRow).data ?? row;
  if (!raw || typeof raw !== "object") return null;
  return raw as Partial<Recipe>;
}

export function applyOverride(base: Recipe, override: Partial<Recipe> | null | undefined): Recipe {
  if (!override) return base;
  const hours = override.hours && typeof override.hours === "object"
    ? {
        min: Number((override.hours as Recipe["hours"]).min ?? base.hours.min),
        max: Number((override.hours as Recipe["hours"]).max ?? base.hours.max),
      }
    : base.hours;
  return {
    ...base,
    ...override,
    slug: base.slug,
    hours,
    ingredients: Array.isArray(override.ingredients) ? override.ingredients : base.ingredients,
    steps: Array.isArray(override.steps) ? override.steps : base.steps,
    proTips: Array.isArray(override.proTips) ? override.proTips : base.proTips,
    milestones: Array.isArray(override.milestones) ? override.milestones : base.milestones,
  };
}

export function mergeCatalog(
  base: Recipe[] = builtinRecipes,
  overrideRows: RecipeOverrideRow[] = [],
  recipeTableRows: { slug: string; data?: unknown }[] = []
): Recipe[] {
  const map = new Map<string, Recipe>();
  for (const recipe of base) map.set(recipe.slug, recipe);

  for (const row of recipeTableRows) {
    const patch = unwrapOverride({ slug: row.slug, data: row.data });
    const current = map.get(row.slug);
    if (current && patch) map.set(row.slug, applyOverride(current, patch));
    else if (!current && patch?.title) {
      map.set(row.slug, applyOverride(emptyRecipe(row.slug), patch));
    }
  }

  for (const row of overrideRows) {
    const patch = unwrapOverride(row);
    if (!row.slug || !patch) continue;
    const current = map.get(row.slug);
    if (current) map.set(row.slug, applyOverride(current, patch));
    else if (patch.title) map.set(row.slug, applyOverride(emptyRecipe(row.slug), patch));
  }

  return Array.from(map.values());
}

export function emptyRecipe(slug: string): Recipe {
  return {
    slug,
    title: slug,
    region: "",
    protein: "",
    difficulty: "",
    hours: { min: 0, max: 0 },
    servings: "",
    wood: "",
    pitTemp: "",
    finish: "",
    summary: "",
    story: "",
    school: "",
    image: "",
    ingredients: [],
    steps: [],
  };
}

export async function fetchOverrideRows(): Promise<RecipeOverrideRow[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/recipe_overrides?select=slug,recipe,updated_at`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as RecipeOverrideRow[];
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

export async function fetchRecipeTableRows(): Promise<{ slug: string; data?: unknown }[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/recipes?select=slug,data`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const rows = (await res.json()) as { slug: string; data?: unknown }[];
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

export async function getLiveRecipes(): Promise<Recipe[]> {
  const [overrides, tableRows] = await Promise.all([fetchOverrideRows(), fetchRecipeTableRows()]);
  return mergeCatalog(builtinRecipes, overrides, tableRows);
}

export async function getLiveRecipe(slug: string): Promise<Recipe | undefined> {
  const list = await getLiveRecipes();
  return list.find((r) => r.slug === slug);
}

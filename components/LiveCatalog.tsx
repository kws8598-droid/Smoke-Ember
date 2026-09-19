"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Recipe } from "@/lib/types";
import { recipes as builtinRecipes } from "@/lib/data";

type Ctx = {
  recipes: Recipe[];
  bySlug: Map<string, Recipe>;
  ready: boolean;
};

const LiveCatalogContext = createContext<Ctx>({
  recipes: builtinRecipes,
  bySlug: new Map(builtinRecipes.map((r) => [r.slug, r])),
  ready: false,
});

export function LiveCatalogProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(builtinRecipes);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/catalog", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (cancelled || !body?.recipes || !Array.isArray(body.recipes)) return;
        setRecipes(body.recipes as Recipe[]);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      recipes,
      bySlug: new Map(recipes.map((r) => [r.slug, r])),
      ready,
    }),
    [recipes, ready]
  );

  return <LiveCatalogContext.Provider value={value}>{children}</LiveCatalogContext.Provider>;
}

export function useLiveCatalog() {
  return useContext(LiveCatalogContext);
}

export function useLiveRecipe(fallback: Recipe): Recipe {
  const { bySlug } = useLiveCatalog();
  return bySlug.get(fallback.slug) ?? fallback;
}

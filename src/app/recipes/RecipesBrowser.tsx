"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Recipe } from "@/lib/recipes";

export default function RecipesBrowser({ recipes }: { recipes: Recipe[] }) {
  const categories = useMemo(
    () => Array.from(new Set(recipes.map((recipe) => recipe.category))),
    [recipes]
  );
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const inCat = active === "All" || recipe.category === active;
      if (!inCat) return false;
      if (!needle) return true;
      return (
        recipe.title.toLowerCase().includes(needle) ||
        recipe.summary.toLowerCase().includes(needle) ||
        recipe.category.toLowerCase().includes(needle)
      );
    });
  }, [recipes, query, active]);

  const groups = useMemo(() => {
    const map = new Map<string, Recipe[]>();
    for (const recipe of filtered) {
      const list = map.get(recipe.category) ?? [];
      list.push(recipe);
      map.set(recipe.category, list);
    }
    return categories
      .filter((category) => map.has(category))
      .map((category) => [category, map.get(category)!] as const);
  }, [filtered, categories]);

  return (
    <>
      <div className="filters">
        <input
          className="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the book — brisket, mop, gator…"
          aria-label="Search recipes"
        />
        <div className="chips">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              className={category === active ? "chip on" : "chip"}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <p className="count">
          {filtered.length} cook{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      {groups.map(([category, items]) => (
        <section className="stack" key={category}>
          <h2>{category}</h2>
          <div className="grid">
            {items.map((recipe) => (
              <Link className="card" key={recipe.slug} href={`/recipes/${recipe.slug}`}>
                <img className="card-photo" src={`/food/${recipe.slug}?v=6`} alt={recipe.title} />
                <p className="meta">{recipe.category}</p>
                <h2>{recipe.title}</h2>
                <p>{recipe.summary}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {filtered.length === 0 ? (
        <p className="lede">Nothing on that pit sheet. Try another word.</p>
      ) : null}
    </>
  );
}

"use client";
import { useState } from "react";
import { addGroceries } from "@/components/GroceryList";
export default function GroceryButton({ items, recipeTitle }: { items: string[]; recipeTitle: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  function add() {
    const n = addGroceries(items.map((text) => ({ text, from: recipeTitle })));
    setMsg(n > 0 ? `${n} added to your grocery list` : "Already on your list");
    setTimeout(() => setMsg(null), 2500);
  }
  return (
    <span className="inline-flex items-center gap-2">
      <button onClick={add} className="rounded-full border border-ember/50 px-3 py-1.5 text-sm text-cream hover:bg-ember/10">
        🛒 Add ingredients to grocery list
      </button>
      {msg && <span className="text-sm text-ember">{msg}</span>}
    </span>
  );
}

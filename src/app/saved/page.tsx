"use client";
import { useEffect, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import { getSaved } from "@/components/SaveButton";
import {
  getGrocery, toggleGrocery, removeGrocery, clearCheckedGrocery, clearGrocery,
  addGroceries, type GroceryItem,
} from "@/components/GroceryList";
import { useLiveCatalog } from "@/components/LiveCatalog";

function GroceryTab() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [draft, setDraft] = useState("");
  const refresh = () => setItems(getGrocery());
  useEffect(refresh, []);
  function addManual() {
    const t = draft.trim();
    if (!t) return;
    addGroceries([{ text: t }]);
    setDraft("");
    refresh();
  }
  const remaining = items.filter((i) => !i.checked).length;
  return (
    <div className="mt-10">
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addManual()}
          placeholder="Add an item…"
          className="min-w-0 flex-1 rounded-xl border border-white/15 bg-bark px-4 py-2.5 text-cream placeholder:text-subtle"
        />
        <button onClick={addManual} className="shrink-0 rounded-xl bg-ember px-4 py-2.5 font-semibold text-ink">Add</button>
      </div>
      {items.length === 0 ? (
        <p className="mt-10 text-subtle">Your list is empty. Open any recipe and hit “Add ingredients to grocery list.”</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-subtle">{remaining} to get · {items.length - remaining} in the cart</p>
          <ul className="mt-3 space-y-2">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-bark px-4 py-3">
                <input type="checkbox" checked={i.checked} onChange={() => { toggleGrocery(i.id); refresh(); }} className="h-5 w-5 shrink-0 accent-ember" />
                <div className="min-w-0 flex-1">
                  <p className={i.checked ? "text-subtle line-through" : "text-cream"}>{i.text}</p>
                  {i.from && <p className="text-xs text-subtle">from {i.from}</p>}
                </div>
                <button onClick={() => { removeGrocery(i.id); refresh(); }} aria-label="Remove" className="shrink-0 text-subtle hover:text-cream">✕</button>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-4 text-sm">
            <button onClick={() => { clearCheckedGrocery(); refresh(); }} className="text-subtle hover:text-cream">Clear checked</button>
            <button onClick={() => { if (confirm("Clear the whole list?")) { clearGrocery(); refresh(); } }} className="text-subtle hover:text-cream">Clear all</button>
          </div>
        </>
      )}
    </div>
  );
}

export default function SavedPage() {
  const [tab, setTab] = useState<"saved" | "grocery">("saved");
  const [slugs, setSlugs] = useState<string[]>([]);
  const { recipes } = useLiveCatalog();
  useEffect(() => setSlugs(getSaved()), []);
  const list = recipes.filter((r) => slugs.includes(r.slug));
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">This device</p>
      <h1 className="mt-2 font-display text-5xl italic">Saved</h1>
      <p className="mt-3 text-parchment/80">Cooks you marked and your grocery list. Lives in the browser, not the cloud.</p>
      <div className="mt-6 flex gap-2">
        {(["saved", "grocery"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-sm ${tab === t ? "bg-ember font-semibold text-ink" : "border border-white/15 text-parchment hover:border-ember"}`}
          >
            {t === "saved" ? "Saved cooks" : "Grocery list"}
          </button>
        ))}
      </div>
      {tab === "saved" ? (
        list.length === 0 ? <p className="mt-10 text-subtle">Nothing saved yet. Open a cook and hit Save.</p> : (
          <div className="mt-10 grid gap-0 sm:grid-cols-2 lg:grid-cols-3">{list.map((r) => <RecipeCard key={r.slug} recipe={r} />)}</div>
        )
      ) : <GroceryTab />}
    </main>
  );
}

"use client";
const KEY = "ember-grocery";
export interface GroceryItem { id: string; text: string; checked: boolean; from?: string }
export function getGrocery(): GroceryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw : [];
  } catch { return []; }
}
function save(list: GroceryItem[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
export function addGroceries(items: { text: string; from?: string }[]): number {
  const cur = getGrocery();
  const have = new Set(cur.map((i) => i.text.toLowerCase()));
  const fresh = items.filter((i) => !have.has(i.text.toLowerCase()));
  const stamped = fresh.map((i) => ({ ...i, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, checked: false }));
  save([...cur, ...stamped]);
  return stamped.length;
}
export function toggleGrocery(id: string) {
  save(getGrocery().map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)));
}
export function removeGrocery(id: string) {
  save(getGrocery().filter((i) => i.id !== id));
}
export function clearCheckedGrocery() {
  save(getGrocery().filter((i) => !i.checked));
}
export function clearGrocery() {
  save([]);
}

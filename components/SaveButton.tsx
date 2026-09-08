"use client";
import { useEffect, useState } from "react";
const KEY = "ember-saved";
export function getSaved(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}
export default function SaveButton({ slug }: { slug: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(getSaved().includes(slug)), [slug]);
  function toggle() {
    const cur = getSaved();
    const next = cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug];
    localStorage.setItem(KEY, JSON.stringify(next));
    setOn(!on);
  }
  return (
    <button onClick={toggle} className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-sm text-parchment hover:border-ember">{on ? "Saved" : "Save"}</button>
  );
}

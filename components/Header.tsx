"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
const links = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/desserts", label: "Dessert" },
  { href: "/wisdom", label: "Tips" },
  { href: "/guide", label: "Guide" },
  { href: "/saved", label: "Saved" },
];
export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-xl tracking-tight text-cream" onClick={() => setOpen(false)}>
          Smoke <span className="text-ember">&#9670;</span> <span className="italic">Ember</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-parchment/80 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={path === l.href ? "text-cream" : "hover:text-cream transition-colors"}>{l.label}</Link>
          ))}
        </nav>
        <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-md text-cream md:hidden" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          <span className="text-lg">{open ? "\u2715" : "\u2630"}</span>
        </button>
      </div>
      {open && (
        <nav className="grid gap-1 border-t border-white/5 px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`min-h-11 rounded-md px-2 py-2 text-base ${path === l.href ? "text-cream" : "text-parchment"}`}>{l.label}</Link>
          ))}
        </nav>
      )}
    </header>
  );
}

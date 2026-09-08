"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-xl tracking-tight text-cream">
          Smoke <span className="text-ember">&#9670;</span> <span className="italic">Ember</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-parchment/80">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={path === l.href ? "text-cream" : "hover:text-cream transition-colors"}>{l.label}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

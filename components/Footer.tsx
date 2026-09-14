"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 10 9-7 9 7v10H4V10" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    href: "/recipes",
    label: "Recipes",
    icon: (
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4v16M10 5l2 14M17 4v16M21 6l-2 12" />
      </svg>
    ),
  },
  {
    href: "/desserts",
    label: "Dessert",
    icon: (
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 10h14l-1.5 10h-11L5 10Z" />
        <path d="M8 10c0-3 1.8-5 4-5s4 2 4 5M4 20h16" />
      </svg>
    ),
  },
  {
    href: "/wisdom",
    label: "Tips",
    icon: (
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 5c3-1 6 0 9 2v13c-3-2-6-3-9-2V5ZM21 5c-3-1-6 0-9 2v13c3-2 6-3 9-2V5Z" />
      </svg>
    ),
  },
  {
    href: "/guide",
    label: "Guide",
    icon: (
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 3c1 4-2 5-1 8 1-2 3-2 4-4 3 3 4 6 2 10-2 4-9 5-12 1-3-4 0-8 3-11 0 3 1 4 2 4-1-3 0-6 2-8Z" />
      </svg>
    ),
  },
  {
    href: "/saved",
    label: "Saved",
    icon: (
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3h12v18l-6-4-6 4V3Z" />
      </svg>
    ),
  },
];

function isActive(path: string, href: string) {
  if (href === "/") return path === "/";
  return path === href || path.startsWith(`${href}/`);
}

export default function Footer() {
  const path = usePathname();
  return (
    <>
      <footer className="mt-20 hidden border-t border-white/5 md:block">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-subtle md:flex-row md:items-center md:justify-between">
          <p className="font-display italic text-cream/80">Smoke &#9670; Ember</p>
          <p>You run the fire. This is a guide, not a food-safety inspector.</p>
          <div className="flex gap-4">
            <Link href="/recipes" className="hover:text-cream">Recipes</Link>
            <Link href="/wisdom" className="hover:text-cream">Fire school</Link>
            <Link href="/guide" className="hover:text-cream">Guide</Link>
          </div>
        </div>
      </footer>
      <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-6 border-t border-white/10 bg-ink/95 pb-[max(.35rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md md:hidden">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 text-[11px] ${isActive(path, item.href) ? "text-ember-hot" : "text-subtle"}`}
          >
            <span aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

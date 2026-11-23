"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import InstallAppButton from "@/components/InstallAppButton";
import ShareButton from "@/components/ShareButton";

const links = [
  { href: "/recipes", label: "Recipes" },
  { href: "/desserts", label: "Desserts" },
  { href: "/wild-game", label: "Wild Game" },
  { href: "/breads", label: "Breads" },
  { href: "/wisdom", label: "Tips" },
  { href: "/cooks", label: "My Cooks" },
];

export default function Header() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-3 px-7 sm:h-20 sm:px-4">
        <Link href="/" className="font-display text-[28px] font-medium italic tracking-tight text-cream sm:text-3xl">
          Smoke <img src="/ember.svg" alt="" className="mx-2 inline h-8 w-6 object-contain" /> Ember
        </Link>
        <div className="flex items-center gap-2">
          <ShareButton />
          <InstallAppButton />
        </div>
      </div>
      <nav aria-label="Site" className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm ${path === l.href || path.startsWith(`${l.href}/`) ? "bg-ember text-cream" : "text-parchment hover:text-cream"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}

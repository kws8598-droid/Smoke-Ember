"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center px-7 sm:h-20 sm:px-4">
        <Link href="/" className="font-display text-[28px] font-medium italic tracking-tight text-cream sm:text-3xl">
          Smoke <img src="/ember.svg" alt="" className="mx-2 inline h-8 w-6 object-contain" /> Ember
        </Link>
      </div>
    </header>
  );
}

"use client";
import Link from "next/link";
import InstallAppButton from "@/components/InstallAppButton";
import ShareButton from "@/components/ShareButton";

export default function Header() {
  const homeUrl = typeof window === "undefined" ? "https://smoke-ember.vercel.app" : window.location.origin;
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-3 px-7 sm:h-20 sm:px-4">
        <Link href="/" className="font-display text-[28px] font-medium italic tracking-tight text-cream sm:text-3xl">
          Smoke <img src="/ember.svg" alt="" className="mx-2 inline h-8 w-6 object-contain" /> Ember
        </Link>
        <div className="flex items-center gap-2">
          <ShareButton
            title="Smoke and Ember"
            text="Pull up a chair."
            url={homeUrl}
          />
          <InstallAppButton />
        </div>
      </div>
    </header>
  );
}

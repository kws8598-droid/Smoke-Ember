"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ fallback = "/" }: { fallback?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        const cameFromSite =
          typeof document !== "undefined" &&
          document.referrer.startsWith(window.location.origin);
        if (cameFromSite) router.back();
        else router.push(fallback);
      }}
      className="inline-flex items-center rounded-full bg-black/50 px-4 py-2 text-sm font-semibold text-cream hover:bg-black/70"
    >
      ← Back
    </button>
  );
}

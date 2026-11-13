"use client";

import { useRouter } from "next/navigation";

export default function BackButton({ fallback = "/" }: { fallback?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") {
          try {
            if (window.sessionStorage.getItem("ember:inApp") === "1") {
              router.back();
              return;
            }
          } catch {
            // Storage unavailable — fall through to the fallback.
          }
        }
        router.push(fallback);
      }}
      className="inline-flex items-center rounded-full bg-black/50 px-4 py-2 text-sm font-semibold text-cream hover:bg-black/70"
    >
      ← Back
    </button>
  );
}

"use client";
import { useEffect, useState } from "react";

const SEEN_KEY = "se-visit-counted";

// Small footer counter: counts one visit per browser session,
// then just reads the total. Best-effort — stays hidden if the
// counter table isn't set up yet.
export default function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    let counted = false;
    try {
      counted = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      counted = false;
    }
    (async () => {
      try {
        const res = await fetch("/api/visits", {
          method: counted ? "GET" : "POST",
          cache: "no-store",
        });
        if (!res.ok) return;
        const body: { count?: unknown } = await res.json();
        if (cancelled) return;
        if (typeof body.count === "number") {
          setCount(body.count);
          if (!counted) {
            try {
              sessionStorage.setItem(SEEN_KEY, "1");
            } catch {
              /* ignore */
            }
          }
        }
      } catch {
        /* silent: counter is decorative */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;
  return (
    <p className="text-sm text-subtle">
      <span aria-hidden="true">🔥 </span>
      {count.toLocaleString("en-US")} visits to the pit
    </p>
  );
}

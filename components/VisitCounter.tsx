"use client";
import { useEffect, useState } from "react";

const SEEN_KEY = "se-visit-counted";

// The counter is mounted twice (desktop + mobile footer) but CSS hides one.
// This dedupes the in-flight request so a fresh session increments exactly once.
let inflight: Promise<number | null> | null = null;

function fetchCount(increment: boolean): Promise<number | null> {
  if (!inflight) {
    const p: Promise<number | null> = (async () => {
      try {
        const res = await fetch("/api/visits", {
          method: increment ? "POST" : "GET",
          cache: "no-store",
        });
        if (!res.ok) return null;
        const body: { count?: unknown } = await res.json();
        return typeof body.count === "number" ? body.count : null;
      } catch {
        return null;
      }
    })();
    inflight = p.finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

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
    const shouldIncrement = !counted;
    if (shouldIncrement) {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
    }
    fetchCount(shouldIncrement).then((c) => {
      if (!cancelled && c !== null) setCount(c);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;
  return (
    <p className="text-sm text-subtle">
      <span aria-hidden="true">🔥 </span>
      {count.toLocaleString("en-US")} visit{count === 1 ? "" : "s"} to the pit
    </p>
  );
}

"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type WakeLockSentinel = { release: () => Promise<void> };

/**
 * Keeps the screen awake while cooking via the Wake Lock API.
 * Toggles on/off. The browser releases the lock whenever the tab hides
 * (app switch, lock screen), so coming back re-acquires it — otherwise
 * the button would say "Awake" while the screen sleeps. A failed tap
 * leaves the button in place to try again instead of vanishing.
 */
export default function WakeLockButton() {
  const [awake, setAwake] = useState(false);
  const [supported, setSupported] = useState(true);
  const lock = useRef<WakeLockSentinel | null>(null);

  const acquire = useCallback(async () => {
    try {
      const nav = navigator as Navigator & {
        wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinel> };
      };
      const sentinel = await nav.wakeLock?.request("screen");
      if (!sentinel) {
        setAwake(false);
        return false;
      }
      lock.current = sentinel;
      setAwake(true);
      return true;
    } catch {
      setAwake(false);
      return false;
    }
  }, []);

  useEffect(() => {
    if (!("wakeLock" in navigator)) setSupported(false);
    return () => {
      lock.current?.release().catch(() => {});
      lock.current = null;
    };
  }, []);

  useEffect(() => {
    if (!awake) return;
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        acquire().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [awake, acquire]);

  async function toggle() {
    if (awake) {
      await lock.current?.release().catch(() => {});
      lock.current = null;
      setAwake(false);
      return;
    }
    await acquire();
  }

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-sm print:hidden ${
        awake
          ? "border-ember bg-ember/20 text-ember-hot"
          : "border-white/15 text-parchment hover:border-ember"
      }`}
    >
      {awake ? "Awake ✓" : "Keep awake"}
    </button>
  );
}

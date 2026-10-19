"use client";
import { useEffect, useRef, useState } from "react";

type WakeLockSentinel = { release: () => Promise<void> };

/**
 * Keeps the screen awake while cooking via the Wake Lock API.
 * Toggles on/off; releases automatically when the tab hides.
 */
export default function WakeLockButton() {
  const [awake, setAwake] = useState(false);
  const [supported, setSupported] = useState(true);
  const lock = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!("wakeLock" in navigator)) setSupported(false);
    return () => {
      lock.current?.release().catch(() => {});
      lock.current = null;
    };
  }, []);

  async function toggle() {
    if (awake) {
      await lock.current?.release().catch(() => {});
      lock.current = null;
      setAwake(false);
      return;
    }
    try {
      const nav = navigator as Navigator & {
        wakeLock?: { request: (type: "screen") => Promise<WakeLockSentinel> };
      };
      lock.current = (await nav.wakeLock?.request("screen")) ?? null;
      if (lock.current) {
        setAwake(true);
      } else {
        setSupported(false);
      }
    } catch {
      setSupported(false);
    }
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

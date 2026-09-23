"use client";
import { useState } from "react";

type Props = {
  title: string;
  text?: string;
  /** Full URL to share. Defaults to the current page. */
  url?: string;
};

/**
 * Opens the device's native share sheet (Android share menu, etc.).
 * Falls back to copying the link when Web Share isn't available.
 */
export default function ShareButton({ title, text, url }: Props) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const shareUrl = url ?? window.location.href;
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share({ title, text: text ?? title, url: shareUrl });
      } catch {
        /* user dismissed the share sheet — nothing to do */
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link to share:", shareUrl);
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-sm text-parchment hover:border-ember"
    >
      {copied ? "Copied!" : "Share"}
    </button>
  );
}

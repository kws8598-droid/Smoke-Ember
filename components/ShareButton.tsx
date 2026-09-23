"use client";
import { useState } from "react";

type Props = {
  title: string;
  text?: string;
  /** Full URL to share. Defaults to the current page. */
  url?: string;
};

/**
 * Opens the device's native share sheet.
 * Falls back to copying the link.
 */
export default function ShareButton({ title, text, url }: Props) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const shareUrl = url ?? window.location.href;
    const payload = { title, text, url: shareUrl };

    if (typeof navigator.share === "function") {
      const canShare =
        typeof navigator.canShare !== "function" || navigator.canShare(payload);
      if (canShare) {
        try {
          await navigator.share(payload);
          return;
        } catch (err) {
          if (err instanceof DOMException && err.name === "AbortError") return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", shareUrl);
    }
  }

  return (
    <button
      type="button"
      onClick={() => {
        void onShare();
      }}
      className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-sm text-parchment hover:border-ember"
    >
      {copied ? "Copied" : "Share"}
    </button>
  );
}

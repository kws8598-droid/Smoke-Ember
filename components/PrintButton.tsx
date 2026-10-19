"use client";

/**
 * Opens the browser's print dialog. Print CSS in globals.css
 * strips the page down to a clean, ink-friendly recipe.
 */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-sm text-parchment hover:border-ember"
    >
      Print
    </button>
  );
}

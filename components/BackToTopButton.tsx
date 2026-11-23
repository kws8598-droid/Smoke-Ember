"use client";

export default function BackToTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-flex h-11 items-center rounded-full bg-ember px-5 text-sm text-cream hover:bg-ember-hot"
    >
      Back to top ↑
    </button>
  );
}

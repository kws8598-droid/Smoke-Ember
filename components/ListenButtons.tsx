"use client";

// Buttons on the homepage "Listen at the pit" cards. They start the single
// persistent player in the layout (PlayerBar) instead of playing their own
// copy, so the sound keeps going when you click to another page.
export function RadioPlayButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("smoke-ember:play-radio"))}
      className="mt-4 inline-flex items-center rounded-full bg-ember px-5 py-2 text-sm font-semibold text-cream hover:bg-ember-hot"
    >
      ▶ Play Halloween Radio
    </button>
  );
}

export function PodcastShowButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("smoke-ember:show-podcast"))}
      className="mt-4 inline-flex items-center rounded-full bg-ember px-5 py-2 text-sm font-semibold text-cream hover:bg-ember-hot"
    >
      ▶ Play the podcast
    </button>
  );
}

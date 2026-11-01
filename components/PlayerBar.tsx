"use client";

import { useEffect, useRef, useState } from "react";

const CHRISTMAS_STREAM = "https://bigrradio.cdnstream1.com/5190_128";
const PODCAST_EMBED = "https://embed.podcasts.apple.com/us/podcast/howtobbqright/id1372347504";

// A single persistent player that lives in the site layout, so it keeps
// playing while you click between pages (the layout does not remount on
// in-app navigation). The homepage cards start this same player — there is
// only ever one radio and one podcast playing.
// The podcast panel is collapsed with height 0, never unmounted, so hiding
// it does not stop playback. A full page refresh still restarts playback.
export default function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [podcastOpen, setPodcastOpen] = useState(false);
  const [showChristmas, setShowChristmas] = useState(false);

  useEffect(() => {
    // Christmas Classics is a November/December feature: it arrives with
    // the Christmas music on November 1. Checked on the visitor's own clock.
    setShowChristmas(new Date() >= new Date(2026, 10, 1));
    const playRadio = () => {
      audioRef.current?.play().catch(() => {});
    };
    const showPodcast = () => setPodcastOpen(true);
    window.addEventListener("smoke-ember:play-radio", playRadio);
    window.addEventListener("smoke-ember:show-podcast", showPodcast);
    return () => {
      window.removeEventListener("smoke-ember:play-radio", playRadio);
      window.removeEventListener("smoke-ember:show-podcast", showPodcast);
    };
  }, []);

  const toggleRadio = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 print:hidden">
      <div className={`mx-auto max-w-6xl px-4 ${podcastOpen ? "" : "h-0 overflow-hidden"}`}>
        <iframe
          allow="autoplay *; encrypted-media *; fullscreen *"
          frameBorder="0"
          height="450"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          src={PODCAST_EMBED}
          className="w-full rounded-t-2xl border border-white/10 border-b-0 bg-bark"
          title="HowToBBQRight Podcast"
        />
      </div>
      <div className="border-t border-white/10 bg-ink/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
          {showChristmas && (
            <button
              type="button"
              onClick={toggleRadio}
              aria-label="Play or pause Christmas Classics"
              className="inline-flex items-center rounded-full bg-ember px-4 py-2 text-sm font-semibold text-cream hover:bg-ember-hot"
            >
              {radioPlaying ? "❚❚ Christmas Classics" : "▶ Christmas Classics"}
            </button>
          )}
          <button
            type="button"
            onClick={() => setPodcastOpen((o) => !o)}
            aria-label="Show or hide the HowToBBQRight podcast player"
            className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm text-parchment hover:text-cream"
          >
            HowToBBQRight Podcast {podcastOpen ? "▲" : "▼"}
          </button>
          <span className="text-xs text-subtle">Streams from the stations — costs the site nothing.</span>
        </div>
      </div>
      <audio ref={audioRef} preload="none" src={CHRISTMAS_STREAM} onPlay={() => setRadioPlaying(true)} onPause={() => setRadioPlaying(false)} />
    </div>
  );
}

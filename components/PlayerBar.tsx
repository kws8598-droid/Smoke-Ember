"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";

const CHRISTMAS_STREAM = "https://bigrradio.cdnstream1.com/5190_128";
const BLUEGRASS_PICKS = [
  { title: "Blue Moon of Kentucky", artist: "Bill Monroe", id: "xtpiqdN2lJk" },
  { title: "How Mountain Girls Can Love", artist: "The Stanley Brothers", id: "dZVqClIwVOM" },
  { title: "Little Maggie", artist: "The Stanley Brothers", id: "kFECy0CgFLQ" },
  { title: "Train 45", artist: "The Stanley Brothers", id: "_9KEIBHsxEo" },
  { title: "I'm a Man of Constant Sorrow", artist: "The Stanley Brothers", id: "jgyu2c-JBlc" },
  { title: "Mountain Dew", artist: "The Stanley Brothers", id: "x81du4NMHZ0" },
  { title: "You'll Never Leave Harlan Alive", artist: "Patty Loveless", id: "MjFcllICjUc" },
];

// A single persistent player that lives in the site layout, so it keeps
// playing while you click between pages (the layout does not remount on
// in-app navigation). The picks panel is collapsed with height 0, never
// unmounted, so hiding it does not stop playback. A full page refresh
// still restarts playback.
export default function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [radioPlaying, setRadioPlaying] = useState(false);
  const [picksOpen, setPicksOpen] = useState(false);
  const [currentPick, setCurrentPick] = useState(BLUEGRASS_PICKS[0]);
  const [showChristmas, setShowChristmas] = useState(false);
  const [currentStream, setCurrentStream] = useState(CHRISTMAS_STREAM);

  useEffect(() => {
    // Christmas Classics is a November/December feature: it arrives with
    // the Christmas music on November 1. Checked on the visitor's own clock.
    setShowChristmas(new Date() >= new Date(2026, 10, 1));
    const playRadio = () => {
      audioRef.current?.play().catch(() => {});
    };
    window.addEventListener("smoke-ember:play-radio", playRadio);
    return () => {
      window.removeEventListener("smoke-ember:play-radio", playRadio);
    };
  }, []);

  // One audio element: tapping the station plays it, tapping it again pauses.
  const playStream = (url: string) => {
    const a = audioRef.current;
    if (!a) return;
    if (currentStream === url) {
      if (a.paused) a.play().catch(() => {});
      else a.pause();
      return;
    }
    setCurrentStream(url);
    a.src = url;
    a.play().catch(() => {});
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 print:hidden">
      
      
      <div className={`mx-auto max-w-6xl px-4 ${picksOpen ? "" : "h-0 overflow-hidden"}`}>
        <div className="rounded-t-2xl border border-white/10 border-b-0 bg-bark">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            frameBorder="0"
            height="315"
            src={`https://www.youtube.com/embed/${currentPick.id}`}
            className="w-full bg-bark"
            title={`${currentPick.title} — ${currentPick.artist}`}
          />
          <div className="flex flex-wrap gap-2 px-3 pb-3">
            {BLUEGRASS_PICKS.map((pick) => (
              <button
                key={pick.id}
                type="button"
                onClick={() => {
                  track("play_pick", { song: pick.title, artist: pick.artist });
                  setCurrentPick(pick);
                }}
                aria-label={`Play ${pick.title} by ${pick.artist}`}
                className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs ${
                  currentPick.id === pick.id
                    ? "border-ember bg-ember font-semibold text-cream"
                    : "border-white/15 text-parchment hover:text-cream"
                }`}
              >
                {pick.title} — {pick.artist}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-ink/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
          {showChristmas && (
            <button
              type="button"
              onClick={() => playStream(CHRISTMAS_STREAM)}
              aria-label="Play or pause Christmas Classics"
              className="inline-flex items-center rounded-full bg-ember px-4 py-2 text-sm font-semibold text-cream hover:bg-ember-hot"
            >
              {radioPlaying && currentStream === CHRISTMAS_STREAM ? "❚❚ Christmas Classics" : "▶ Christmas Classics"}
            </button>
          )}
          
          
          
          <button
            type="button"
            onClick={() => {
              if (!picksOpen) track("open_bluegrass_picks", {});
              setPicksOpen((o) => !o);
            }}
            aria-label="Show or hide the bluegrass picks playlist"
            className="inline-flex items-center rounded-full border border-white/15 px-4 py-2 text-sm text-parchment hover:text-cream"
          >
            Bluegrass Picks {picksOpen ? "▲" : "▼"}
          </button>
          <span className="text-xs text-subtle">Streams from the stations — costs the site nothing.</span>
        </div>
      </div>
      <audio
        ref={audioRef}
        preload="none"
        src={currentStream}
        onPlay={() => {
          setRadioPlaying(true);
          track("play_station", { station: "Christmas Classics" });
        }}
        onPause={() => setRadioPlaying(false)}
      />
    </div>
  );
}

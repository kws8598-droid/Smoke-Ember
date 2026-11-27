// A real Christmas tree standing in the snowy backdrop behind the homepage
// content — a photograph of a snow-covered tree with colored lights, blended
// over the dark background so the black night sky disappears into it.
// Colored lights twinkle on it and snow falls on it. Pure CSS motion —
// no video, no data cost. The photo itself is a plain <img>, not the
// optimizer, so it costs no image transformations either.
const COLORS = ["#ff4d4d", "#34d399", "#fbbf24", "#38bdf8", "#f472b6", "#fef3c7"];

// Twinkle bulbs placed on the tree's tiers (left/top as % of the tree box).
const BULBS: Array<[number, number]> = [
  [50, 22],
  [44, 30], [56, 30],
  [38, 38], [50, 38], [62, 38],
  [34, 46], [46, 46], [58, 46], [68, 46],
  [32, 54], [44, 54], [56, 54], [68, 54],
  [30, 62], [42, 62], [54, 62], [66, 62],
  [28, 70], [40, 70], [52, 70], [64, 70], [74, 70],
  [26, 78], [38, 78], [50, 78], [62, 78], [74, 78],
  [30, 86], [44, 86], [58, 86], [70, 86],
];

// Snowflakes falling on the tree (left % / size px / duration s / delay s).
const FLAKES: Array<[number, number, number, number]> = [
  [6, 4, 13, 0], [12, 3, 11, 2.5], [18, 5, 15, 1], [24, 3, 10, 4],
  [30, 4, 14, 0.5], [36, 6, 16, 3], [42, 3, 11, 1.5], [48, 4, 12, 5],
  [54, 5, 15, 2], [60, 3, 10, 0.8], [66, 4, 13, 3.5], [72, 6, 16, 1.2],
  [78, 3, 11, 4.5], [84, 4, 14, 0.3], [90, 5, 12, 2.8], [95, 3, 10, 1.8],
  [21, 4, 12, 6], [57, 5, 14, 6.5], [81, 4, 11, 7], [45, 3, 13, 7.5],
];

export default function ChristmasTree() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 flex justify-center overflow-hidden">
      <style>{`
        @keyframes ember-twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes ember-snow {
          0% { top: -2%; opacity: 0; }
          8% { opacity: 0.9; }
          92% { opacity: 0.9; }
          100% { top: 102%; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ember-bulb, .ember-flake { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
      <div className="relative h-[1000px] w-[min(115vw,680px)] shrink-0">
        <img
          src="/images/christmas-tree.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-contain mix-blend-screen"
        />
        {BULBS.map(([left, top], i) => {
          const color = COLORS[i % COLORS.length];
          const delay = (i % 7) * 0.23;
          const duration = 1.6 + ((i * 37) % 10) / 10;
          return (
            <span
              key={i}
              className="ember-bulb absolute block h-3 w-3 rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                background: color,
                boxShadow: `0 0 10px 2px ${color}`,
                transform: "translate(-50%, -50%)",
                animation: `ember-twinkle ${duration}s ease-in-out ${delay}s infinite`,
              }}
            />
          );
        })}
        {FLAKES.map(([left, size, duration, delay], i) => (
          <span
            key={`f${i}`}
            className="ember-flake absolute block rounded-full bg-white"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animation: `ember-snow ${duration}s linear ${delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

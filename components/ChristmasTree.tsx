// A big Christmas tree standing in the snowy backdrop behind the homepage
// content, with colored lights that twinkle and snow falling on it.
// Pure CSS motion — no images, no video, no data cost.
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
        <svg viewBox="0 0 400 620" className="absolute inset-0 h-full w-full">
          <rect x="185" y="560" width="30" height="55" fill="#5b3a1e" />
          <polygon points="200,60 155,180 245,180" fill="#166534" />
          <polyline points="158,178 175,186 190,178 205,187 220,178 238,186 244,178" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
          <polygon points="200,130 130,280 270,280" fill="#15803d" />
          <polyline points="134,278 150,286 168,278 185,287 202,278 220,286 238,278 254,286 268,278" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
          <polygon points="200,210 105,380 295,380" fill="#14532d" />
          <polyline points="110,378 128,386 146,378 165,387 184,378 202,386 221,378 240,387 258,378 276,386 292,378" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
          <polygon points="200,300 75,480 325,480" fill="#166534" />
          <polyline points="80,478 100,486 120,478 140,487 160,478 180,486 200,478 220,487 240,478 260,486 280,478 300,486 320,478" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
          <polygon points="200,390 50,570 350,570" fill="#15803d" />
          <polyline points="56,568 76,576 96,568 116,577 136,568 156,576 176,568 196,577 216,568 236,576 256,568 276,577 296,568 316,576 336,568" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
          <polygon points="200,8 207,24 224,24 210,35 215,52 200,42 185,52 190,35 176,24 193,24" fill="#fbbf24" />
        </svg>
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

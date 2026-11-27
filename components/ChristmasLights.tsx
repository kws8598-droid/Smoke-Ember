// A strand of colored Christmas lights draped across the top of the
// Christmas section, twinkling on the snowy backdrop. Pure CSS twinkle —
// no images, no JavaScript timers.
const COLORS = ["#ff4d4d", "#34d399", "#fbbf24", "#38bdf8", "#f472b6", "#fef3c7"];
const COUNT = 24;

// Wire: two gentle sags across a 1200-wide viewBox, 60 tall.
// y(x) follows the same quadratic curves as the SVG path below.
function wireY(x: number): number {
  const t = x <= 600 ? x / 600 : (x - 600) / 600;
  return (1 - t) * (1 - t) * 6 + 2 * (1 - t) * t * 54 + t * t * 6;
}

export default function ChristmasLights() {
  const bulbs = Array.from({ length: COUNT }, (_, i) => {
    const x = ((i + 0.5) / COUNT) * 1200;
    const y = wireY(x);
    const color = COLORS[i % COLORS.length];
    const delay = (i % 7) * 0.23;
    const duration = 1.6 + ((i * 37) % 10) / 10;
    return { x, y, color, delay, duration };
  });
  return (
    <div aria-hidden className="relative h-16 w-full overflow-hidden">
      <style>{`
        @keyframes ember-twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ember-bulb { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d="M0,6 Q300,54 600,6 T1200,6" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      </svg>
      {bulbs.map((b, i) => (
        <span
          key={i}
          className="ember-bulb absolute block h-3.5 w-3 rounded-b-full"
          style={{
            left: `${(b.x / 1200) * 100}%`,
            top: `${b.y}px`,
            background: b.color,
            boxShadow: `0 0 10px 2px ${b.color}`,
            transform: "translateX(-50%)",
            animation: `ember-twinkle ${b.duration}s ease-in-out ${b.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

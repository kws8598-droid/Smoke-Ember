// Kelly's Christmas tree video standing in the snowy backdrop behind the
// homepage content — a real snowy tree on a hillside out in the country,
// lights twinkling, with our falling snow over it. Muted autoplay loop,
// about 1 MB. The GIF it replaced is still in public/images if we ever
// want it back.
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
        @keyframes ember-snow {
          0% { top: -2%; opacity: 0; }
          8% { opacity: 0.9; }
          92% { opacity: 0.9; }
          100% { top: 102%; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ember-flake { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
      <div className="relative h-[700px] w-[min(115vw,680px)] shrink-0">
        <video
          src="/images/christmas-tree.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover mix-blend-screen blur-[3px]"
        />
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

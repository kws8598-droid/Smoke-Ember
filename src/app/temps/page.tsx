import Link from "next/link";

const rows: [string, string, string, string][] = [
  ["Pork Butt (pulled)", "225–250°F", "200–205°F, probe tender", "1.5–2 hrs/lb"],
  ["Brisket", "225–250°F", "200–205°F, probe tender", "1–1.5 hrs/lb"],
  ["Beef Ribs", "225–250°F", "200–205°F, probe tender", "6–8 hrs"],
  ["Spare Ribs", "225–250°F", "195–203°F, bend test", "5–6 hrs total"],
  ["Baby Back Ribs", "225–250°F", "195–203°F", "4–5 hrs total"],
  ["Whole Chicken", "275–325°F", "165°F breast", "2–4 hrs"],
  ["Chicken Thighs & Legs", "275°F", "175°F", "1.5–2 hrs"],
  ["Whole Turkey", "250–300°F", "165°F breast, 175°F thigh", "30–40 min/lb"],
  ["Pork Loin", "225–250°F", "145°F + 3-min rest", "30–45 min/lb"],
  ["Pork Tenderloin", "225–250°F", "145°F + 3-min rest", "~1.5 hrs"],
  ["Tri-Tip", "225–250°F", "130–135°F, rest 15 min", "~1.5–2 hrs"],
  ["Steak", "Hot & fast", "130–135°F med-rare", "Minutes per side"],
  ["Burgers & Sausage", "275°F", "160°F", "~30–45 min"],
  ["Meatloaf", "275°F", "160°F", "~2 hrs"],
  ["Salmon", "225°F", "145°F, flakes", "~1 hr"],
  ["Catfish", "225°F", "145°F, flakes", "~1 hr"],
  ["Shrimp", "225°F", "Opaque & curled", "~30–45 min"],
  ["Venison Backstrap", "225°F", "130–135°F", "~1–1.5 hrs"],
  ["Duck", "275°F", "165°F", "3–4 hrs"],
];

export default function TempsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">Pit reference</p>
      <h1 className="mt-2 font-display text-4xl italic text-cream glow-ember">Smoking Chart</h1>
      <p className="mt-2 max-w-xl text-parchment/85">
        Cook to temp, not to time — times are estimates. Rest everything.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/5">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="bg-bark text-cream">
              <th className="px-4 py-3 font-semibold">Protein</th>
              <th className="px-4 py-3 font-semibold">Smoker Temp</th>
              <th className="px-4 py-3 font-semibold">Done Internal Temp</th>
              <th className="px-4 py-3 font-semibold">Time Estimate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([protein, smoker, done, time], i) => (
              <tr key={protein} className={i % 2 ? "bg-white/[0.02]" : ""}>
                <td className="border-t border-white/5 px-4 py-3 font-medium text-cream">{protein}</td>
                <td className="border-t border-white/5 px-4 py-3 text-parchment/85">{smoker}</td>
                <td className="border-t border-white/5 px-4 py-3 text-ember">{done}</td>
                <td className="border-t border-white/5 px-4 py-3 text-parchment/85">{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 rounded-2xl border border-white/5 bg-bark p-5">
        <p className="text-sm text-parchment/85">
          <span className="font-semibold text-cream">USDA safe mins:</span> Poultry 165°F,
          pork/beef steaks &amp; roasts 145°F (rest 3 min), ground meat 160°F. Pull temps for
          butts and brisket run higher for tenderness. Stuck around 160°F for hours? That&apos;s
          the stall — <Link href="/wisdom/the-stall" className="text-ember hover:text-ember-hot">wait it out or wrap</Link>.
        </p>
      </div>
    </main>
  );
}

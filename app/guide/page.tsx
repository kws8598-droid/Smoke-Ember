import Link from "next/link";
export const metadata = { title: "Guide" };
const schools = [
  { name: "Texas", line: "Salt, pepper, post oak. The meat is the sauce.", href: "/recipes?protein=beef" },
  { name: "Kansas City", line: "Burnt ends, molasses, a glaze that shines under the lights.", href: "/recipes?protein=pork" },
  { name: "The Carolinas", line: "Whole hog, vinegar, mustard if you crossed the river.", href: "/recipes?protein=pork" },
  { name: "Memphis", line: "Dry ribs, a second dusting, sauce on the side for tourists.", href: "/recipes/memphis-dry-ribs" },
  { name: "Alabama", line: "White sauce on smoked chicken. It looks wrong until it doesn't.", href: "/recipes/alabama-white-chicken" },
  { name: "Kentucky", line: "Mutton in Owensboro. Shoulder and a cayenne mop in Monroe County.", href: "/recipes/owensboro-mutton" },
];
export default function GuidePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.22em] text-subtle">How to use this book</p>
      <h1 className="mt-2 font-display text-5xl italic">Guide</h1>
      <div className="mt-8 space-y-6 text-lg leading-relaxed text-parchment/90">
        <p>Pick the clock first. A weeknight is not a packer. An afternoon will take a rack of ribs or a tri-tip. All day is brisket, shoulder, mutton — the cooks that sort you out.</p>
        <p>Then pick the animal. Beef wants oak and patience. Pork will take hickory. Birds like fruitwood. Mesquite is a spice, not a 12-hour fuel.</p>
        <p>Temperature is a rumor. Probe tender is the law. Rest is still cooking. Thin blue smoke or go home.</p>
      </div>
      <h2 className="mt-12 font-display text-3xl italic">Pick a school</h2>
      <div className="mt-6 grid gap-4">{schools.map((s) => (
        <Link key={s.name} href={s.href} className="rounded-2xl border border-white/8 bg-bark p-5 hover:border-ember/40">
          <h3 className="font-display text-2xl text-cream">{s.name}</h3>
          <p className="mt-1 text-parchment/80">{s.line}</p>
        </Link>
      ))}</div>
    </main>
  );
}

import Link from "next/link";
export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-subtle md:flex-row md:items-center md:justify-between">
        <p className="font-display italic text-cream/80">Smoke &#9670; Ember</p>
        <p>You run the fire. This is a guide, not a food-safety inspector.</p>
        <div className="flex gap-4">
          <Link href="/recipes" className="hover:text-cream">Recipes</Link>
          <Link href="/wisdom" className="hover:text-cream">Fire school</Link>
          <Link href="/guide" className="hover:text-cream">Guide</Link>
        </div>
      </div>
    </footer>
  );
}

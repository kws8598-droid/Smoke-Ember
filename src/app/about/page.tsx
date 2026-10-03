import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-ember">About</p>
      <h1 className="mt-2 font-display text-4xl italic text-cream">Smoke &amp; Ember</h1>
      <div className="mt-6 space-y-5 text-parchment/90">
        <p>
          I&apos;m Kelly Simpson, a pitmaster from Lawrenceburg, Kentucky. I got into barbecue the way a lot of folks do — I
          got hurt, got disabled, and found myself watching BBQ Pitmasters thinking, &ldquo;I can do this.&rdquo; So I did.
        </p>
        <p>
          I spent years at the Kentucky State BBQ Festival in Danville, talking with competition pitmasters and learning what
          the fire actually teaches — the stuff that never makes it into a recipe card. The stall, the rest, when to wrap and
          when to leave it alone.
        </p>
        <p>
          This site is everything I&apos;ve learned, written down the way I&apos;d tell it to you across the pit: regional
          barbecue, pitmaster sides, and the tricks the fire actually teaches. Every recipe here is one I&apos;ve cooked or
          built myself — no invented plates.
        </p>
        <p>
          I also wrote the <em>Smoke and Ember</em> cookbook, and this app grew out of the same fire. Pull up a chair.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/recipes" className="rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-ink hover:bg-ember-hot">
          Browse the recipes
        </Link>
        <Link href="/contact" className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-cream hover:border-cream/40">
          Get in touch
        </Link>
      </div>
    </main>
  );
}

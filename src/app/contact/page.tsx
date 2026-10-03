export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-ember">Contact</p>
      <h1 className="mt-2 font-display text-4xl italic text-cream">Say howdy</h1>
      <div className="mt-6 space-y-5 text-parchment/90">
        <p>
          Questions about a recipe, a cook gone sideways, or just want to talk barbecue? The fastest way to reach me is
          email — I read everything, though the pit sometimes keeps me a while.
        </p>
        <p>
          <a href="mailto:kmkj05@yahoo.com" className="font-semibold text-ember hover:text-ember-hot">
            kmkj05@yahoo.com
          </a>
        </p>
        <p className="text-sm text-subtle">
          For anything about the <em>Smoke and Ember</em> cookbook, mention it in the subject line so it doesn&apos;t get
          lost in the smoke.
        </p>
      </div>
    </main>
  );
}

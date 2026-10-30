import BackButton from "@/components/BackButton";

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <BackButton fallback="/" />
      <p className="text-xs uppercase tracking-[0.2em] text-ember">Terms</p>
      <h1 className="mt-2 font-display text-4xl italic text-cream">Terms of Service</h1>
      <p className="mt-2 text-sm text-subtle">Last updated October 30, 2026</p>
      <div className="mt-6 space-y-5 text-parchment/90">
        <p>
          Welcome to Smoke and Ember. By using this site, you agree to these terms. If you don&apos;t agree, no hard
          feelings — just don&apos;t use the site.
        </p>
        <section>
          <h2 className="font-display text-xl italic text-cream">What this site is</h2>
          <p className="mt-2">
            Smoke and Ember is a collection of barbecue and smoked-food recipes, pit notes, and cooking guides, written
            for home cooks. The recipes are a starting point, not set in stone — taste and adjust to your own liking.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl italic text-cream">Cooking is on you</h2>
          <p className="mt-2">
            Cooking involves fire, smoke, and hot equipment. Follow food-safety basics, cook meat to safe temperatures,
            and use your own judgment. We&apos;re not responsible for how a cook turns out in your kitchen.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl italic text-cream">Accounts</h2>
          <p className="mt-2">
            If you create an account, we store the email you sign up with so you can log in and save recipes. You can
            ask us to delete your account by emailing{" "}
            <a href="mailto:kmkj05@yahoo.com" className="text-ember hover:text-ember-hot">
              kmkj05@yahoo.com
            </a>
            . Your My Cooks notes live on your own device.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl italic text-cream">Our content</h2>
          <p className="mt-2">
            The recipes, stories, and pictures on this site belong to Smoke and Ember. You&apos;re welcome to cook from
            them and share them with family and friends. Please don&apos;t republish the whole collection elsewhere or
            claim it as your own.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl italic text-cream">Advertising</h2>
          <p className="mt-2">
            Ads may appear on the site, served through Google AdSense and its partners, which may use cookies. You can
            opt out of personalized advertising in Google&apos;s Ads Settings.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl italic text-cream">Links</h2>
          <p className="mt-2">
            The site may link to other websites. We don&apos;t control those sites and aren&apos;t responsible for what
            they do.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl italic text-cream">Changes</h2>
          <p className="mt-2">
            We may update these terms from time to time. The latest version will always be here.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl italic text-cream">Contact</h2>
          <p className="mt-2">
            Questions about these terms? Email{" "}
            <a href="mailto:kmkj05@yahoo.com" className="text-ember hover:text-ember-hot">
              kmkj05@yahoo.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

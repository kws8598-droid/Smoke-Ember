export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs uppercase tracking-[0.2em] text-ember">Privacy</p>
      <h1 className="mt-2 font-display text-4xl italic text-cream">Privacy Policy</h1>
      <p className="mt-2 text-sm text-subtle">Last updated October 3, 2026</p>
      <div className="mt-6 space-y-5 text-parchment/90">
        <section>
          <h2 className="font-display text-xl italic text-cream">What we collect</h2>
          <p className="mt-2">
            If you create an account, we store the email address you sign up with so you can log in and save recipes.
            We also keep a simple count of total site visits. We do not sell your information to anyone.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl italic text-cream">Cookies and advertising</h2>
          <p className="mt-2">
            We use Google AdSense to show ads. Google uses cookies to serve ads based on your prior visits to this and
            other websites. You can opt out of personalized advertising by visiting Google&apos;s Ads Settings. Google&apos;s
            use of advertising cookies is described in{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              className="text-ember hover:text-ember-hot"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s Advertising policy
            </a>
            .
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl italic text-cream">Your choices</h2>
          <p className="mt-2">
            You can browse the site without an account. If you have an account and want it deleted, email us at{" "}
            <a href="mailto:kmkj05@yahoo.com" className="text-ember hover:text-ember-hot">
              kmkj05@yahoo.com
            </a>{" "}
            and we&apos;ll take care of it.
          </p>
        </section>
      </div>
    </main>
  );
}

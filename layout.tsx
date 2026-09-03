import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import site from "@/lib/og/site.json";

export const metadata: Metadata = {
  title: {
    default: site.ogTitle,
    template: `%s — ${site.shortName}`
  },
  description: site.description,
  metadataBase: new URL(site.url),
  themeColor: site.themeColor,
  icons: { icon: site.icon },
  openGraph: {
    title: site.ogTitle,
    description: site.ogDescription,
    url: site.url,
    siteName: site.name,
    locale: site.locale,
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="topbar">
            <Link className="brand" href="/">
              <img src="/ember.svg" alt="" />
              Smoke Ember
            </Link>
            <nav>
              <Link href="/recipes">Recipes</Link>
              <Link href="/tips">Tips</Link>
            </nav>
          </header>
          {children}
          <footer>Hold the smoke. Do not rush the bark.</footer>
        </div>
      </body>
    </html>
  );
}

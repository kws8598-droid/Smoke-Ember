import type { Metadata, Viewport } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PwaRegister from "@/components/PwaRegister";
import { LiveCatalogProvider } from "@/components/LiveCatalog";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://smoke-ember.vercel.app"),
  title: { default: "Smoke and Ember", template: "%s · Smoke and Ember" },
  description: "Pull up a chair. Regional BBQ, pitmaster sides, and the tricks the fire actually teaches.",
  applicationName: "Smoke and Ember",
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "Smoke and Ember",
    title: "Smoke and Ember",
    description: "Pull up a chair. Regional BBQ, pitmaster sides, and the tricks the fire actually teaches.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Smoke and Ember" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smoke and Ember",
    description: "Pull up a chair. Regional BBQ, pitmaster sides, and the tricks the fire actually teaches.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Smoke & Ember",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#0c0907",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,400;0,500;0,600;1,400&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0c0907" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" /> 
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1197692196854903" crossOrigin="anonymous" /> </head>
      <body className="min-h-screen font-sans antialiased">
        <PwaRegister />
        <Header />
        <LiveCatalogProvider>{children}</LiveCatalogProvider>
        <Footer />
      </body>
    </html>
  );
}

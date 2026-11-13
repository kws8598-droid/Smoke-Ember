/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // TEMPORARY BYPASS (Oct 28, 2026 — remove after the Image Optimization
    // allowance resets ~Nov 5): fresh transforms are refused with a billing
    // block (402), so pictures needing a new size go dark. Serving every
    // picture raw until the reset keeps all cards, heroes, and wisdom
    // pictures loading. Revert this flag (and the per-picture unoptimized
    // props in RecipeCard/RecipeView/wisdom pages) after the reset.
    unoptimized: true,
    // Trimmed sizes: fewer variants per photo = fewer Image Optimization
    // transformations (Hobby cap is 5K/mo). Covers phones through desktops.
    deviceSizes: [640, 1080, 1920],
    imageSizes: [64, 128, 256, 384],
    // 24h minimum cache TTL: remote recipe photos (Supabase) otherwise
    // revalidate about hourly, burning Image Optimization cache writes
    // (Hobby cap is 100K/mo — hit 90% on 2026-10-14). Admin uploads use
    // unique timestamped URLs, so new photos still appear instantly.
    minimumCacheTTL: 86400,
    remotePatterns: [
      { protocol: "https", hostname: "wekdmhvrujskpvmqtxup.supabase.co" },
      { protocol: "https", hostname: "plum-honey-silver-wave.grok.me" },
    ],
  },
  async redirects() {
    return [
      { source: "/temps", destination: "/temp-chart", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [{ key: "Service-Worker-Allowed", value: "/" }],
      },
      {
        // STALE-PAGE FIX (Nov 12, 2026 — Kelly's phone kept showing old
        // page sections after deploys, even with a fresh link): the old
        // `public, max-age=0, must-revalidate` was not enough. Chrome
        // restores pages from its back-forward cache without re-fetching,
        // so Back (and switching back to an open tab) kept bringing back
        // the old copy even though the server was sending the new page.
        // `no-store` opts pages out of that cache entirely, so every open
        // fetches fresh from the server. It also applies to photos and
        // bundles on this route, so they re-download instead of
        // revalidating — traffic is small enough (~140 visitors/week)
        // that ending stale pages is worth it.
        source: "/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
};
module.exports = nextConfig;

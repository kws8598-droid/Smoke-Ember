/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
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
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
};
module.exports = nextConfig;

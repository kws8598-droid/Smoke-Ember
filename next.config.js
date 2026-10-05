/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Trimmed sizes: fewer variants per photo = fewer Image Optimization
    // transformations (Hobby cap is 5K/mo). Covers phones through desktops.
    deviceSizes: [640, 1080, 1920],
    imageSizes: [64, 128, 256, 384],
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

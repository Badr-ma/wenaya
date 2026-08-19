import type { NextConfig } from "next";

/** Next.js configuration — image optimization, redirects, and security headers */
const nextConfig: NextConfig = {
  /** Image optimization settings — allows Unsplash remote images with responsive sizing */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  /** URL redirects — sends old /corporate path to new /solutions/entreprises */
  async redirects() {
    return [
      {
        source: "/corporate",
        destination: "/solutions/entreprises",
        permanent: true,
      },
    ];
  },
  /** Enables app/global-not-found.tsx — restores the custom French 404 for unmatched URLs (multi-root-layout app) */
  experimental: {
    globalNotFound: true,
  },
  /** Security headers applied to all routes — prevents clickjacking, MIME sniffing, and restricts permissions */
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;

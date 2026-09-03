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
  /** URL redirects — old site → new app. Specific routes first, catch-alls last. */
  async redirects() {
    return [
      /* ── Category 1: Direct mappings (permanent, same content) ── */
      { source: "/about-us",            destination: "/about",                  permanent: true },
      { source: "/contact-us",          destination: "/contact",                 permanent: true },
      { source: "/terms-and-conditions",destination: "/conditions",              permanent: true },
      { source: "/privacy-policy",      destination: "/confidentialite",         permanent: true },
      { source: "/for-entreprise",      destination: "/solutions/entreprises",   permanent: true },
      { source: "/corporate",           destination: "/solutions/entreprises",   permanent: true },
      /* EN equivalents */
      { source: "/en/about-us",            destination: "/en/about",                  permanent: true },
      { source: "/en/contact-us",          destination: "/en/contact",                 permanent: true },
      { source: "/en/terms-and-conditions",destination: "/en/conditions",              permanent: true },
      { source: "/en/privacy-policy",      destination: "/en/confidentialite",         permanent: true },
      { source: "/en/for-entreprise",      destination: "/en/solutions/entreprises",   permanent: true },
      { source: "/en/corporate",           destination: "/en/solutions/entreprises",   permanent: true },

      /* ── Category 2: Semantic mappings (permanent for renamed, temporary for removed) ── */
      { source: "/soins",             destination: "/pratiques",   permanent: true },
      { source: "/maux-troubles",     destination: "/pratiques",   permanent: true },
      { source: "/articles",          destination: "/blog",        permanent: true },
      { source: "/evenements",        destination: "/",            permanent: false },
      { source: "/search/all/all",    destination: "/produits",    permanent: false },
      /* Old practice slugs — renamed/merged during 19-practice migration */
      { source: "/pratiques/psychologie-clinique",    destination: "/pratiques/psychologie",    permanent: true },
      { source: "/pratiques/therapies-complementaires", destination: "/pratiques",              permanent: true },
      /* EN equivalents */
      { source: "/en/soins",             destination: "/en/pratiques",   permanent: true },
      { source: "/en/maux-troubles",     destination: "/en/pratiques",   permanent: true },
      { source: "/en/articles",          destination: "/en/blog",        permanent: true },
      { source: "/en/seance-de-groupe",  destination: "/en/group-sessions", permanent: false },
      { source: "/en/evenements",        destination: "/en/",            permanent: false },
      { source: "/en/search/all/all",    destination: "/en/produits",    permanent: false },
      { source: "/en/pratiques/psychologie-clinique",    destination: "/en/pratiques/psychologie",    permanent: true },
      { source: "/en/pratiques/therapies-complementaires", destination: "/en/pratiques",              permanent: true },

      /* ── Category 3: Care pathways — no equivalent in new app (temporary) ── */
      { source: "/parcours-de-soins/:slug+", destination: "/",        permanent: false },
      { source: "/en/parcours-de-soins/:slug+", destination: "/en/",  permanent: false },

      /* ── Category 4: Arabic locale — not supported in new app, redirect to FR ── */
      { source: "/ar/:path*", destination: "/", permanent: false },
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

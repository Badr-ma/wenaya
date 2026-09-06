import type { NextConfig } from "next";

/** Next.js configuration — image optimization, redirects, and security headers */
const nextConfig: NextConfig = {
  /** Image optimization settings — allows Unsplash remote images with responsive sizing */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "nbg1.your-objectstorage.com" },
      { protocol: "https", hostname: "api.wenaya.com" },
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
      { source: "/for-entreprise",      destination: "/corporate",               permanent: true },
      { source: "/for-entreprise/:path*", destination: "/corporate/:path*",       permanent: true },
      { source: "/solutions/entreprises", destination: "/corporate",             permanent: true },
      { source: "/solutions/entreprises/:path*", destination: "/corporate/:path*", permanent: true },
      /* EN equivalents */
      { source: "/en/about-us",            destination: "/en/about",                  permanent: true },
      { source: "/en/contact-us",          destination: "/en/contact",                 permanent: true },
      { source: "/en/terms-and-conditions",destination: "/en/conditions",              permanent: true },
      { source: "/en/privacy-policy",      destination: "/en/confidentialite",         permanent: true },
      { source: "/en/for-entreprise",      destination: "/en/corporate",               permanent: true },
      { source: "/en/for-entreprise/:path*", destination: "/en/corporate/:path*",       permanent: true },
      { source: "/en/solutions/entreprises", destination: "/en/corporate",             permanent: true },
      { source: "/en/solutions/entreprises/:path*", destination: "/en/corporate/:path*", permanent: true },

      /* ── Category 2: Semantic mappings (permanent for renamed, temporary for removed) ── */
      { source: "/soins",             destination: "/pratiques",   permanent: true },
      { source: "/maux-troubles",     destination: "/pratiques",   permanent: true },
      { source: "/blog",              destination: "/articles",    permanent: true },
      { source: "/blog/:path*",       destination: "/articles/:path*", permanent: true },
      { source: "/evenements",        destination: "/",            permanent: false },
      { source: "/search/all/all",    destination: "/produits",    permanent: false },
      /* Old practice slugs — renamed/merged during 19-practice migration */
      { source: "/pratiques/psychologie-clinique",    destination: "/pratiques/psychologie",    permanent: true },
      { source: "/pratiques/therapies-complementaires", destination: "/pratiques",              permanent: true },
      /* EN equivalents */
      { source: "/en/soins",             destination: "/en/pratiques",   permanent: true },
      { source: "/en/maux-troubles",     destination: "/en/pratiques",   permanent: true },
      { source: "/en/blog",           destination: "/en/articles", permanent: true },
      { source: "/en/blog/:path*",    destination: "/en/articles/:path*", permanent: true },
      { source: "/en/evenements",        destination: "/en/",            permanent: false },
      { source: "/en/search/all/all",    destination: "/en/produits",    permanent: false },
      { source: "/en/pratiques/psychologie-clinique",    destination: "/en/pratiques/psychologie",    permanent: true },
      { source: "/en/pratiques/therapies-complementaires", destination: "/en/pratiques",              permanent: true },
      /* Group sessions: live canonical is /en/seance-de-groupe/{fr-slug}; old app
         EN detail URLs used /en/group-sessions/{en-slug}. Slugs differ for 4 sessions,
         so explicit per-slug redirects come first, then a listing fallback. */
      { source: "/en/group-sessions",             destination: "/en/seance-de-groupe",              permanent: true },
      { source: "/en/group-sessions/prenatal-yoga",        destination: "/en/seance-de-groupe/yoga-prenatal",        permanent: true },
      { source: "/en/group-sessions/sophrology",           destination: "/en/seance-de-groupe/sophrologie",         permanent: true },
      { source: "/en/group-sessions/brazilian-jiu-jitsu",  destination: "/en/seance-de-groupe/jiu-jitsu-bresilien", permanent: true },
      { source: "/en/group-sessions/pilates-and-posture",  destination: "/en/seance-de-groupe/pilates-et-posture",  permanent: true },
      { source: "/en/group-sessions/nutrition",   destination: "/en/seance-de-groupe/nutrition",   permanent: true },
      { source: "/en/group-sessions/breathwork",  destination: "/en/seance-de-groupe/breathwork",  permanent: true },
      { source: "/en/group-sessions/:path*",      destination: "/en/seance-de-groupe/:path*",      permanent: true },

      /* ── Category 3: Care pathways — no equivalent in new app (temporary) ── */
      { source: "/parcours-de-soins/:slug+", destination: "/",        permanent: false },
      { source: "/en/parcours-de-soins/:slug+", destination: "/en/",  permanent: false },

      /* ── Category 4: Arabic locale — not supported in new app, redirect to FR ── */
      { source: "/ar/:path*", destination: "/", permanent: false },

      /* ── Category 5: Legacy URL compatibility — verified destinations only ──
         Only redirects whose target route exists are added. Unresolved legacy
         URLs are documented in the parity report and deliberately NOT redirected
         here, to avoid leading traffic to a second 404. */

      /* Specialists: old alias /specialistes → canonical /professional.
         A wildcard detail redirect is used so every specialist profile slug maps
         to the canonical route regardless of the dataset being local or Redis-backed. */
      { source: "/specialistes",                    destination: "/professional",               permanent: true },
      { source: "/specialistes/:path*",             destination: "/professional/:path*",        permanent: true },
      { source: "/en/specialistes",                 destination: "/en/professional",            permanent: true },
      { source: "/en/specialistes/:path*",          destination: "/en/professional/:path*",     permanent: true },

      /* Login: live wenaya aliases fold into our locale pages.
         /en/user/sign-in → /en/login; /user/sign-in → /login. */
      { source: "/user/sign-in",   destination: "/login", permanent: true },
      { source: "/en/user/sign-in", destination: "/en/login", permanent: true },

      /* Practices: legacy accented slugs → normalized ASCII slugs (existing routes).
         Incoming paths are URL-encoded (e.g. é → %C3%A9), and Next.js matches redirect
         `source` against the encoded path, so sources are written percent-encoded below. */
      { source: "/pratiques/art-martial-th%C3%A9rapie", destination: "/pratiques/art-martial-therapie", permanent: true },
      { source: "/pratiques/kin%C3%A9sith%C3%A9rapie",   destination: "/pratiques/kinesitherapie",       permanent: true },
      { source: "/pratiques/massoth%C3%A9rapie",         destination: "/pratiques/massotherapie",        permanent: true },
      { source: "/pratiques/m%C3%A9ditation",            destination: "/pratiques/meditation",           permanent: true },
      { source: "/pratiques/psychomotricit%C3%A9",       destination: "/pratiques/psychomotricite",      permanent: true },
      { source: "/pratiques/psychoth%C3%A9rapie",        destination: "/pratiques/psychotherapie",       permanent: true },
      /* EN equivalents */
      { source: "/en/pratiques/art-martial-th%C3%A9rapie", destination: "/en/pratiques/art-martial-therapie", permanent: true },
      { source: "/en/pratiques/kin%C3%A9sith%C3%A9rapie",   destination: "/en/pratiques/kinesitherapie",       permanent: true },
      { source: "/en/pratiques/massoth%C3%A9rapie",         destination: "/en/pratiques/massotherapie",        permanent: true },
      { source: "/en/pratiques/m%C3%A9ditation",            destination: "/en/pratiques/meditation",           permanent: true },
      { source: "/en/pratiques/psychomotricit%C3%A9",       destination: "/en/pratiques/psychomotricite",      permanent: true },
      { source: "/en/pratiques/psychoth%C3%A9rapie",        destination: "/en/pratiques/psychotherapie",       permanent: true },
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

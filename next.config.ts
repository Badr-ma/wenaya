import type { NextConfig } from "next";

/** Next.js configuration — image optimization, redirects, and security headers */
const nextConfig: NextConfig = {
  /** Image optimization settings — allows Unsplash remote images with responsive sizing */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "nbg1.your-objectstorage.com" },
      { protocol: "https", hostname: "api.wenaya.com" },
      { protocol: "https", hostname: "dev-api.wenaya.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  /** URL redirects — old site → new app. Specific routes first, catch-alls last. */
  async redirects() {
    return [
      /* ── Category 1: Canonical parity — live URLs stay canonical (permanent) ──
         The new app's shorter paths (/about, /contact, /conditions,
         /confidentialite) fold INTO the live canonical URLs the old site indexed
         (/about-us, /contact-us, /terms-and-conditions, /privacy-policy). */
      { source: "/about",            destination: "/about-us",                  statusCode: 301 },
      { source: "/a-propos",         destination: "/about-us",                  statusCode: 301 },
      { source: "/contact",          destination: "/contact-us",                 statusCode: 301 },
      { source: "/conditions",       destination: "/terms-and-conditions",       statusCode: 301 },
      { source: "/confidentialite",  destination: "/privacy-policy",             statusCode: 301 },
      { source: "/for-entreprise",      destination: "/corporate",               statusCode: 301 },
      { source: "/for-entreprise/:path*", destination: "/corporate/:path*",       statusCode: 301 },
      { source: "/solutions/entreprises", destination: "/corporate",             statusCode: 301 },
      { source: "/solutions/entreprises/:path*", destination: "/corporate/:path*", statusCode: 301 },
      /* EN equivalents */
      { source: "/en/about",            destination: "/en/about-us",                  statusCode: 301 },
      { source: "/en/a-propos",         destination: "/en/about-us",                  statusCode: 301 },
      { source: "/en/contact",          destination: "/en/contact-us",                 statusCode: 301 },
      { source: "/en/conditions",       destination: "/en/terms-and-conditions",       statusCode: 301 },
      { source: "/en/confidentialite",  destination: "/en/privacy-policy",             statusCode: 301 },
      { source: "/en/for-entreprise",      destination: "/en/corporate",               statusCode: 301 },
      { source: "/en/for-entreprise/:path*", destination: "/en/corporate/:path*",       statusCode: 301 },
      { source: "/en/solutions/entreprises", destination: "/en/corporate",             statusCode: 301 },
      { source: "/en/solutions/entreprises/:path*", destination: "/en/corporate/:path*", statusCode: 301 },
      /* Duplicate home variant — canonical is the root */
      { source: "/fr", destination: "/", statusCode: 301 },

      /* Labelled-programme legacy paths — the malformed double "programmes/programmes/pcm"
         (never canonical, 404 on live) folds onto the real PCM detail page. */
      { source: "/corporate/programmes/programmes/pcm",     destination: "/corporate/programmes/pcm",     statusCode: 301 },
      { source: "/en/corporate/programmes/programmes/pcm",  destination: "/en/corporate/programmes/pcm",  statusCode: 301 },

      /* ── Category 2: Semantic mappings (permanent for renamed, temporary for removed) ── */
      { source: "/soins",             destination: "/pratiques",   statusCode: 301 },
      /* /maux-troubles is now a first-class page (API-backed orientation
         catalogue) — no redirect to /pratiques anymore. Unmapped
         /maux-troubles/* deep slugs stay 404 pending content sign-off. */
      { source: "/blog",              destination: "/articles",    statusCode: 301 },
      { source: "/blog/:path*",       destination: "/articles/:path*", statusCode: 301 },
      { source: "/evenements",        destination: "/seance-de-groupe", statusCode: 301 },
      /* Old full-clinic search has no new equivalent; fold to the practice
         catalog (the search page searched specialists/practices — NOT the
         shop, which was the previous destination). Deep /search/{spec}/{city}
         variants stay 404; an 410 is recommended at the deploy edge. */
      { source: "/search/all/all",    destination: "/search/all",   statusCode: 301 },
      /* Old practice slugs — renamed/merged during 19-practice migration */
      { source: "/pratiques/psychologie-clinique",    destination: "/pratiques/psychologie",    statusCode: 301 },
      { source: "/pratiques/therapies-complementaires", destination: "/pratiques",              statusCode: 301 },
      /* EN equivalents */
      { source: "/en/soins",             destination: "/en/pratiques",   statusCode: 301 },
      /* /en/maux-troubles now folds to the real EN health-needs page. */
      { source: "/en/maux-troubles",     destination: "/en/health-needs", statusCode: 301 },
      /* Home care (soins à domicile) is a FR-only page with no EN translation.
         Collapse manually entered /en/soins-a-domicile to the canonical FR
         route instead of 404. Both locale CTAs link straight to /soins-a-domicile. */
      { source: "/en/soins-a-domicile", destination: "/soins-a-domicile", statusCode: 301 },
      { source: "/en/blog",           destination: "/en/articles", statusCode: 301 },
      { source: "/en/blog/:path*",    destination: "/en/articles/:path*", statusCode: 301 },
      { source: "/en/evenements",        destination: "/en/seance-de-groupe", statusCode: 301 },
      /* See FR note above — practice catalog, not the shop. */
      { source: "/en/search/all/all",    destination: "/en/search/all",    statusCode: 301 },
      { source: "/en/pratiques/psychologie-clinique",    destination: "/en/pratiques/psychologie",    statusCode: 301 },
      { source: "/en/pratiques/therapies-complementaires", destination: "/en/pratiques",              statusCode: 301 },
      /* Group sessions: live canonical is /en/seance-de-groupe/{fr-slug}; old app
         EN detail URLs used /en/group-sessions/{en-slug}. Slugs differ for 4 sessions,
         so explicit per-slug redirects come first, then a listing fallback. */
      { source: "/en/group-sessions",             destination: "/en/seance-de-groupe",              statusCode: 301 },
      { source: "/en/group-sessions/prenatal-yoga",        destination: "/en/seance-de-groupe/yoga-prenatal",        statusCode: 301 },
      { source: "/en/group-sessions/sophrology",           destination: "/en/seance-de-groupe/sophrologie",         statusCode: 301 },
      { source: "/en/group-sessions/brazilian-jiu-jitsu",  destination: "/en/seance-de-groupe/jiu-jitsu-bresilien", statusCode: 301 },
      { source: "/en/group-sessions/pilates-and-posture",  destination: "/en/seance-de-groupe/pilates-et-posture",  statusCode: 301 },
      { source: "/en/group-sessions/nutrition",   destination: "/en/seance-de-groupe/nutrition",   statusCode: 301 },
      { source: "/en/group-sessions/breathwork",  destination: "/en/seance-de-groupe/breathwork",  statusCode: 301 },
      { source: "/en/group-sessions/:path*",      destination: "/en/seance-de-groupe/:path*",      statusCode: 301 },

      /* ── Category 3: Care pathways ──
         The 7 care journeys are now first-class pages at /parcours-de-soins/{slug}
         (FR + EN). These rows only handle the LEGACY live alias forms (accented
         URLs, apostrophe encoding variants) and 301 them one hop onto the
         canonical ASCII slug. The canonical slugs themselves are NOT listed here
         (they resolve to real pages). Any other /parcours-de-soins/{slug}
         correctly 404s. */
      { source: "/parcours-de-soins/grossesse-&-maternit%C3%A9",      destination: "/parcours-de-soins/grossesse-&-maternite",     statusCode: 301 },
      { source: "/parcours-de-soins/les-troubles-de-l%27apprentissage", destination: "/parcours-de-soins/les-troubles-de-l-apprentissage", statusCode: 301 },
      { source: "/parcours-de-soins/les-troubles-de-l'apprentissage", destination: "/parcours-de-soins/les-troubles-de-l-apprentissage", statusCode: 301 },
      { source: "/parcours-de-soins/sant%C3%A9-holistique",           destination: "/parcours-de-soins/sante-holistique",          statusCode: 301 },
      { source: "/parcours-de-soins/la-maladie-d%27Alzheimer",        destination: "/parcours-de-soins/la-maladie-d-alzheimer",    statusCode: 301 },
      { source: "/parcours-de-soins/la-maladie-d%E2%80%99Alzheimer",  destination: "/parcours-de-soins/la-maladie-d-alzheimer",    statusCode: 301 },
      { source: "/parcours-de-soins/la-maladie-d'Alzheimer",         destination: "/parcours-de-soins/la-maladie-d-alzheimer",    statusCode: 301 },
      { source: "/parcours-de-soins/la-maladie-d’Alzheimer",         destination: "/parcours-de-soins/la-maladie-d-alzheimer",    statusCode: 301 },
      { source: "/parcours-de-soins/tecar-th%C3%A9rapie",            destination: "/parcours-de-soins/tecar-therapie",            statusCode: 301 },
      { source: "/parcours-de-soins/kin%C3%A9sith%C3%A9rapie-&-avc",  destination: "/parcours-de-soins/kinesitherapie-&-avc",      statusCode: 301 },
      { source: "/en/parcours-de-soins/grossesse-&-maternit%C3%A9",     destination: "/en/parcours-de-soins/grossesse-&-maternite",         statusCode: 301 },
      { source: "/en/parcours-de-soins/les-troubles-de-l%27apprentissage", destination: "/en/parcours-de-soins/les-troubles-de-l-apprentissage", statusCode: 301 },
      { source: "/en/parcours-de-soins/les-troubles-de-l'apprentissage", destination: "/en/parcours-de-soins/les-troubles-de-l-apprentissage", statusCode: 301 },
      { source: "/en/parcours-de-soins/sant%C3%A9-holistique",          destination: "/en/parcours-de-soins/sante-holistique",              statusCode: 301 },
      { source: "/en/parcours-de-soins/la-maladie-d%27Alzheimer",       destination: "/en/parcours-de-soins/la-maladie-d-alzheimer",        statusCode: 301 },
      { source: "/en/parcours-de-soins/la-maladie-d%E2%80%99Alzheimer", destination: "/en/parcours-de-soins/la-maladie-d-alzheimer",        statusCode: 301 },
      { source: "/en/parcours-de-soins/la-maladie-d'Alzheimer",        destination: "/en/parcours-de-soins/la-maladie-d-alzheimer",        statusCode: 301 },
      { source: "/en/parcours-de-soins/la-maladie-d’Alzheimer",        destination: "/en/parcours-de-soins/la-maladie-d-alzheimer",        statusCode: 301 },
      { source: "/en/parcours-de-soins/tecar-th%C3%A9rapie",            destination: "/en/parcours-de-soins/tecar-therapie",                statusCode: 301 },
      { source: "/en/parcours-de-soins/kin%C3%A9sith%C3%A9rapie-&-avc", destination: "/en/parcours-de-soins/kinesitherapie-&-avc",          statusCode: 301 },

      /* ── Category 4: Arabic locale — not supported in new app, redirect to FR ──
         Precise mappings first (permanent), then the catch-all for anything else. */
      { source: "/ar/about-us", destination: "/about-us",                  statusCode: 301 },
      { source: "/ar/pratiques", destination: "/pratiques",               statusCode: 301 },
      { source: "/ar/parcours-de-soins/grossesse-&-maternite", destination: "/parcours-de-soins/grossesse-&-maternite", statusCode: 301 },
      { source: "/ar/search/all/all", destination: "/",                   statusCode: 301 },
      { source: "/ar/:path*", destination: "/", permanent: false },

      /* ── Category 5: Legacy URL compatibility — verified destinations only ──
         Only redirects whose target route exists are added. Unresolved legacy
         URLs are documented in the parity report and deliberately NOT redirected
         here, to avoid leading traffic to a second 404. */

      /* Specialists: the professionals LISTING migrated from /professional to the
         /search route family (FR /search/all + /search/<specialty>, EN /en/search/...).
         Filtered bookmarks (/professional?specialty=<slug>) 308 onto the matching
         /search/<slug> page (Next preserves non-has params, so ?q= survives). Bare
         listing URLs retarget to /search/all. Detail pages remain at
         /professional/[slug], so both detail wildcards below still hit them.
         The 20 per-slug slugs = verified live specialty slugs from the API. */
      { source: "/professional",                    destination: "/search/osteopathie",          statusCode: 301, has: [{ type: "query", key: "specialty", value: "osteopathie" }] },
      { source: "/professional",                    destination: "/search/sophrologie",         statusCode: 301, has: [{ type: "query", key: "specialty", value: "sophrologie" }] },
      { source: "/professional",                    destination: "/search/naturopathie",        statusCode: 301, has: [{ type: "query", key: "specialty", value: "naturopathie" }] },
      { source: "/professional",                    destination: "/search/psychotherapie",      statusCode: 301, has: [{ type: "query", key: "specialty", value: "psychotherapie" }] },
      { source: "/professional",                    destination: "/search/kinesitherapie",      statusCode: 301, has: [{ type: "query", key: "specialty", value: "kinesitherapie" }] },
      { source: "/professional",                    destination: "/search/massotherapie",       statusCode: 301, has: [{ type: "query", key: "specialty", value: "massotherapie" }] },
      { source: "/professional",                    destination: "/search/nutrition",           statusCode: 301, has: [{ type: "query", key: "specialty", value: "nutrition" }] },
      { source: "/professional",                    destination: "/search/coaching-sportif",    statusCode: 301, has: [{ type: "query", key: "specialty", value: "coaching-sportif" }] },
      { source: "/professional",                    destination: "/search/cupping-therapy-hijama", statusCode: 301, has: [{ type: "query", key: "specialty", value: "cupping-therapy-hijama" }] },
      { source: "/professional",                    destination: "/search/psychologie",         statusCode: 301, has: [{ type: "query", key: "specialty", value: "psychologie" }] },
      { source: "/professional",                    destination: "/search/orthophonie",         statusCode: 301, has: [{ type: "query", key: "specialty", value: "orthophonie" }] },
      { source: "/professional",                    destination: "/search/sexologie",           statusCode: 301, has: [{ type: "query", key: "specialty", value: "sexologie" }] },
      { source: "/professional",                    destination: "/search/psychomotricite",     statusCode: 301, has: [{ type: "query", key: "specialty", value: "psychomotricite" }] },
      { source: "/professional",                    destination: "/search/neuropsychologie",    statusCode: 301, has: [{ type: "query", key: "specialty", value: "neuropsychologie" }] },
      { source: "/professional",                    destination: "/search/jiu-jitsu",           statusCode: 301, has: [{ type: "query", key: "specialty", value: "jiu-jitsu" }] },
      { source: "/professional",                    destination: "/search/art-martial-therapie", statusCode: 301, has: [{ type: "query", key: "specialty", value: "art-martial-therapie" }] },
      { source: "/professional",                    destination: "/search/yoga",                statusCode: 301, has: [{ type: "query", key: "specialty", value: "yoga" }] },
      { source: "/professional",                    destination: "/search/meditation",          statusCode: 301, has: [{ type: "query", key: "specialty", value: "meditation" }] },
      { source: "/professional",                    destination: "/search/sono-therapie",       statusCode: 301, has: [{ type: "query", key: "specialty", value: "sono-therapie" }] },
      { source: "/professional",                    destination: "/search/infirmerie",          statusCode: 301, has: [{ type: "query", key: "specialty", value: "infirmerie" }] },
      { source: "/en/professional",                 destination: "/en/search/osteopathie",      statusCode: 301, has: [{ type: "query", key: "specialty", value: "osteopathie" }] },
      { source: "/en/professional",                 destination: "/en/search/sophrologie",      statusCode: 301, has: [{ type: "query", key: "specialty", value: "sophrologie" }] },
      { source: "/en/professional",                 destination: "/en/search/naturopathie",     statusCode: 301, has: [{ type: "query", key: "specialty", value: "naturopathie" }] },
      { source: "/en/professional",                 destination: "/en/search/psychotherapie",   statusCode: 301, has: [{ type: "query", key: "specialty", value: "psychotherapie" }] },
      { source: "/en/professional",                 destination: "/en/search/kinesitherapie",   statusCode: 301, has: [{ type: "query", key: "specialty", value: "kinesitherapie" }] },
      { source: "/en/professional",                 destination: "/en/search/massotherapie",    statusCode: 301, has: [{ type: "query", key: "specialty", value: "massotherapie" }] },
      { source: "/en/professional",                 destination: "/en/search/nutrition",        statusCode: 301, has: [{ type: "query", key: "specialty", value: "nutrition" }] },
      { source: "/en/professional",                 destination: "/en/search/coaching-sportif", statusCode: 301, has: [{ type: "query", key: "specialty", value: "coaching-sportif" }] },
      { source: "/en/professional",                 destination: "/en/search/cupping-therapy-hijama", statusCode: 301, has: [{ type: "query", key: "specialty", value: "cupping-therapy-hijama" }] },
      { source: "/en/professional",                 destination: "/en/search/psychologie",      statusCode: 301, has: [{ type: "query", key: "specialty", value: "psychologie" }] },
      { source: "/en/professional",                 destination: "/en/search/orthophonie",      statusCode: 301, has: [{ type: "query", key: "specialty", value: "orthophonie" }] },
      { source: "/en/professional",                 destination: "/en/search/sexologie",        statusCode: 301, has: [{ type: "query", key: "specialty", value: "sexologie" }] },
      { source: "/en/professional",                 destination: "/en/search/psychomotricite",  statusCode: 301, has: [{ type: "query", key: "specialty", value: "psychomotricite" }] },
      { source: "/en/professional",                 destination: "/en/search/neuropsychologie", statusCode: 301, has: [{ type: "query", key: "specialty", value: "neuropsychologie" }] },
      { source: "/en/professional",                 destination: "/en/search/jiu-jitsu",        statusCode: 301, has: [{ type: "query", key: "specialty", value: "jiu-jitsu" }] },
      { source: "/en/professional",                 destination: "/en/search/art-martial-therapie", statusCode: 301, has: [{ type: "query", key: "specialty", value: "art-martial-therapie" }] },
      { source: "/en/professional",                 destination: "/en/search/yoga",             statusCode: 301, has: [{ type: "query", key: "specialty", value: "yoga" }] },
      { source: "/en/professional",                 destination: "/en/search/meditation",       statusCode: 301, has: [{ type: "query", key: "specialty", value: "meditation" }] },
      { source: "/en/professional",                 destination: "/en/search/sono-therapie",    statusCode: 301, has: [{ type: "query", key: "specialty", value: "sono-therapie" }] },
      { source: "/en/professional",                 destination: "/en/search/infirmerie",       statusCode: 301, has: [{ type: "query", key: "specialty", value: "infirmerie" }] },
      { source: "/specialistes",                    destination: "/search/osteopathie",          statusCode: 301, has: [{ type: "query", key: "specialty", value: "osteopathie" }] },
      { source: "/specialistes",                    destination: "/search/sophrologie",         statusCode: 301, has: [{ type: "query", key: "specialty", value: "sophrologie" }] },
      { source: "/specialistes",                    destination: "/search/naturopathie",        statusCode: 301, has: [{ type: "query", key: "specialty", value: "naturopathie" }] },
      { source: "/specialistes",                    destination: "/search/psychotherapie",      statusCode: 301, has: [{ type: "query", key: "specialty", value: "psychotherapie" }] },
      { source: "/specialistes",                    destination: "/search/kinesitherapie",      statusCode: 301, has: [{ type: "query", key: "specialty", value: "kinesitherapie" }] },
      { source: "/specialistes",                    destination: "/search/massotherapie",       statusCode: 301, has: [{ type: "query", key: "specialty", value: "massotherapie" }] },
      { source: "/specialistes",                    destination: "/search/nutrition",           statusCode: 301, has: [{ type: "query", key: "specialty", value: "nutrition" }] },
      { source: "/specialistes",                    destination: "/search/coaching-sportif",    statusCode: 301, has: [{ type: "query", key: "specialty", value: "coaching-sportif" }] },
      { source: "/specialistes",                    destination: "/search/cupping-therapy-hijama", statusCode: 301, has: [{ type: "query", key: "specialty", value: "cupping-therapy-hijama" }] },
      { source: "/specialistes",                    destination: "/search/psychologie",         statusCode: 301, has: [{ type: "query", key: "specialty", value: "psychologie" }] },
      { source: "/specialistes",                    destination: "/search/orthophonie",         statusCode: 301, has: [{ type: "query", key: "specialty", value: "orthophonie" }] },
      { source: "/specialistes",                    destination: "/search/sexologie",           statusCode: 301, has: [{ type: "query", key: "specialty", value: "sexologie" }] },
      { source: "/specialistes",                    destination: "/search/psychomotricite",     statusCode: 301, has: [{ type: "query", key: "specialty", value: "psychomotricite" }] },
      { source: "/specialistes",                    destination: "/search/neuropsychologie",    statusCode: 301, has: [{ type: "query", key: "specialty", value: "neuropsychologie" }] },
      { source: "/specialistes",                    destination: "/search/jiu-jitsu",           statusCode: 301, has: [{ type: "query", key: "specialty", value: "jiu-jitsu" }] },
      { source: "/specialistes",                    destination: "/search/art-martial-therapie", statusCode: 301, has: [{ type: "query", key: "specialty", value: "art-martial-therapie" }] },
      { source: "/specialistes",                    destination: "/search/yoga",                statusCode: 301, has: [{ type: "query", key: "specialty", value: "yoga" }] },
      { source: "/specialistes",                    destination: "/search/meditation",          statusCode: 301, has: [{ type: "query", key: "specialty", value: "meditation" }] },
      { source: "/specialistes",                    destination: "/search/sono-therapie",       statusCode: 301, has: [{ type: "query", key: "specialty", value: "sono-therapie" }] },
      { source: "/specialistes",                    destination: "/search/infirmerie",          statusCode: 301, has: [{ type: "query", key: "specialty", value: "infirmerie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/osteopathie",      statusCode: 301, has: [{ type: "query", key: "specialty", value: "osteopathie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/sophrologie",      statusCode: 301, has: [{ type: "query", key: "specialty", value: "sophrologie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/naturopathie",     statusCode: 301, has: [{ type: "query", key: "specialty", value: "naturopathie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/psychotherapie",   statusCode: 301, has: [{ type: "query", key: "specialty", value: "psychotherapie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/kinesitherapie",   statusCode: 301, has: [{ type: "query", key: "specialty", value: "kinesitherapie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/massotherapie",    statusCode: 301, has: [{ type: "query", key: "specialty", value: "massotherapie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/nutrition",        statusCode: 301, has: [{ type: "query", key: "specialty", value: "nutrition" }] },
      { source: "/en/specialistes",                 destination: "/en/search/coaching-sportif", statusCode: 301, has: [{ type: "query", key: "specialty", value: "coaching-sportif" }] },
      { source: "/en/specialistes",                 destination: "/en/search/cupping-therapy-hijama", statusCode: 301, has: [{ type: "query", key: "specialty", value: "cupping-therapy-hijama" }] },
      { source: "/en/specialistes",                 destination: "/en/search/psychologie",      statusCode: 301, has: [{ type: "query", key: "specialty", value: "psychologie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/orthophonie",      statusCode: 301, has: [{ type: "query", key: "specialty", value: "orthophonie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/sexologie",        statusCode: 301, has: [{ type: "query", key: "specialty", value: "sexologie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/psychomotricite",  statusCode: 301, has: [{ type: "query", key: "specialty", value: "psychomotricite" }] },
      { source: "/en/specialistes",                 destination: "/en/search/neuropsychologie", statusCode: 301, has: [{ type: "query", key: "specialty", value: "neuropsychologie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/jiu-jitsu",        statusCode: 301, has: [{ type: "query", key: "specialty", value: "jiu-jitsu" }] },
      { source: "/en/specialistes",                 destination: "/en/search/art-martial-therapie", statusCode: 301, has: [{ type: "query", key: "specialty", value: "art-martial-therapie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/yoga",             statusCode: 301, has: [{ type: "query", key: "specialty", value: "yoga" }] },
      { source: "/en/specialistes",                 destination: "/en/search/meditation",       statusCode: 301, has: [{ type: "query", key: "specialty", value: "meditation" }] },
      { source: "/en/specialistes",                 destination: "/en/search/sono-therapie",    statusCode: 301, has: [{ type: "query", key: "specialty", value: "sono-therapie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/infirmerie",       statusCode: 301, has: [{ type: "query", key: "specialty", value: "infirmerie" }] },
      { source: "/professional",                    destination: "/search/all",                 statusCode: 301 },
      { source: "/en/professional",                 destination: "/en/search/all",              statusCode: 301 },
      { source: "/specialistes",                    destination: "/search/all",                 statusCode: 301 },
      { source: "/en/specialistes",                 destination: "/en/search/all",              statusCode: 301 },
      { source: "/specialistes/:path*",             destination: "/professional/:path*",        statusCode: 301 },
      { source: "/en/specialistes/:path*",          destination: "/en/professional/:path*",     statusCode: 301 },

      /* Old per-profile booking sub-page → the same specialist's profile
         (the new booking flow is the in-profile booking panel; each target
         route is verified to exist in /professional/[slug]). Only the
         canonical 10 live slugs are wired — unknown slugs stay 404. */
      { source: "/professional/nadine-kita/booking",          destination: "/professional/nadine-kita",          statusCode: 301 },
      { source: "/professional/dr-amal-benali/booking",      destination: "/professional/dr-amal-benali",        statusCode: 301 },
      { source: "/professional/khalid-ouazzani/booking",     destination: "/professional/khalid-ouazzani",       statusCode: 301 },
      { source: "/professional/nadia-tazi/booking",          destination: "/professional/nadia-tazi",            statusCode: 301 },
      { source: "/professional/yassine-el-amrani/booking",   destination: "/professional/yassine-el-amrani",     statusCode: 301 },
      { source: "/professional/sara-mansouri/booking",       destination: "/professional/sara-mansouri",         statusCode: 301 },
      { source: "/professional/mehdi-irzi/booking",          destination: "/professional/mehdi-irzi",            statusCode: 301 },
      { source: "/professional/najat-berrada/booking",       destination: "/professional/najat-berrada",         statusCode: 301 },
      { source: "/professional/omar-tazi/booking",           destination: "/professional/omar-tazi",             statusCode: 301 },
      { source: "/professional/fatima-zahra-alami/booking",  destination: "/professional/fatima-zahra-alami",    statusCode: 301 },
      { source: "/en/professional/nadine-kita/booking",          destination: "/en/professional/nadine-kita",          statusCode: 301 },
      { source: "/en/professional/dr-amal-benali/booking",      destination: "/en/professional/dr-amal-benali",        statusCode: 301 },
      { source: "/en/professional/khalid-ouazzani/booking",     destination: "/en/professional/khalid-ouazzani",       statusCode: 301 },
      { source: "/en/professional/nadia-tazi/booking",          destination: "/en/professional/nadia-tazi",            statusCode: 301 },
      { source: "/en/professional/yassine-el-amrani/booking",   destination: "/en/professional/yassine-el-amrani",     statusCode: 301 },
      { source: "/en/professional/sara-mansouri/booking",       destination: "/en/professional/sara-mansouri",         statusCode: 301 },
      { source: "/en/professional/mehdi-irzi/booking",          destination: "/en/professional/mehdi-irzi",            statusCode: 301 },
      { source: "/en/professional/najat-berrada/booking",       destination: "/en/professional/najat-berrada",         statusCode: 301 },
      { source: "/en/professional/omar-tazi/booking",           destination: "/en/professional/omar-tazi",             statusCode: 301 },
      { source: "/en/professional/fatima-zahra-alami/booking",  destination: "/en/professional/fatima-zahra-alami",    statusCode: 301 },

      /* Login: live wenaya aliases fold into our locale pages.
         /en/user/sign-in → /en/login; /user/sign-in → /login.
         Signup mirrors the same treatment (live /user/sign-up → /signup). */
      { source: "/user/sign-in",   destination: "/login", statusCode: 301 },
      { source: "/en/user/sign-in", destination: "/en/login", statusCode: 301 },
      { source: "/user/sign-up",   destination: "/signup", statusCode: 301 },
      { source: "/en/user/sign-up", destination: "/en/signup", statusCode: 301 },

      /* Practices: legacy accented slugs → normalized ASCII slugs (existing routes).
         Incoming paths are URL-encoded (e.g. é → %C3%A9), and Next.js matches redirect
         `source` against the encoded path, so sources are written percent-encoded below. */
      { source: "/pratiques/art-martial-th%C3%A9rapie", destination: "/pratiques/art-martial-therapie", statusCode: 301 },
      { source: "/pratiques/kin%C3%A9sith%C3%A9rapie",   destination: "/pratiques/kinesitherapie",       statusCode: 301 },
      { source: "/pratiques/massoth%C3%A9rapie",         destination: "/pratiques/massotherapie",        statusCode: 301 },
      { source: "/pratiques/m%C3%A9ditation",            destination: "/pratiques/meditation",           statusCode: 301 },
      { source: "/pratiques/psychomotricit%C3%A9",       destination: "/pratiques/psychomotricite",      statusCode: 301 },
      { source: "/pratiques/psychoth%C3%A9rapie",        destination: "/pratiques/psychotherapie",       statusCode: 301 },
      { source: "/pratiques/ost%C3%A9opathie",           destination: "/pratiques/osteopathie",          statusCode: 301 },
      { source: "/pratiques/sono-th%C3%A9rapie",         destination: "/pratiques/sono-therapie",        statusCode: 301 },
      /* EN equivalents */
      { source: "/en/pratiques/art-martial-th%C3%A9rapie", destination: "/en/pratiques/art-martial-therapie", statusCode: 301 },
      { source: "/en/pratiques/kin%C3%A9sith%C3%A9rapie",   destination: "/en/pratiques/kinesitherapie",       statusCode: 301 },
      { source: "/en/pratiques/massoth%C3%A9rapie",         destination: "/en/pratiques/massotherapie",        statusCode: 301 },
      { source: "/en/pratiques/m%C3%A9ditation",            destination: "/en/pratiques/meditation",           statusCode: 301 },
      { source: "/en/pratiques/psychomotricit%C3%A9",       destination: "/en/pratiques/psychomotricite",      statusCode: 301 },
      { source: "/en/pratiques/psychoth%C3%A9rapie",        destination: "/en/pratiques/psychotherapie",       statusCode: 301 },
      { source: "/en/pratiques/ost%C3%A9opathie",           destination: "/en/pratiques/osteopathie",          statusCode: 301 },
      { source: "/en/pratiques/sono-th%C3%A9rapie",         destination: "/en/pratiques/sono-therapie",        statusCode: 301 },

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

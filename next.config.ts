import type { NextConfig } from "next";

/** Next.js configuration — image optimization, redirects, and security headers */
const nextConfig: NextConfig = {
  /** Image optimization settings — allows Unsplash remote images with responsive sizing */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
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
      { source: "/about",            destination: "/about-us",                  permanent: true },
      { source: "/contact",          destination: "/contact-us",                 permanent: true },
      { source: "/conditions",       destination: "/terms-and-conditions",       permanent: true },
      { source: "/confidentialite",  destination: "/privacy-policy",             permanent: true },
      { source: "/for-entreprise",      destination: "/corporate",               permanent: true },
      { source: "/for-entreprise/:path*", destination: "/corporate/:path*",       permanent: true },
      { source: "/solutions/entreprises", destination: "/corporate",             permanent: true },
      { source: "/solutions/entreprises/:path*", destination: "/corporate/:path*", permanent: true },
      /* EN equivalents */
      { source: "/en/about",            destination: "/en/about-us",                  permanent: true },
      { source: "/en/contact",          destination: "/en/contact-us",                 permanent: true },
      { source: "/en/conditions",       destination: "/en/terms-and-conditions",       permanent: true },
      { source: "/en/confidentialite",  destination: "/en/privacy-policy",             permanent: true },
      { source: "/en/for-entreprise",      destination: "/en/corporate",               permanent: true },
      { source: "/en/for-entreprise/:path*", destination: "/en/corporate/:path*",       permanent: true },
      { source: "/en/solutions/entreprises", destination: "/en/corporate",             permanent: true },
      { source: "/en/solutions/entreprises/:path*", destination: "/en/corporate/:path*", permanent: true },
      /* Duplicate home variant — canonical is the root */
      { source: "/fr", destination: "/", permanent: true },

      /* Labelled-programme legacy paths — the malformed double "programmes/programmes/pcm"
         (never canonical, 404 on live) folds onto the real PCM detail page. */
      { source: "/corporate/programmes/programmes/pcm",     destination: "/corporate/programmes/pcm",     permanent: true },
      { source: "/en/corporate/programmes/programmes/pcm",  destination: "/en/corporate/programmes/pcm",  permanent: true },

      /* ── Category 2: Semantic mappings (permanent for renamed, temporary for removed) ── */
      { source: "/soins",             destination: "/pratiques",   permanent: true },
      /* /maux-troubles is now a first-class page (API-backed orientation
         catalogue) — no redirect to /pratiques anymore. Unmapped
         /maux-troubles/* deep slugs stay 404 pending content sign-off. */
      { source: "/blog",              destination: "/articles",    permanent: true },
      { source: "/blog/:path*",       destination: "/articles/:path*", permanent: true },
      { source: "/evenements",        destination: "/seance-de-groupe", permanent: false },
      /* Old full-clinic search has no new equivalent; fold to the practice
         catalog (the search page searched specialists/practices — NOT the
         shop, which was the previous destination). Deep /search/{spec}/{city}
         variants stay 404; an 410 is recommended at the deploy edge. */
      { source: "/search/all/all",    destination: "/pratiques",   permanent: false },
      /* Old practice slugs — renamed/merged during 19-practice migration */
      { source: "/pratiques/psychologie-clinique",    destination: "/pratiques/psychologie",    permanent: true },
      { source: "/pratiques/therapies-complementaires", destination: "/pratiques",              permanent: true },
      /* EN equivalents */
      { source: "/en/soins",             destination: "/en/pratiques",   permanent: true },
      /* /en/maux-troubles now folds to the real EN health-needs page. */
      { source: "/en/maux-troubles",     destination: "/en/health-needs", permanent: true },
      { source: "/en/blog",           destination: "/en/articles", permanent: true },
      { source: "/en/blog/:path*",    destination: "/en/articles/:path*", permanent: true },
      { source: "/en/evenements",        destination: "/en/seance-de-groupe", permanent: false },
      /* See FR note above — practice catalog, not the shop. */
      { source: "/en/search/all/all",    destination: "/en/pratiques",    permanent: false },
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

      /* ── Category 3: Care pathways ──
         The 7 care journeys are now first-class pages at /parcours-de-soins/{slug}
         (FR + EN). These rows only handle the LEGACY live alias forms (accented
         URLs, apostrophe encoding variants) and 308 them one hop onto the
         canonical ASCII slug. The canonical slugs themselves are NOT listed here
         (they resolve to real pages). Any other /parcours-de-soins/{slug}
         correctly 404s. */
      { source: "/parcours-de-soins/grossesse-&-maternit%C3%A9",      destination: "/parcours-de-soins/grossesse-&-maternite",     permanent: true },
      { source: "/parcours-de-soins/les-troubles-de-l%27apprentissage", destination: "/parcours-de-soins/les-troubles-de-l-apprentissage", permanent: true },
      { source: "/parcours-de-soins/les-troubles-de-l'apprentissage", destination: "/parcours-de-soins/les-troubles-de-l-apprentissage", permanent: true },
      { source: "/parcours-de-soins/sant%C3%A9-holistique",           destination: "/parcours-de-soins/sante-holistique",          permanent: true },
      { source: "/parcours-de-soins/la-maladie-d%27Alzheimer",        destination: "/parcours-de-soins/la-maladie-d-alzheimer",    permanent: true },
      { source: "/parcours-de-soins/la-maladie-d%E2%80%99Alzheimer",  destination: "/parcours-de-soins/la-maladie-d-alzheimer",    permanent: true },
      { source: "/parcours-de-soins/la-maladie-d'Alzheimer",         destination: "/parcours-de-soins/la-maladie-d-alzheimer",    permanent: true },
      { source: "/parcours-de-soins/la-maladie-d’Alzheimer",         destination: "/parcours-de-soins/la-maladie-d-alzheimer",    permanent: true },
      { source: "/parcours-de-soins/tecar-th%C3%A9rapie",            destination: "/parcours-de-soins/tecar-therapie",            permanent: true },
      { source: "/parcours-de-soins/kin%C3%A9sith%C3%A9rapie-&-avc",  destination: "/parcours-de-soins/kinesitherapie-&-avc",      permanent: true },
      { source: "/en/parcours-de-soins/grossesse-&-maternit%C3%A9",     destination: "/en/parcours-de-soins/grossesse-&-maternite",         permanent: true },
      { source: "/en/parcours-de-soins/les-troubles-de-l%27apprentissage", destination: "/en/parcours-de-soins/les-troubles-de-l-apprentissage", permanent: true },
      { source: "/en/parcours-de-soins/les-troubles-de-l'apprentissage", destination: "/en/parcours-de-soins/les-troubles-de-l-apprentissage", permanent: true },
      { source: "/en/parcours-de-soins/sant%C3%A9-holistique",          destination: "/en/parcours-de-soins/sante-holistique",              permanent: true },
      { source: "/en/parcours-de-soins/la-maladie-d%27Alzheimer",       destination: "/en/parcours-de-soins/la-maladie-d-alzheimer",        permanent: true },
      { source: "/en/parcours-de-soins/la-maladie-d%E2%80%99Alzheimer", destination: "/en/parcours-de-soins/la-maladie-d-alzheimer",        permanent: true },
      { source: "/en/parcours-de-soins/la-maladie-d'Alzheimer",        destination: "/en/parcours-de-soins/la-maladie-d-alzheimer",        permanent: true },
      { source: "/en/parcours-de-soins/la-maladie-d’Alzheimer",        destination: "/en/parcours-de-soins/la-maladie-d-alzheimer",        permanent: true },
      { source: "/en/parcours-de-soins/tecar-th%C3%A9rapie",            destination: "/en/parcours-de-soins/tecar-therapie",                permanent: true },
      { source: "/en/parcours-de-soins/kin%C3%A9sith%C3%A9rapie-&-avc", destination: "/en/parcours-de-soins/kinesitherapie-&-avc",          permanent: true },

      /* ── Category 4: Arabic locale — not supported in new app, redirect to FR ──
         Precise mappings first (permanent), then the catch-all for anything else. */
      { source: "/ar/about-us", destination: "/about-us",                  permanent: true },
      { source: "/ar/pratiques", destination: "/pratiques",               permanent: true },
      { source: "/ar/parcours-de-soins/grossesse-&-maternite", destination: "/parcours-de-soins/grossesse-&-maternite", permanent: true },
      { source: "/ar/search/all/all", destination: "/",                   permanent: true },
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
      { source: "/professional",                    destination: "/search/osteopathie",          permanent: true, has: [{ type: "query", key: "specialty", value: "osteopathie" }] },
      { source: "/professional",                    destination: "/search/sophrologie",         permanent: true, has: [{ type: "query", key: "specialty", value: "sophrologie" }] },
      { source: "/professional",                    destination: "/search/naturopathie",        permanent: true, has: [{ type: "query", key: "specialty", value: "naturopathie" }] },
      { source: "/professional",                    destination: "/search/psychotherapie",      permanent: true, has: [{ type: "query", key: "specialty", value: "psychotherapie" }] },
      { source: "/professional",                    destination: "/search/kinesitherapie",      permanent: true, has: [{ type: "query", key: "specialty", value: "kinesitherapie" }] },
      { source: "/professional",                    destination: "/search/massotherapie",       permanent: true, has: [{ type: "query", key: "specialty", value: "massotherapie" }] },
      { source: "/professional",                    destination: "/search/nutrition",           permanent: true, has: [{ type: "query", key: "specialty", value: "nutrition" }] },
      { source: "/professional",                    destination: "/search/coaching-sportif",    permanent: true, has: [{ type: "query", key: "specialty", value: "coaching-sportif" }] },
      { source: "/professional",                    destination: "/search/cupping-therapy-hijama", permanent: true, has: [{ type: "query", key: "specialty", value: "cupping-therapy-hijama" }] },
      { source: "/professional",                    destination: "/search/psychologie",         permanent: true, has: [{ type: "query", key: "specialty", value: "psychologie" }] },
      { source: "/professional",                    destination: "/search/orthophonie",         permanent: true, has: [{ type: "query", key: "specialty", value: "orthophonie" }] },
      { source: "/professional",                    destination: "/search/sexologie",           permanent: true, has: [{ type: "query", key: "specialty", value: "sexologie" }] },
      { source: "/professional",                    destination: "/search/psychomotricite",     permanent: true, has: [{ type: "query", key: "specialty", value: "psychomotricite" }] },
      { source: "/professional",                    destination: "/search/neuropsychologie",    permanent: true, has: [{ type: "query", key: "specialty", value: "neuropsychologie" }] },
      { source: "/professional",                    destination: "/search/jiu-jitsu",           permanent: true, has: [{ type: "query", key: "specialty", value: "jiu-jitsu" }] },
      { source: "/professional",                    destination: "/search/art-martial-therapie", permanent: true, has: [{ type: "query", key: "specialty", value: "art-martial-therapie" }] },
      { source: "/professional",                    destination: "/search/yoga",                permanent: true, has: [{ type: "query", key: "specialty", value: "yoga" }] },
      { source: "/professional",                    destination: "/search/meditation",          permanent: true, has: [{ type: "query", key: "specialty", value: "meditation" }] },
      { source: "/professional",                    destination: "/search/sono-therapie",       permanent: true, has: [{ type: "query", key: "specialty", value: "sono-therapie" }] },
      { source: "/professional",                    destination: "/search/infirmerie",          permanent: true, has: [{ type: "query", key: "specialty", value: "infirmerie" }] },
      { source: "/en/professional",                 destination: "/en/search/osteopathie",      permanent: true, has: [{ type: "query", key: "specialty", value: "osteopathie" }] },
      { source: "/en/professional",                 destination: "/en/search/sophrologie",      permanent: true, has: [{ type: "query", key: "specialty", value: "sophrologie" }] },
      { source: "/en/professional",                 destination: "/en/search/naturopathie",     permanent: true, has: [{ type: "query", key: "specialty", value: "naturopathie" }] },
      { source: "/en/professional",                 destination: "/en/search/psychotherapie",   permanent: true, has: [{ type: "query", key: "specialty", value: "psychotherapie" }] },
      { source: "/en/professional",                 destination: "/en/search/kinesitherapie",   permanent: true, has: [{ type: "query", key: "specialty", value: "kinesitherapie" }] },
      { source: "/en/professional",                 destination: "/en/search/massotherapie",    permanent: true, has: [{ type: "query", key: "specialty", value: "massotherapie" }] },
      { source: "/en/professional",                 destination: "/en/search/nutrition",        permanent: true, has: [{ type: "query", key: "specialty", value: "nutrition" }] },
      { source: "/en/professional",                 destination: "/en/search/coaching-sportif", permanent: true, has: [{ type: "query", key: "specialty", value: "coaching-sportif" }] },
      { source: "/en/professional",                 destination: "/en/search/cupping-therapy-hijama", permanent: true, has: [{ type: "query", key: "specialty", value: "cupping-therapy-hijama" }] },
      { source: "/en/professional",                 destination: "/en/search/psychologie",      permanent: true, has: [{ type: "query", key: "specialty", value: "psychologie" }] },
      { source: "/en/professional",                 destination: "/en/search/orthophonie",      permanent: true, has: [{ type: "query", key: "specialty", value: "orthophonie" }] },
      { source: "/en/professional",                 destination: "/en/search/sexologie",        permanent: true, has: [{ type: "query", key: "specialty", value: "sexologie" }] },
      { source: "/en/professional",                 destination: "/en/search/psychomotricite",  permanent: true, has: [{ type: "query", key: "specialty", value: "psychomotricite" }] },
      { source: "/en/professional",                 destination: "/en/search/neuropsychologie", permanent: true, has: [{ type: "query", key: "specialty", value: "neuropsychologie" }] },
      { source: "/en/professional",                 destination: "/en/search/jiu-jitsu",        permanent: true, has: [{ type: "query", key: "specialty", value: "jiu-jitsu" }] },
      { source: "/en/professional",                 destination: "/en/search/art-martial-therapie", permanent: true, has: [{ type: "query", key: "specialty", value: "art-martial-therapie" }] },
      { source: "/en/professional",                 destination: "/en/search/yoga",             permanent: true, has: [{ type: "query", key: "specialty", value: "yoga" }] },
      { source: "/en/professional",                 destination: "/en/search/meditation",       permanent: true, has: [{ type: "query", key: "specialty", value: "meditation" }] },
      { source: "/en/professional",                 destination: "/en/search/sono-therapie",    permanent: true, has: [{ type: "query", key: "specialty", value: "sono-therapie" }] },
      { source: "/en/professional",                 destination: "/en/search/infirmerie",       permanent: true, has: [{ type: "query", key: "specialty", value: "infirmerie" }] },
      { source: "/specialistes",                    destination: "/search/osteopathie",          permanent: true, has: [{ type: "query", key: "specialty", value: "osteopathie" }] },
      { source: "/specialistes",                    destination: "/search/sophrologie",         permanent: true, has: [{ type: "query", key: "specialty", value: "sophrologie" }] },
      { source: "/specialistes",                    destination: "/search/naturopathie",        permanent: true, has: [{ type: "query", key: "specialty", value: "naturopathie" }] },
      { source: "/specialistes",                    destination: "/search/psychotherapie",      permanent: true, has: [{ type: "query", key: "specialty", value: "psychotherapie" }] },
      { source: "/specialistes",                    destination: "/search/kinesitherapie",      permanent: true, has: [{ type: "query", key: "specialty", value: "kinesitherapie" }] },
      { source: "/specialistes",                    destination: "/search/massotherapie",       permanent: true, has: [{ type: "query", key: "specialty", value: "massotherapie" }] },
      { source: "/specialistes",                    destination: "/search/nutrition",           permanent: true, has: [{ type: "query", key: "specialty", value: "nutrition" }] },
      { source: "/specialistes",                    destination: "/search/coaching-sportif",    permanent: true, has: [{ type: "query", key: "specialty", value: "coaching-sportif" }] },
      { source: "/specialistes",                    destination: "/search/cupping-therapy-hijama", permanent: true, has: [{ type: "query", key: "specialty", value: "cupping-therapy-hijama" }] },
      { source: "/specialistes",                    destination: "/search/psychologie",         permanent: true, has: [{ type: "query", key: "specialty", value: "psychologie" }] },
      { source: "/specialistes",                    destination: "/search/orthophonie",         permanent: true, has: [{ type: "query", key: "specialty", value: "orthophonie" }] },
      { source: "/specialistes",                    destination: "/search/sexologie",           permanent: true, has: [{ type: "query", key: "specialty", value: "sexologie" }] },
      { source: "/specialistes",                    destination: "/search/psychomotricite",     permanent: true, has: [{ type: "query", key: "specialty", value: "psychomotricite" }] },
      { source: "/specialistes",                    destination: "/search/neuropsychologie",    permanent: true, has: [{ type: "query", key: "specialty", value: "neuropsychologie" }] },
      { source: "/specialistes",                    destination: "/search/jiu-jitsu",           permanent: true, has: [{ type: "query", key: "specialty", value: "jiu-jitsu" }] },
      { source: "/specialistes",                    destination: "/search/art-martial-therapie", permanent: true, has: [{ type: "query", key: "specialty", value: "art-martial-therapie" }] },
      { source: "/specialistes",                    destination: "/search/yoga",                permanent: true, has: [{ type: "query", key: "specialty", value: "yoga" }] },
      { source: "/specialistes",                    destination: "/search/meditation",          permanent: true, has: [{ type: "query", key: "specialty", value: "meditation" }] },
      { source: "/specialistes",                    destination: "/search/sono-therapie",       permanent: true, has: [{ type: "query", key: "specialty", value: "sono-therapie" }] },
      { source: "/specialistes",                    destination: "/search/infirmerie",          permanent: true, has: [{ type: "query", key: "specialty", value: "infirmerie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/osteopathie",      permanent: true, has: [{ type: "query", key: "specialty", value: "osteopathie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/sophrologie",      permanent: true, has: [{ type: "query", key: "specialty", value: "sophrologie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/naturopathie",     permanent: true, has: [{ type: "query", key: "specialty", value: "naturopathie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/psychotherapie",   permanent: true, has: [{ type: "query", key: "specialty", value: "psychotherapie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/kinesitherapie",   permanent: true, has: [{ type: "query", key: "specialty", value: "kinesitherapie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/massotherapie",    permanent: true, has: [{ type: "query", key: "specialty", value: "massotherapie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/nutrition",        permanent: true, has: [{ type: "query", key: "specialty", value: "nutrition" }] },
      { source: "/en/specialistes",                 destination: "/en/search/coaching-sportif", permanent: true, has: [{ type: "query", key: "specialty", value: "coaching-sportif" }] },
      { source: "/en/specialistes",                 destination: "/en/search/cupping-therapy-hijama", permanent: true, has: [{ type: "query", key: "specialty", value: "cupping-therapy-hijama" }] },
      { source: "/en/specialistes",                 destination: "/en/search/psychologie",      permanent: true, has: [{ type: "query", key: "specialty", value: "psychologie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/orthophonie",      permanent: true, has: [{ type: "query", key: "specialty", value: "orthophonie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/sexologie",        permanent: true, has: [{ type: "query", key: "specialty", value: "sexologie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/psychomotricite",  permanent: true, has: [{ type: "query", key: "specialty", value: "psychomotricite" }] },
      { source: "/en/specialistes",                 destination: "/en/search/neuropsychologie", permanent: true, has: [{ type: "query", key: "specialty", value: "neuropsychologie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/jiu-jitsu",        permanent: true, has: [{ type: "query", key: "specialty", value: "jiu-jitsu" }] },
      { source: "/en/specialistes",                 destination: "/en/search/art-martial-therapie", permanent: true, has: [{ type: "query", key: "specialty", value: "art-martial-therapie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/yoga",             permanent: true, has: [{ type: "query", key: "specialty", value: "yoga" }] },
      { source: "/en/specialistes",                 destination: "/en/search/meditation",       permanent: true, has: [{ type: "query", key: "specialty", value: "meditation" }] },
      { source: "/en/specialistes",                 destination: "/en/search/sono-therapie",    permanent: true, has: [{ type: "query", key: "specialty", value: "sono-therapie" }] },
      { source: "/en/specialistes",                 destination: "/en/search/infirmerie",       permanent: true, has: [{ type: "query", key: "specialty", value: "infirmerie" }] },
      { source: "/professional",                    destination: "/search/all",                 permanent: true },
      { source: "/en/professional",                 destination: "/en/search/all",              permanent: true },
      { source: "/specialistes",                    destination: "/search/all",                 permanent: true },
      { source: "/en/specialistes",                 destination: "/en/search/all",              permanent: true },
      { source: "/specialistes/:path*",             destination: "/professional/:path*",        permanent: true },
      { source: "/en/specialistes/:path*",          destination: "/en/professional/:path*",     permanent: true },

      /* Old per-profile booking sub-page → the same specialist's profile
         (the new booking flow is the in-profile booking panel; each target
         route is verified to exist in /professional/[slug]). Only the
         canonical 10 live slugs are wired — unknown slugs stay 404. */
      { source: "/professional/nadine-kita/booking",          destination: "/professional/nadine-kita",          permanent: true },
      { source: "/professional/dr-amal-benali/booking",      destination: "/professional/dr-amal-benali",        permanent: true },
      { source: "/professional/khalid-ouazzani/booking",     destination: "/professional/khalid-ouazzani",       permanent: true },
      { source: "/professional/nadia-tazi/booking",          destination: "/professional/nadia-tazi",            permanent: true },
      { source: "/professional/yassine-el-amrani/booking",   destination: "/professional/yassine-el-amrani",     permanent: true },
      { source: "/professional/sara-mansouri/booking",       destination: "/professional/sara-mansouri",         permanent: true },
      { source: "/professional/mehdi-irzi/booking",          destination: "/professional/mehdi-irzi",            permanent: true },
      { source: "/professional/najat-berrada/booking",       destination: "/professional/najat-berrada",         permanent: true },
      { source: "/professional/omar-tazi/booking",           destination: "/professional/omar-tazi",             permanent: true },
      { source: "/professional/fatima-zahra-alami/booking",  destination: "/professional/fatima-zahra-alami",    permanent: true },
      { source: "/en/professional/nadine-kita/booking",          destination: "/en/professional/nadine-kita",          permanent: true },
      { source: "/en/professional/dr-amal-benali/booking",      destination: "/en/professional/dr-amal-benali",        permanent: true },
      { source: "/en/professional/khalid-ouazzani/booking",     destination: "/en/professional/khalid-ouazzani",       permanent: true },
      { source: "/en/professional/nadia-tazi/booking",          destination: "/en/professional/nadia-tazi",            permanent: true },
      { source: "/en/professional/yassine-el-amrani/booking",   destination: "/en/professional/yassine-el-amrani",     permanent: true },
      { source: "/en/professional/sara-mansouri/booking",       destination: "/en/professional/sara-mansouri",         permanent: true },
      { source: "/en/professional/mehdi-irzi/booking",          destination: "/en/professional/mehdi-irzi",            permanent: true },
      { source: "/en/professional/najat-berrada/booking",       destination: "/en/professional/najat-berrada",         permanent: true },
      { source: "/en/professional/omar-tazi/booking",           destination: "/en/professional/omar-tazi",             permanent: true },
      { source: "/en/professional/fatima-zahra-alami/booking",  destination: "/en/professional/fatima-zahra-alami",    permanent: true },

      /* Login: live wenaya aliases fold into our locale pages.
         /en/user/sign-in → /en/login; /user/sign-in → /login.
         Signup mirrors the same treatment (live /user/sign-up → /signup). */
      { source: "/user/sign-in",   destination: "/login", permanent: true },
      { source: "/en/user/sign-in", destination: "/en/login", permanent: true },
      { source: "/user/sign-up",   destination: "/signup", permanent: true },
      { source: "/en/user/sign-up", destination: "/en/signup", permanent: true },

      /* Practices: legacy accented slugs → normalized ASCII slugs (existing routes).
         Incoming paths are URL-encoded (e.g. é → %C3%A9), and Next.js matches redirect
         `source` against the encoded path, so sources are written percent-encoded below. */
      { source: "/pratiques/art-martial-th%C3%A9rapie", destination: "/pratiques/art-martial-therapie", permanent: true },
      { source: "/pratiques/kin%C3%A9sith%C3%A9rapie",   destination: "/pratiques/kinesitherapie",       permanent: true },
      { source: "/pratiques/massoth%C3%A9rapie",         destination: "/pratiques/massotherapie",        permanent: true },
      { source: "/pratiques/m%C3%A9ditation",            destination: "/pratiques/meditation",           permanent: true },
      { source: "/pratiques/psychomotricit%C3%A9",       destination: "/pratiques/psychomotricite",      permanent: true },
      { source: "/pratiques/psychoth%C3%A9rapie",        destination: "/pratiques/psychotherapie",       permanent: true },
      { source: "/pratiques/ost%C3%A9opathie",           destination: "/pratiques/osteopathie",          permanent: true },
      { source: "/pratiques/sono-th%C3%A9rapie",         destination: "/pratiques/sono-therapie",        permanent: true },
      /* EN equivalents */
      { source: "/en/pratiques/art-martial-th%C3%A9rapie", destination: "/en/pratiques/art-martial-therapie", permanent: true },
      { source: "/en/pratiques/kin%C3%A9sith%C3%A9rapie",   destination: "/en/pratiques/kinesitherapie",       permanent: true },
      { source: "/en/pratiques/massoth%C3%A9rapie",         destination: "/en/pratiques/massotherapie",        permanent: true },
      { source: "/en/pratiques/m%C3%A9ditation",            destination: "/en/pratiques/meditation",           permanent: true },
      { source: "/en/pratiques/psychomotricit%C3%A9",       destination: "/en/pratiques/psychomotricite",      permanent: true },
      { source: "/en/pratiques/psychoth%C3%A9rapie",        destination: "/en/pratiques/psychotherapie",       permanent: true },
      { source: "/en/pratiques/ost%C3%A9opathie",           destination: "/en/pratiques/osteopathie",          permanent: true },
      { source: "/en/pratiques/sono-th%C3%A9rapie",         destination: "/en/pratiques/sono-therapie",        permanent: true },

      /* ── Category 6: Shop launch freeze (temporary — permanent: false) ──
         The commerce frontend is paused. /produits and /en/produits render a
         premium "coming soon" editorial page; product-detail deep links fold
         onto the corresponding listing, and cart/checkout redirect to the
         listing too. `:path+` (one+ segments) so `/produits` itself is NOT
         matched (avoids a self-redirect loop). Existing shop code stays on
         disk untouched — 307 so nothing is cached as gone while paused. */
      { source: "/produits/:path+",     destination: "/produits",     permanent: false },
      { source: "/en/produits/:path+",  destination: "/en/produits",  permanent: false },
      { source: "/panier",              destination: "/produits",     permanent: false },
      { source: "/en/panier",           destination: "/en/produits",  permanent: false },
      { source: "/checkout",            destination: "/produits",     permanent: false },
      { source: "/en/checkout",         destination: "/en/produits",  permanent: false },
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

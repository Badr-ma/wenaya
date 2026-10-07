# Wenaya — Technical SEO Audit (pre-launch)

**Date:** 2026-09-28 · **Status:** READ-ONLY, nothing changed or pushed.
**Scope:** `C:\Users\hp\wenaya` (Next.js 16 App Router, FR `/…` + EN `/en/…`).
**Method:** source review + live probes against an ISOLATED production build
(`http://127.0.0.1:3026`, fresh `next build`, junctioned `src/`/`node_modules`/`public`)
so the running repo dev server, `.next`, and any prod instance were untouched.
Evidence scripts/reports: `%TEMP%\opencode\seo-ssr-probes.mjs` →
`seo-ssr-probes-report.txt`, `seo-diag.mjs` → `seo-diag.txt`, `sitemap-raw.xml`.

---

## Executive summary

The site is in strong SEO shape: canonical self-links, fr-MA/en-MA/x-default
hreflang pairs, clean ASCII URL architecture, a 216-row managed redirect table,
JSON-LD organization/clinic/page breadcrumbs, per-route robots, and a strict
Content-Security-Policy. The SSR probe suite was **88 PASS / 34 FAIL**, of which
**30 FAILs are harness-expectation bugs** (Next serves relative `Location` headers,
canonicals without a trailing slash, `Physician` JSON-LD `@type`, and two
fabricated probe URLs — all correct behavior, verified by follow-through).

**Two real, fixable defects were found:**

1. **[P1] `sitemap.xml` is invalid XML.** The care-journey URLs whose slugs
   contain `&` (`grossesse-&-maternite`, `kinesitherapie-&-avc`) are emitted with a
   **raw `&`** — 12 unescaped entities (4 `<loc>` + 8 `xhtml:link` alternates,
   byte length 86,211, 217 locs). Next's `MetadataRoute.Sitemap` **does not
   auto-escape** these. PowerShell `[xml]` strict parse throws
   `An error occurred while parsing EntityName` at the first occurrence. This can
   cause Google to reject the file or drop those URLs. **Fix:** emit `&amp;` in
   `src/app/sitemap.ts` for these two slugs (loc + alternates).
2. **[P2] Brand suffix duplicated in `<title>` on many pages.** The root layouts
   set `title.template: "%s | Wenaya"`, and several pages **also** hard-code the
   brand in their own `title`, producing `… | Wenaya | Wenaya`,
   `… | Wenaya Casablanca | Wenaya`, `… | Wenaya Corporate | Wenaya`. Confirmed on
   FR+EN: corporate, about-us, professional/[slug], articles (lists), care-journey
   details, maux-troubles/[slug], login, par des pages listing `| Wenaya` inline.
   **Fix:** strip the brand from per-page `title` strings (let the template add it
   once), or set `title: { absolute: … }` where the full suffix is intentional.

---

## A. Route inventory (isolated build route table)

| Route (FR / EN) | Mode | Notes |
|---|---|---|
| `/`, `/en` | ● static | CMS-driven fallback + Redis config |
| `/search/all`, `/search/{slug}`, /en× | ƒ dynamic | URL-driven specialty in path; q via query |
| `/professional/[slug]`, /en× | ƒ dynamic | live professionals API |
| `/professional`, /en× | ƒ dynamic | now 308s → `/search/all` |
| `/maux-troubles`, `/en/health-needs` | ● static | hub |
| `/maux-troubles/[slug]`, `/en/health-needs/[slug]` | ● ISR 1h | 8 live slugs each |
| `/parcours-de-soins`, /en× (hub) | ● static | |
| `/parcours-de-soins/[slug]`, /en× | ● static | 7 journeys × 2 |
| `/pratiques`, /en× | ○ ISR 1h | API-backed listing |
| `/pratiques/[slug]`, /en× | ● ISR 1h | 19 × 2 |
| `/seance-de-groupe`, /en× | ○ ISR 10m | live + editorial |
| `/seance-de-groupe/[slug]`, /en× | ● ISR 10m | 6 editorial + 2 live programs |
| `/articles`, /en×, `/articles/[slug]`, /en× | ● static / SSG | live API articles (18 slugs) |
| `/produits/[slug]`, /en× | ● static (~60 paths) | — inactive shop |
| `/corporate`, /en× + `/corporate/programmes/[slug]` | ● static | |
| `/clinique/wenaya-casablanca`, `/en/clinic/wenaya-casablanca` | ○ ISR 1h | clinic |
| `/about-us`, `/en/about-us` | ● static | |
| `/soins-a-domicile` | ● static | FR-only (EN 404 — intentional, same as live) |
| `/login`, `/signup`, `/compte/*`, `/panier`, `/checkout`, /en× | ● static | all noindex |
| `/admin`, `/api/*` | — | noindex / robots-blocked |
| `/not-found` (fr/en) | ● | custom 404 |

404 behavior via `experimental.globalNotFound` renders the French global 404;
unknown slugs on journeys/professionals/details verified to return true 404
(no soft-200).

---

## B. Metadata matrix

- **Root (both layouts):** `metadataBase=SITE_URL`; `title.default` + `template
  "%s | Wenaya"`; FR/EN localised descriptions; `robots index/follow`,
  `googleBot max-snippet:-1, max-image-preview:large`; `verification` via
  `NEXT_PUBLIC_GSC_VERIFICATION` / `NEXT_PUBLIC_BING_VERIFICATION`; `alternates
  canonical: SITE_URL`. Default OG/TW are FR-correct on the FR layout (fixed in an
  earlier phase), EN layout supplies `en_MA` + `ENGLISH_HOME_URL`.
- Per-page pages override title/description/canonical/hreflang (`languageAlternates`
  FR/x-default + EN for every public route; EN segment-diff helpers for
  `clinique→clinic`, `maux-troubles→health-needs`, `configurateur→configurator`).
- **Findings:** P2 double-brand suffix (see §F2). Otherwise titles, descriptions,
  canonicals, OG, and hreflang pairs verified present and byte-correct on sampled
  FR+EN pairs including the tricky `maux-troubles ↔ health-needs` both directions.

## C. Specialty / professional URLs

- Canonical professional detail URL = `/professional/{slug}`, `slug` sourced from
  the live professionals API (`slug ← api.slug`), accent-canonicalized.
- Specialty listing URL = `/search/{slug}` (specialty in **path**, q only in query);
  `slug === "all"` → unfiltered. Invalid slugs → `notFound()` in both metadata +
  body (verified 404).
- Redirects (`next.config.ts`, permanent): `has`-query rows `/professional?specialty=X`
  and `/specialistes?specialty=X` → `/search/X`, then bare `/professional`,
  `/en/professional`, `/specialistes`, `/en/specialistes` → `/search/all`; legacy
  `/specialistes/:path*` → `/professional/:path*` kept.
- **Note (documented, not a bug):** when a `?specialty=` redirect fires, Next
  preserves the untracked query param on the destination (`/search/nutrition?specialty=nutrition`).
  The page's canonical is clean (`/search/nutrition`), so indexing is unaffected;
  cosmetic only. (See §F5.)
- Practice detail pages render a "Voir les professionnels" link → `/search/{slug}`
  gated on live specialists (never a dead-end); same gating used across site CTAs.

## D. hreflang pairing

- Verified pairs (fr-MA ↔ en-MA + x-default=FR) on: home FR/EN, clinic pair
  (`/clinique/wenaya-casablanca` ↔ `/en/clinic/wenaya-casablanca`), about-us,
  prácticas, maux-troubles hub+detail ↔ health-needs hub+detail, parcours-de-soins
  hub+detail, seance-de-groupe, programmes, login/signup/compte, panier/checkout.
- `x-default` = FR everywhere (matches audience + `lang` config).
- **Note:** the site mixes two hreflang emission conventions across helpers —
  `sitemap.ts` emits `{x-default, en}` per URL while pages emit
  `{x-default, fr-MA, en-MA}` via `languageAlternates`. Both are valid; §F4.
- FR home canonical/hreflang render WITHOUT a trailing slash (`https://www.wenaya.com`).
  Semantically fine; only differs from the trailing-slash style used elsewhere.

## E. Structured data (JSON-LD)

- Site-wide `@graph` in both root layouts: Organization `#organization`,
  MedicalBusiness/LocalBusiness `#clinic`, WebSite `#website` (FR vs EN `url`/
  `inLanguage` differ correctly). WebSite `inLanguage: ["fr-MA","ar-MA","en"]` (FR).
- Per-page: BreadcrumbList (via Breadcrumbs on detail routes), FAQPage,
  ItemList/Product, and specialist detail emits `@type: "Physician"` with
  `medicalSpecialty`, `worksFor` → `#clinic`, `hasOfferCatalog`, `aggregateRating`
  (verified on `/professional/nadine-kita`).
- Homepage emits `MedicalBusiness`/`LocalBusiness` (+ og) correctly for the region.

## F. Findings — full list

### F1. P1 — sitemap invalid XML (raw `&`)
- Where: served `/sitemap.xml` (217 locs, 86,211 bytes).
- What: raw `&` in `<loc>` and `xhtml:link` for
  `/parcours-de-soins/grossesse-&-maternite`, `/en/…`,
  `/parcours-de-soins/kinesitherapie-&-avc`, `/en/…` → **12 unescaped entities**.
- Proof: regex count = 12; `[xml]` strict parse throws
  `An error occurred while parsing EntityName. Line ~1365`; probe harness flagged
  both the loc and alternates.
- Fix: `src/app/sitemap.ts` — emit `&amp;` for these two journey slugs in `loc`
  and both alternates (Next's `MetadataRoute.Sitemap` does not escape).
- Deliverable state: **open**.

### F2. P2 — duplicate brand suffix in `<title>`
- Where: root layout `title.template: "%s | Wenaya"` + pages that hard-code the brand.
- Confirmed examples (isolated build):
  - `/corporate` → `Bien-être en Entreprise — Programmes Santé & Prévention | Wenaya | Wenaya`
  - `/about-us` → `Qui sommes nous | Wenaya | Wenaya`
  - `/professional/nadine-kita` → `Nadine Kita — Kinésithérapeute | Wenaya Casablanca | Wenaya`
  - `/articles` → `Blog Santé & Bien-être — Conseils, Études et Guides | Wenaya | Wenaya`
  - `/parcours-de-soins/grossesse-&-maternite` → `Grossesse & Maternité | Wenaya | Wenaya`
  - `/corporate/programmes/pcm` → `Process Communication Model® | Wenaya Corporate | Wenaya`
  - `/login` → `Connexion — Espace Patient Wenaya | Wenaya`
  - EN mirrors equivalent (`/en/corporate`, `/en/about-us`, `/en/professional/…`).
- Fix: remove the brand suffix from per-page `title` strings (single source:
  root template), or `title: { absolute: "… | Wenaya Corporate" }` where distinctive.
- Deliverable state: **open**.

### F3. P3 — `/produits/[slug]` statics render canonical-self while redirected
- The inactive shop: `/produits` listing + `/produits/{slug}` detail pages are
  pre-rendered statics that 307-redirect their own URLs to `/produits`. The
  product details are correctly absent from sitemap, but the two SRP/detail
  canonical tags point to redirect sources. In the short term this is harmless
  (307 sources don't index), but the pages themselves are dead weight (see §G4).

### F4. P3 — two hreflang emission conventions
- sitemap emits `xhtml:link rel="alternate" hreflang="x-default|en"` (2 per pair);
  pages emit `fr-MA|en-MA|x-default` (3). Both valid; recommend unifying on the
  3-form to match the main pages and reduce cross-engine inconsistencies.

### F5. P3 — redirected query param preserved on `has`-query redirects
- `/professional?specialty=nutrition` → `/search/nutrition?specialty=nutrition`
  (Next preserves untracked params). Canonical is clean; cosmetic. If it must
  disappear, add explicit `destination` querystring or `query: {}` in the redirect
  definition.

### F6. P3 — no `Strict-Transport-Security`
- No HSTS header in `headers()` (`next.config.ts`). CSP (`default-src 'self'`,
  inline scripts/styles for GSAP/next, no object-src/frame/plugin, `base-uri 'self'`)
  is strong and identical FR/EN. HSTS is a small, recommended add for a public
  launch (esp. since `admins`/`api` and the patient login flows exist).

### F7. Info — robots/networking tidy-ups
- `robots.ts` disallows `/api`, `/login`, `/en/login`, `/signup`, `/en/signup`,
  `/admin`; allows `/compte`. Several protected routes (`/compte/*`, `/panier`,
  `/checkout`) are noindexed via page `robots.noindex` meta rather than
  `robots.txt` rows — fine, but keep the noindex metas when any route becomes
  server-rendered/auth-gated.

---

## G. Observations / classification (harness vs site) — probe suite 88/34

**Harness bugs (NOT site defects — verified by follow-through):**
- Redirect `Location` headers are RELATIVE (`/about-us`, `/articles`, `/search/all`),
  not absolute URLs — Next's standard behavior; browsers/followers handle fine.
- FR home canonical + hreflang emit without trailing slash.
- `Physician` JSON-LD `@type` (my probe expected ProfilePage).
- Two fabricated probe URLs (`/en/parcours-de-soins/le-vertige-positionnel-fr`;
  an EN articles URL) — real URLs verified 200/behaved correctly.
- 16 "redirect expected absolute" FAIL lines = all the above collapsed.

**Verified-correct (sample):**
- All 20 redirect-spotchecks (308 `Location` + final 200 single-hop / 307 temp).
- `/search/all` + `/search/osteopathie` FR/EN: 200, canonical self, indexable.
- `/search/not-a-specialty` → 404. Professional/journey unknown slugs → 404.
- `maux-troubles↔health-needs` + `clinique↔clinic` hreflang both directions.
- Journey detail canonical is HTML-escaped; hreflang alternates good.
- Shop freeze redirects (`/produits/{slug}`, `/panier`, `/checkout`) → 307.
- noindex pages present; `/ar/other/path` → 307 `/`.
- robots.txt has sitemap directive; `robots.txt` + meta robotics consistent.

---

## H. Implementation plan (ordered)

1. **P1 - Fix sitemap escaping** (`src/app/sitemap.ts`): emit `&amp;` for the two
   `&`-containing journey slugs (loc + alternates). Rebuild, then re-validate:
   `[xml]` parse OK + Google sitemap-validator clean + loc count unchanged (217).
2. **P2 - De-duplicate `<title>` brand suffix**: remove hard-coded brand from the
   pages listed in F2 (keep template). Verify each FR+EN title renders exactly one
   `| Wenaya`. Watch for the `Wenaya Casablanca` / `Wenaya Corporate` variants —
   decide on a single canonical brand suffix sitewide (recommend `| Wenaya`).
3. **P3 - HSTS**: add `Strict-Transport-Security` (60d+) + keep CSP. Optional but
   recommended for launch.
4. **P3 - Shop decision**: either remove the `/produits/[slug]` statics + redirects
   when the shop stays frozen, or leave (documented). If the shop is revived,
   route+canonical+sitemap pass is needed anyway.
5. **P3 - Unify hreflang convention** (F4) and decide on trailing-slash style (F6/F5).
6. **Re-run suite** against the real prod URL post-deploy; re-check the 4 real
   findings flipped to PASS and no new FAILs outside the known harness set.

## I. Issues requiring Jamal / product decisions (not code)
- Q1: Is the inactive shop (`/produits`, cart, checkout) to stay frozen, or is
  `produits/[slug]` to be removed entirely? (drives §H4)
- Q2: EN `maux-troubles` segment name `health-needs` (vs `maux-troubles`) — keep
  the localised EN segment difference? (affects sitemap/hreflang symmetry)
- Q3: Confirm canonical brand suffix choice (`| Wenaya` vs
  `| Wenaya Casablanca` vs `| Wenaya Corporate` per section) before applying §H2.
- Q4: HSTS + expiry (≥60d) sign-off.
- Q5: Redirection of `?specialty=` preserved query (F5) — accept, or clean with
  explicit `query: {}`.

---

## Verification evidence
- `%TEMP%\opencode\seo-ssr-probes.mjs` — probe runner (SSR, redirects, JSON-LD,
  titles, hreflang).
- `seo-ssr-probes-report.txt` — full PASS/FAIL log (88/34).
- `seo-diag.mjs` / `seo-diag.txt` — head-link dumps, JSON-LD dumps, corporate-title
  capture, sitemap raw-`&` count (= 12), byte length (86,211).
- `sitemap-raw.xml` — captured sitemap (invalid-XML reproduction).
- PowerShell `[xml]` strict parse of `sitemap-raw.xml` → `An error occurred while
  parsing EntityName` (P1 proof).
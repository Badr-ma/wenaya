# Wenaya Clinic <-> About Us page split — final report

**Date:** 2026-09-23 · Branch: `pre-production-cleanup` · NOT committed/pushed

## Outcome

The Clinic page and the About Us page are now **separate, first-class pages** matching live
`wenaya.com` semantics. Clinic design/content is byte-preserved, just relocated; `/about-us`
gained net-new editorial About content with real internal navigation.

## Routes (v4, no redirects — direct canonical)

| Page | FR | EN |
|---|---|---|
| Clinic | `/clinique/wenaya-casablanca` (○ ISR 1h) | `/en/clinic/wenaya-casablanca` (○ ISR 1h) |
| About Us | `/about-us` (○ static) | `/en/about-us` (○ static) |

`/about` → 308 → `/about-us`, `/en/about` → 308 → `/en/about-us`, `/ar/about-us` → 308 → `/about-us` (pre-existing, verified).

## Files

**Created**
- `src/components/about/AboutUs.tsx` — shared About content server component.
- `src/app/(fr)/clinique/wenaya-casablanca/page.tsx` — full clinic assembly (12 sections).
- `src/app/(en)/en/clinic/wenaya-casablanca/page.tsx` — EN clinic assembly.

**Rewritten**
- `src/app/(fr)/about-us/page.tsx` — About page (WebPage JSON-LD, metadata).
- `src/app/(en)/en/about-us/page.tsx` — EN About page.

**Modified (task this session)**
- `src/app/sitemap.ts` — clinic FR/EN pair with alternates (fr-MA/en-MA/x-default) + `dual("/about-us")`.

**Prior session (squashed)**
- `src/lib/href.ts` (clinicHref + switchLocalePathname clinic/configurator), `src/lib/hreflang.ts` (optional enPath), `src/components/Nav.tsx`, `src/components/nav/MobileMenu.tsx` (clinicHref prop), `src/components/Footer.tsx`, `src/components/clinic/StructuredData.tsx`, `src/components/Breadcrumbs.tsx`, `src/components/QuickAccessSection.tsx`, `src/components/domicile/Coordination.tsx`, `src/i18n/fr.ts` + `en.ts` (nav.clinique, nav.aPropos, footer singular, aboutUs block), `src/components/entreprises/Footer.tsx:155` + `next.config.ts` (about-intent refs kept).

## i18n

`aboutUs` block: `eyebrow, heading, lead, paragraphs[3], facts[3], ctaPrimary, ctaSecondary, ctaTertiary, ctaNavLabel, imageAlt`. Localized FR (accents) / EN (genuine, no translation).

## Verification

- **SSR harness** (`%TEMP%\opencode\clinic-about-qa.mjs`): **50/50 PASS** on fresh 308-page build:
  - 4 pages 200, exactly 1 `<h1>` each.
  - About: eyebrow/3 paragraphs/facts/CTAs present; **no clinic sections leak** (`ch-bg-wrap`, `Nos Pratiques`, HealthNeeds absent).
  - CTAs: clinic → correct locale clinic route, pratiques, booking.
  - Canonical, og:url, camelCase `hrefLang` (fr-MA/en-MA/x-default), WebPage JSON-LD + `inLanguage` fr-MA/en-MA, og:locale en_MA.
  - Clinic: canonical, hreflang, MedicalBusiness JSON-LD, breadcrumbs Clinique/Wenaya.
  - Sitemap: clinic FR+EN present with alternates; about-us pair present.
- **Real-browser CDP** (`clinic-nav-cdp.mjs` + `sw-reverse.mjs`): **17/17 PASS**:
  - Nav has Clinique + À propos items routing to correct locale pages; no `/en/clinique` or `/clinique` bad hrefs on either locale.
  - Language switcher round-trips all 4 directions:
    `FR clinic → /en/clinic/wenaya-casablanca`, `EN clinic → /clinique/wenaya-casablanca`,
    `FR about → /en/about-us`, `EN about → /about-us`.
- **Redirects:** `/about`, `/en/about`, `/ar/about-us` all 308 to correct targets.
- **Gates:** `npx tsc --noEmit` clean; eslint on 12 touched files clean; `npm run build` 308 static pages (kill-node + `Remove-Item .next` first).

## Notes

- Harness lessons: `hrefLang` is camelCase in SSR (probes on `hreflang=` fail by design); JSON-LD lives in `<script>` (strip before text probes, keep for JSON-LD probes); CTAs appear more than once (nav duplicates) — assert `>= 1`, and TR-FR switcher button matches `aria-label`, not "FR/EN" text.
- The switcher is client-side; runtime navigation verified in-browser.
- No visual QA by model (cannot view pixels) — screenshots for eyeball: `%TEMP%\opencode\` (`edh-shots`, `cli-nav-shots` from prior session). Visual checks (hero palette, spacing, mobile menu) remain a user browser check.
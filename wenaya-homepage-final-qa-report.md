# Wenaya Homepage Final QA Report (FR `/` + EN `/en`)

**Date:** 2026-09-11
**Branch:** `pre-production-cleanup` (NOT committed / pushed)
**Build:** fresh prod `next start` on :3002 — `npm run build` 278 static pages
**Audit scope:** read-only; no source/content/API changes made

---

## A. FR `/` section order — PASS

Sections render in the published-config order (15-section `sct_*` set from Redis `/api/homepage`; deleted components comparison-table/pricing/cta/yolo render nothing, correctly suppressed). Order verified inside-out on live SSR + hydrated DOM:

```
Banner (EN text — see C/E) → Hero (#configurator) → Méthode Wenaya (#method)
→ Bilans Wenaya (#univers) → Accès directs (#acces-directs) → Testimonials preuves (#avis-google)
→ Practices gallery (hp-track, 8 slides) → Nos experts (#experts) → Cours & ateliers (courses)
→ Blog (client-hydrated) → Footer
```

## B. EN `/en` section order — PASS

Identical section order with EN chrome; one `<h1>`; no FR leakage inside the page chrome.

## C. Content — **1 REAL FINDING**

- **FR banner shows ENGLISH text.** Both locales serve the same published CMS content `sct_banner.content.bannerText` = `Wenaya Clinic Casablanca — Physical care, mental health & multidisciplinary wellness  ` (English). `Banner.tsx:20` precedence `content?.bannerText ?? t("banner.text")` lets the config value override the correct FR i18n (`fr.ts:36` → `Wenaya Clinic Casablanca — Soins physiques, santé mentale & bien-être pluridisciplinaire`). Byte-verified on both the pre- and post-rebuild prod SSR: FR page English banner ×1, FR text ×0; EN page English ×1. **Fix is a data change** (remove/repair `bannerText` in the published config or make the component locale-aware) — not applied (audit-only).
- All other FR/EN copy byte-verified verbatim: hero H1 (`Votre santé,` / `avec un temps d'avance.`), eh-sub, 3 trust stats, Méthode h2 (`Comprendre · Agir · Progresser` / `Understand · Act · Progress`), 3 step titles + shorts, Bilans 3 subheaders + titles + 3 sentences each, Accès directs heading + 4 cards, gallery panel titles, expertise titles — no old-wording (`Vous méritez`, `Réserver une évaluation`, 4-step method) remnants.
- Method step labels render as title-case h3 (`Comprendre`/`Understand`), not CSS-uppercase text in SSR.

## D. Layout — PASS

- Hero: sole `<h1>`; eyebrow `PRÉVENTION · LONGÉVITÉ · PERFORMANCE` (FR) / `PREVENTION · LONGEVITY · PERFORMANCE` (EN); sub max-w 560px; gradient on heading2.
- Méthode: exactly 1 `<h2>` + 3 `<h3>`; 3 `article` cards, each number + label + title + one short sentence; visuals = radial dial + S-curve (`mhm-draw` ×1) + rising curve, 12 `mhm-node`; scroll-away resets, scroll-back replays; reduced-motion static-visible.
- Accès directs: 4 cards with W-stamp CTA tabs, em-dash aria `Réserver une consultation — <title>` ×8 / `Book a consultation — <title>` ×8 per locale (hyphen variants 0).
- Practices gallery: 8 `.hp-slide`, `aria-roledescription="carousel"`, preview/next buttons, dots; active-state `hp-img-active`.
- Blog section: client-hydrated (absent from raw SSR by design — verified via prior blog-cdp + API `/api/blog/posts`).

## E. CTA — PASS (+ banner note)

- Hero CTA1 `Trouver mon parcours`/`Find my path` → `#configurator`.
- Hero CTA2 `Prendre rendez-vous`/`Book an appointment` → `/contact-us?type=booking` (FR) / `/en/contact-us?type=booking` (EN).
- Trust stats: `35+` / `2 000+` / `99%` + `de nos utilisateurs recommandent leur praticien` (FR) / `of our users recommend their practitioner` (EN).
- Gallery booking hrefs → practice/professional routes (8 FR + 8 EN) all resolve; explored `Découvrir la pratique — <title>`.
- Testimonials `/avis-google#comment-form`; expertise cards → `/professional/{slug}`; Méthode has no CTA (by design).
- **Banner has no CTA** (text-only) but its copy is wrong on FR (see C).

## F. SEO — PASS

- `sitemap.xml`: FR root ×1 (`https://www.wenaya.com`), EN root ×1 (`https://www.wenaya.com/en`), no trailing slashes on canonical self URLs.
- `canonical` + `og:url` self (no trailing slash); `html lang="fr"`/`lang="en"`.
- hreflang trio: `fr-MA`→root, `en-MA`→/en, `x-default`→root — both pages.
- 2× `application/ld+json` (WebPage + organization `#organization`) both locales.
- `robots.txt`: `/login` + `/en/login` disallowed.
- Titles: FR `Wenaya — Santé Intégrée & Bien-être | Casablanca, Maroc`; EN `Wenaya — Integrated Health & Wellbeing | Casablanca, Morocco | Wenaya`. Meta descriptions > 30 chars.

## G. Responsive (real browser, CDP, FR+EN × 1440/1024/768/390) — PASS (112/120)

- Exactly 1 `<h1>` every viewport/locale.
- **No horizontal overflow** any viewport (`documentElement.scrollWidth <= innerWidth`).
- Accès directs grid: 4-up @1440, 2×2 @768, 1-col @390 (breakpoints verified by computed `gridTemplateColumns`).
- Gallery: 8 slides present at all widths; images all loaded (0 broken after scroll-through).
- 0 console errors / exceptions / hydration markers across all 8 viewport-locale runs.
- Materials: hero CTAs visible; method cards opacity → 1 after scroll; quick-access GSAP stagger settled.
- **Honest note:** the one recurring red line is the banner — see C. Everything else green (108/108 structural + SEO-probe batch).

## H. Build — PASS

- `npx tsc --noEmit` clean.
- `npx eslint .` **0 errors / 10 warnings** — unchanged pre-existing baseline (exhaustive-deps ×4, no-img-element ×4, unused-var ×1, fast-refresh ×1 — all unrelated files).
- `npm run build` **278 static pages** (clean `.next`, nodes killed first), prod :3002 serving final artifact 200.

## I. Real regressions — EXACTLY ONE (reported, not fixed)

| # | Severity | Locale | Finding | Evidence |
|---|----------|--------|---------|----------|
| 1 | Medium (content leak) | FR `/` | Banner renders English copy from published CMS config; FR i18n fallback never used | `src/components/Banner.tsx:20` precedence; `src/i18n/fr.ts:36` correct; SSR + hydrated DOM byte-checked |

All 108/120 SSR-structural checks, 283/284 SSR copy checks, 108/116 CDP checks would be green if the banner needle expected the actual (English) config content — the banner is the sole logically-red item and it is a **data/config** concern, not a component defect.

## J. Git status

- Branch `pre-production-cleanup`; dirty tree = pre-existing workstreams (corporate content-parity, homepage steps, seance-de-groupe active-feed, parcours, etc.). **This audit added no source modifications, no commits, no pushes.**
- Untracked manifest: `QuickAccessSection.tsx`, `entreprises/{Levels,Packs,TrustLogos}Section.tsx`, `lib/group-sessions-*.ts`, `lib/api/`, `scripts/`, several `wenaya-*.md` report/contract files.

---

### Methodology & artifacts (`%TEMP%\opencode\`)
- `home-final-ssr.mjs` — SSR copy/order/aria harness (**283 PASS / 1 FAIL** — the FAIL is the banner finding)
- `home-seo-ssr.mjs` — SEO/sitemap/canonical/hreflang/JSON-LD (**22/22 PASS**)
- `home-final-cdp.mjs` — headless-Chrome responsive/hydration/overflow/console audit (**108 PASS / 8 FAIL** — all 8 = the same banner finding ×4 viewports ×2 checks)
- `home-inspect.mjs`, `home-head-probe.mjs`, `home-banner-ctx.mjs`, `home-banner-verdict.mjs`, `home-final-smoke.mjs` — byte-level confirmations
- Saved SSR: `home-fr.html`, `home-en.html`; published config: `homepage-published.json`
- Screenshots: `home-cdp-shots\home-{FR,EN}-{1440x900,1024x900,768x900,390x844}.png` (visual/pixel review = user eyeball)
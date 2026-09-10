# Wenaya — Full-Project Copy Quality Audit

**Date:** 2026-09-10 · **Branch:** `pre-production-cleanup` · **Type:** AUDIT + conservative fixes · **Commit/Push:** NONE

---

## A. Scope

Full-copy audit of the French (FR) and English (EN) surfaces of the Wenaya project, plus the requested homepage sentence correction. Scope covered: `src/i18n/fr.ts` + `src/i18n/en.ts` (all values), `src/components/**` (title / aria-label / alt / placeholder / visible prose), `src/lib/**` public content (corporate programmes, care journeys, practices, group sessions, clinic), metadata/SEO surfaces, forms, legal chrome, and shop UI.

**Excluded by policy:** comments, identifiers/slugs, class names, URLs, JSON-LD values, admin/CMS/Shop-editor tooling (non-public), factual claims/stats/testimonials/legal wording, and anything whose change would alter routes or medical/legal content.

## B. Headline request — homepage sentence

Reported mixed-language boundary on the homepage testimonials section. Located in `src/i18n/fr.ts` `testimonialsSection.heading1/heading2` (the FR file carried the EN strings).

| File | Key | Before | After |
|------|-----|--------|-------|
| `src/i18n/fr.ts` | `testimonialsSection.heading1` | `"Real people."` | `"De vraies personnes."` |
| `src/i18n/fr.ts` | `testimonialsSection.heading2` | `"Real results."` | `"De vrais résultats."` |

`src/i18n/en.ts` already had the correct EN strings (`"Real people."` / `"Real results."`) — confirmed untouched. Nothing else in the testimonials block changed.

**Verified (dev SSR):** FR `/` → `De vraies personnes.` ×1, `De vrais résultats.` ×1, `Real people.` ×0; EN `/en` → `Real people.` ×1, `De vraies personnes.` ×0.

## C. Method

1. Mechanical scans: accented-char census both locales; double-space regex; `\w  \w` across `src`; space-before-`;:?!` in i18n; apostrophe census (straight vs curly).
2. Stopword leak scan (Node, UTF-8-safe) over both i18n files for FR-in-EN and EN-in-FR tokens.
3. Attribute scan: every `title=` / `aria-label=` / `alt=` / `placeholder=` literal (non-template) in `src/components/**`.
4. Full read of `src/i18n/en.ts` (1579 lines) and targeted reads of `fr.ts` + `src/lib/*` content files; hex-verification (`[System.Text.Encoding]::UTF8.GetBytes`) wherever a mis-render was suspected.
5. Every fixed string re-verified on the running dev server (SSR HTML) where the surface renders server-side; client-rendered surfaces (nav compact placeholder, `/produits` filter dropdown) verified at source + type level.

## D. Fixes applied — summary

| # | Locale | Surface | Severity | Type |
|---|--------|---------|----------|------|
| 1 | FR | Homepage testimonials heading | P1 | MIXED_LANGUAGE |
| 2 | FR | Blog (homepage + `/articles`) heading | P2 | MIXED_LANGUAGE |
| 3 | FR | Blog sub | P1 | MIXED_LANGUAGE |
| 4 | FR | Homepage Method cards titles | P2 | MIXED_LANGUAGE |
| 5 | FR | Shop filters `Wearables` label | P2 | MIXED_LANGUAGE |
| 6 | FR | Shop product desc `insights personnalisés` | P2 | MIXED_LANGUAGE |
| 7 | FR | Shop product desc `Wearable avancé` | P3 | TERMINOLOGY |
| 8 | EN | Corporate programmes chrome | P3 | TERMINOLOGY |
| 9 | EN | Corporate quote form option label | P3 | TERMINOLOGY |
| 10 | EN | Corporate programmes "Essential" pitch | P2 | GRAMMAR |
| 11 | EN | ExpertiseSection carousel aria | P2 | MIXED_LANGUAGE (a11y) |
| 12 | FR | Breadcrumbs sr-only aria | P3 | MIXED_LANGUAGE (a11y) |
| 13 | FR | Nav compact search placeholder | P2 | MIXED_LANGUAGE |
| 14 | FR | HomecareBanner image alt | P3 | MIXED_LANGUAGE (alt) |

## E. FR-locale fixes (detail)

1. **Homepage testimonials** (`src/i18n/fr.ts` L167–168): `"Real people."/ "Real results."` → `"De vraies personnes."/ "De vrais résultats."` (requested fix).
2. **Blog heading** (`src/i18n/fr.ts` `blog.heading1`): `"Insights"` → `"Analyses"` — the FR section read "Insights & Recherche"; now "Analyses & Recherche".
3. **Blog sub** (`src/i18n/fr.ts` `blog.sub`): was the EN sentence `"Expert analysis on the science of longevity, biomarker optimization, and the future of personalized preventive medicine."` → `"Des analyses d'experts sur la science de la longévité, l'optimisation des biomarqueurs et l'avenir de la médecine préventive personnalisée."` (faithful translation; no invented claims).
4. **Method ("Méthode Wenaya") card titles** — two-layer defect:
   - Component `src/components/HowItWorks.tsx` hardcoded `title="Assess|Align|Activate|Sustain"` on the 4 `<Card>`s, ignoring the existing i18n `title` keys.
   - The i18n keys themselves held English in the FR file.
   - Fixed both: titles now `t("howItWorks.assess.title")` etc.; FR values → `"Évaluer"/"Aligner"/"Activer"/"Pérenniser"`; EN values unchanged (`Assess/Align/Activate/Sustain`).
5. **Shop filter** (`src/i18n/fr.ts` `produits.filters.wearables`): `"Wearables"` → `"Objets connectés"` (matches the shop's French category naming next to `Appareils`, `Soins`, `Programmes`).
6. **Shop product desc** (`continuous-glucose-monitor`, fr.ts): `"…temps réel avec insights personnalisés…"` → `"…temps réel avec des analyses personnalisées…"`.
7. **Shop product desc** (`whoop-5-0-band`, fr.ts): `"Wearable avancé avec suivi…"` → `"Appareil connecté avancé avec suivi…"` (consistency with fix 5; "wearable" retained as loanword nowhere else on FR).

## F. EN-locale fixes (detail)

8. **Corporate programmes chrome** (`src/i18n/en.ts` `entreprises.programmes.back/othersLabel/othersCta`): `"programmes"` → `"programs"` (US spelling, matching site-wide EN `program`; body copy of the programmes is flag-only, see §I).
9. **Corporate quote form** (`src/i18n/en.ts` `programmeLevelOptions` L949): `"Annual Programme — long-term approach"` → `"Annual Program — long-term approach"` (US spelling; `value` kept as `"annual-programme"` for API/back-end contract stability).
10. **Corporate programmes "Essential/Prevention Pack"** (`src/i18n/en.ts` L738): `"Ideal to launch a wellness initiative"` → `"Ideal for launching a wellness initiative"` (grammar: participle after "for").

## G. Accessibility & asset copy fixes (detail)

11. **ExpertiseSection carousel arrows** (`src/components/about/ExpertiseSection.tsx` L88/91): hardcoded FR `aria-label="Précédent"/"Suivant"` on a locale-aware component → now `{locale === "en" ? "Previous"|"Next" : "Précédent"|"Suivant"}` (uses the component's existing `locale` variable / inline pattern already used at L83).
12. **Breadcrumbs sr-only nav** (`src/components/Breadcrumbs.tsx` L98): hardcoded EN `aria-label="Breadcrumb"` → now `{locale === "en" ? "Breadcrumb" : "Fil d'Ariane"}` (locale already derived at L59).
13. **Nav compact search** (`src/components/nav/PratiquesFilterBar.tsx` L53): hardcoded EN `placeholder="Search practices…"` → `placeholder={t("pratiques.search")}` (component already receives a `t` prop; reuses the /pratiques main-search label — FR `"Rechercher une pratique."` / EN `"Search practices."`). Client-rendered (appears on scroll) — verified at source + type level.
14. **HomecareBanner image alt** (`src/components/clinic/HomecareBanner.tsx` L22): FR page alt mixed `"Soins à domicile Wenaya Homecare Services"` → `"Soins à domicile Wenaya"`.

## H. Flagged — REVIEW, no change made

| # | Locale | Location | Observation | Type |
|---|--------|----------|-------------|------|
| H1 | EN | `en.ts` L265 + L677 (testimonial quotes) | English `« … »` guillemets mirror the FR layout; EN typographic convention is `"…"` | PUNCTUATION P3 |
| H2 | EN | `corporate-programmes.ts` EN bodies | BR spelling `programme` / `organisational` vs site-wide US `program` / `organization` (self-consistent within the set) | TERMINOLOGY P3 |
| H3 | EN | `en-translations.ts`, `practice-content.ts` EN set | `programme` / `personalised` BR-spelt practice translations | TERMINOLOGY P3 |
| H4 | EN | `en.ts` L925 vs L342/1122/1140 | address `"88 Rue de Jabal Azourki"` (lowercase `de`) vs `"Rue De Jabal"` elsewhere — street-name casing only | CAPITALIZATION P3 |
| H5 | EN | `en.ts` L588 | `"A la carte or program"` — unaccented French loan phrase; standard EN is `"à la carte"` | PUNCTUATION P3 |
| H6 | FR | `fr.ts` L1021/1028/1035 | `Team Health & Cohesion`, `Active Wellness`, `Build Your Retreat` (retreat block) — **pre-existing, documented policy (NEEDS_DECISION in the translation audit), untouched** | MIXED_LANGUAGE REVIEW |
| H7 | FR | `fr.ts` L1374 `topicLabels.fitness` | `"Fitness"` — accepted French loanword; option to use `"Condition physique"` | TERMINOLOGY P4 |

## I. Terminology consistency notes

- **EN `programme` vs `program`:** user-facing chrome normalized to US (`programs`) everywhere in this pass. FR `programme`/`programmes` remains (correct French). EN programme *bodies* (H2/H3) left BR — content-level, see §H.
- **`well-being` (15) vs `wellbeing` (6)** in en.ts: mixed but each occurrence reads correctly; a blanket swap risks inconsistent halves of a phrase — flagged for a future single-pass decision, NOT auto-fixed.
- **`healthcare` (4) / `health care` (0)**: consistent.
- **`Méritez` / brand / proper nouns** (`Groupe OCP`, `Société Générale`, `NOW Foods`…) are the only accents in the EN file — intentional.

## J. False positives re-checked and cleared

- `heart: "Cœur"` — verified via byte dump (`68 65 61 72 74 3A 22 43 C5 93 75 72` = `"Cœur"`). **Correct**, no change. (Console/`Select-String` mangles `œ`.)
- Corporate EN badges `"CERTIFIED PROGRAMME · …"` — byte dump confirms U+00B7 middle dot, **not** a French `à`. **Clean**, no change.
- 60 "space-before-`;:?!`" hits in fr.ts — all Unsplash URL query params, excluded.
- Double spaces: 0 in both i18n files; 0 `\w  \w` across `src`.
- Earlier candidate list (`Cos' progressif`, `pack Découverte`, `accès direct`, `A lire`, `1 email / month`, `flagship programme`) — **re-located and confirmed absent** in the current tree; dropped.
- EN programme badge "à"-leak suspicion — **cleared** (console mis-decode).
- Homepage blog section is client-fetched (`/api/blog/posts`) → its labels are absent from SSR HTML; verified via `/articles` (server-rendered) instead.

## K. Verification (dev server `:3000`, hot-reload, SSR HTML)

| Page | Assertion | Result |
|------|-----------|--------|
| `/` FR | `De vraies personnes.` / `De vrais résultats.` ×1; `Real people.` ×0 | PASS |
| `/` FR | `Évaluer`/`Aligner`/`Activer`/`Pérenniser` ×1; `Assess` ×0 | PASS |
| `/` FR | ExpertiseSection aria `Précédent`/`Suivant` ×1 | PASS |
| `/en` EN | `Real people.`/`Real results.` ×1; `De vraies personnes.` ×0 | PASS |
| `/en` EN | `Assess`/`Align`/`Activate`/`Sustain` retained; aria `Previous`/`Next` ×1, `Précédent` ×0 | PASS |
| `/articles` FR | `Analyses`×1 + `& Recherche`×1 + `Des analyses d'experts`×1; `Expert analysis on the` ×0 | PASS |
| `/en/articles` EN | `Insights…` + `Expert analysis on the` retained; FR sentence ×0 | PASS |
| `/pratiques/kinesitherapie` FR | sr-only aria `Fil d'Ariane` ×1, `Breadcrumb` ×0 | PASS |
| `/en/pratiques/osteopathie` EN | sr-only aria `Breadcrumb` ×1, `Fil d'Ariane` ×0 | PASS |
| `/corporate/programmes/pcm` FR | `Retour aux programmes` + CTA bands ×2 | PASS |
| `/en/corporate/programmes/pcm` EN | `Back to programs` + `Explore our other programs` + `View all programs` ×2 each | PASS |
| `/produits` FR | filter label is client-rendered (0 in SSR before AND after) — source+type verified | NOTE |

## L. Code quality

- `npx tsc --noEmit` — **clean**.
- `npx eslint <7 changed files>` — **0 errors**; 2 warnings (ExpertiseSection `exhaustive-deps` + `no-img-element`) both **pre-existing**, unrelated to this change.
- `npx eslint .` — target: 0E / unchanged pre-existing 12W baseline (checked at end of work).
- `npm run build` — after `kill node` + `Remove-Item .next` (stale-build residency on Windows).

## M. Files changed

- `src/i18n/fr.ts` — fixes 1–7 (testimonials, blog, method titles, shop labels/descs).
- `src/i18n/en.ts` — fixes 8–10 (programmes chrome, quote-form label, grammar).
- `src/components/HowItWorks.tsx` — card titles wired to i18n (fix 4).
- `src/components/about/ExpertiseSection.tsx` — locale-aware aria (fix 11).
- `src/components/Breadcrumbs.tsx` — locale-aware sr-only aria (fix 12).
- `src/components/nav/PratiquesFilterBar.tsx` — i18n placeholder (fix 13).
- `src/components/clinic/HomecareBanner.tsx` — FR alt (fix 14).

**NOT changed (by policy):** `src/lib/corporate-programmes.ts` content bodies (flagged only), `en-translations.ts` / `practice-content.ts` EN wording (flagged only), `src/lib/retreat*` keys, admin/CMS/Shop tooling, routes, `next.config.ts`, sitemap.

## N. Coverage & regression

- All 8 required QA pages reached: `/`, `/en`, `/about-us`, `/en/about-us`, `/corporate`, `/en/corporate`, `/contact-us`, `/en/contact-us` — 200, unchanged structure.
- No route / URL / meta / canonical / hreflang alteration anywhere in this pass.
- Client-rendered surfaces (nav compact placeholder, `/produits` filters, homepage blog fetch) verified at source/type level; recommend browser spot-check at 390×844 during visual QA.

## O. Remaining user/browser checks (not runnable here)

- Visual QA at 1440×900 + 390×844 of the changed copy (4 FR method titles, `Analyses & Recherche`, shop filter labels in the opened dropdown).
- Confirm the nav compact search placeholder after scroll on `/pratiques` (FR shows `Rechercher une pratique.`).
- Reviewer sign-off on the H1–H7 REVIEW flags (esp. EN `programme`-bodies BR spelling, EN testimonial guillemets, retreat block per prior NEEDS_DECISION).
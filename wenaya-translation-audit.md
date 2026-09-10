# Wenaya FR/EN Translation & Content-Parity Audit

**Date:** 2026-09-09
**Branch:** pre-production-cleanup
**Scope:** All public routes FR + EN. i18n-files parity, hardcoded-string scan, per-family content parity.
**Status:** Audit + confirmed-fixes implemented (7 changes, §8). NO commit/push. Human-decision rows remain open.

---

## 1. Executive summary

FR and EN i18n files are structurally sound: **both have 423 keys, zero missing in either direction** (the shared `Translations` type enforces it), and the EN file contains **zero French accented characters**. The remaining problems are concentrated in **hardcoded strings in a handful of shared components**, **~30 EN i18n values that are byte-identical to FR** (untranslated or intentionally non-localized), and **one FR-file bug (English words in the French corporate retreat section)**.

**Totals:** 72 hardcoded-string findings scanned across `src/components/`; after triage, **4 P1** + **10 P2** + the rest INTENTIONAL/POLISH. No P0 (nothing renders raw French on an English page at high severity, and no missing keys anywhere).

### Top fixes (by priority)
1. **P1 — `CorporateConsultationWidget.tsx`**: hardcoded English on a shared component ("Book Free Consultation", aria-label="Free consultation", alt="Corporate wellness"). Uses zero i18n. **[FIXED]** — now `useLocale()` + `entreprises.consultWidget` keys.
2. **P1 — FR corporate OG/Twitter descriptions in English** (`src/app/(fr)/corporate/page.tsx` L44/51): FR page, English social-share text. **[FIXED]**.
3. **P1 — `soins-a-domicile` telemetry "secousse"** — see `confidentialite` note: "Secousses" appears in an EN-facing string? *(RESOLVED in review — see section 5.)*
4. **P2 — `clinic/Practical.tsx` L108** `{isEn ? "Book" : "Réserver"}` (locale ternary, no i18n key). **[FIXED]** → `t("clinic.hero.ctaBook")`.
5. **P2 — `clinic/HomecareBanner.tsx` L22, `clinic/Intro.tsx` L94, `contact/ContactForm.tsx` L125**: hardcoded FR alt/text in SHARED components (visible on EN pages). **[FIXED]** Intro alt + ContactForm text; HomecareBanner alt is unreachable on EN (LOW, documented).
6. **P2 — `en.ts` L332 typo `"Cliniqus"`** in `nav.links`. **[FIXED]** → `Clinics`.
7. **P2 — FR retreat drift**: `prev: "Retreat précédent"`, `next: "Retreat suivant"`, `counter: "Retreat"`, `badge: "Build Your Retreat"` in the **French** section. **[NEEDS_DECISION — human choice on brand styling; NOT changed]**.

---

## 2. i18n files parity

| Check | Result |
|---|---|
| FR keys | 423 |
| EN keys | 423 |
| Missing FR→EN | **0** |
| Missing EN→FR | **0** |
| EN values identical to FR | **30** (see §2.1) |
| EN contains French accented chars | **No** (verified by script) |
| EN `Translations` type coupling | Enforced (en.ts typed as `Translations` from fr.ts) |

### 2.1 The 30 EN values identical to FR (potential untranslated)

Intentional-class values (brand terms / product names / invariant strings) are marked `OK`.

| # | Key | Value | Verdict |
|---|---|---|---|
| 1 | `solutions` | "Corporate" | OK (EN brand arm) |
| 2 | `menu` | "Menu" | OK (same in both) |
| 3 | `message` | "Message" | OK (same in both) |
| 4 | `phonePh` | "+212 6 XX XX XX XX" | OK (placeholder) |
| 5 | `autoRotate` | "Auto · 5s" | OK (universal) |
| 6 | `level` | "Premium" | OK (brand) |
| 7 | `tag` | "YOLO — You Only Live Once" | OK (brand tagline) |
| 8-10 | `emailLabel` / `emailFieldLabel` / `emailForm` | "Email" | OK (same) |
| 11 | `satisfaction` | "satisfaction" | **REVIEW** — same lowercase word both languages |
| 12 | `contact.addressLine1/2` | address | OK (proper noun) |
| 13 | `contact.emailAddr` | email | OK (proper noun) |
| 14 | `contact.mapText` | map placeholder | OK (short) |
| 15 | `contact.value` | "unsure" (booking category) | OK (stable value) |
| 16 | `formatTitle` | "Format" | OK (same) |
| 17 | `slug` | "tim-ferriss" | OK (data slug) |
| 18 | `total` | "Total" | OK (same) |
| 19 | `qualifications` | "Qualifications" | OK (same) |
| 20 | `services` | "Services" | OK (same) |
| 21 | `eyebrow` (clinic) | "Wenaya Clinic" | OK (brand) |
| 22 | `viaWenaya` | "Via Wenaya" | OK (brand) |
| 23 | `stepConfirm` | "Confirmation" | OK (same) |
| 24-26 | `phonePlaceholder` | "+212 6 00 00 00" | OK (placeholder) |
| 27-30 | retreat chapter titles (`Reset & Recharge`, `Team Health & Cohesion`, `Active Wellness`), `newsletterBadge` ("Newsletter") | — | REVIEW (see §4) |

**Conclusion:** No EN value that should be translated is stranded untranslated at a level that would show a French word on an EN page. The identical-value list is dominated by invariant strings. The genuinely debatable ones (`satisfaction`, retreat chapter titles) are flagged for human review, not automation.

---

## 3. Hardcoded-string scan (72 findings → triaged)

Method: regex scan of `src/components/**/*.tsx` for accented chars + Latin-alphabet words outside `t()`/`tRaw()`; locale-ternary `isEn ?`; image `alt="…"`. Triage classes: `P1`, `P2`, `OK` (brand/technical), `INTENTIONAL`.

### 3.1 P1 — hardcoded English on shared EN-face components

| File:Line | Content | Note |
|---|---|---|
| `src/components/CorporateConsultationWidget.tsx` L79 | `alt="Corporate wellness"` | Shared (corporate page FR+EN) — EN-only alt on FR. **[FIXED]** |
| `src/components/CorporateConsultationWidget.tsx` L101 | `"Book Free Consultation"` | Hardcoded CTA, no i18n. **[FIXED]** |
| `src/components/CorporateConsultationWidget.tsx` L119 | `aria-label="Free consultation"` | Hardcoded aria. **[FIXED]** |
| `src/app/(fr)/corporate/page.tsx` L44/51 | OG/Twitter description **in English** on FR page | Shared metadata for FR corporate. **[FIXED]** |

### 3.2 P2 — hardcoded FR in shared components (appears on EN pages)

| File:Line | Content | Note |
|---|---|---|
| `src/components/clinic/Practical.tsx` L108 | `{isEn ? "Book" : "Réserver"}` | Locale ternary instead of i18n key. **[FIXED]** → `t("clinic.hero.ctaBook")` |
| `src/components/clinic/Practical.tsx` L40 | FR image alt | Visible on EN /about-us. **[FIXED]** → `t("clinic.practical.imageAlt")` |
| `src/components/clinic/HomecareBanner.tsx` L22 | `"Soins à domicile Wenaya Homecare Services"` FR alt | Shared — but homecare is FR-only; EN /about-us does NOT render the banner (verified). LOW. No action |
| `src/components/clinic/Intro.tsx` L94 | `alt="équipe pluridisciplinaire Wenaya"` FR | On EN /about-us. **[FIXED]** → `t("clinic.intro.imageAlt")` |
| `src/components/contact/ContactForm.tsx` L125 | `"équipe Wenaya"` FR | On EN /en/contact-us success text. **[FIXED]** → `t("contact.recruitmentLabel")` + `t("contact.recruitmentJoin")` |
| `src/i18n/en.ts` L332 | `"Cliniqus"` | Typo in `nav.links` (EN). **[FIXED]** → `Clinics` |

### 3.5 NEW finding (from verification pass, NOT in the confirmed fix list)

| File:Line | Content | Note |
|---|---|---|
| `src/components/CookieConsent.tsx` L53 | `aria-label="Fermer"` | Hardcoded FR close aria on the shared cookie banner — EN pages show "Fermer" for the dismiss button. Visually invisible (X icon), low severity. Body copy already English. **[FIXED]** → `t("cookieConsent.close")` |

### 3.3 INTENTIONAL / OK (documented, no action)

- **`src/components/domicile/*`** — all hardcoded FR. BY DESIGN: `/soins-a-domicile` is a FR-only page (no authoritative EN translation exists; header comment documents this). EN route 404s.
- **`src/components/LanguageSwitcher.tsx` L34** — aria-label ternary `"Switch to English" | "Passer en français"` (both languages present correctly).
- **`src/components/Logo.tsx`, `Footer.tsx`** — `alt="Wenaya"` brand.
- **`src/components/specialistes/MapViewInner.tsx`** — French specialty keys in `colors` map are technical data keys (match French specialty names in data layer).
- **`src/components/Breadcrumbs.tsx`** — `fr` AND `en` routeLabels records both complete (the "accented" hits are the FR record — correct).
- **`src/components/clinic/StructuredData.tsx`** — **CLEAN** (lang ternary for both languages; earlier "French JSON-LD on EN" flag was WRONG — verified, the file has complete FR/EN branches).
- **`src/components/clinic/Hero.tsx` L98** — alt FR/EN conditional (locale ternary present, both languages covered).
- **`src/components/produits/ProductCard.tsx` L24** — `locale="fr"` default prop: FLAG — EN pages DO pass `locale` explicitly (verified in `en/produits/**` routes); no active EN bug, but the default invites future misuse.

### 3.4 Verified-clean components (use `t`/`tRaw`/`useLocale` correctly)

Nav, MobileMenu, HeroSection (home), Footer, CoursAteliers, Biomarkers, ExpertiseSection, BlogListClient, ProductsGrid, StickyCta, RetreatSection, ThematiquesSection, SpecialistsPage, SpecialistDetail, FaqSection, ConfidentialitePage, ContactPage, ContactForm (FR/EN via i18n), Naturalizers. In-mission components: PanierView, CheckoutView (locale-aware, `article`/`item` pluralization), GroupSessionsHero/List/Detail (labels prop), CareJourney* (locale props), RecommendedPractices, OrientationCta, programes detail (labels), PratiqueDetail (props).

---

## 4. Per-family findings

### Homepage `/` + `/en`
- Clean. HeroSection, PracticesSection gallery, CoursAteliers, Biomarkers, Testimonials all i18n-driven.
- Trust bar: FR `4,7 ★` on homepage, `99%` moved to Clinic band (swap from the last session's hero-step) — mirrored correctly both locales.
- **Note:** homepage `4,7` also appears in `<meta description>` and an SVG `d` path — pre-existing, not a stat leak.

### Clinic `/about-us` + `/en/about-us`
- 1 `<h1>` each. Practices/Sessions/Pathologies/HealthNeeds/Parcours explorers all server-or-client locale-correct.
- **P2:** `Intro.tsx` L94 FR alt on shared comp.
- **P2:** `Practical.tsx` L108 `{isEn ? "Book" : "Réserver"}` + L40 FR alt.
- **OK:** `HomecareBanner` FR alt unreachable on EN (banner not rendered there).
- **OK:** ClinicStructuredData — full FR/EN branches.

### Corporate `/corporate` + `/en/corporate`
- **P1:** FR page OG/Twitter description in **English** (`src/app/(fr)/corporate/page.tsx` L44/51).
- **P1:** `CorporateConsultationWidget` hardcoded English (see §3.1).
- **P2:** FR `retreat` drift — `badge: "Corporate Retreats"`, `prev: "Retreat précédent"`, `next: "Retreat suivant"`, `counter: "Retreat"`, `design.badge: "Build Your Retreat"`, chapter titles `Reset & Recharge`/`Team Health & Cohesion`/`Active Wellness` all in the **French** section.
- **P2/RIVIEW:** EN `retreat.counter: "Retreat"` — acceptable brand term, but FR `"Retreat précédent"` mixing languages is a genuine wording flaw.
- Programmes detail pages + listing + carousel: clean (server components, labels props, EN chrome genuine — verified 229/229 in the prior visual QA).
- **As of 2026-09-10:** the four EN programme bodies (`leadership-360`, `pcm`, `art-des-priorites`, `people-model-canvas`) — which previously served the **French** body on `/en/corporate/programmes/*` — are now fully translated to business English in `src/lib/corporate-programmes.ts` (localized fr/en content sets, FR copy byte-unchanged), with English detail metadata + localized `newTab` aria (no `(nouvel onglet)`). Verified **61/61 SSR + 73/73 real-browser** (see §6 row J, §7).
- StickyCta / StatsTestimonials / ContactSection: clean (i18n-driven, verified in STEP 10/12).

### Specialists `/professional` + `/en/professional`
- Clean. FR + EN detail pages; EN uses `specialist.roleEn ?? specialist.role` fallback and an EN metadata template. `MapViewInner` FR specialty color keys are data keys (OK).

### Contact `/contact-us` + `/en/contact-us`
- **P2:** `ContactForm.tsx` L125 "équipe Wenaya" FR hardcoded in shared success/**booking-success** text (visible on EN).
- Booking mode (nav CTA) — i18n correct (63/63 + 29/29 verified prior).
- Generic mode — i18n correct.

### Login `/login` + `/en/login`
- Clean (Patient sign-in, STEP 9). Disabled submit + notice, legal links, hreflang, robots both locales.

### Legal `/conditions`, `/confidentialite` + EN
- `ConfidentialitePage` — i18n-driven, both locales clean. Terms pages present both locales.

### FAQ `/faq` + `/en/faq`
- Clean — `FaqSection` loops `faq.qN.q/a`; EN page has its own English JSON-LD. Note: FAQ JSON-LD on EN must be confirmed present (page-level; verified in earlier passes).

### Homecare `/soins-a-domicile`
- **FR-only BY DESIGN.** Hardcoded FR throughout `src/components/domicile/*` is expected and documented. EN route 404s; sitemap only FR. No hreflang.

### Shop `produits`, `panier`, `checkout` + EN
- ProductsGrid/ProductCard: i18n + locales; product data (demo/shop) not deeply audited (future CMS workstream). EN product detail pages use English metadata — pass `locale` explicitly (confirmed).
- PanierView/CheckoutView: clean shared views, `article`/`item` pluralization.

### Care journeys `/parcours-de-soins/{slug}` + EN
- Clean. All content via adapter (`care-journeys.ts`) with genuine-EN bodies (built step), labels via `getTranslations('locale')`, orientation CTAs informational. Verified 300/300 + 76/76 passes previous sessions.

### Practices `/pratiques/{slug}` + EN
- Clean. PratiqueDetail receives content via adapter (FR from API/local, EN genuine translations). Detail routes server components with `generateMetadata` per locale.

### Sessions `/seance-de-groupe/{slug}` + EN
- Clean. Adapter locale-aware (imports both i18n files). EN slug == FR slug by design (live parity).

---

## 5. Corrections to earlier audit notes

- **`clinic/StructuredData.tsx`** — previously flagged "French JSON-LD on EN (P1)"; **WRONG** — the file has complete FR and EN branches via `lang` ternary. No action.
- **`clinics.*` i18n block** — confirmed **dead code** (zero `clinics.` consumers anywhere in `src/`). 1048-line FR/EN block. Not a translation bug; a prune candidate (documented in Phase 2 deferred list).
- **Homecare banner alt** — flagged P2 but EN `/about-us` does not render `HomecareBanner` (verified); downgraded to LOW/intentional.

---

## 6. Fix plan (ordered, with scope estimates)

| # | Fix | Files | Severity | Est. effort | Status |
|---|---|---|---|---|---|
| A | Replace `"Book Free Consultation"` + aria + alt in widget with i18n keys | `CorporateConsultationWidget.tsx`, `en.ts`, `fr.ts` | P1 | S | **DONE** |
| B | FR corporate OG/Twitter desc → French | `src/app/(fr)/corporate/page.tsx` | P1 | S | **DONE** |
| C | `Practical.tsx` `{isEn ? "Book":"Réserver"}` → i18n key; L40 alt → locale prop | `Practical.tsx`, i18n | P2 | S | **DONE** |
| D | `Intro.tsx` L94, `ContactForm.tsx` L125 FR alts/text → locale props/i18n | 2 comps | P2 | S | **DONE** |
| E | Fix `Cliniqus` → `Clinic` (or `Clinics`) | `en.ts` L332 | P2 | XS | **DONE** (→ `Clinics`, matches FR `Cliniques`) |
| F | FR retreat drift: `prev/next/counter/badge` → French (or keep brand term + fix "Retreat précédent"→"Retraite précédente"); chapter titles → decide EN-in-FR is intentional or localize | `fr.ts` L991–1035 | P2 | S | **NEEDS_DECISION** — untouched (human brand decision) |
| G | `satisfaction` EN vs FR identical + `newsletterBadge` "Newsletter" — human review | i18n | REVIEW | S | **NEEDS_DECISION** |
| H | (Optional pr.) delete dead `clinics.*` block | `fr.ts`, `en.ts` | P3 | S | **DEFERRED** |
| I | (NEW) `CookieConsent.tsx` L53 hardcoded FR `aria-label="Fermer"` on shared banner → i18n key | `CookieConsent.tsx`, i18n | P2 | XS | **DONE** → `i18n.cookieConsent.close`; FR `Fermer` / EN `Close`, real-browser verified |
| J | (POST-AUDIT) EN programme bodies (`leadership-360`/`pcm`/`art-des-priorites`/`people-model-canvas`) were French on `/en/...` — localized fr/en content sets in data adapter; FR byte-unchanged | `corporate-programmes.ts`, `ProgrammeDetail.tsx`, `ProgrammesPage.tsx`, `ProgrammesSection.tsx`, EN+FR `[slug]/page.tsx`, i18n | P1 | L | **DONE** → 61/61 SSR + 73/73 browser (see §7) |

**Total scope:** 8 confirmed fixes + the new CookieConsent finding (all DONE except human-decision/open rows). No structural work, no page re-render risk beyond the touch points.

---

## 7. Verification status

- Framework + parity scripts run (results in §2).
- Component read-through completed for all public families.
- **Fixes implemented (this session, no commit/push):** widget → `useLocale()` + `entreprises.consultWidget` (6 keys FR+EN); FR corporate OG/Twitter → French; `Practical.tsx` CTA → `t("clinic.hero.ctaBook")` + alt → `t("clinic.practical.imageAlt")`; `Intro.tsx` alt → `t("clinic.intro.imageAlt")`; `ContactForm.tsx` → `t("contact.recruitmentLabel")` + `t("contact.recruitmentJoin")`; `en.ts` L332 `Cliniqus` → `Clinics`. Retreat block + `satisfaction`/`newsletterBadge` intentionally untouched (human decisions).
- **Post-fix verification (prod build `next start` :3002):** `tsc` clean; `eslint .` **0E/12W** (unchanged pre-existing baseline, no new files flagged); `npm run build` **278 pages** (kill-node + `Remove-Item .next` before rebuild). HTTP bundle+SSR QA **32/32 PASS** (FR corporate metadata French / EN kept English, Practical CTA + alts both locales, Intro alt both locales, recruitment strings in EN/FR bundles, booking mode intact, widget keys in bundle, retreat untouched, zero `Cliniqus`). Real-browser CDP **17/17 PASS** (widget FR/EN aria/alt/heading/CTA + no EN FR-leak, recruitment notice FR/EN + no leak).
- **NEW POST-AUDIT FINDING — NOW FIXED:** `CookieConsent.tsx` L53 hardcoded FR `aria-label="Fermer"` on the shared cookie banner (visible on EN pages for the dismiss X; body copy is English; visually low severity). Fix: added `i18n.cookieConsent.close` (FR `Fermer` / EN `Close`) + wired `useLocale()` into `CookieConsent.tsx`; body copy, buttons, localStorage keys, animation all untouched. Verified §7 (43/43 PASS).
- **CookieConsent verification (this session, dev server :3000, real-browser CDP `%TEMP%\opencode\cookie-aria-qa.mjs`):** **43/43 PASS** — FR `/`, `/about-us` dismiss `aria-label="Fermer"`; EN `/en`, `/en/about-us` → `"Close"`; no raw `cookieConsent.close` key leaked to DOM; banner body copy + Accept/Decline buttons byte-unchanged on both locales (0 FR leak on EN); dismiss persists `wenaya-cookie-consent=declined`, banner removed from DOM; same-profile reload → consent persisted, banner suppressed; 0 console errors/exceptions. `npx tsc --noEmit` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline, no new files flagged). No build run (client-only change verified against live dev server).
- **Programme EN-body localization (2026-09-10, no commit/push):** `src/lib/corporate-programmes.ts` now holds per-locale `LocalizedProgramme` content sets (localized `name`/`badge`/`pitch`/`intro`/`blocks`/`practical`/`note`/`ctas`), resolved by `resolveProgramme(raw, locale)`; FR copy byte-unchanged; EN listing/carousel/detail all English incl. metadata; hardcoded `(nouvel onglet)` external-CTA aria replaced by i18n `newTab` (FR `nouvel onglet` / EN `opens in a new tab`). Verified against prod :3002: SSR harness **61/61 PASS** + real-browser CDP **73/73 PASS** (0 console errors). `npx tsc --noEmit` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline); `npm run build` **278 pages** (4 FR + 4 EN programme details SSG'd; kill-node + `Remove-Item .next` first).
- No secrets touched.
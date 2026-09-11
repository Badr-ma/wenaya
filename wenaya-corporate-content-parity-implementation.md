# Wenaya Corporate Content-Parity Implementation

**Branch:** pre-production-cleanup · **Status:** COMPLETE — code + QA green, no commit/push
**Date:** 2026-09-10 · **Audit source:** `wenaya-corporate-content-parity-report.md`

---

## A. Context & Objective

The `/corporate` page (FR + EN) was audited zone-by-zone against the LIVE
`wenaya.com/corporate` capture (2026-09-10). This implementation closes the
approved content gaps from that audit: trust logos (Z2), "Par où commencer ?"
3 levels (Z3), 3 label packs (Z4), stats/testimonials alignment (Z9/Z11),
downloads (Z12) and FAQ (Z13). Design, languages, routes, APIs, booking and
SEO are untouched. FR is the source of truth (live-verbatim); EN is genuine.

**Scope:** CONTENT parity only — preserve the platform visual language (navy
`#0B1220`, bronze `#B88A5A`, sand `#F2EFE9` / ivory `#FAF8F4`, heading-serif,
bronze gradient proof band). Nothing committed or pushed.

## B. Audit Scope

- Live capture: `%TEMP%\opencode\livecorp-zones.txt` (15 zones, full text),
  `livecorp-body.txt`, headless-Chrome CDP dumps of `/corporate`.
- Local baseline: all 14 `src/components/entreprises/*` + both `corporate`
  pages + `corporate-programmes.ts` + i18n `entreprises:` blocks.
- Verdict carried over: Z6 (catalogue "Tout ce que Wenaya…") and Z8 (Yolo)
  are agreed EXCLUDE LIVE SECTIONS; Retreat + ImageBreak stay local-only.

## C. Methodology

1. Each live zone's verbatim text was mapped to the existing local component
   or a new one, reusing the existing section chrome (GSAP `useIntersectionDeferred`
   rhythm, `pf-reveal`-style reveals, bronze underline eyebrows).
2. No invented content: no fake names/photos, no invented PDFs, no invented
   brand logos. Testimonial anonymity is ground truth (3 anonymous DRH quotes).
3. FAQ items whose live source named Yolo were rewritten to keep the
   substance without the platform name (sanitization), substance preserved.
4. Both locales share one component tree; FR i18n is verbatim live, EN is
   genuine EN written from the same facts.
5. Verification = SSR/HTTP harness (script-stripped DOM) + real-browser CDP
   at 1440/768/390 (scroll-through, console, overflow, hydration).

## D. Zone-by-Zone Actions (Z0–Z14)

| Zone | LIVE | Local action |
|------|------|--------------|
| Z0 Hero | verbatim H1/desc/cta1/cta2 | kept as-is (already parity) |
| Z1 (bg / assurance) | — | non-content zone, nothing to add |
| **Z2 Trust logos** | "Ils nous font confiance" + 5 marks | **NEW `TrustLogosSection`** (light band, 5 neutral abstract SVG marks `viewBox="0 0 96 48"`, no invented brand names) |
| **Z3 Levels** | "Par où commencer ?" 3 tiers (Découverte/Programme Annuel/Transformation) | **NEW `LevelsSection`** (dead `entreprises.levels` i18n block repurposed to live Z3 verbatim; tier cards + "Tarif sur devis personnalisé" + CTA → `#contact`) |
| **Z4 Packs** | 3 packs (La Journée Bien-Être Wenaya / Wenaya Présence / Leadership Wenaya) | **NEW `PacksSection`** (dead `entreprises.packs` block repurposed to live Z4; 3 cards, feature checklists, "Demander un devis personnalisé" → `#contact`) |
| Z5 Programmes | badges verbatim ("NASA · 1978" / "5 AXES" / "ANTI-SURCHARGE" / "20+ ANS…") + "Format :" / "Animée par :" lines | `corporate-programmes.ts` badges aligned to live bare tokens; optional `cardFormat`/`cardAnimator` fields wired through `resolveProgramme`/`toProgrammeCard` (fallback = practical[0] + "Animation"/"Facilitation") |
| Z6 Catalogue | "Tout ce que Wenaya peut faire pour vos équipes" | **EXCLUDED** per audit — heading absent from both locales |
| Z7 (Video/…) | — | no local equivalent (already excluded) |
| Z8 Yolo | Corporate Yolo platform section | **EXCLUDED** per audit — no Yolo mention anywhere on the page (dead `entreprises.yolo` i18n block not used); FAQ Q1/Q4 Yolo-sanitized |
| **Z9 Stats** | 3 500 €/Malakoff · +13 %/Oxford 2019 · × 5/Deloitte 2022 | `StatsTestimonialsSection` metrics rebuilt to live-verbatim with animated counters + "Chez Wenaya : 35 thérapeutes certifiés · +2 000 collaborateurs accompagnés" strip |
| **Z11 Testimonials** | 3 anonymous DRH quotes | carousel rebuilt: 3 quote slides, **no photos** — initials monogram square ("DRH" → "DR", EN "HR Director" → "HR"), prev/next + dots, desktop/mobile layouts, touch swipe; ALL 3 slides in SSR DOM (sr-only inactive) |
| **Z12 Downloads** | 3 live docs (Catalogue excluded with Z6) | 2 live PDFs only (presentation + livre blanc) via `entreprises.downloads.items`; section renders them generically |
| **Z13 FAQ** | 7 live Q&As | 7-item accordion, Yolo-sanitized Q1/Q4, verbatim remainder |
| Z14 Contact | identity fields + 8 option labels + audit CTA + hours strip | already parity (STEP 10/10b) — kept |
| Retreat / ImageBreak | local-only sanctioned | kept in place between Programmes→Packs and Thematiques→Downloads |

**Final section order (both locales):**
Hero → TrustLogos (Z2) → Stats (Z9) → Levels (Z3) → Modularity → Programmes (Z5)
→ Retreat → Packs (Z4) → HowItWorks → Thematiques → ImageBreak → Resources/FAQ
(Z12+Z13) → Contact (Z14) → StickyCta → Footer

## E. New / Rewritten Sections

- `src/components/entreprises/TrustLogosSection.tsx` (NEW) — "Ils nous font
  confiance"/"They trust us" eyebrow + serif heading + 5 neutral abstract SVG
  marks in a sand band; GSAP fade (reduced-motion aware), `#FAF8F4` bg.
- `src/components/entreprises/LevelsSection.tsx` (NEW) — 3 tier cards
  (bronze tag pill "Niveau …", title, includes list, duration/note,
  "Tarif sur devis personnalisé"), devis CTA → `#contact`.
- `src/components/entreprises/PacksSection.tsx` (NEW) — 3 pack cards with
  feature checklists and navy CTA "Demander un devis personnalisé" → `#contact`.
- `src/components/entreprises/StatsTestimonialsSection.tsx` (REWRITTEN) —
  header ("Pourquoi investir…") + 3 LV-verbatim metrics (animated counters,
  `data-target`) + "Chez Wenaya" strip + 3-quote anonymous carousel.
  **Behaviour fix this step:** the carousel originally rendered only the
  active slide in SSR; it now renders all 3 slides (inactive = `sr-only
  absolute inset-0 pointer-events-none`, `aria-hidden`), so all quotes are in
  the DOM/SSR for SEO and the QA assertions, while only one is visible.

## F. i18n Changes

`src/i18n/fr.ts` (verbatim live) + `src/i18n/en.ts` (genuine):
- `entreprises.levels` — repurposed to Z3: `title` "Par où commencer ?"/"Where
  to start?", `subtitle`, 3 `{ level, ideal, includes, duration, note }` items,
  `cta` + `ctaQuote`.
- `entreprises.packs` — repurposed to Z4: `title` "Des exemples concrets pour
  vous inspirer"/"Concrete examples to inspire you" + 3 `{ level/name, pitch,
  features[], ideal }` + `cta`.
- `entreprises.stats` — `items` = live trio with `value/label/source`
  (quote glyphs `× 5`, `+13 %`, `€` byte-identical), `band` = "Chez Wenaya…".
- `entreprises.testimonials` — `items` = 3 anonymous quotes + authors (FR
  source-of-truth, EN genuine), `prev`/`next`, `subtitle`.
- `entreprises.downloads` — 2 live PDF items (link targets verbatim);
  `title`/`subtitle`.
- `entreprises.faq` — 7 items, Q1/Q4 sanitized (no "Yolo"); substance kept.
- `entreprises.trustLogos` — `title` added ("Ils nous font confiance"/"They trust us").
- Dead blocks `entreprises.yolo`, `entreprises.approach.stats/comparison`,
  `cta.*`, `programs.offers` left in place (grep-proven zero consumers).

## G. Data-Layer Changes

- `src/lib/corporate-programmes.ts`: badge strings aligned to live bare
  tokens ("5 AXES", "NASA · 1978", "ANTI-SURCHARGE", "20+ ANS · RECHERCHE &
  TERRAIN"; EN mirrors); optional `cardFormat` + `cardAnimator` added to
  `Programme`/`ProgrammeContent`, resolved by `resolveProgramme`/
  `toProgrammeCard` (fallback `practical[0]` + "Animation"/"Facilitation").
  Detail pages unaffected (SSR-safe).

## H. Exclusions (Declared)

- Z6 catalogue section — heading "Tout ce que Wenaya…" absent on both locales.
- Z8 Corporate Yolo section — no "Yolo"/"You Only Live Once" anywhere.
- No third download (Catalogue PDF excluded with its section): 2 PDFs only.
- No invented client logo assets — 5 neutral marks instead of real brands.
- Retreat + ImageBreak retained (sanctioned local-only sections).
- No API/auth/booking/payment change; no redesign; no new route/animation.

## I. Accessibility & Animations

- FAQ accordion: `button aria-expanded` + `role="region"` labelled panels
  (7 closed in SSR).
- Carousel dots: `aria-label="<title> <n>"` + `aria-current`; quote slides
  inactive = `aria-hidden` + `sr-only` (kept in DOM, out of a11y tree).
- All new sections GSAP-gated + `prefers-reduced-motion` aware; content
  visible in SSR/no-JS.
- Trust marks `aria-hidden`+`focusable="false"`; monogram square is
  presentational text within a non-interactive wrapper.

## J. Content Decision Index

- Testimonial anonymity kept (live ground truth) → initials-based monogram,
  no portraits/photos.
- Levels/Packs CTAs → `#contact` (contact-form quote request), never a fake
  booking; the audit calendar CTA unchanged.
- FAQ wording: Q1 (data protection) and Q4 (SIRH integration) rewritten to
  avoid naming the excluded Yolo platform while preserving all factual claims
  (encryption, no internal access, AI on anonymized profiles, pre-approved
  interactions, secret professionnel, anonymized/aggregated RH indicators,
  RGPD + Moroccan law, API connectors).
- EN uses GR spelling "programs" for new copy while programme BODIES keep BR
  "programme"/"organisational" (live EN serves FR; flagged REVIEW earlier).

## K. QA Execution

1. **SSR/HTTP harness** `corp-parity-qa.mjs` (prod :3002, script-tags stripped
   to avoid RSC flight duplication): **99/99 PASS** both locales — exactly 1
   `<h1>`; trust title + 5 marks; levels 3 cards + notes ×3; packs 3 names +
   features + CTA; stats values/sources + band; 3 testimonial quotes + DR/HR
   monogram; downloads 2 PDFs + titles; FAQ 7 closed (scoped after title);
   retreat present; Yolo/catalogue absent; cross-locale leak-free; section
   order (13 markers) correct.
2. **Real-browser CDP** `corp-cdp-qa.mjs` (headless Chrome, prod :3002,
   FR+EN × 1440/768/390, scroll-through before assertions): **156/156 PASS** —
   1 h1; no horizontal overflow; each section heading exactly once; 3 quotes
   + 3 metrics + band + 3 packs; retreat + image-break quotes present;
   no Yolo/catalogue; 5 marks; monogram ≥2; zero console errors/exceptions/
   hydration markers.

## L. Build/CDP Results

- `npx tsc --noEmit` — clean.
- `npx eslint .` — **0E/10W** (unchanged pre-existing baseline).
- `npm run build` (kill-node + `Remove-Item .next`) — **278 static pages**
  ("Generating static pages using 7 workers (278/278)"), compiled successfully.
- Prod `next start` left running on :3002 (final artifact). Dev :3000 untouched.

## M. Deviances (declared, deliberate)

| Item | Audit said | Implemented |
|------|-----------|-------------|
| Z2 logos | real client logo assets | 5 neutral abstract marks (no assets available) |
| Z12 downloads | 3 live docs | 2 (Catalogue PDF excluded with Z6) |
| Testimonial visuals | photos | anonymous DR monogram (live anonymity) |
| FAQ Yolo wording | verbatim | sanitized (Q1/Q4) to honour the Yolo exclusion |

## N. Files Changed

**New:** `src/components/entreprises/TrustLogosSection.tsx`,
`LevelsSection.tsx`, `PacksSection.tsx`.
**Rewritten:** `StatsTestimonialsSection.tsx`.
**Modified:** `src/i18n/fr.ts`, `src/i18n/en.ts` (levels/packs/stats/
testimonials/downloads/faq/trustLogos), `src/lib/corporate-programmes.ts`
(badges + cardFormat/cardAnimator), `src/app/(fr)/corporate/page.tsx`,
`src/app/(en)/en/corporate/page.tsx` (wiring + import order).
**Untouched:** all other `entreprises/*` components (Modularity, Programmes,
Retreat, HowItWorks, Thematiques, ImageBreak, ResourcesFaq, Contact), API,
routes, booking, sitemap, metadata.

## O. Future / Remaining

- Real client logo assets (Z2) when provided by Wenaya.
- Third catalogue PDF + associated copy if Z6 is ever revived.
- Live testimonial approval for the 3 anonymous quotes / named variants.
- Visual sign-off (screenshots `%TEMP%\opencode\corp-parity-shots\` — this
  environment has no image viewing): card rhythm on the 3-pack / 3-level rows,
  trust band spacing, monogram square at 390, carousel swipe feel.
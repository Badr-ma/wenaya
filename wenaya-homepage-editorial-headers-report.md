# Wenaya Homepage Editorial Headers — Implementation Report

**Task:** Premium editorial header system (label → motif → headline → sub) across all 8 homepage sections, FR + EN. Branch `pre-production-cleanup`. **NOT committed/pushed.**

---

## A. Goal

Replace the mixed hero/boxed/card headers of the 8 homepage landmark sections with ONE consistent editorial header language: a small bronze-caps legal/eyebrow label, a decorative motif (wireframe teal diamond), a visually dominant section headline (H2), and (where copy exists) a supporting paragraph — all left-aligned, respecting the existing GSAP reveal hooks, the section headline staying an `<h2>`, and per-section typographic clamps.

Scope was presentation-only: no content rewrites, no routes, no section/card/image changes, no API/CMS work.

## B. Sections updated (8)

| # | Section | Component |
|---|---------|-----------|
| 1 | Méthode Wenaya | `HowItWorks.tsx` |
| 2 | Bilans Wenaya | `Biomarkers.tsx` |
| 3 | Accès directs | `QuickAccessSection.tsx` |
| 4 | Témoignages | `TestimonialsSection.tsx` |
| 5 | Pratiques | `PracticesSection.tsx` |
| 6 | Équipe | `about/ExpertiseSection.tsx` |
| 7 | Cours & Ateliers | `CoursAteliers.tsx` |
| 8 | Articles (blog) | `blog/BlogSection.tsx` |

**Explicitly NOT touched:** H1 hero, gallery panel titles (H3), buttons, CTA rows, footer headings, small metadata labels, QuickAccess card titles.

## C. Files changed

- `src/components/SectionTitleAccent.tsx` — **NEW** primitive; now accepts optional `className` appended to its root span (used as the header motif; other consumers unchanged).
- `src/components/HowItWorks.tsx` — header reworked (~265–285).
- `src/components/Biomarkers.tsx` — header reworked (~52–71).
- `src/components/QuickAccessSection.tsx` — header reworked (~76–87).
- `src/components/TestimonialsSection.tsx` — header reworked (~113–130).
- `src/components/PracticesSection.tsx` — header reworked (~373–395) + closing-tag fix `</p>` → `</h2>`.
- `src/components/about/ExpertiseSection.tsx` — header reworked (~47–63) + `#es-text` container `<div>` → `<p>` (system consistency; GSAP selector `#es-text` unaffected).
- `src/components/CoursAteliers.tsx` — header reworked (~82–96).
- `src/components/blog/BlogSection.tsx` — header reworked (~83–101).

## D. Header pattern (applied to every section)

```
<p  label />            gold #B88A5A, Manrope, semibold, uppercase,
                        tracking-[0.22em], text-[11px] sm:text-xs
<SectionTitleAccent className="mt-3" />     motif (wireframe teal diamond), aria-hidden
<h2 headline />         Manrope, #0B1220 (white on navy CoursAteliers),
                        leading-[1.05], tracking-[-0.01em], per-section clamp
<p sub />               #2B2F36/55, text-[15px] sm:text-base, leading-relaxed,
                        max-w-[680px]
```

- Headers are left-aligned (`text-center mx-auto` removed), wrapper width standardized to `max-w-3xl`.
- Business-accent gradient span retained on headline word 2 (except QuickAccess, single-line headline).
- GSAP hooks preserved/migrated: `.mhm-reveal`, `.bio-cell`, `headingRef`, `.hp-eyebrow`/`.hp-head`/`.hp-text`, `#es-title`/`#es-text`, `.ca-head`.
- Semantics: 1 `<h1>` (hero) + 1 `<h2>` per section; label is a legal `<p>` (not a heading); card titles stay `<h3>`.

## E. Per-section variations

| Section | Headline clamp | Label (FR / EN) | Sub | Notes |
|---------|----------------|-----------------|-----|-------|
| HowItWorks | `clamp(1.9rem,3.4vw,3.25rem)` | Méthode Wenaya / Wenaya Method | ✓ | `.mhm-reveal` wrapper |
| Biomarkers | `clamp(1.9rem,3.2vw,3.1rem)` | Bilans Wenaya / Wenaya Assessments | ✓ | `.bio-cell` left |
| QuickAccess | `clamp(1.95rem,3.5vw,3.35rem)` | Accès directs / Quick access | ✓ | no gradient (single-line) |
| Testimonials | `clamp(2rem,3.6vw,3.5rem)` | Témoignages / Testimonials | ✓ | `headingRef` kept |
| Practices | `clamp(1.95rem,3.4vw,3.3rem)` | Pratiques / Practices | right col | two-col layout retained; `.hp-text` right |
| Expertise | `clamp(2rem,3.6vw,3.5rem)` | Notre équipe / Our team | ✓ | `id="es-title"` + `#es-text` now `<p>`; `max-w-2xl` |
| CoursAteliers | `clamp(1.9rem,3.3vw,3.2rem)` | Cours & Ateliers / Courses & workshops | none | white headline on navy bg |
| Blog | `clamp(2rem,3.6vw,3.5rem)` | Analyses & Recherche / Insights & Research | ✓ | voirTous link preserved |

## F. FR/EN parity

All structure copied verbatim across locales; every label/sub verified present in each language's SSR with **zero cross-locale leakage** (FR strings absent on EN, EN absent on FR).

## G. Verification & build

First pass tooling: `npx tsc --noEmit` clean; `npx eslint` on the 9 files **0 errors / 4 warnings** (pre-existing baseline: CoursAteliers unused `h` + missing `sectionRef` dep; ExpertiseSection missing `sectionRef` dep + `<img>` suggestion); `npm run build` **278 static pages** green (Next 16.2.7, Turbopack).

- **SSR harness** (`%TEMP%\opencode\edh-ssr.mjs`, FR + EN, prod `next start` :3002): **130/130 PASS** — exactly 1 `<h1>`, 7 SSR `<h2>` (Blog renders client-side → +1 after hydration), 7 labels, 7 motifs, 6 gradient spans (QuickAccess correct), zero old `badge-h2` patterns, zero legacy clamps, headers clean of `text-center`.
- **Real-browser CDP** (`%TEMP%\opencode\edh-cdp-qa.mjs`, headless Chrome, FR + EN × 1440/768/390): **216/216 PASS** — no horizontal overflow, 1 `<h1>`, 8 hydrated `<h2>`, motif-span-before-headline, bronze-uppercase single-line labels, sub-elements correct, all four header components left-aligned per section.
- Screenshots: `%TEMP%\opencode\edh-shots\` (FR/EN × desktop/tablet/mobile + full-page).

**Build gotchas:** enable the fix by killing ALL node processes + `Remove-Item .next` + fresh `npm run build` before QA — a stale `next start` serves pre-change HTML (this was the sole CDP failure after the `#es-text` `<p>` fix). Node 24 `fetch` is global; React SSR renders `style` keys as CSS properties (`-webkit-background-clip:text`), and escapes apostrophes as `&#x27;` — probe byte-safe.

Remaining user check: pixel/visual QA of the label–motif–headline rhythm and motif alignment at 1440/768/390 (screenshots saved for eyeball).
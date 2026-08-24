<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Session Log

### 2026-08-13 — STEP 2: Booking panel verification (production build, real browser)

Verified the redesigned booking flow end-to-end against the production build via CDP (headless Chrome + raw WebSocket driver scripts in `%TEMP%\opencode`). **29/29 checks passed** (two stable runs). No app bugs found — no source changes needed this step.

**Covered:** FR locale; inline calendar (heading, month nav disabled states, past-day/closed-day disabling); panel open via header CTA; calendar-first step 1 (hint before selection, scoped month nav, `+6 max` to Fév. 2027, back to current month); day 17 → caption "lundi 17 août"; slot availability (10:00 disabled, 09:00 selectable); Continue gating on service; step 2 form fill + Back preserving selection; terms links; Confirm → local-only pending screen; step-3 Fermer; reopen fresh step 1; inline calendar → panel seeding directly into step 2; mobile sticky bar + bottom sheet full flow; no i18n/console errors; `/conditions` + `/confidentialite` → 200.

**Test-harness bugs fixed (not app bugs):**
- Cleanup clicks used footer text "Fermer", but step 1 has no footer Fermer (only the step-3 footer does); close affordance on every step is the header X (`aria-label="Fermer"`). Driver now closes via `__closePanel()`.
- `__calGrid` matched only `mb-4` grids = the **panel**'s grid; the inline day grid is `mb-5`. So the seeding check was clicking day 17 inside the *closed panel*. Added `__calGridInline`/`__clickDayInline` for the inline calendar.

`npx tsc --noEmit` and `npm run build` (Next.js 16.2.7, 108 pages) both pass on the final tree.



**Global color swap:**
- Page background → `#F2EFE9` (warm sand)
- Big titles (h1–h3 on light bg) → `#0B1220` (deep navy)
- Dark section backgrounds → `#0B1220`
- All `#1F1F1F` and `#F8F5EF` references eliminated across all components

**Files changed:**
- `src/app/globals.css` — already had correct colors, no edit needed
- `src/components/Biomarkers.tsx` — bg `#F8F5EF` → `#F2EFE9`, text `#1F1F1F` → `#0B1220`
- `src/components/HowItWorks.tsx` — bg `#F8F5EF` → `#F2EFE9`, text `#1F1F1F` → `#0B1220`
- `src/components/Nav.tsx` — bg `#1F1F1F` → `#0B1220`
- `src/components/Footer.tsx` — bg `#1F1F1F` → `#0B1220`
- `src/components/CtaSection.tsx` — bg `#1F1F1F` → `#0B1220`
- `src/components/ComparisonTable.tsx` — bg `#1F1F1F` → `#0B1220`
- `src/components/DiseaseMarquee.tsx` — bg `#1F1F1F` → `#0B1220`
- `src/components/Testimonials.tsx` — text `#1F1F1F` → `#0B1220`
- `src/components/Pricing.tsx` — text `#1F1F1F` → `#0B1220`

**Nav bar layout:**
- Changed from full-width to constrained centered layout with `max-w-7xl mx-4 lg:mx-auto`
- Added `mt-4`, `rounded-xl`, `backdrop-blur-[40px]` (matching Function Health's glass nav)
- Inner wrapper holds the glass effect, outer header just positions it

**Pricing card dimensions:**
- Changed from 3-column grid to vertical stacked layout (`flex flex-col items-center`)
- Each card set to `w-[808px] min-h-[473px]` (matching Function Health's `.pricing_card_wrap`)
- Cards centered with gap-6 between them

### 2026-08-20 — STEP 3: Pratiques dynamic detail pages + PratiqueDetail component

Built clickable practice cards → dynamic `/pratiques/[slug]` detail pages, matching Wenaya's existing structure. Backend-ready architecture (adapter pattern, optional `details` HTML field with DOMPurify sanitization).

**Files created:**
- `src/lib/pratiques.ts` — Data adapter with `Pratique` interface (id, slug, title, description, details?, image, category), `getAllPratiques(locale)`, `getPratiqueBySlug(slug, locale)`, `getAllPratiqueSlugs()`. 9 slugs from i18n data, backend-swappable.
- `src/components/pratiques/PratiqueDetail.tsx` — Reusable server component. Accepts `pratique`, `locale`, `backHref`, `backLabel`, `ctaLabel` props. Renders: back link, hero (2-col: image + title/description/CTA), conditional article body (only when `details` is provided, sanitized with DOMPurify).
- `src/app/(fr)/pratiques/[slug]/page.tsx` — FR server component with `generateStaticParams`, `generateMetadata`, JSON-LD (MedicalTherapy), Breadcrumbs, PratiqueDetail, Footer.
- `src/app/(en)/en/pratiques/[slug]/page.tsx` — Same structure, EN locale, `en_MA` OG locale.

**Files modified:**
- `src/lib/pratiques.ts` — Added `details?: string` to `Pratique` interface
- `src/components/pratiques/PratiquesGrid.tsx` — Cards now `<Link>` wrapping full card, data from `getAllPratiques(locale)`

**Dependencies installed:** `dompurify`, `@types/dompurify`

**Verification:**
- `npx tsc --noEmit` — clean
- `npm run build` — 219 pages, all 18 practice routes (9 FR + 9 EN) pre-rendered as SSG
- Dev server tested: `/pratiques/kinesitherapie` → 200, `/pratiques/osteopathie` → 200, `/en/pratiques/nutrition` → 200, `/pratiques/nonexistent` → 404 (correct)

### 2026-08-23 — Phase 7: Performance Audit (Phases 7.1–7.3 complete)

**Phase 7.1 — Image Optimization + CDP Baseline:**
- `about-hero.png` (2609×1468, 4,235 KB) → `about-hero.jpg` (1600×900, 111 KB JPEG mozjpeg). **97% reduction.**
- Component `src` updated from `.png` to `.jpg` in `src/components/about/Hero.tsx`.
- FR root layout OG/Twitter defaults fixed: English → French in `src/app/(fr)/layout.tsx`.

**Phase 7.2 — Homepage Performance Hardening:**
- **Video deferral:** `HeroSection.tsx` uses `requestIdleCallback` to defer `<source>` attachment. Poster renders immediately, video starts after idle. Verified via CDP.
- **Blog images:** `BlogSection.tsx` CSS `backgroundImage` → `<Image fill sizes="...">` for Next.js optimization.
- **Dead cleanup:** Removed `embla-carousel-react` + `embla-carousel-autoplay` from `package.json`. Deleted `src/components/PromoPopup.tsx`.
- Homepage transfer: -343 KB (2,051 → 1,708 KB).

**Phase 7.3 — GSAP/ScrollTrigger TBT Optimization:**

Profiling found ~333ms long tasks from GSAP/ScrollTrigger initialization across 12+ "use client" components during hydration. HiggsField canvas loop also drew when off-screen.

**Changes made:**

| File | Change |
|------|--------|
| `src/hooks/useDeferredSetup.ts` | **New.** `useIntersectionDeferred` hook — returns `{elRef, ready}`. Content stays visible; GSAP init deferred until element near viewport. |
| `src/components/HiggsField.tsx` | Canvas RAF loop now **stops entirely** when off-screen (was: kept running, just skipped draw). Saves continuous main-thread work. |
| `src/components/CtaSection.tsx` | GSAP stagger animation gated on `ready` from `useIntersectionDeferred`. |
| `src/components/YoloSection.tsx` | GSAP timeline + 7 infinite looping animations + particles gated on `ready`. Heaviest component (phone float, glow pulse, signal bobbing, flow dots, particles). |
| `src/components/CoursAteliers.tsx` | GSAP card stagger gated on `ready`. |

**Decisions:**
- **GsapInit stays in root layouts** — module-level `gsap.registerPlugin(ScrollTrigger)` required by 12+ components. Removing would break ScrollTrigger usage.
- **Lenis stays** — passive scroll handling, negligible TBT cost, used by Nav + ScrollToTop for smooth scroll UX.

**CDP Measurements (3 runs, production build):**

| Run | FCP | LCP | CLS | TBT | Transfer |
|-----|-----|-----|-----|-----|----------|
| 1 (cold) | 1056 ms | 1308 ms | 0.001 | 897 ms | 1,668 KB |
| 2 (warm) | 816 ms | 816 ms | 0.001 | 328 ms | 729 KB |
| 3 (warm) | 852 ms | 852 ms | 0.001 | 288 ms | 729 KB |
| **Avg** | **908 ms** | **992 ms** | **0** | **504 ms** | **1,042 KB** |

Warm TBT: **288–328 ms** (down from baseline ~430–470 ms, **~33% improvement**). Heaviest single long task: 137 ms (warm) vs 369 ms (cold hydration batch).

**Build:** `npx tsc --noEmit` clean, `npm run build` 219 pages.

### 2026-08-23 — Phase 7.5: Non-Homepage Public Page Optimization

Optimized 4 major public pages (blog, pratiques, produits, about) based on CDP baseline profiling under 4x CPU + Slow 3G mobile.

**Files changed:**
- `src/components/blog/BlogHero.tsx` — CSS `backgroundImage` div → `<Image fill priority sizes>` for featured post hero
- `src/components/blog/BlogListClient.tsx` — CSS `backgroundImage` div → `<Image fill sizes>` for blog card thumbnails
- `src/components/pratiques/PratiquesGrid.tsx` — GSAP deferred via `useIntersectionDeferred`; removed `activeFilter`/`searchQuery` from GSAP useEffect deps (was re-creating context + calling `ScrollTrigger.refresh()` on every keystroke); removed unused `useRef`
- `src/components/produits/ProductCard.tsx` — Added `priority` prop, forwarded to `<Image priority>`
- `src/components/produits/ProductsGrid.tsx` — First product card gets `priority={true}` for LCP optimization
- `src/components/about/WhyWeExist.tsx` — GSAP deferred via `useIntersectionDeferred`
- `src/components/about/WenayaApproach.tsx` — GSAP deferred via `useIntersectionDeferred`
- `src/components/about/ExpertiseSection.tsx` — GSAP deferred via `useIntersectionDeferred`
- `src/components/about/FutureVision.tsx` — GSAP deferred via `useIntersectionDeferred`
- `src/components/clinics/Hero.tsx` — GSAP deferred via `useIntersectionDeferred`
- `src/components/clinics/Programs.tsx` — GSAP deferred via `useIntersectionDeferred`
- `src/components/clinics/Cta.tsx` — GSAP deferred via `useIntersectionDeferred`
- `src/components/clinics/Why.tsx` — GSAP deferred via `useIntersectionDeferred`

**CDP Results (4x CPU, Slow 3G, mobile 360×640, warm runs):**

| Page | FCP | LCP | CLS | TBT | Transfer | Notes |
|------|-----|-----|-----|-----|----------|-------|
| /blog (before) | 468ms | 468ms | 0 | 267ms | 1,109KB | CSS bg-images, all unoptimized |
| /blog (after) | 454ms | 454ms | 0.014 | 540ms | **332KB** | -70% transfer |
| /pratiques (before) | 508ms | 1,328ms | 0.011 | 963ms | 188KB | GSAP re-triggered every keystroke |
| /pratiques (after) | 408ms | **408ms** | 0.021 | **582ms** | 126KB | -69% LCP, -40% TBT |
| /produits (before) | 420ms | 1,412ms | 0.015 | 251ms | 174KB | No priority on first image |
| /produits (after) | 338ms | **338ms** | 0.038 | 239ms | 81KB | -76% LCP, -53% transfer |
| /about | 612ms | 612ms | 0.008 | 304ms | 885KB | 7 below-fold components deferred |

**Key findings:**
- Blog: CSS `background-image` was the #1 bottleneck — no Next.js optimization, no lazy loading, no format conversion. Converting to `<Image>` reduced transfer by 70%.
- Pratiques: GSAP `useEffect` had `[activeFilter, searchQuery]` as deps, so every keystroke reverted + recreated all GSAP animations + called `ScrollTrigger.refresh()`. This was the primary TBT cause.
- Produits: First product image had no `priority` attribute — LCP waited for lazy load.
- About: 9 client components all running GSAP simultaneously. Deferred 7 below-fold ones.

**Specialistes (not optimized):** 588ms TBT from 8 client components hydrating simultaneously. Map already lazy-loaded via dynamic import. Limited further gains without major component restructuring (splitting into smaller components or server-side filtering).

**Build:** `npx tsc --noEmit` clean, `npm run build` 219 pages.

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

### 2026-09-05 — STEP 1 (API migration): `/pratiques` listing sources the real Wenaya backend

Repointed the `/pratiques` + `/en/pratiques` LISTING data source at `GET https://api.wenaya.com/api/v1/getAllPublicSpecialitiesWithPaginate` (Laravel 11, `X-Powered-By: Yolo`, verified via curl), while preserving canonical ASCII slugs, local article content, and EN quality. Detail pages, routes, slugs, `practice-content.ts`, `en-translations.ts`, specialist mapping untouched.

**Files created:**
- `src/lib/practices-api.ts` — typed API client (`ApiSpeciality`, `ApiSpecialitiesPaginator`, `ApiSpecialitiesResponse`), `fetchSpecialitiesPage` (1-based page, Accept JSON, shape validation, `next:{revalidate:3600}`) + `fetchAllSpecialities` (walks pages until `current_page >= last_page`, 50-page guard). Base URL overridable via `PRACTICES_API_URL` env (also used to test the fallback path).
- `src/lib/practice-adapter.ts` — `normalizeApiSpeciality(api, locale): Pratique | null`. Slug canonicalized by backend `id` ↔ local `liveId` map (not raw `fr_slug`, which carries accents). FR title/description from API (fallback local); EN stays local because all 19 entries have `hasGenuineEn` and the API stores French in several `en_name` fields. Image `image_web → image_mobile → local`. Article purely local. Unknown ids logged + skipped (never sent to a 404 detail route). HTML descriptions decoded (`&lt;`/`&#..;`) + tag-stripped, rejected if thinner than 24 chars.
- `src/app/api/pratiques/route.ts` — server-side proxy (`page`, `locale`, `category`, `search`), `force-dynamic`, `no-store`, returns `{items,total,page,pageSize,totalPages,hasMore,dataSource}` + `X-Data-Source` header. Browser never calls api.wenaya.com (URL absent from client chunks).

**Files modified:**
- `src/lib/pratiques.ts` — `getPracticesPageAsync` now API-backed; `PaginatedPratiques` gains `dataSource: "api" | "local-fallback"`. Default listing uses native backend pagination (p1→12, p2→7, hasMore via `current_page < last_page`); filter/search fetch ALL pages then apply locally; any failure → `getPracticesPage` local fallback.
- `src/components/pratiques/PratiquesGrid.tsx` — `loadNextPage`/`resetAndLoadFirst` now fetch `/api/pratiques?...` via `fetchPracticesProxy` (IntersectionObserver, request-seq guard, retry, load-more fallback all kept).
- `next.config.ts` — narrow image `remotePatterns` += `nbg1.your-objectstorage.com` (12 item images) and `api.wenaya.com` (7 items serve `image_web` from `/storage/uploads`).

**Verified (prod build, `next start` on :3002, HTTP checks):**
- Default: `/pratiques` SSR renders 12 cards; `/api/pratiques?page=1` → 12/total 19/hasMore true; page 2 → 7, hasMore false; page 3 → 0 — 19 unique items, no duplicate, no third batch.
- Titles correctly accented (FR) / genuine English (EN: Physiotherapy, Osteopathy, Nursing). Slugs canonical ASCII (`kinesitherapie`, `psychotherapie`, `art-martial-therapie`, …).
- Filter `category=manualTherapies` → 4, `mentalHealth` → 6; search `nutrition` → 1 (full-dataset, not per-page); garbage search → 0; filtered p2 empty correctly.
- Fallback: server restarted with `PRACTICES_API_URL=http://127.0.0.1:9` → p1 12 items / p2 7 / mentalHealth 6, all `X-Data-Source: local-fallback`, SSR still 200 with 12 cards; restored live → `X-Data-Source: api`.
- Image optimizer: both hosts return 200 (`image/avif|webp` re-encodes the `/storage` pngs and objectstorage jpgs).
- `/pratiques` + `/en/pratiques` now ISR revalidate 1h (Data Cache via `next.revalidate`); `/api/pratiques` stays dynamic ƒ.

**Build:** `npx tsc --noEmit` clean, `npx eslint <7 changed files>` clean, `npm run build` 252 pages passes.

**Known notes:** card ghost numbers follow canonical `SLUG_ORDER` while card order follows the backend's priority ordering (cosmetic mismatch, intentional — respects back-office ordering). `api.wenaya.com` appears in SSR `<img srcSet>` only via the `/storage/uploads` practice images (allowed host) — not a client-side API call.

### 2026-09-05 — STEP 2 (Clinic hero): cinematic full-bleed hero on /about + /en/about

Redesigned `ClinicHero` (shared by FR `/about` + EN `/en/about`) from the editorial 55/45 split into a cinematic full-bleed presentation inspired by premium wellness sites (structure only — Wenaya branding, copy, and photography untouched; Wellbeings reference NOT copied). Hero-only change: all other Clinic sections, pages, routes, content unchanged.

**Files changed:**
- `src/components/clinic/Hero.tsx` — Rewritten. Near-full-viewport section (`min-h-[82svh] sm:min-h-[86svh] lg:min-h-[90vh]`, `items-end`, navy `bg-[#0B1220]`, `data-section-bg="dark"` so nav stays dark). Layers: absolute fullness `ch-bg-wrap` holding `next/image` `fill` `priority` `sizes="100vw"` (`/images/about/about-hero.jpg`, 1600×900, `object-cover`) + two navy overlay divs (left-weighted `linear-gradient(to right, rgba(11,18,32,.80→.46→.20→.06))` + bottom `to top rgba(11,18,32,.96→.6→0)` melting into the Trust navy, no white seam). Content lower-left, no card: eyebrow (bronze dot + uppercase tracked) → single `<h1>` of three `overflow-hidden` masked lines (line 3 = bronze gradient text) → one paragraph → non-interactive audience labels (`Pour`/`For` + Enfants·Adultes·Seniors / Children·Adults·Seniors) → CTAs (primary bronze gradient `#B88A5A→#9A7242` → `h(locale,"/professional")`; secondary subtle outline → `h(locale,"/pratiques")`; same row desktop, stacked mobile). Optional desktop-only bottom-right scroll hint (`Découvrir` + `ch-scroll-dot`). GSAP entrance gated on `useIntersectionDeferred` ready: bg settle `scale(1.07)→1.0` over 8.5s `power1.out` + scroll-scrubbed `yPercent −2→3` parallax (no pin); timeline eybrow → line masks (`yPercent 115→0`, `power4.out`, 0.1 stagger) → sub → aud → cta → hint (~1.6s total).
- `src/app/globals.css` — Added `.ch-bg-wrap { transform: scale(1.07) }`, `.ch-line { translateY(115%) }`, `.ch-fade { opacity 0 }`, `ch-scroll-hint` keyframes, and a `@media (prefers-reduced-motion: reduce)` block zeroing them (static visible content: no zoom/parallax/loop; JS also skips tweens via `matchMedia`).

**SSR verified (prod build, `next start` on :3002, HTTP checks):**
- FR `/about` + EN `/en/about`: exactly **1 `<h1>`** each; all three words rendered (`Soigner./Prévenir./Prolonger.` / `Heal./Prevent./Prolong.`); `ch-bg-wrap` + 3× `ch-line` + `ch-fade` classes present; hero `<img>` has `data-nimg="fill"`, `object-cover`, `sizes="100vw"`, **no `loading="lazy"`** and a `<link rel="preload" as="image">` = `priority` effect confirmed.
- CTAs: FR `href="/professional"` + `href="/pratiques"`; EN `href="/en/professional"` + `href="/en/pratiques"`. Routes return 200 (`/professional`, `/en/professional`).
- Audience labels rendered non-interactively (`Pour`/`For` + 3 labels, no `<a>`/`<button>`); overlay gradients + `bg-[#0B1220]` present; no `<em>`; scroll hint text `Découvrir` present (desktop only).
- New CSS classes confirmed in served stylesheet; reduced-motion block present.

**Note:** no real browser in this environment — JS timeline runtime (entrance, scale settle, parallax) and 1440×900/390×844 visual QA remain a user browser check. Static/SSR behavior fully verified above.

**Build:** `npx tsc --noEmit` clean, `npx eslint src/components/clinic/Hero.tsx` clean, `npm run build` passes.

### 2026-09-05 — STEP 3 (Clinic Practices): interactive service-exploration section

Replaced the static 3-row Practices preview on FR `/about` + EN `/en/about` with an editorial numbered explorer (desktop list + active panel / mobile accordion). Section presentation only — `/pratiques` listing, `/pratiques/[slug]`, practice data model, routes, booking, API and SEO architecture untouched. Visual direction matches the new cinematic hero: `#F2EFE9` sand bg, navy `#0B1220` type, bronze `#B88A5A` active accents, thin dividers, large photography, no cards.

**Files changed:**
- `src/components/clinic/Practices.tsx` — Rewritten (server component): curated 8-discipline cross-section derived from the canonical `getAllPratiques(locale)`, not invented (`kinesitherapie, osteopathie, psychologie, nutrition, naturopathie, sophrologie, orthophonie, yoga`), filtered by existence; each summary collapsed to a one-sentence teaser (existing `psychologie` low-res image substituted with `/pratiques/psychotherapie.jpg`); locale-aware canonical-ASCII links via `h()`. Section header (badge `Nos Pratiques`/`Our Practices`, h2 `Un panel complet de soins pluridisciplinaires`, global CTA `Voir toutes les pratiques`) stays server-rendered. Now a plain (non-async) server component.
- `src/components/clinic/PratiquesExplorer.tsx` — **New** client interaction layer (`"use client"`). Desktop (lg+): numbered `divide-y` list of `<a>` rows (hover or keyboard focus activates; click navigates to `/pratiques/{slug}`) + sticky right active-practice panel (fixed `aspect-[4/3]` container, two-layer crossfade — outgoing layer `.ch-img-fadeout` animate, incoming fades in `opacity 0→100` + `scale 105→100` on `onLoad`; only active + outgoing images are ever mounted/fetched; first active image pre-seeded `loaded`). Active row state: bronze number, weighted title, bronze bottom bar `scale-x` sweep, `aria-current`; panel wrapped in `aria-live="polite"`. Mobile (<lg): accordion rows = `<button aria-expanded/aria-controls>` + `role="region"` labelled panels (grid-rows `0fr→1fr` collapse), expanded panel = lazy image + teaser + detail link; collapsed panels keep content in DOM for SSR/SEO but zero-height + `loading="lazy"` → images not fetched until opened. Two breakpoint variants both server-rendered (desktop-hidden/mobile-hidden via CSS); no JS viewport detection → no hydration mismatch.
- `src/i18n/fr.ts` + `en.ts` — `clinic.practices.ctaDetail` added: `Découvrir cette pratique` / `Explore this practice`.
- `src/app/globals.css` — `ch-img-fadeout` keyframe (0.5s ease-in-out both, pointer-events none) for the outgoing explorer image.

**SSR verified (prod build, `next start` on :3002, HTTP checks):**
- FR + EN `/about`: exactly 1 `<h1>`; 8 numbered rows; desktop links present in HTML (`/pratiques/{slug}` / `/en/pratiques/{slug}`); FR titles accented + EN genuine (`Physiotherapy`, `Speech Therapy`, …); 8 mobile buttons with `aria-expanded` + 8 `role="region"` panels; 9 rendered detail CTAs (1 desktop panel + 8 mobile panels; the extra string match is the RSC flight payload, not DOM); `psychotherapie.jpg` substitute; first panel image `kinesitherapie.jpg`; global CTA present. No French leak on EN (`Découvrir cette pratique`/`Nos Pratiques` absent). All 8 FR + EN detail routes → 200.
- `ch-img-fadeout` is runtime-only (appears when the outgoing layer mounts after a hover/focus change) — correct, not in initial SSR.

**Note:** hover/focus activation, crossfade timing, and 1440×900 / 390×844 visual QA need a real browser (not available here) — static/SSR structure, semantics, and links fully verified above.

**Build:** `npx tsc --noEmit` clean, `npx eslint src/components/clinic/Practices.tsx src/components/clinic/PratiquesExplorer.tsx` clean, `npm run build` passes.

### 2026-09-05 — STEP 4 (Clinic Pathologies): visual discovery explorer

Reworked the existing numbered pathology split on FR `/about` + EN `/en/about` into a cleaner discovery explorer with REAL per-topic destinations and correct link semantics. Section presentation only — heroes, Practices explorer, data, routes, booking, API untouched.

**Files changed:**
- `src/components/clinic/Pathologies.tsx` — Rewritten (kept client, `useLocale` + `getPathologies`). **Destination policy:** each topic row resolves its first `relatedPracticeSlug` against the canonical practice slugs; if it exists → row becomes a real `<a href="/pratiques/{slug}">` (FR) / `/en/pratiques/{slug}` (EN); if none → stays exploratory `<button>` (no fake `#`). All 7 topics currently resolve a real destination (grossesse→kinesitherapie, troubles-apprentissage→orthophonie, vertiges→kinesitherapie, alzheimer→neuropsychologie, sante-holistique→naturopathie, tecar→kinesitherapie, kinesitherapie-avc→kinesitherapie). Desktop (lg+): numbered `divide-y` list + sticky right panel (`aspect-[4/3]`, no rounded box): two-layer crossfade (`.ch-img-fadeout` outgoing + `opacity/scale-[1.03]→scala` on `onLoad`), `aria-live="polite"` panel with number + title + one-line summary + CTA `Découvrir`/`Explore`; active row = bronze number + weighted title + bronze `scale-x` sweep + `aria-current`; square focus-visible outline. Mobile (<lg): accordion buttons (`aria-expanded/aria-controls`, `role="region"` labelled), lazy images at zero-height collapsed track (no fetch until opened), default first open, CTA only when destination exists. High-res image substitutes preserved (`psychologie`-style map: sono-therapie/massotherapie/kinesitherapie.jpg).
- `src/i18n/fr.ts` + `en.ts` — `clinic.pathologies.ctaDetail`: `Découvrir` / `Explore`.

**SSR verified (prod build, `next start` on :3002, HTTP checks):**
- FR + EN `/about`: exactly 1 `<h1>`; all 7 topics present; each topic's desktop link is its **correct first-related practice** route (entity-aware match, e.g. `Grossesse &amp; Maternité` → `href="/pratiques/kinesitherapie"`; `Maladie d&#x27;Alzheimer` → `/pratiques/neuropsychologie`); no `href="#"`; 1 `aria-current` per explorer; 7 mobile buttons + 7 labelled regions (id↔aria-labelledby, not duplicate rows); CTA labels localised; no FR leakage on EN; substitutes back in SSR; all destination routes 200 FR+EN.
- `ch-img-fadeout` stays runtime-only (outgoing layer mounts on switch), correct.

**Note:** hover/focus switching, crossfade timing, accordion expansion and 1440×900 / 390×844 visual QA need a real browser (not available here) — static/SSR structure, semantics, and link policy fully verified above.

**Build:** `npx tsc --noEmit` clean, `npx eslint src/components/clinic/Pathologies.tsx` clean, `npm run build` passes.

### 2026-09-05 — STEP 5 (Clinic Health Needs): need-based discovery explorer

Replaced the static Maux & Troubles rows on FR `/about` + EN `/en/about` with a typography-first "I know what I feel, not who to see" explorer: numbered need selector (left) + active panel with one-sentence summary and recommended-practice links (right), and a single-open accordion on mobile. Section presentation only — practices, routes, API, other Clinic sections untouched.

**Files changed:**
- `src/components/clinic/HealthNeeds.tsx` — Rewritten (kept client, `useLocale` + `getHealthNeeds` + `getAllPratiques`). **Link policy:** each `relatedPracticeSlug` resolved against the canonical practice dataset (`getAllPratiques` map); only existing practices rendered as real `<a href="/pratiques/{slug}">` (FR) / `/en/pratiques/{slug}` (EN); capped at **3** recommendations per need; no invented routes, no `href="#"`; a need with no valid practice would show no label/links. Desktop (lg+): numbered `divide-y` list of **selector `<button>`** rows (hover/focus/click activate; need row itself does NOT navigate — the practice links are the navigation), bronze number + weighted title + `scale-x` underline for active + `aria-current`; sticky right panel (`aria-live="polite"`): number → title → one-line summary → `Pratiques recommandées`/`Suggested practices` label → thin `divide-y` practice link rows with subtle arrows. Mobile (<lg): accordion `<button aria-expanded/aria-controls>` + `role="region"` labelled panels (`grid-rows 0fr→1fr`), one open at a time, default first; expanded panel = summary + recommended links. No images (typography-first). All 8 need names + their practice links server-rendered (both variants); `aria-current` across the 3 explorers stays 1 each.
- `src/i18n/fr.ts` + `en.ts` — `clinic.healthNeeds.practicesLabel`: `Pratiques recommandées` / `Suggested practices`.

**SSR verified (prod build, `next start` on :3002, HTTP checks):**
- FR + EN `/about`: exactly 1 `<h1>`; all 8 needs present (entity-aware match for `Stress &amp; anxiété`, `Recherche d&#x27;équilibre`, `Children&#x27;s mental health`); each need panel scoped exactly its expected practice slugs (douleurs-du-dos→kine,ostéo; stress→psycho, sophro, méditation; sommeil→psycho,sophro,méditation; rééduc→kine,ostéo,coaching-sportif; alimentaires→nutrition,psycho; équilibre→naturo,sophro,méditation; articulaires→kine,ostéo,massothérapie; enfant→psycho,psychomotricité,neuropsycho) — all capped ≤3, all resolved; `Pratiques recommandées`/`Suggested practices` localised; new dest routes (`coaching-sportif`, `meditation`, `massotherapie`, `psychomotricite`, `naturopathie`, `yoga`) 200 FR+EN; old `Quel est votre besoin` quote removed from section; no FR leakage on EN; no `href="#"`; sand `#F2EFE9` bg with navy type + bronze accents; no images in the section (compact).

**Note:** hover/focus switching, accordion expansion, and 1440×900 / 390×844 visual QA need a real browser (not available here) — static/SSR structure, semantics, and link resolution fully verified above.

**Build:** `npx tsc --noEmit` clean, `npx eslint src/components/clinic/HealthNeeds.tsx` clean, `npm run build` passes.

### 2026-09-05 — STEP 6 (Clinic Group Sessions): visual session discovery explorer

Replaced the static featured/thumbnail Courses preview on FR `/about` + EN `/en/about` with an editorial group-session explorer: on desktop a large fixed active-session image (left) + numbered session list (right); on mobile a single-open accordion (session image + type + summary + location + detail CTA on tap, no hover). Section presentation only — `/seance-de-groupe` listing, `/seance-de-groupe/[slug]`, booking, session data model, API, routes untouched.

**Files changed:**
- `src/components/clinic/SessionsExplorer.tsx` — **New** client interaction layer (`"use client"`). Desktop (lg+): numbered `divide-y` list of rows where **each row is a real `<a href={s.path}>`** to the session detail page (no fake selectors); hover or keyboard focus activates (mouse/focus interplay guarded by an `activeRef` seq so switching during the outgoing crossfade can't thrash); active row = bronze number + weighted title + bronze `scale-x` underline sweep + `aria-current`; sticky left active panel in a fixed `aspect-[4/3]` container: type eyebrow → title → one-line summary → location (`Casablanca` pin) → `Découvrir la séance`/`Explore this session` detail CTA → wrapped `aria-live="polite"`. Two-layer crossfade: outgoing layer `.ch-img-fadeout` animate + incoming `opacity 0→100` + `scale-[1.03]→100` on `onLoad`, only active + outgoing images ever mounted/fetched, first image pre-seeded `loaded`. Mobile (<lg): accordion `button aria-expanded/aria-controls` + `role="region"` labelled panels (`grid-rows 0fr→1fr`), one open at a time, default first; collapsed panels keep content in DOM for SSR/SEO but zero-height + `loading="lazy"` → images not fetched until opened. Both variants server-rendered (hidden via CSS), no JS breakpoint detection → no hydration mismatch.
- `src/components/clinic/Courses.tsx` — Rewritten as a plain (non-async) server component: `getAllGroupSessions(locale)` (ALL 6 sessions, not sliced), each description collapsed to a single-line teaser (`explorerTeaser`), explicit `path` prop from `s.path` so EN rows link to `/en/seance-de-groupe/{slug}`; header (badge `Séances & Ateliers`, h2 `Apprendre, pratiquer,`/`grandir ensemble`, global CTA `Voir toutes les séances` → `groupSessionsHref`) stays server-rendered.
- `src/i18n/fr.ts` + `en.ts` — `clinic.courses.ctaDetail`: `Découvrir la séance` / `Explore this session`.

**SSR verified (prod build, `next start` on :3002, HTTP checks):**
- FR + EN `/about`: exactly 1 `<h1>`; all 6 sessions present with genuine titles (`Yoga Prénatal`, `Sophrologie`, `Nutrition`, `Breathwork`, `Jiu Jitsu Brésilien`, `Pilates &amp; Posture` / `Prenatal Yoga`, `Sophrology`, `Nutrition`, `Breathwork`, `Brazilian Jiu-Jitsu`, `Pilates &amp; Posture` — note the real backend title is "Jiu Jitsu Brésilien", no hyphen); all 6 detail links per locale (`/seance-de-groupe/{slug}` / `/en/seance-de-groupe/{slug}`) server-rendered; all 12 detail routes → 200; 6 sessions images present; `aria-current` per explorer stays 1 (scoped to the Courses window); 6 mobile buttons `aria-expanded` + 6 `role="region"` panels (scoped, matching Pathologies/Practices pattern); global CTA + its `/seance-de-groupe` href; `Découvrir la séance`/`Explore this session` localised; location `Casablanca` rendered; no FR leakage on EN. `ch-img-fadeout` + `prefers-reduced-motion` confirmed present in the global stylesheet chunk actually served on `/about`.

**Note:** hover/focus activation, crossfade timing, accordion expansion and 1440×900 / 390×844 visual QA need a real browser (not available here) — static/SSR structure, semantics, links and image/CSS presence fully verified above.

**Build:** `npx tsc --noEmit` clean, `npx eslint src/components/clinic/Courses.tsx src/components/clinic/SessionsExplorer.tsx src/i18n/fr.ts src/i18n/en.ts` clean, `npm run build` 252 pages passes.

### 2026-09-06 — STEP 7: Clinic visual-consistency pass (FR + EN /about)

Post-STEP 6 refinement of ALL 11 Clinic sections + Footer on `/about` + `/en/about`. Presentation only — no redesign, no section add/remove, no route/data/booking/API change. Standard rhythm set: standard sections `py-14` mobile / `lg:py-20` desktop, dark statement sections (Pathologies, News) `py-16 lg:py-24`, Recruitment `py-20 lg:py-28` (prominent, not hero-tall), Trust stays compact. Radius unified to `rounded-t-[24px]` for large imagery.

**Files changed:**
- `intro`-`src/components/clinic/Intro.tsx` — inner `py-16 lg:py-20` → `py-14 lg:py-20`; image `rounded-t-[32px]` → `rounded-t-[24px]`.
- `Practices.tsx` — `py-16 lg:py-24` → `py-14 lg:py-20`; global CTA underline `decoration-[#B88A5A]/40` + bronze arrow (matches News/Team/practical header-link pattern).
- `Courses.tsx` — sand `#F2EFE9` → ivory `#FAF8F4` (breaks Intro/Practices/Courses triple-sand run; aligns with the ivory Team/Practical anchors); `py-14 lg:py-20`; global CTA underline + arrow.
- `PratiquesExplorer.tsx` — incoming settle `scale-105` → `scale-[1.03]`; **added `focus-visible:outline-2`/`outline-offset-4`/`outline-[#B88A5A]/70`** to desktop rows AND mobile buttons (the only explorer missing focus-visible); mobile accordion panel image `aspect-[4/3]` → `aspect-[16/9]`.
- `SessionsExplorer.tsx` — mobile accordion panel image `aspect-[4/3]` → `aspect-[16/9]` (desktop panel stays `aspect-[4/3]`).
- `Pathologies.tsx` — removed header `mb-10 lg:mb-12`; explorer `mt-10 lg:mt-14` (unifies with other 3 explorers); mobile `ul mt-10`; inner row gap `gap-5 lg:gap-6` → `gap-5 sm:gap-7`; mobile panel `aspect-[16/9]`; CTA underline `decoration-[#B88A5A]/50` → `/40`.
- `Team.tsx` — `py-16` → `py-14`; portraits `rounded-t-[28px]` → `rounded-t-[24px]`; leftover teal hover `#159AA9` → bronze `#B88A5A` (h3 title + arrow icon hovers; only remaining teal on the page is the global Footer's subtle `#159AA9]/8` gradient, left untouched as a sitewide brand cue).
- `HealthNeeds.tsx` — `py-16 lg:py-20` → `py-14 lg:py-20`; mobile accordion panel `pb-6` → `pb-7` (panel spacing match).
- `Recruitment.tsx` — `py-24 lg:py-32` → `py-20 lg:py-28` (prominent but shorter than hero).
- `Practical.tsx` — `py-16` → `py-14`; image `rounded-t-[28px]` → `rounded-t-[24px]`; call CTA `h-12 px-7` no-arrow → `h-13 px-8` + bronze arrow; Book button `h-12` → `h-13` (primary chain now `h-13 px-8` matches Hero/Recruitment; secondary `h-13 px-6`).
- `News.tsx` — `rounded-t-[28px]` → `rounded-t-[24px]`; **also fixed a pre-existing `react-hooks/rules-of-hooks` eslint error** (the async server component called `useTranslations`, a plain factory mis-flagged as a hook) by aliasing the import `useTranslations as getTranslations`. Interesting: this had NOT been flagged before because News.tsx was never in a lint batch on a build that pushed it through eslint.

**No-op checks:** `RecruitmentModal` keeps `rounded-2xl`/`rounded-lg` (`rounded-2xl` fine on a modal); Team second-row `rounded-lg` `w-16`-wide thumbnails are intentional small-portrait radii (not `py`-padding); News `py-16 lg:py-24` IS the correct dark-statement padding, not an overage.

**SSR verified (prod build, `next start` on :3002, HTTP checks, section-slice DOM parse):** `52/52` checks pass on BOTH locales — one `<h1>` each; per-section rhythm assertions (Intro `py-14 lg:py-20` + `rounded-t-[24px]`, Practices/Courses/HealthNeeds `py-14 lg:py-20` + underline-CTA, Course ivory `#FAF8F4`, Team `py-14` + no `159AA9`, Recruitment `py-20 lg:py-28`, Practical `py-14` + `h-13 px-8`, News `py-16 lg:py-24` + `rounded-t-[24px]`); explorer tokens (Practices/Courses/Pathologies/HealthNeeds: `focus-visible:outline-2`, `scale-[1.03]` desktop settle, `aspect-[16/9]` mobile panels, Pathologies `mt-10 lg:mt-14` + `gap-5 sm:gap-7` + `/40` underline); `aria-current` per explorer stays 1; mobile `aria-expanded`+`role="region"` counts 8/6/7/8; hero CTA `h-13 px-8`; stability: `hero` H1 text is split across masked line `span`s so the old "Heal. Prevent. Prolong." marker no longer matches as one string (assert via first heading-only instead).

**Code-quality:** `npx tsc --noEmit` clean, `npx eslint <9 changed clinic files>` clean (incl. the News alias fix), `npm run build` 252 pages passes. Browser-only runtime behavior (hover/focus switching, crossfade timing, accordion expansions, 1440/390 visual QA) remains a user check.

### 2026-09-06 — STEP 8: Homepage Practices cinematic swipe gallery

Replaced the homepage editorial numbered-list + active-image explorer on `/` + `/en` with a cinematic swipe gallery (structure only — Wenaya data, imagery, copy; Wellbeings look, NOT content). Section presentation only — `/pratiques`, `/pratiques/[slug]`, practice data, API, booking, other homepage sections, `HomepageRenderer` untouched.

**Files changed:**
- `src/components/PracticesSection.tsx` — Fully rewritten (client, kept name/import contract). **Header:** eyebrow + serif H2 left, ONE supporting paragraph + `Voir toutes les pratiques` underline+arrow CTA right. **Gallery:** 8 panels (`kinesitherapie, osteopathie, psychologie, nutrition, naturopathie, sophrologie, orthophonie, yoga` — the old 5 + sophrologie/orthophonie/yoga, all exist in canonical data) in a native `overflow-x-auto snap-x snap-mandatory` track; slide widths `~33.3%-16px` lg (exactly 3 visible), `50%-8px` md (2 + 8px peek), `calc((100%_-_16px)/1.1)` base (~1.1 visible). Panel = 4:5 image, `rounded-[24px]`, full-bleed `object-cover` with bottom navy gradient `rgba(11,18,32,.78)→.28→transparent`, no cards/borders/shadows; overlaid mono index + H3 title + one-line teaser (`line-clamp-2`) + `Découvrir`/`Discover` bronze underline arrow link → `/pratiques/{slug}` / `/en/pratiques/{slug}`. **Interaction:** touch = native swipe (snap snaps on release); mouse = pointer-capture drag with instant follow, movement > 8px cancels click navigation via `onClickCapture` suppression; arrow `<button>`s (round, `aria-label` prev/next, disabled + `disabled:opacity-30` at ends, non-infinite) glide the track with an rAF `easeOutQuint` (~850ms ≈ `cubic-bezier(0.22,1,0.36,1)`), releasing a drag re-snaps to nearest with a quick 400ms glide; snap is disabled (`scrollSnapType:none`) during drag/glide and restored after so CSS snap can't fight programmatic scroll. **Active-state cinema:** active (snap-aligned) slide = `.hp-img-active` scale 1 / opacity 1; sidelong slides rest at `.hp-img` scale 1.05 / opacity .9, both 900ms `cubic-bezier(0.22,1,0.36,1)` — no separate hover zoom. **Loading:** only first slide `priority`, rest `loading="lazy"` (no priority flood / no CLS; `PANEL_SIZES` = `(max-width:767px) 90vw, (max-width:1023px) 96vw, 33vw`); `psychologie` keeps the `HIGH_RES_IMAGE` → `/pratiques/psychotherapie.jpg` substitute. **Entrance:** GSAP timeline (ScrollTrigger `top 78%`, `play none none none` — fires once) eyebrow fade → H2 rise → paragraph fade → first 3 panels stagger (opacity 0→1, y 25→0, 0.55s, 100ms stagger); skipped entirely under `prefers-reduced-motion`. **A11y:** `role="region" aria-roledescription="carousel"` + translated `aria-label`, plain anchors, `focus-visible` bronze outlines on links + arrows, arrows disabled at ends, no `aria-current`/accordion markup.
- `src/i18n/fr.ts` + `en.ts` — `homePractices`: `ctaDetail` → `discover` (`Découvrir`/`Discover`); added `galleryLabel` (`Parcourir nos pratiques`/`Browse our practices`), `prev` (`Pratique précédente`/`Previous practice`), `next`; `sub` tightened ("Neuf disciplines de soin réunies…" / "Nine care disciplines united…").
- `src/app/globals.css` — `.hp-img` (rest state scale 1.05/opacity .9, 900ms premium-ease transition, `will-change`), `.hp-img-active` (scale 1/opacity 1), `.hp-track` scrollbar hiding, and a `prefers-reduced-motion: reduce` block disabling all of it; adjacent to the `ch-*` cinema helpers.

**SSR/static verified (dev server :3000, HTTP checks):** `28/28` — FR + EN exactly 1 `<h1>`; 8 `hp-slide` panels; `aria-roledescription="carousel"`; first slide `hp-img-active` in SSR; FR `aria-label="Pratique précédente"/suivante` + `"Découvrir"` + `Parcourir nos pratiques`; prev button `disabled` at scroll 0; all 8 FR + 8 EN detail routes → 200 (`/pratiques/yoga`, `/en/pratiques/sophrologie`, …); compiled CSS contains `.hp-img{`, `.hp-img-active{`, `.hp-track{`, reduced-motion block, and the simplified width calcs (`calc(90.9091% - 14.5455px)`, `calc(50% - 8px)`, `calc(33.3333% - 16px)`); no old explorer markup (`hp-row`, `hp-prac-btn-`) on either locale; no `aria-current`; no FR leak on EN (`Découvrir` absent, `Speech Therapy` present).

**Code-quality:** `npx tsc --noEmit` clean, `npx eslint src/components/PracticesSection.tsx src/i18n/fr.ts src/i18n/en.ts` clean, `npm run build` 252 pages passes. Browser-only runtime (mouse-drag follow, glide easing feel, snap-on-release, edge-viewport 1440/768/390 visual QA) remains a user check.

### 2026-09-06 — STEP 8b: Practices gallery refinement (square 3-up + Book Now)

Refined the STEP 8 gallery on `/` + `/en` — no redesign, no new routes, Clinic/API untouched. Section presentation only.

**Files changed:**
- `src/components/PracticesSection.tsx` — **Square panels:** `aspect-[4/5]` → `aspect-square` (panel height = width, all 8). **Sizing:** base `w-[85vw]` (1 + next-preview, mobile gap `gap-3`), `md:w-[calc((100%_-_24px)/2)]` (`calc(50% - 12px)`, exactly 2 + gap), `lg:w-[calc((100%_-_48px)/3)]` (`calc(33.3333% - 16px)`, exactly 3 fill the `max-w-7xl` gallery width); section base padding `px-6` → `px-4` for the 85vw fit; tablet/desktop `gap-6`. **Two actions per panel:** overlay (mono index + H2-title clamp-2 + one-line teaser line-clamp-2) now holds a primary bronze-filled **Book Now** link (`h-10 sm:h-11 rounded-lg`, `#B88A5A→#9A7242` gradient, white text, focus ring `#FFF7EB`) and a secondary **Découvrir/Explore** bronze text-link with arrow — overlay is `pointer-events-none` with `pointer-events-auto` links so dragging on non-interactive panel area works but links stay clickable. **Booking per-practice** via `getPratiqueBookingCta` + `getSpecialistsForPractice` (canonical `pratique-cta`/`pratique-specialists`): 1 specialist → `/professional/[slug]` (`nadine-kita`, `khalid-ouazzani`, `nadia-tazi`, `najat-berrada`, `mehdi-irzi`); 2+ (nutrition) → `/pratiques/nutrition#specialists`; 0 (sophrologie, yoga) → `/professional`; all locale-aware. **Drag fix:** removed `setPointerCapture` (it retargets the following click to the track and kills link/button navigation) — mouse drag now tracks with `pointermove` on the track + transient `window` `pointerup`/`pointercancel`/`blur` listeners; >8px movement still suppresses the next click via `onClickCapture`. Arrows, 850ms easeOutQuint glide, snap-disable-during-glide, `.hp-img`/`.hp-img-active` settle, entrance stagger, reduced-motion, lazy images — all unchanged.
- `src/i18n/fr.ts` + `en.ts` — `homePractices`: added `bookNow` (`Réserver`/`Book Now`), `bookNowAria` (`Réserver une consultation`/`Book a consultation`), `exploreAria` (`Découvrir la pratique`/`Explore this practice`); descriptive `aria-label`s are `<aria> — <title>` per panel.

**SSR/static verified (dev server :3000, HTTP checks):** all checks pass on both locales (one test string initially false-negatived — `Découvrir` is followed by the arrow `<svg>`, not `</a>`) — FR+EN exactly 1 `<h1>`; 8 `hp-slide`; per-panel Book Now aria-labels (`Réserver une consultation — Kinésithérapie` / `Book a consultation — Physiotherapy`) and hrefs (kine/osteo/psycho/naturo/ortho → their `/professional/[slug]`, nutrition → `…/nutrition#specialists`, sophrologie/yoga → `/professional` principal EN `/en/professional`); explore hrefs `/pratiques/{slug}` FR + `/en/…` EN; prev button disabled at 0; no `aria-current`/old developer markup; no FR leak on EN; 14 booking/e/route smoke → 200. Compiled CSS contains `width:85vw`, `calc(50% - 12px)`, `calc(33.3333% - 16px)`, `aspect-square{aspect-ratio:1}`, `.hp-img{`, `.hp-img-active{`.

**Code-quality:** `npx tsc --noEmit` clean, `npx eslint src/components/PracticesSection.tsx src/i18n/fr.ts src/i18n/en.ts` clean, `npm run build` 252 pages passes. Browser-only runtime (desktop drag over a panel ≠ link click, arrow glide feel, square-crop visual QA at 1440/768/390, image subject framing) remains a user check — note the environment model cannot view images, so `object-cover` center crop (all sources are landscape) was audited by aspect only; frame with `object-position` if a subject gets clipped.

### 2026-09-06 — STEP 9: Patient login presentation parity (FR + EN)

Redesigned `/login` as the **patient** sign-in, mirroring live `wenaya.com/user/sign-in` (Wenaya pour les patients / Continuer / Créez un compte / legal links). **Presentation-only: the submit is intentionally disabled** with an availability notice — no auth request, no token storage, until a real patient-auth backend exists (`/api/admin/auth` + `src/lib/admin-auth.ts` + `/admin` inline `LoginForm` untouched; `/admin` logout now redirects to `/admin`, not `/login`).

**Files created:**
- `src/components/login/LoginClient.tsx` — shared client component (`"use client"`, `useLocale`+`t`): ivory `#FAF8F4` full-height centered column (`max-w-[400px]`, big whitespace), `Logo` → `h(locale,"/")`, bronze eyebrow `login.eyebrow`, exactly-one `<h1>` `login.heading` (`Wenaya pour les patients`), one supporting line `login.subtitle`, email field (`label htmlFor`, `id="login-email"`, `type="email"`, `autoComplete="email"`, placeholder) + bronze-gradient **disabled** `Continuer` button (`disabled aria-disabled` + `title=unavailable`) + `unavailable` notice, divider, `noAccount` + `Créer un compte` → **live `https://www.wenaya.com/user/sign-up`** (SITE_URL-based; the real patient sign-up; no local signup route exists so no invented route), legal links (`h(locale,"/conditions")`, `h(locale,"/confidentialite")`) with bronze dot separator, `footer` line. No password field/toggle (no backend), no icons/decorative clutter.
- `src/app/(en)/en/login/page.tsx` + `layout.tsx` — EN route (`"Sign in — Wenaya Patient Space"`, `en_MA` OG, hreflang via `languageAlternates("/login")`, canonical `/en/login`, robots noindex).

**Files modified:**
- `src/app/(fr)/login/page.tsx` — thin wrapper over `LoginClient` (was a 108-line hardcoded admin form posting to `/api/admin/auth` → deleted entirely).
- `src/app/(fr)/login/layout.tsx` — added `languageAlternates("/login")` + twitter card; canonical/robots kept.
- `src/i18n/fr.ts` + `en.ts` — rewrote `login` block: `eyebrow`, `heading`, `subtitle`, `email`/`emailPlaceholder`, `continue` (`Continuer`/`Continue`), `unavailable`, `noAccount`, `createAccount`, `terms` (`Termes et conditions`/`Terms & Conditions`), `privacy`, `footer`; removed unused `password`/`rememberMe`/`forgotPassword`/`submit`.
- `src/components/Nav.tsx` + `nav/MobileMenu.tsx` — "Se connecter" links now locale-aware `hh("/login")` / `h("/login")` (EN → `/en/login`).
- `src/app/robots.ts` — disallow `"/en/login"`.
- `next.config.ts` — **removed** the old `/en/login → /login` redirect (it swallowed the new EN page); kept `/user/sign-in → /login` and `/en/user/sign-in → /en/login` live aliases.
- `src/app/(fr)/admin/page.tsx` — logout `window.location.href = "/login"` → `/admin` (admin login lives inline on `/admin`; `/login` is now the patient space).

**SSR verified (prod build, `next start` :3002, HTTP checks):** FR `/login` + EN `/en/login` → 200, exactly 1 `<h1>` each; FR copy accented, EN genuine (no French leak — `Espace patient`/`Continuer`/`Créer` absent on EN); disabled button + notice present; legal links `/conditions`/`/confidentialite` FR + `/en/…` EN; create-account → `https://www.wenaya.com/user/sign-up`; titles `Connexion - Espace Patient Wenaya | Wenaya` / `Sign in - Wenaya Patient Space | Wenaya`; hreflang fr-MA/en-MA both directions; `<meta name="robots" content="noindex, nofollow">`; `/user/sign-in` 308→`/login`, `/en/user/sign-in` 308→`/en/login`; robots.txt disallows both login routes; no `Username`/`Password`/`Admin access` remnants.

**Code-quality:** clean rebuild (removed the stale `.next` typed-routes collision from the old `/en/login` redirect before rebuilding), `npx tsc --noEmit` clean, `npx eslint <all changed files>` clean (the two `react-hooks/set-state-in-effect` errors in `admin/page.tsx` are **pre-existing** at lines 333/364 — untouched; my admin edit is one line). `npm run build` 253 pages passes. Browser-only runtime (focused field state, 1440×900 / 390×844 breathing-room visual, disabled-button cursor/ARIA announcement) remains a user check.

### 2026-09-06 — STEP 10: Corporate contact section parity (FR + EN)

Redesigned the Corporate closing section on `/corporate` + `/en/corporate` from the old "heading + email/message form + closing quote" to the live-Wenaya two-column structure: LEFT = heading + paragraph + email/phone/address contact rows + external Google Calendar audit CTA; RIGHT = quote-request form (team-size + programme-level radio selectors + submit). Presentation-only — routes, `RetreatSection`/`StickyCta` anchor contract, and the `/api/contact` backend all untouched.

**Files changed:**
- `src/components/entreprises/ContactSection.tsx` — Rewritten (kept client, kept name/import contract). Dark navy `#0B1220` closing band kept; **left** (`.ct-head`): bronze eyebrow `Contact` → serif H2 `Discutons de votre projet bien-être` (exact, no trailing period) → supporting line (exact reference copy) → `ul` of 3 icon rows (mailto `corporate@wenaya.com`, tel `+212666124035`, address `88 Rue de Jabal Azourki, Casablanca 20930` — Heroicons inline, bronze icon in `white/[0.06]` tile, uppercase label + value) → bronze round audit CTA `Réserver un audit gratuit` → `https://calendar.app.google/YyAirdPSc2ugGbnh9` (`target="_blank" rel="noopener noreferrer"`, `aria-label` new-tab note) + existing hours strip (`entreprises.cta.contact`). **Right** (`.ct-form`, ivory `#FAF8F4` card, `lg:sticky lg:top-24`): `h3` `Demander un devis personnalisé` + microcopy `Réponse sous 24h ouvrées. Sans engagement.` + form → `Prénom`+`Nom` grid (required, `autoComplete`) → `Email` (required, `type=email`) → **`fieldset`/`legend`** team-size group (`Taille d'équipe :`, 4 options, `sm:grid-cols-2`) → `fieldset`/`legend` programme-level group (`Quel niveau vous intéresse ?`, 4 options, stacked) → solid navy `Envoyer` submit (`h-13`, bronze focus ring, disabled while `sending`) → `role="status"` success / `role="alert"` error. Radio options are **pure-CSS-state** bordered rows: `sr-only peer` native radios (real radio semantics + arrow-key groups), bronze border/bg on `peer-checked`, bronze dot via `group-has-[:checked]`, `peer-focus-visible` ring — SSR markup identical to client (no hydration mismatch). GSAP `.ct-head`/`.ct-form` reveals kept (dropped dead `.ct-cta` tween). `id="contact"` + `data-contact` preserved.
- `src/i18n/fr.ts` + `en.ts` — rewrote `entreprises.contactSection` block: `eyebrow`, `heading`, `sub` (exact FR reference copy; EN `Let's discuss your workplace wellbeing project` / `30 minutes to understand your challenges and identify suitable avenues for your teams. No obligation.`), `email`/`phone`/`address` + labels, `bookingCta`/`bookingAria` (FR `Réserver un audit gratuit` = exact), `quoteHeading`/`quoteSub` (FR exact), identity-field labels/placeholders, `teamSizeLabel`/`teamSizeOptions` (FR `Taille d'équipe :` + `Moins de 50 / 50 à 250 / 250 à 1 000 / Plus de 1 000`; EN `Under 50 / 50 to 250 / 250 to 1,000 / Over 1,000`), `programmeLevelLabel`/`programmeLevelOptions` (FR exact 4; EN `To be defined together / Discovery — one-off event / Annual Program — lasting approach / Transformation — management culture`), `submit` (`Envoyer`/`Send`), `fetching`/`success`/`error`. Removed the now-unused `title`/`subtitle`/`desc`/`emailLabel`/`emailPlaceholder`/`msgLabel`/`msgPlaceholder` (also fixes the old build-time `contactSection.emailPlaceholder` warning — no reference remains).

**Backend contract kept (item D/E of the plan):** `/api/contact` (`src/app/api/contact/route.ts`) still REQUIRES `firstName`/`lastName`/`email` — so the redesigned form collects exactly those three identity fields (fresh `id="ct-firstname" | ct-lastname | ct-request-email"`, replacing the old `email`+`msg` which **never satisfied the contract** — the previous Corporate submit always 400'd) and POSTs `{firstName, lastName, email, teamSize, programmeLevel, source:"corporate-quote"}`. Proven via live smoke test: valid payload → 200 `{"success":true,...}`; missing identity fields → 400. Old `/api/contact` consumers (`contact/ContactForm.tsx`, `clinic/RecruitmentModal.tsx`) untouched. The old closing quote/`finalHeading`/`finalSub` block was dropped from this section (their other consumer `entreprises/Cta.tsx` remains dead code, key set untouched).

**SSR verified (prod build, `next start` :3002, HTTP checks):** `30/30` on both locales — exactly 1 `<h1>` each; FR heading rendered once verbatim (no period) + supporting line + hours strip; contact rows (`mailto:`/`tel:` + address) present; audit CTA exact href + `target="_blank" rel="noopener noreferrer"` + `aria-label` (apostrophes are `&#x27;`-escaped in SSR — false-negative if searched raw); `Demander un devis personnalisé` + `Réponse sous 24h ouvrées` + 8 radios total (4 `ct-team-size` + 4 `ct-programme-level`, all `sr-only peer`), 2 `fieldset` + 2 `legend`, 3 `required` fields, submit `Envoyer` not disabled at idle; `id="contact" data-contact` present; old artifacts absent (`ct-email`, `ct-msg`, `Votre message`, `Parlons de votre projet`, `Discutons de votre projet bien-être.` with period, quote text); EN genuine (heading once, `Request a tailored quote`, `No commitment.`, `250 to 1,000`, `Discovery — one-off event`, `Send`, mailto/tel/aria, `Book a free audit`) with zero FR leakage. `entreprises.cta.contact` strip and `Réserver un audit gratuit` count 3 (Hero/Sticky/pre-existing, unchanged).

**Code-quality:** `npx tsc --noEmit` clean, `npx eslint src/components/entreprises/ContactSection.tsx src/i18n/fr.ts src/i18n/en.ts` clean, `npm run build` 253 pages passes. Browser-only runtime (radio selected-state/arrow-key behaviour, sticky right form on long sections, 1440×900 / 390×844 visual QA, submit success/error toasts) remains a user check.

**STEP 10b — Quote-form radio groups → native selects (FR + EN):** replaced BOTH radio groups in the Corporate quote form with native `<select>` dropdowns (same `ct-team-size`/`ct-programme-level` labels, real `label htmlFor`, `name="teamSize"`/`name="programmeLevel"` kept). Options carry **stable values** (`""`/`less-than-50`/`50-250`/`250-1000`/`1000-plus`; `""`/`undecided`/`discovery`/`annual-programme`/`transformation`) with `{value,label}` objects via `tRaw`. Disabled placeholder options (`Sélectionnez une taille`/`Select team size`; `Sélectionnez un niveau`/`Select a level`) selected by default, rendered by React as `<option value="" disabled="" selected="">`. Styled to match inputs (`appearance-none` ivory surface, `bg-[#F2EFE9]/60`, `border-[#0B1220]/[0.08]`, `rounded-xl px-4 py-3`, bronze `focus:border/focus-visible:ring`, muted text when empty, lightweight chevron SVG `pointer-events-none`). Selects NOT required (radios weren't) → empty values still submit. Payload unchanged: `{firstName, lastName, email, teamSize, programmeLevel, source:"corporate-quote"}`. FR labels now `Taille d'équipe` / `Quel niveau vous intéresse ?`; EN `Team size` / `Which level are you interested in?` (+ new EN option wording `Fewer than 50`/`More than 1,000`/`To be determined together`/`Annual Programme — long-term approach`). **Deployed stale-build gotcha:** `next start` kept serving pre-change HTML — kill ALL node processes + rebuild (`Remove-Item .next`) to see pickups. SSR verified on fresh prod server: FR+EN 0 radios/0 fieldsets/0 legends, 2 selects, all 8 stable values + 8 option labels + both placeholders per locale, 1 `<h1>` each, anchors `id="contact" data-contact`, no FR leak on EN; API smoke: valid + empty-select payloads both → 200. `npx tsc --noEmit` clean, `npx eslint` (3 files) clean, `npm run build` 253 pages. Browser-only runtime (native select UX/chevron at 390×844, keyboard interplay) remains a user check.

### 2026-09-06 — STEP 11: Corporate hero cinematic full-bleed (FR + EN)

Redesigned the Corporate hero on `/corporate` + `/en/corporate` using the **same cinematic system as the Clinic hero** (Clinic `ch-*` CSS + GSAP pattern reused directly), while keeping the Corporate executive identity: serif H1 with tight tracking, bronze accent line, pill CTAs, value-prop bullets. Hero-only change — copy and CTA destinations preserved, all other sections/routes/data/backend untouched.

**Files changed:**
- `src/components/entreprises/Hero.tsx` — Rewritten (kept name/import contract). Near-full-viewport section (`min-h-[82svh] sm:min-h-[86svh] lg:min-h-[90vh]`, `flex items-end`, navy `bg-[#0B1220]`, `data-section-bg="dark"` so the global nav theme detector stays dark). Full-bleed background wrap `ch-bg-wrap` (absolute `inset-x-0 -top-[6%] -bottom-[6%]`) holding the existing executive Unsplash image (`photo-1600880292203-757bb62b4baf`, `next/image fill priority sizes="100vw" object-cover`, `alt=""` decorative, no lazy) + two overlay divs: **global** `linear-gradient(to right, rgba(11,18,32,.85)→.50→.20→.06)` weighted toward the text zone, and a **bottom weld** `h-40 sm:h-52 lg:h-64` melting into the NEXT section's `#D4A56A` top edge — the Corporate StatsTestimonialsSection that directly follows is a bronze gradient (unlike Clinic's navy Trust section), so the bottom gradient goes `#D4A56A 0% → #D4A56A 5% → rgba(212,165,106,.55) 14% → rgba(212,165,106,.22) 26% → transparent 44%` = seamless hero→bronze transition, no white/gray/light seam. Content lower-left, no card: eyebrow (`ch-eyebrow ch-fade`; bronze dot + tracked uppercase `entreprises.hero.badge` — badge text also on `aria-label` like Clinic) → exactly-one `<h1>` of two masked lines (`ch-line` in `overflow-hidden` wrappers; line 1 `heading1` in white, line 2 `heading2` in bronze `bg-clip-text` gradient; inline `clamp(2.8rem, 5.5vw, 5.2rem)` + weight 500 kept so the `.corp-typeset [style*="clamp(2.8rem"]` override still applies the approved smaller H1) → paragraph `ch-sub ch-fade` (max-w-[560px]) → CTAs `ch-cta ch-fade` (primary bronze-gradient pill `h-13 px-8 rounded-full` → existing external calendar link `target="_blank" rel="noopener noreferrer`; secondary outline pill `h-13 px-6` → `#downloads`; focus-visible bronze rings) → value bullets `ch-proof ch-fade` (3, bronze check icons, unchanged copy). Optional **scroll hint** (`ch-scroll ch-fade`, hidden lg:flex, bottom-right: `Découvrir`/`Explore` `t("entreprises.hero.scrollHint")` + `ch-scroll-dot` line animation). GSAP gated on `useIntersectionDeferred`: bg settle `scale(1.07)→1.0` 8.5s `power1.out` + scroll-scrubbed parallax `yPercent −2→4` (no pin); timeline eyebrow → 2 H1 lines (`yPercent 115→0`, 0.8s `power4.out`, 0.1 stagger) → sub → cta → bullets → hint (~1.5s); reduced-motion early-returns (CSS shows everything statically). `ch-*` CSS classes + reduced-motion block are the SHARED Clinic globals (reused — zero new globals.css; GSAP selectors scoped by `gsap.context` so no cross-component leakage).
- `src/i18n/fr.ts` + `en.ts` — `entreprises.hero.scrollHint` added: `Découvrir` / `Explore`. All existing hero copy keys untouched (`stats` stays dead).

**SSR verified (prod build, `next start` on :3002, HTTP checks):** FR + EN `/corporate` → 200, exactly **1 `<h1>`** each; `ch-bg-wrap` + `data-section-bg="dark"` present; 5 `ch-fade` + 2 `ch-line` masked lines (line 2 with `bg-clip-text` bronze gradient); 3 bullets with check icons; hero `<img>` has `data-nimg="fill"`, `sizes="100vw"`, `object-cover`, **no `loading="lazy"`**, with a `<link rel="preload" as="image">` to `photo-1600880292203…` in `<head>` = `priority` confirmed; bottom melt `#D4A56A` (2 stops) present — next section's gradient also starts `#D4A56A` → seamless transition; CTAs: external calendar href + `#downloads`, each localised copy exactly once inside the hero slice; scroll hint label localised (FR `Découvrir` / EN `Explore`); eyebrow renders twice (**aria-label + visible span**, matches Clinic pattern); old split-panel artifacts gone (`eh-fade`/`eh-hl` zero); no rounded-card/boxed panel in hero; no FR leak on EN (`Cultivez`/`Récoltez`/`Réserver…` absent, `Cultivate well-being.`/`Reap performance.` present); FR accented copy byte-verified (`bien-être.` UTF-8). Compiled CSS served on `/corporate` includes `.ch-bg-wrap{` (`scale(1.07)`), `.ch-line{` (`translateY(115%)`), `.ch-fade{`, `.ch-scroll-dot` + `ch-scroll-hint` keyframes, and the `prefers-reduced-motion` block. (Test-harness note: PowerShell `console` rendering mangles non-ASCII in matched context — verify accents at the byte/UTF-8 level, not via console echo.)

**Code-quality:** `npx tsc --noEmit` clean, `npx eslint src/components/entreprises/Hero.tsx src/i18n/fr.ts src/i18n/en.ts` clean, `npm run build` 253 pages passes (stale-build gotcha applied: killed ALL node + `Remove-Item .next` before rebuild). Browser-only runtime (entrance/scale-settle/parallax timing, hover/translate feel, scroll-hint loop, 1440×900 / 390×844 visual QA — image subject framing and bronze-seam look) remains a user browser check.

### 2026-09-06 — STEP 12: Corporate proof band compacted (FR + EN)

Compacted `StatsTestimonialsSection` (proof/impact section on `/corporate` + `/en/corporate`) from a tall stats/testimonial split into ONE bronze proof band with 3 horizontal layers (4 metrics → measured-impact strip → compact testimonial). Section presentation only — hero, contact, routes, data, backend untouched; bronze gradient `#D4A56A…#8E6A3E` + any other section/data preserved verbatim.

**Files changed:**
- `src/components/entreprises/StatsTestimonialsSection.tsx` — Rewritten (kept name, `useLocale`+`t`/`tRaw`, `portraitImages`, counter `animateCounter`, `arrowBtn`). Single `<section>` bronze gradient + subtle diagonal sheen overlay + top/bottom hairline runs (`via-white/40`/`via-white/20`); `max-w-7xl mx-auto py-6 sm:py-7 lg:py-8 px-6`. **Layer 1** `grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-5 lg:divide-x lg:divide-white/15` (2×2 @390): `stat-num` counter `data-target`, clamp `clamp(1.7rem,2.5vw,2.8rem)`, label `text-xs sm:text-[13px]`, source `text-[10px] text-white/55` under label. **Layer 2** `mt-4 lg:mt-5 pt-4 border-t border-white/15`: `Impact mesuré`/`Measured impact` uppercase `text-[10px] tracking-[0.18em]` left `lg:w-44` + `sm:grid sm:grid-cols-2 sm:divide-x` two impact stats, numbers `clamp(1.5rem,1.9vw,2.1rem)` + inline label + source. **Layer 3** testimonial desktop `hidden lg:flex items-center gap-8`: image `w-[104px] h-[104px] rounded-2xl` (`sizes="104px"`) → quote `text-base lg:line-clamp-3` → author `mt-1.5`; right column `1 / 3` counter + 2 `w-8 h-8` arrows + 3 dots; mobile `lg:hidden`: `w-16 h-16 rounded-xl` + author + `1 / 3` counter, quote `text-[13px] sm:text-sm line-clamp-3 mt-3`, dots + arrows row. Carousel logic kept exactly (`slideTo` now a **plain inline function**, not `useCallback`). `pf-reveal` on all 3 layers; `stat-num` counters; reducedMotion guard.

**Heights (headless Chrome CDP, prod `next start` :3002):** BEFORE FR 617 / EN 614 @1440, FR 941 / EN 876 @390 → **AFTER FR 366 / EN 366 @1440 (≈ −40.7% / −40.4%)**, FR 576 / EN 560 @390 (−38.8% / −36.1%); **no horizontal overflow** on any variant (innerW == scrollW). Target −40–50% desktop met.

**SSR verified (prod build, HTTP checks):** `59/59` on both locales — all 4 metrics (`35+`/`2 000+`/`96%`/`7 ans`·`7 years`) + their labels/sources, impact `−40%`/`+25%` + both sources, `Impact mesuré`/`Measured impact`, OCP testimonial quote+author, `1 / 3` counter + prev/next aria labels + dots, 3 `pf-reveal` layers, no old `eh-fade`/`eh-hl` residue, image cape `w-[104px]`; zero FR leak on EN. React SSR `&#x27;`-escapes apostrophes (FR `d&#x27;expérience`, `d&#x27;absentéisme`, `d&#x27;engagement`, `Étude d&#x27;impact`) and splits `1 / 3` into `1<!-- --> / <!-- -->3` — search with those, not raw strings.

**Gotchas worth logging:** (1) **React Compiler** (`react-hooks/preserve-manual-memoization`) flags `useCallback(fn, deps)` when the inferred dep ≠ source deps — the original `slideTo` useCallback failed eslint; a plain inline function avoids it. (2) A `process.exit()` in a node fetch-based test harness crashes on Windows with an undici `UV_HANDLE_CLOSING` async assertion — omit the exit and filter failures from a results array instead. (3) Stale `next start` serves old HTML — always kill ALL node + `Remove-Item .next` before rebuild/QA.

**Code-quality:** `npx tsc --noEmit` clean, `npx eslint src/components/entreprises/StatsTestimonialsSection.tsx` clean, `npm run build` 253 pages passes. Browser-only runtime (counter animation, carousel swipe/arrows/dots, reduced-motion, 1440×900 / 390×844 visual QA — line-clamp truncation and image subject framing) remains a user check. i18n dead keys `entreprises.stats.title`/`desc`/`band` left untouched.

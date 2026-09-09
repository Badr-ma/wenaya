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

### 2026-09-06 — PHASE 2: Pre-production cleanup (executed on `pre-production-cleanup`, no commit)

Approved low-risk production-readiness cleanup based on the Phase 1 audit (`%TEMP%\opencode\phase1_report.md`; eslint baseline 12E/22W). NO UX/route/content/CMS/Shop/API change; NOTHING committed or pushed. Report: `%TEMP%\opencode\phase2_report.md` (sections A–P).

- **B1 ADMIN_SECRET guard** — `src/lib/admin-auth.ts`: added `getAdminSecret()` (throws when `ADMIN_SECRET` missing) wired into `signToken` + `verifyToken`, deleting the `|| "wenaya-admin-fallback"` default (P1 finding). `api/admin/auth/route.ts`: inlined `Set-Cookie` → now reuses the byte-identical existing `setAuthCookie(res, token)` helper. `ADMIN_SECRET` verified present in `.env.local`; repo-wide grep zero `wenaya-admin-fallback`.
- **B2 translation-factory rename** — `src/i18n/index.ts` exports `getTranslations(locale)` (was `useTranslations`, a plain factory falsely flagged as a hook by eslint). All 7 callers updated: `LanguageContext.tsx` (client), FR+EN `produits/[slug]`, FR+EN `pratiques/[slug]`, clinic `Courses.tsx`/`Practices.tsx`, and `News.tsx` (drop-in import, no more alias). Value semantics identical; the 4 `react-hooks/rules-of-hooks` errors gone.
- **B3 dead code** — deleted `src/components/entreprises/Cta.tsx` (112 lines, zero importers). Removed ONLY the two keys it exclusively owned: `entreprises.cta.finalHeading` + `finalSub` (fr + en). No other keys touched.
- **B4 href consolidation** — `hh` family was LARGER than planned: Nav, main Footer, entreprises Footer, checkout FR+EN, panier FR+EN, plus a CartActions ternary. Fix: `src/lib/href.ts` gained root special-case `h("en","/")→"/en"` (was `/en/`; only two home back-links affected, same destination, removes a redirect hop); then all `hh` helpers deleted and replaced with `h(locale, …)` (MobileMenu gets `h={(p) => h(locale, p)}`; Nav `isActive` preserved exactly). `\bhh\b` zero repo-wide.
- **B5 README** — rewrote the boilerplate: real scripts (`npm run dev/build/start/lint`), routing map, env var NAMES grouped required/optional (documents `ADMIN_SECRET` as required), CMS+Shop explicitly marked FUTURE workstreams, accurate data-source + login-on-hold production notes.
- **B6 DOMPurify** — zero src imports (only stale AGENTS.md log claims); `npm uninstall dompurify @types/dompurify`. Repo-wide grep clean.
- **B7–B10 verification** — `npx tsc --noEmit` clean; eslint **8E/22W** (−4 errors, exactly the renamed pages; warnings 22 unchanged, no new files flagged — remaining 8 errors pre-existing, deferred); `npm run build` (clean `.next`, killed node first) **253 pages** — identical page count; dev-server smoke: 31 public routes + 6 detail pages → 200, `POST /api/admin/auth` bad-creds → 401. Deleted 1 / modified 25 files, diff reviewed line-by-line, no secrets.
- **Deferred (untouched):** CMS + Shop architectures, 357-key i18n prune, Clinic explorer extraction, component server-ification, window-CustomEvents, admin page split, JSON-LD, sitemap/hreflang, blog SSR, `href="#"` (audit-only), remaining 8 eslint errors. Future consolidation candidates noted: Breadcrumbs/ProgrammesPage/LanguageSwitcher inline locale logic (differ for the `/` root), `npm audit` (7 high).
- **Gotchas:** PowerShell 5.1 has no `?:` ternary; `Set-Content` in a bulk replace is safe when the git diff of the same files shows ONLY the intended hunks (byte-precise proof of no encoding corruption).

### 2026-09-07 — STEP 13: Clinic page section-variety redesign (FR + EN /about)

Broke the repetitive "numbered list + active panel + accordion on mobile" pattern across the Clinic page so each major section now has a distinct visual character. **Presentation only** — approved content, routes, booking logic, APIs, hero, CMS, Shop untouched. Build 253 pages.

**Section system (both locales):**
- **Intro/Ecosystem** → calm editorial magazine layout (sand `#F2EFE9`): badge + serif H2 + one paragraph left, large `diverse-team.jpg` right; lower row WHO statement as a bronze-bordered typographic **pull-quote** left + 5 principles as compact **index lines** (mono bronze number / serif title / right-aligned desc). No interaction. Single gentle GSAP fade-in (eyebrow → H2 → p → image → quote → principles) gated on `useIntersectionDeferred` + reduced-motion-skipped; content always visible in HTML (no-JS safe — the first draft used a JS-driven `opacity-0` wrapper, reverted to the platform's visible-content + `fromTo` pattern).
- **Practices** → KEPT the numbered explorer (PratiquesExplorer) as the page's single primary explorer; section bg changed sand → ivory.
- **Courses/Sessions** → **image-led horizontal swipe gallery** (new `SessionsExplorer.tsx`, reusing the homepage `.hp-track/hp-slide/hp-img/hp-img-active` mechanic): 3 panels @lg / 2 @md / ~1+peek @mobile, `w-[calc((100%_-_48px)/3)]` etc., landscape `aspect-[4/3]`, image top (`rounded-[20px]`) with type eyebrow / serif title / line-clamp-2 summary / location pin / "Découvrir la séance" link BELOW the image (no overlay). Native swipe + mouse drag (no pointer-capture), arrow buttons (850ms easeOutQuint glide, disabled at ends), `01 / 06` counter, `role="region" aria-roledescription="carousel"`, carousel movement only (no GSAP). Section bg → sand `#F2EFE9` in `Courses.tsx`.
- **Pathologies** → **typography-led navy index** (bg stays `#0B1220`): asymmetric 2-column editorial grid of fine-hairline rows — mono bronze number / serif white title / one-line summary, hover/focus warms title to bronze + slides in arrow. No images, no active panel, no accordion. **Serverified** (now `locale`/`lang` props via `getTranslations`, removing a client component + its stateful hydration); destination policy unchanged (real practice links only).
- **Health Needs** → **functional symptom-to-practice navigator** (sand): statement column left + single-open expander list right; expanded row reveals the clinical summary + "Pratiques recommandées" inline practice links (max 3, real routes). One interaction set for ALL breakpoints (removed the old desktop/mobile split — this is now the page's only expander; chevron, `aria-expanded`/`aria-controls`/`role="region"`, hover opens, tap toggles). No images.
- **Team** (ivory), **Recruitment** (navy band), **Practical** (ivory), **News** (navy): untouched. Verified section bg rhythm in served HTML: `#0B1220 → #0B1220 → #F2EFE9 → #FAF8F4 → #F2EFE9 → #0B1220 → #FAF8F4 → #F2EFE9 → #0B1220 → #FAF8F4 → #0B1220`.

**Files created:** `none` (rewrote existing components). **Files changed:** `src/components/clinic/Intro.tsx`, `SessionsExplorer.tsx`, `Pathologies.tsx`, `HealthNeeds.tsx`, `Practices.tsx` (bg only), `src/components/clinic/Courses.tsx` (sand bg + new props), `src/i18n/fr.ts` + `en.ts` (`clinic.courses.galleryLabel/prev/next` added — UI labels only, no content rewrite), `src/app/(fr)/about/page.tsx` + `src/app/(en)/en/about/page.tsx` (Pathologies props).

**SSR verified (prod build, `next start` :3002, HTTP checks):** `62/62` on both locales — exactly 1 `<h1>` each; Intro content fully preserved (FR `La santé intégrée,"/au cœur de Casablanca`, WHO quote + `OMS`; EN `Integrated health,"/at the heart of Casablanca`, `WHO`; 5 principles incl. `9 disciplines réunies…`); courses gallery = 6 `hp-slide`, carousel aria-label `Parcourir nos séances`/`Browse our sessions`, prev/next labels, `Découvrir la séance`/`Explore this session`, session links `/seance-de-groupe/yoga-prenatal` (FR) + `/en/...` (EN), width `calc((100%_-_48px)/3)` present; Pathologies 7 titles (incl. FR `Maladie d&#x27;Alzheimer`, EN `Alzheimer&#x27;s disease`), real links `/pratiques/neuropsychologie` + EN prefix, no old `clinic-path-btn-` accordion DOM; HealthNeeds 8 `id="clinic-need-btn-*"` + 8 regions, `Pratiques recommandées`/`Suggested practices`, `/pratiques/meditation` link; **zero FR leakage on EN**; compiled CSS chunks on `/about` contain `.hp-img{`, `.hp-img-active{`, `.hp-track{`, `.heading-serif{`; all 9 detail/route smoke dests → 200 (meditation, coaching-sportif, yoga-prenatal, pilates-et-posture, neuropsychologie FR+EN…). Test-harness gotchas: intro image `src` is URL-encoded (`%2Fimages%2Fdiverse-team.jpg`); the `/about` CSS lives under `/_next/static/chunks/*.css` (not `static/css`); healthNeeds button count must match `id="clinic-need-btn-"` (the bare prefix doubles via `aria-labelledby`); `aria-current` legitimately remains on the Practices Explorer row.

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint .` **0E/12W** (all 12 warnings pre-existing in unrelated files — the old known 8E baseline is now fully resolved); `npm run build` 253 pages (clean via kill-node + `.next`). Browser-only runtime (drag/swipe feel, arrow glide, hover-to-open HealthNeeds, GSAP Intro fade timing, 1440×900 / 768 / 390×844 visual QA) remains a user check — prod server left running on :3002.

### 2026-09-07 — STEP 14: Clinic paragraph-led Intro + remove ALL visible numbering (FR + EN /about)

Paragraph-led manifesto Intro (no numbered principles) and zero visible section numbering across the whole Clinic page — Practices explorer, Sessions gallery, Pathologies index, Health Needs navigator, Team. Presentation only: approved copy restructured into paragraphs (Intro only), routes/APIs/booking/hero/CMS/Shop untouched; nothing committed. Build 253 pages.

**Files changed:**
- `src/i18n/fr.ts` + `en.ts` — `clinic.intro` reworked: `heading1`/`heading2` → `Votre santé,`/`notre priorité` (EN `Your health,`/`our priority`), `p1` → lead-in `Wenaya, c'est plus qu'un simple centre de soins :` / `Wenaya is more than just a care center:`, new `paragraphs` array (5 sentences, FR genuine-EN); `badge` + WHO `whoQuote`/`whoSource`/`whoCommitment` and the legacy `features` array kept untouched.
- `src/components/clinic/Intro.tsx` — rewritten paragraph-led: badge → large serif H2 → bold lead-in → 5 real paragraphs (left) beside `diverse-team.jpg` (right), WHO quote as bronze-bordered pull-quote below; the numbered principles `<ol>` deleted. Reads copy via `tRaw<string[]>("clinic.intro.paragraphs")`; GSAP fade (eyebrow → h2 → lead → staggered paragraphs → image → quote) gated on `useIntersectionDeferred`, content visible by default (SSR/no-JS safe), reduced-motion skipped.
- `src/components/clinic/Practices.tsx` + `PratiquesExplorer.tsx` — `number` field dropped from `ExplorerItem` + mapping; visible number spans removed in desktop rows, active panel and mobile accordion buttons; desktop row gutter realigned (`flex items-center`, single title col); `aria-current`, hover/focus activation, bronze underline sweep, accordion semantics unchanged.
- `src/components/clinic/Courses.tsx` + `SessionsExplorer.tsx` — `number` dropped from `SessionItem`; the `01 / 06` mono counter replaced by 6 progress dots (active = elongated bronze `w-4`, inactive round `w-1.5 bg-[#0B1220]/20`); arrows, carousel region, swipe/drag mechanics unchanged.
- `src/components/clinic/Pathologies.tsx` — `String(i+1).padStart` number span removed from every row; title + summary + hover arrow realigned via `flex flex-col gap-2`; real practice links + navy grid/hairlines unchanged.
- `src/components/clinic/HealthNeeds.tsx` — `number` field + badge span removed; buttons refocused to title + chevron (`items-center`), panel indent `pl-8 sm:pl-14` removed; 8 expanders with `aria-expanded`/`aria-controls` + `role="region"`, hover-open/tap-toggle unchanged.
- `src/components/clinic/Team.tsx` — featured portrait `01` mono badge and secondary-rows `02`/`03` bronze numbers removed (`rest.map((s)` — no unused index); editorial photo-led layout kept.

**SSR verified (prod build, `next start` :3002, HTTP checks):** `86/86` on both locales — one `<h1>` each; zero `font-mono` and zero `>0X<` visible numerals in rendered DOM; new intro copy present (FR accented verbatim: `Votre santé,`/`notre priorité`, `c&#x27;est plus qu&#x27;un simple centre de soins :`, 5 paragraphs incl. `longévité au cœur de notre mission`; EN genuine: `Your health,`/`our priority`, `more than just a care center`, `Longevity is at the heart of our mission`); WHO pull-quote + `OMS`/`WHO` both locales; Practices 8 rows (all titles FR/EN) + 1 `aria-current` + real `/pratiques/{slug}` links + localised CTA; Sessions 6 `hp-slide` + carousel region + prev/next labels + dots (1 active `w-4 bg-[#B88A5A]`, 5 inactive `bg-[#0B1220]/20`); Pathologies 7 titles + `/pratiques/neuropsychologie`, no `clinic-path-btn-`; HealthNeeds 8 rows (16 id/aria refs) + `Pratiques recommandées`/`Suggested practices` + `/pratiques/meditation`; Team names intact, no featured `01`; trust band intact; **zero FR leakage on EN**.

**Test-harness gotchas worth logging:** (1) The RSC flight payload (`self.__next_f` scripts) contains the global-404 `font-mono "404"` text — always strip `<script>` blocks before asserting "zero font-mono / no visible numbering" (otherwise false positive). (2) React SSR escapes the Intro apostrophe as `&#x27;` — probe `plus qu&#x27;un simple centre de soins`, not the raw string. (3) Dots are proven by active-class==1 + inactive-class==5, because `h-1.5 rounded-full` also matches 3 non-dot elements on the page.

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline, no new warnings); `npm run build` 253 pages (kill-node + `Remove-Item .next` before rebuild). Browser-only runtime (GSAP Intro fade timing, sessions swipe/drag feel, dot state sweep, 1440×900 / 768 / 390×844 visual QA) remains a user check — prod server left running on :3002.

### 2026-09-07 — STEP 15: Clinic sessions per-session Book Now + Maux-troubles symptom map (FR + EN /about)

Upgraded the Clinic "Séances & Ateliers" swipe gallery with per-session **Book Now + Explore** actions and redesigned "Maux-troubles" as an interactive editorial **symptom map** (selectable nodes + single shared detail panel). **Presentation only** — approved content, routes, booking architecture, APIs, hero, CMS, Shop untouched; nothing committed.

**Files changed:**
- `src/i18n/fr.ts` + `en.ts` — `clinic.courses` gained `bookNow` (`Réserver`/`Book Now`), `bookNowAria` (`Réserver — {title}`/`Book — {title}`), `exploreAria` (`Découvrir — {title}`/`Explore — {title}`); EN `ctaDetail` `Explore this session` → `Explore session`. `clinic.healthNeeds` untouched (fr/en copy already exactly matched the new design: `Maux-troubles`/`Aches & conditions`, `Je sais ce que je ressens,`/`I know what I feel,`, `pas vers qui aller`/`not who to see`, `Décrivez votre besoin`/`Describe your need`, `Pratiques recommandées`/`Suggested practices`).
- `src/components/clinic/Courses.tsx` — server component now maps `bookingHref: s.bookingHref` into each `SessionItem` and passes `bookNow`/`bookNowAria`/`exploreAria` to the explorer.
- `src/components/clinic/SessionsExplorer.tsx` — each session slide keeps its image-led composition (image top, type + location line, title, one-line summary) and now ends in a CTA row: **primary** bronze-gradient `h-11 rounded-lg` full-width (mobile) / auto (desktop) "Réserver"/"Book Now" `<a href={s.bookingHref}>` (aria `Réserver — {title}`/`Book — {title}`) + **secondary** underline arrow text-link "Découvrir la séance"/"Explore session" → detail page (aria `Découvrir — {title}`/`Explore — {title}`). Book Now reuses the existing `GroupSession.bookingHref` (`/contact?service={slug}&type=group-session` FR, `/en/contact?service={slugEn}&type=group-session` EN) — contact form with the session preselected; no new URL invented. Header doc updated. Gallery mechanics untouched: 3/2/1+peek panels, swipe + drag threshold click-cancel (no pointer-capture), arrows (disabled at ends), 6 dots, `hp-img`/`hp-img-active` settle.
- `src/components/clinic/HealthNeeds.tsx` — **rewritten as a symptom map** (no cards/pills/accordion/chevrons/numbering). LEFT (lg:col-span-5): badge + serif H2 + supporting paragraph (existing copy) + selectors — desktop = stacked editorial list of large text-node buttons (`heading-serif`, bronze active left rail `border-l-2`, arrow slides in on hover, hairline `divide-y`); mobile = horizontal scrollable **text rail** (whitespace-nowrap names, bronze bottom underline for active). RIGHT (lg:col-span-7, `lg:sticky top-24`): ONE shared detail panel (`aria-live="polite"`) wrapped in `border-l-2 border-[#B88A5A]`: need title → one-line summary → `PRATIQUES RECOMMANDÉES` uppercase bronze label → recommended practice links (real `/pratiques/{slug}` / `/en/...`, bronze underline + arrow, max 3 via the existing canonical resolution). Selecting a node swaps only the panel — the selected node never expands. Selectors are `<button aria-pressed>` (hover opens on desktop, tap/click anywhere); keyed remount on the panel animates a subtle CSS rise. Old `clinic-need-btn-*` accordion markup fully removed.
- `src/app/globals.css` — added `hn-fade` (rise + fade 14px, 0.5s premium ease) + `prefers-reduced-motion` disable, beside the `ch-*` helpers.

**SSR verified (prod build, `next start` :3002, HTTP checks):** `108/108` on both locales — one `<h1>` each; Sessions: 6 `hp-slide`, 6 Book Now aria-labels + 12 Explore aria-labels (image link + text link per slide), all 6 `bookingHref`s per locale present (`/contact?service=…&amp;type=group-session`, `/en/contact?service=…`), primary gradient present ×6, visible CTA labels, all 6 titles both locales (`Pilates &amp; Posture` escaped), active dot == 1 + inactive == 5, panel width `calc((100%_-_48px)/3)`, prev arrow disabled at start; HealthNeeds: badge/heading/sub both locales, `aria-pressed` total 16 (8 desktop + 8 mobile) with exactly 2 `aria-pressed="true"` (one per variant), `hn-fade` == 1 (single shared panel) + `aria-live="polite"`, active need (`Douleurs du dos`/`Back pain`) title + verbatim summary + `/pratiques/kinesitherapie`+`/pratiques/osteopathie` links in the panel, all 8 need names as selectors, no `clinic-need-btn-`; zero visible `font-mono`/`>0X<` numbering; zero FR leakage on EN; smoke: both booking flows + both detail routes (FR/EN) → 200.

**Test-harness gotchas worth logging:** (1) React SSR escapes `&` in attribute values/text as `&amp;` and apostrophes in text as `&#x27;` — probe `/contact?service=yoga-prenatal&amp;type=group-session`, `Pilates &amp; Posture`, `Research d&#x27;équilibre`, `Children&#x27;s mental health`, NOT the raw characters (all 20 initial failures were exactly this — zero app bugs). (2) Image link + text link both carry the same `Explore — {title}` aria → 12 not 6. (3) Both the hidden `lg:block` desktop list and `lg:hidden` mobile rail are server-rendered, so `aria-pressed` total is 16 with 2 active.

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline, no new warnings); `npm run build` 253 pages (kill-node + `Remove-Item .next` before rebuild). Browser-only runtime (drag vs Book Now/Explore click-navigation, arrow glide + dot sweep, symptom hover-open/selection swap + panel rise, 1440×900 / 768 / 390×844 visual QA — Book Now full-width vs Explore readability on mobile) remains a user check — prod server left running on :3002.### 2026-09-07 -- STEP 16 (Homecare): Soins a domicile presentation page (FR) + Clinic banner
Built a FR-only presentation page at /soins-a-domicile (exact live wenaya.com/soins-a-domicile content, no rewritten/invented copy) plus a tasteful Homecare entry banner on FR /about. Nothing committed (branch pre-production-cleanup).

EN: /en/soins-a-domicile on the live site returns 200 but serves the SAME French content under lang="en" -- no authoritative EN translation exists -> FR-only page, no EN route, no fake hreflang.

Files created:
- src/app/(fr)/soins-a-domicile/page.tsx -- FR-only route; metadata (title/desc = exact live head strings; canonical SITE_URL/soins-a-domicile; OG/Twitter from live H1/sub); structuredData MedicalBusiness @graph node (Wenaya Homecare Services, address 88 Rue De Jabal Azourki Casablanca, +212666124035, areaServed Casablanca) + parentOrganization @id /#organization + Breadcrumbs. Assembles Hero->Intro->Why->Services->NursingLevels->Evaluation->Multidisciplinary->Material->Support->Coordination->Engagements->Faq->Contact (live order).
- src/components/domicile/{Hero,Intro,Why,Services,NursingLevels,Evaluation,Multidisciplinary,Material,Support,Coordination,Engagements,Faq,Contact}.tsx -- 13 sections, all copy verbatim from live capture; Hero client GSAP (dc-* CSS mirror of ch-*); Faq client single-open accordion; Contact navy closing (tel 0666-124035, address, WhatsApp CTA, 24h/24-7j/7).
- src/components/clinic/HomecareBanner.tsx -- FR-only /about entry banner (eyebrow + H2 + exact intro para + CTA -> /soins-a-domicile + /domicile/Infirmerie.jpg), wired into FR /about between ClinicHealthNeeds and ClinicRecruitment.

Files modified:
- src/app/globals.css -- .dc-bg-wrap/.dc-line/.dc-fade helpers + reduced-motion overrides.
- src/app/sitemap.ts -- single FR-only /soins-a-domicile entry (changeFrequency monthly, priority 0.8), added after ...dual(/corporate/programmes...).
- public/domicile/ -- 4 Wenaya-owned homecare images downloaded (CSP 'self'+Unsplash blocks hot-linking live _next/image URLs): Infirmerie.jpg (2000x1125), Soins-Infirmiers-min.jpeg (8139x5426), pluridisciplinaire-min.jpeg (3840x2160), materiel-medical-a-domicile-min.jpg (1408x768).

CTA mapping decisions (live->localhost): WhatsApp CTA preserved exactly (wa.me/212666124035?text=Bonjour...soins%20%C3%A0%20domicile); tel +212666124035 preserved; live "Rejoindre l'équipe" was a dead # link -> dropped, replaced by "Découvrir Wenaya Clinic" -> /about (maps the Coordination-with-Wenaya-Clinic section intent to the canonical Clinic page).

SSR/browser verified (prod next start :3002): /soins-a-domicile 200, HTML lang="fr", exactly 1 h1, ALL live text lines present (body content; live-site global chrome - old navbar Se connecter footer hours/cookie banner - correctly excluded in favor of project Nav/Footer/CookieConsent), every H2/H3/lead/bullet/paragraph exact (incl. escaped probes &amp;/&#x27;), WhatsApp CTA x2 + tel link + address, single canonical, no /en href, no hreflang, no French leak path issues, meta desc live wording, MedicalBusiness JSON-LD + Breadcrumb, 4 content images alt texts preserved (hero alt=""), all 4 images optimize 200 (materiel jpg re-encodes as png - pre-existing file labeling, renders fine). /about: banner eyebrow/H2/paragraph/CTA present, after HealthNeeds + before Recruitment, image present; EN /en/about: no banner, no FR leak, no /soins-a-domicile link. Sitemap: /soins-a-domicile present, no /en clone. robots allow /. Browser (CDP headless 390x844): no horizontal overflow (innerW==390), 0 broken images after scroll-through lazy loads, one h1, WhatsApp visible, no console errors, no hydration marker.

Gotchas logged: (1) Live site is a legacy pages-router SPA - raw curl shows empty "Loading..." shell, so real-browser CDP render was required to capture actual content (homecare-fr-text.txt). (2) React SSR escapes & -> &amp; and ' -> &#x27; in body text/attributes; probe escaped forms. (3) Local images render as /_next/image?url=%2Fdomicile%2F... (not literal path); "local image referenced" string-probes false-negative. (4) JSX text decodes &nbsp; to U+00A0 so literal &nbsp;: string-probes fail though the char is present. (5) In-page lazy images show naturalWidth=0 until scrolled into view - use scroll-through + re-check, not a one-shot "broken" pass. (6) Windows dynamic import() of %TEMP% path needs pathToFileURL (ERR_UNSUPPORTED_ESM_URL_SCHEME). (7) Restart prod via Start-Process npx.cmd next start -p 3002 (node --experimental flag approach had issues).

Code-quality: npx tsc --noEmit clean; npx eslint . 0E/12W (unchanged pre-existing baseline - Hero unused useRef import removed + sectionRef exhaustive-deps eslint-disable added matching ClinicHero precedent); npm run build 254 pages (kill-node + Remove-Item .next before rebuild). Prod server left running on :3002. Browser-only runtime remaining: GSAP hero entrance/scale/parallax timing, FAQ accordion feel, 1440/768 visual QA of the banner + new sections.
### 2026-09-07 -- STEP 17 (TEMP): Hide "Prévenir. Performer. Durer." pricing section from homepage
Temporarily hidden the Pricing section ("Prévenir. Performer. Durer." / "Investissez dans votre santé" / "Des formules pensées pour chaque profil, avec ou sans mutuelle.") from the public homepage on BOTH / and /en. Component, i18n keys, types, CMS schema/editor/API, and Redis content all kept intact -- public render suppressed only. Nothing committed (branch pre-production-cleanup).

Files changed:
- src/components/homepage/HomepageRenderer.tsx -- case "pricing": now returns null (TEMPORARILY HIDDEN comment); removed the now-unused Pricing dynamic import. This deterministically suppresses the section on BOTH the CMS-driven path and the admin HomepageRenderer preview, immune to any published Redis config that might re-enable it.
- src/app/(fr)/page.tsx -- removed the hardcoded <div data-section-bg="light"><Pricing /></div> block and its const Pricing dynamic import from the no-published-config fallback render. Neighboring rhythm preserved: ComparisonTable -> (single Spacer) -> CoursAteliers (no double spacer, no blank gap).
- src/app/(en)/en/page.tsx -- same removal for the EN fallback.

NOT touched: src/components/Pricing.tsx (intact, 146 lines), src/i18n/fr.ts + en.ts (pricing block intact), src/lib/homepage-types.ts (PricingContent, SectionType "pricing", SECTION_META, DEFAULT_SECTIONS), src/lib/homepage-editor-fields.ts (pricing field defs), admin/editor + /api/admin/homepage*s routes, Redis config. No metadata change (pricing owns none).

Verification (dev :3000 + prod :3002, SSR + real browser CDP):
- FR "/" + EN "/en": pricing eyebrow "Prévenir. Performer. Durer." / "Prevent. Perform. Last.", heading "Investissez dans / Invest in", sub "Des formules pensées.../ Plans designed..." ALL absent from SSR HTML and rendered DOM.
- 0 pricing text matches in body.innerText on both locales (regex FR+EN).
- Exactly 1 h1 per locale; neighbors ComparisonTable + CoursAteliers still render; no horizontal overflow; no console/exception errors; no hydration errors.
- Page count unchanged: 254 pages.

Gotchas: substring false-positives -- "votre santé"/"your health"/"Prevent" appear in OTHER sections, so probe full phrases (incl. EN exact "Prevent. Perform. Last."), not bare tokens. Both default CMS config (DEFAULT_SECTIONS sct_pricing enabled:true) and any stale published Redis config still resolve to render -> null in HomepageRenderer.

Code-quality: npx tsc --noEmit clean; npx eslint . 0E/12W (unchanged pre-existing baseline); npm run build 254 pages (kill-node + Remove-Item .next before rebuild). Re-enable later by restoring the case "pricing": return <Pricing .../>; in HomepageRenderer (and re-adding the dynamic import) + re-adding the two fallback <Pricing/> blocks. Prod server left running on :3002.
### 2026-09-07 -- STEP 18 (Homecare): decorative bronze title accents on every /soins-a-domicile section
Added a subtle, premium decorative treatment to every major section heading on FR /soins-a-domicile. Same Wenaya title-decoration language page-wide. Content/order/routes/CTAs/APIs/SEO/behavior untouched. Nothing committed (branch pre-production-cleanup).

Design (one consistent language): straight short bronze rule (#B88A5A) ABOVE each heading-serif section title, sitting between the bronze eyebrow and the H2: [eyebrow small-caps] -> [2px bronze line] -> [heading-serif title]. 2px height, w-9 (36px) mobile / sm:w-12 (48px) desktop, mb-4 gap (16px), no pill/gradient/numbering/icons.

Files:
- src/components/domicile/HomecareSectionHeading.tsx -- NEW tiny presentational primitive: props eyebrow?, children, variant "light"|"dark", className?, style; light -> navy title text-[#0B1220], dark -> text-white; renders eyebrow + bronze rule (aria-hidden) + heading-serif h2. Server-safe/static (no animation).
- 12 section components updated to use it (all non-hero sections):
  LIGHT (no variant, navy title): Intro, Services, Evaluation, Material, Engagements, Why, Multidisciplinary, Coordination, Faq (client).
  DARK (variant="dark", white title): NursingLevels, Support, Contact.
Each section replaced its inline <span eyebrow>+<h2> block with <HomecareSectionHeading eyebrow=... variant=... style=...>{title}</...>, preserving the exact existing clamp font-sizes and copy.
Hero.tsx NOT touched (excluded); list-item/card/FAQ-question/button subheads not decorated.

Verification (dev :3000 + real browser CDP at 390/768/1440): 12 bronze rules == 12 section h2 (matched, no duplicates); each rule immediately precedes its h2 in SSR (eyebrow -> rule -> title structure confirmed); Intro title variant light (navy), Nursing/Support/Contact dark (white); hero h1 NOT decorated; no horizontal overflow at 390/768/1440; FAQ questions unchanged; all exact live copy present byte-identical; one h1.

Gotchas: React SSR emits the self-closing rule span as <span ...></span> (not />), so a ...mb-4" /> string-probe returns 0 though the element is present -- probe the class substring instead.

Code-quality: npx tsc --noEmit clean; npx eslint src/components/domicile clean; npm run build 254 pages (unchanged; kill-node + Remove-Item .next before rebuild). Prod server needs restart (build killed node). Browser-only runtime: none new (static decoration; reduced-motion N/A as no animation added).

### 2026-09-08 — SEO MIGRATION: high-confidence redirects only (from audit CSVs, branch pre-production-cleanup)

Implemented ONLY the CSV-marked high-confidence redirect actions from `wenaya-seo-migration-map.csv`. Audit-only philosophy maintained: no invented redirects, no new wildcards beyond pre-existing ones, no redirects for MANUAL/NEEDS-CONTENT rows, no commit. Prod server on :3002, fresh `next start` after `Remove-Item .next`.

**Files changed:** `next.config.ts` only (+12 lines, 1 block comment).

**Added (all `permanent: true` → 308):**
- `/fr` → `/` (CSV duplicate-home variant, canonical is root).
- Practice accented-slug gaps: `/pratiques/ost%C3%A9opathie` → `/pratiques/osteopathie`, `/pratiques/sono-th%C3%A9rapie` → `/pratiques/sono-therapie`, plus EN equivalents. (Other 6 accented slugs were already present; these two were the CSV-mapped stragglers, both target routes verified in `SLUG_ORDER`.).
- Arabic precise mappings inserted BEFORE the existing temp `/ar/:path*` catch-all (order = first-match-wins): `/ar/about-us` → `/about`, `/ar/pratiques` → `/pratiques`, `/ar/parcours-de-soins/grossesse-&-maternite` → `/pratiques/kinesitherapie`, `/ar/search/all/all` → `/`. The `/ar/:path*` → `/` (307) remains as the fallback for every other AR URL without a mapped destination.

**Not touched (per CSV classification):**
- Broken catch-alls: `/articles/undefined`, `/en/articles/undefined`, `/evenements/undefined` — must 404. Verified the new app returns **404** for each (articles `[slug]` page calls `notFound()`; there is no `/evenements` route in the new app). No redirect added.
- Broken professional URLs (`/professional/*`, `Undefined | Wenaya` titles): KEEP — same URL, never redirected away.
- MANUAL/NEEDS-CONTENT: `/parcours-de-soins/*`, `/maux-troubles/{slug}`, `/search/*` variants, `/professional/*/booking` — left untouched (pre-existing temp 307 `/parcours-de-soins/:slug+` → `/` kept as-is).
- `/en/soins-a-domicile`: DO-NOT-INDEX — no EN homecare route exists (verified 404), not in sitemap (only FR single entry), robots leaves it unlisted (a 404 needs no disallow).

**Verified (prod :3002, curl no-follow + follow):** `22/22` redirect sources return **308** with correct `Location` and **final 200** single-hop (no chains/loops): `/fr`, `/about-us`, `/en/about-us`, `/contact-us`, `/terms-and-conditions`, `/privacy-policy`, `/for-entreprise`, `/soins`, `/maux-troubles`, `/en/maux-troubles`, `/user/sign-in`, `/en/user/sign-in`, `/specialistes`, `/specialistes/nadine-kita`, `/en/group-sessions/prenatal-yoga` + `brazilian-jiu-jitsu`, accented `kin%C3%A9sith%C3%A9rapie`/`ost%C3%A9opathie`/`sono-th%C3%A9rapie` FR+EN (percent-encoded AND raw `é` UTF-8 both 308 → ASCII target), `/ar/about-us`, `/ar/pratiques`, `/ar/parcours-de-soins/grossesse-&-maternite`, `/ar/search/all/all`. Pre-existing 307s unchanged (`/evenements`, `/search/all/all`, `/ar/*` fallback, `/parcours-de-soins/:slug+`). `/en/group-sessions/zumba-anim` → `/en/seance-de-groupe/zumba-anim` fallback (pre-existing, unverified-detail risk — documented, not new).

**Sitemap/canonical (sitemap.xml at :3002, 231 URLs):** zero redirect-source URLs present; canonicals `/`, `/en`, `/soins-a-domicile`, `/pratiques/kinesitherapie`, `/en/pratiques/osteopathie` present; no `/en/soins-a-domicile`; `/en` emitted WITHOUT trailing slash by `dual("/")` (pre-existing). Canonical + `hrefLang` fr-MA/en-MA/x-default correct on FR+EN pairs (pages use camelCase `hrefLang`). `robots.txt`: `/login`, `/en/login`, `/admin`, `/api/` disallowed.

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline, next.config.ts clean); `npm run build` passes. Prod server left running on :3002.

### 2026-09-08 — SEO MIGRATION (Phase 4): verified care-journey targets + fixed AR mapping (branch pre-production-cleanup)

Deep-verified the 3 ambiguous care journeys using the REAL live content (detail bodies captured via CDP; the "Invalid tab!" SPA artifact resolved by direct-load URLs). Then applied the confirmed redirect batch + corrected the Phase-3 AR target.

**Live journey evidence (web + browser captures):**
- **Troubles de l'apprentissage → PROVEN** `/pratiques/orthophonie`: live body *"Diagnostic précoce — réalisé par un professionnel de santé (**orthophoniste**, neuropsychologue…)"* + *"Interventions spécifiques: **Orthophonie**: pour les troubles du langage écrit (dyslexie, dysorthographie)"* — orthophonist is first-named practitioner, orthophonie first intervention. Confirms `pathologies.ts:45`.
- **Grossesse & Maternité → NOT single-practice** `/pratiques`: body explicitly enumerates exactly 4 approaches *"1. Le yoga prénatal et postnatal, 2. La massothérapie, 3. La nutrition, 4. La psychologie"*; conclusion *"En intégrant le yoga, la massothérapie, la nutrition et la psychologie…"*. Kinésithérapie appears nowhere → the old `/ar/parcours-de-soins/grossesse-&-maternite` → `/pratiques/kinesitherapie` (added Phase 3) was WRONG.
- **Santé holistique → NOT single-practice** `/pratiques`: generic wellness pillars body; practitioners "un naturopathe, un médecin généraliste… ou un coach" + "yoga, méditation, réflexologie, aromathérapie". No dominant practice.
- `/maux-troubles/grossesse` → `/pratiques` (same non-single-practice rationale).
- Technique notes: care-journey detail pages are the broken SPA ("Invalid tab!" appears when navigating client-side); direct top-level navigation renders the full body. The hub page IS fully SSR'd (journey teasers in HTML); its `__NEXT_DATA__` holds only the i18n bundle (no per-journey content); detail `_next/data/<build>/fr/parcours-de-soins/<slug>.json` likewise (i18n frame). Journey slugs carry raw apostrophe (`les-troubles-de-l'apprentissage`), curly-quote encode `%E2%80%99` does NOT resolve (Invalid tab) — must use raw `'`.

**Files changed:** `next.config.ts` only (+14 lines). Changes:
- **AR fix:** `/ar/parcours-de-soins/grossesse-&-maternite` destination `/pratiques/kinesitherapie` → `/pratiques`.
- **New care-journey 308s** (FR+EN, each with both the canonical accented URL and the unaccented CSV alias), inserted BEFORE the temp `/parcours-de-soins/:slug+` catch-all (order = first-match-wins): apprentissage → `/pratiques/orthophonie` (+`/en/…`), grossesse (accented `maternit%C3%A9` + unaccented) → `/pratiques` (+EN), santé-holistique (accented + unaccented) → `/pratiques` (+EN).
- **New:** `/maux-troubles/grossesse` → `/pratiques` (permanent), placed beside the existing `/maux-troubles` entry.
- Unmapped journey slugs (`le-vertige-positionnel`, `tecar-therapie`, …) still fall to the pre-existing 307 catch-all → `/` (deliberate — not in this batch).

**Verified (prod :3002, curl no-follow + follow):** `14/14` new/prefixed sources return **308** + final **200** single-hop; `11/11` regression checks pass unchanged (incl. pre-existing 307s `/search/all/all`, `/ar/*` fallback, `/parcours-de-soins/le-vertige-positionnel` + `tecar-therapie` still 307 → `/`). Target routes `/pratiques`, `/en/pratiques`, `/pratiques/orthophonie`, `/en/pratiques/orthophonie` → 200. Sitemap 231 URLs, zero redirect sources present, no `/parcours-de-soins/` in sitemap.

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint next.config.ts` clean; `npm run build` 254 pages (kill-node + `Remove-Item .next` before rebuild). Prod server left running on :3002. NOT committed/pushed.

### 2026-09-08 — SEO MIGRATION (Phase 5/final): professional-404 fix + deliverables refresh (branch pre-production-cleanup)

Wrapped the unresolved-URL pass. Two code fixes + all three audit deliverables regenerated to the CURRENT canonical architecture (canonical = live `-us`/`terms-and-conditions`/`privacy-policy` forms; parity direction INVERTED from the pre-parity draft).

**Code changes:**
- `src/app/(fr)/professional/[slug]/loading.tsx` + `(en)/en/professional/[slug]/loading.tsx` **deleted.** `/professional/ghita` (unknown slug) returned HTTP **200** (with correct noindex + "Page Introuvable" 404 content) because the `loading.tsx` Suspense boundary streamed the pulse skeleton at 200 BEFORE the async page called `notFound()`. Removing the boundary lets `notFound()` fire pre-commit → real **404**. Now FR+EN `/professional/{unknown}` → 404 (noindex, clean `Page Introuvable — 404` title). Same streaming artifact exists on the Shop detail route (`/produits/{unknown}` → 200 noindex) but is **out of scope** (CMS/Shop) — documented. Specialist source/page/data untouched; admin edits existing specialists in place only.
- `next.config.ts` redirect table finalized in earlier phases (search→`/pratiques` 307, maux verified-slug 308s, 20 booking rows, proven-journey rows); this pass validated it.

**Deliverables regenerated (previously stale):**
- `wenaya-live-url-inventory.csv` — 224 rows (111 canonical SSR-verified 200 incl. titles/canonicals for every practice/session/professional/article detail; 99 redirect sources with verified codes; 14 DONT-REDIRECT 404s).
- `wenaya-seo-migration-map.csv` — 224 rows `old_url,current_status,new_target,action,confidence,priority,notes`.
- `wenaya-seo-migration-summary.md` — sections A–T, IMPLEMENTED+VERIFIED status.

**Regression (prod :3002):** 122/122 PASS — no-follow (status+Location) + follow (final URL) + expect-404 + expect-temp (unmapped journey catch-alls) + canonical-200. Two initial test-case over-strictness fixes (not app bugs): raw `&` (not `%26`) is the realistic journey URL form; `tecar-therapie` etc. correctly fall to the pre-existing temp `:slug+` 307 → `/` (documented NEEDS-CONTENT — summary corrected to "temp 307" not "404").

**Quality gates:** sitemap 231 URLs canonical-only (zero redirect sources; the only `/soins` prefix hit is the canonical `/soins-a-domicile`); zero stale short-form internal hrefs in `src`; hreflang camelCase `hrefLang` fr-MA/en-MA/x-default present on `/pratiques` pair; robots.txt disallows `/login /en/login /admin /api/`.

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint next.config.ts` clean; `npm run build` 254 pages (kill-node + `Remove-Item .next`). Prod server left running on :3002. NOT committed/pushed.

### 2026-09-08 — SEO MIGRATION (Phase 6/FINAL): URL-parity pass — outcome: zero renames needed (branch pre-production-cleanup)

Deep-redo of the URL parity audit against the LIVE site (2026-09-08, live is up + SPA-rendering). **Verdict: the new app's canonical URLs already match live 1:1 for every same-content page — no GROUP-B route renames were warranted.** Several previously assumed "gaps" were DISPROVEN by direct live probes (self-canonical + follow): `/en/about`→404 (live canonical is `/en/about-us`), `/en/group-sessions`→404 (`/en/seance-de-groupe`), `/contact`→404 (`/contact-us`), `/for-entreprise`→404 (`/corporate`), and `/pratiques/psychologie-clinique` is a live 200 self-canonical DUPLICATE whose canonical slug is `/pratiques/psychologie` (new correctly uses it). Full table + decision log in `wenaya-url-parity-report.md` (deliverable A–L).

**Verified parity (live 200 self-canonical = new 200 self-canonical):** `/`, `/en`, `/about-us`, `/en/about-us`, `/contact-us`, `/en/contact-us`, `/terms-and-conditions`, `/privacy-policy` (+EN), `/corporate`, `/en/corporate`, `/soins-a-domicile` (FR-only — EN 404 both sides, no fake hreflang), `/pratiques`+`/en/pratiques` with 19×19 detail slugs IDENTICAL (incl. `psychologie`, `sexologie`, `infirmerie`, `cupping-therapy-hijama`), `/seance-de-groupe`+`/en/seance-de-groupe` with 6 detail slugs where EN slug == FR slug (`yoga-prenatal` 200 live), `/professional/{10}`+`/en/...` detail 200 live (listing `/professional` 404 live = net-new page), `/articles`+`/en/articles` (detail pages net-new — live child sitemaps empty, zero article URLs).

**Intentionally different (reported, not bugs):** `/login`+`/en/login` (live patient app `/user/sign-in`, robots-disallowed `/user/`, noindex; aliases 308) — separate architecture; net-new `/professional`/`/en/professional` listing + 7×2 article details; temp 307s for `/parcours-de-soins/:slug+`, `/evenements`, `/search/all/all`, `/ar/*` retained (NEEDS-CONTENT); `psychologie-clinique`+`therapies-complementaires` 308 into canonical.

**Evidence:** live sitemap index now live; static child real; detail children EMPTY; robots allows `/professional` disallows `/user/`. All 26 canonical pages on prod :3002 emit SELF canonical + og:url + fr-MA/en-MA/x-default hreflang (camelCase hrefLang). Browser nav-parity test (headless Chrome CDP, real clicks/follows of all nav+footer links FR+EN): **24/24 PASS — final pathname == canonical href, no redirect hop observed**. grep confirms zero user-facing short-form/redirect-source hrefs in `src`. Regression `smoke-final.mjs`: **122/122 PASS**.

**Deliverables:** added `wenaya-url-parity-report.md` (A–L: parity table, identical routes, zero changed-to-live, intentionally-different + reasons, links-unchanged evidence, redirect direction, sitemap parity, canonical/hreflang parity, browser nav parity, remaining mismatches, build result).

**Code-quality:** no source edits this pass (read-only audit). `npx tsc --noEmit` clean; `npx eslint .` 0E/12W (pre-existing baseline unchanged); `npm run build` 254 pages on the committed tree; prod server :3002 still the Phase-5-final build. NOT committed/pushed.

### 2026-09-08 — SEO MIGRATION (Phase 7/FINAL): all 7 care journeys = exact 308s, temp catch-alls removed (branch pre-production-cleanup)

Completed the care-journey migration: the 4 remaining live journey slugs (`le-vertige-positionnel`, `la-maladie-d'Alzheimer`, `tecar-thérapie`, `kinésithérapie-&-avc`) now redirect **permanently** to proven practice routes instead of the temp 307 → home catch-all, and the `:slug+` catch-alls are GONE — unmapped `/parcours-de-soins/{slug}` now returns 404, never a broken 200.

**Files changed:**
- `next.config.ts` — Category 3 rebuilt: every care-journey source is now an exact 308 covering the accented canonical form + unaccented CSV alias + (Alzheimer) the curly-quote `%E2%80%99` form the live hub itself emits, FR+EN; the 2 `:slug+` 307 catch-alls deleted. New: vertige-positionnel→`/pratiques/kinesitherapie`, maladie-d'Alzheimer (3 forms)→`/pratiques/neuropsychologie`, tecar-thérapie (2 forms)→`/pratiques/kinesitherapie`, kinésithérapie-&-avc (2 forms)→`/pratiques/kinesitherapie` (+EN mirrors) = 16 new 308s → **113 redirect sources** total.
- `wenaya-seo-migration-map.csv` — regenerated with the **NEW 9-col schema** `old_url,live_status,current_new_status,final_target,action,confidence,priority,implementation_status,notes`; **245 rows** (113 IMPLEMENTED, 109 KEEP, 2 NOINDEX, 18 verified-404, 2 unmapped-journey MANUAL, 1 hub NEEDS_CONTENT).
- `wenaya-live-url-inventory.csv` — 247 rows: 111 canonical + 113 redirect sources + 23 verified 404s; suite note bumped to 139-check.
- `wenaya-seo-migration-summary.md` — refreshed tables (care journeys, redirect surface, 404 set, files, verification, deploy notes).

**Verified (prod :3002, clean 254-page build):** extended `smoke-final.mjs` **139/139 PASS** — all 4 new journey slugs FR+EN assert 308 with correct `Location` + follow to final 200 (single-hop, no chains/loops), unmapped journey slugs assert 404, EN search variants (`/en/search*`) 404, `/en/articles/undefined` 404; the full prior 122-check baseline unchanged. Sitemap still 231 canonical-only URLs with zero redirect sources.

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint .` 0E/12W (pre-existing baseline unchanged, next.config.ts clean); `npm run build` 254 pages (kill-node + `Remove-Item .next` first). Prod server left running on :3002. NOT committed/pushed.


### 2026-09-08 — MISSING LIVE PAGE FAMILIES AUDIT (AUDIT ONLY, NO CODE CHANGES — branch pre-production-cleanup)

Identified every real page/content family on live wenaya.com vs the current App Router project (glob :44 route files) and published wenaya-missing-pages-audit.md (A–R). Zero code touched — no routes/redirects/content/APIs, no commit/push.

**Live evidence (real-browser CDP renders + sitemaps + API, 2026-09-08):** sitemapindex = 6 children; chat articles/practices/troubles/professionals child sitemaps EMPTY; search child = {/search/all/all}; static child = 13 top URLs + 7 journeys (escaped &amp;/&apos;/curly d’Alzheimer). robots allows /articles /pratiques /maux-troubles /seance-de-groupe /search /professional; disallows /api/ /admin/ /user/ /partner/ /_next/ /auth/ /payment/.

**Rendered captures (%TEMP%\opencode\live-family-capture.json):** /about-us = company mission "Qui sommes nous" (2,207c, no H2) — our /about-us is the CLINIC page (semantic mismatch, P2). /soins+/maux-troubles = thin 859–890c stubs. Maux-troubles details = BROKEN template (undefined - Troubles & Solutions, no H1, ~529c). /parcours-de-soins hub REAL (3,644c, 7 cards); 7 journey details REAL content (vertige 4,866c / tecar 4,145c / avc 4,558c / alzheimer 3,644c; EN mirrors genuine 200). /evenements = URL-reuse of the group-BOOKING app ("réservation de Groupes") — NOT an events family (P1: temp → /seance-de-groupe). /articles = EMPTY shell (631c, 📚 actualités, ZERO cards) while API /api/v1/public/articles holds **18 orphaned articles with no public URLs**. /professional listing = 404 live (our listing is net-new improvement). /for-entreprise = 404 (dead; sitemap stale), /corporate real. /soins-a-domicile rich FR (5,209c) not in live sitemap; /en/… = same FR. /search/all/all = login-gated Mapbox app (~50c). EN journeys (hub + tecar + alzheimer + vertige) all 200 (301 = host normalize only).

**Gap verdict:** exactly ONE true missing family — **Parcours de Soins (hub + 7 details × FR+EN = 16 pages of genuine content)**; currently 28 redirect rows→practice routes + hub 404s. Everything else COMPLETE or intentionally replaced (maux-troubles details / evenements / search / professional-listing / article-details / login). P0 = build journeys hub+[slug] FR+EN (content already byte-captured in pds-*.json|html); P1 = /evenements re-target + about-us semantics; P2 = search 308, article 18-slug API pipeline, AR, llms.txt, /login auth.

**Code-quality:** not run (nothing changed). Prod :3002 untouched.
### 2026-09-08 — CARE JOURNEYS BUILT (P0 from missing-pages audit) — FR + EN /parcours-de-soins

Resolved the sole missing-family finding of the audit: built the care-journey hub + 7 details as **first-class pages** (FR + EN, live-verbatim content) and collapsed the 28 journey redirect rows down to **20 alias-only 308s** → canonical ASCII slugs. Assisted by Claude agent that independently inspected `next.config.ts` + the 3 deliverables to keep them byte-accurate. Nothing committed (branch pre-production-cleanup).

**Files created:**
- `src/lib/care-journeys.ts` — adapter: 7 journeys (grossesse-&-maternite, les-troubles-de-l-apprentissage, le-vertige-positionnel, la-maladie-d-alzheimer, sante-holistique, tecar-therapie, kinesitherapie-&-avc), live-verbatim FR + genuine-EN body content, introHref→clinic page, metadata.
- `src/components/care-journeys/` — `CareJourneyLayout` (shared shell + breadcrumbs + prev/next carousel), `CareJourneyHero`, `CareJourneyBody`, `CareJourneyCTA` (server components).
- `src/app/(fr)/parcours-de-soins/` + `(en)/en/parcours-de-soins/` — hub `page.tsx` (grid of 7 cards + intro) + `[slug]/page.tsx` (generateStaticParams, generateMetadata, JSON-LD, canonical + hreflang).

**Files modified:**
- `next.config.ts` — journey section: canonical pages + legacy URL forms exact 308 → ASCII pages (accented raw, `%27`, `%E2%80%99`, raw-straight `'`, raw-curly `’` FR+EN = 20 aliases). Removed the 2 temp `:slug+`→`/` catch-alls. **Total = 111 redirect sources** (unaltered families).
- `src/app/sitemap.ts` — `.lang("fr")`/`lang` call fixed to keep the `lang` field (the audit's sitemap had dropped it); added hub + 7 × FR+EN journeys via `dual()`.
- Deliverables regenerated/enriched: `wenaya-seo-migration-summary.md` (A–T: 127 canonical, 111 sources, 13 verified-404s, 270-page build), `wenaya-missing-pages-audit.md` (P0 → DONE, gap table + verdict + priorities updated), `wenaya-live-url-inventory.csv` + `wenaya-seo-migration-map.csv` (251 rows each; added 8 missing config rows: `/blog/:path*` + EN glob, 4 EN corporate aliases, 2 raw-curly alzheimer forms).

**Verification (prod `next start` :3002, clean 270-page build):**
- `59/59` journey suite PASS: 16 canonical dests FR+EN → 200 (+2 hubs), 20 legacy aliases → 308 with correct `Location` (single-hop), 2 unmapped journey slugs → 404.
- Sitemap 247 canonical-only URLs (16 journey entries, all un-encoded ASCII slugs; no redirect sources).
- CSV diff: all 111 `next.config.ts` sources present in map (zero drift, path-normalized byte-check).
- `next.config.ts` dedupe check: 111 unique albeit 2 visual-duplicate alzheimer rows are *distinct* forms (straight U+0027 line99 vs curly U+2019 line100) — NOT true duplicates, kept.

**Gotchas logged:** (1) `next.config.ts` must be read with `-Encoding UTF8` or the raw curly `’` mis-decodes to `â€™` — a false "missing row" in CSV diffing. (2) `/(.*)` is a *headers* source, not a redirect — exclude it when counting redirects (111 != 112). (3) `%26` is NOT a designed avc alias (raw `&` is, per CSV) — `kin%C3%A9sith%C3%A9rapie-%26avc` correctly does NOT 308. (4) Server restart via `Start-Process npx.cmd` failed silently; use nested `Start-Process powershell -ArgumentList '-Command','Set-Location C:\Users\hp\wenaya; npx next start -p 3002'`. (5) Re-grepping the route table triggered a 2nd `next start` that died on a half-cleared `.next` — always clean `.next` + kill-node before the final build.

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline, no new files flagged); `npm run build` **270 static pages** (kill-node + `Remove-Item .next` before rebuild). Prod server left running on :3002. NOT committed/pushed.

### 2026-09-08 — P1: /\/evenements\ re-target to the session gallery (FR + EN)

Closed the last open P1 from the missing-pages audit: the live \/evenements\ URL was **URL-reuse of the group-booking app** (not an events family), so the temp 307 \→ /\ fold now re-targets to \/seance-de-groupe\ (+ EN), where the real session gallery lives. Config + deliverables only — no routes, no content, no API. Nothing committed (branch pre-production-cleanup).

**Files changed:**
- \
ext.config.ts\ — \/evenements → /seance-de-groupe\ and \/en/evenements → /en/seance-de-groupe\ (both stay \permanent: false\ 307; source list count unchanged = 111). \/evenements/undefined\ unaffected (still 404).
- \wenaya-seo-migration-map.csv\ (rows 30–31), \wenaya-live-url-inventory.csv\ (rows 157–158), \wenaya-seo-migration-summary.md\ (events table row + pre-existing-edges line) — destination notes updated to the re-target.

**Verified (prod \
ext start\ :3002, clean rebuild):** \/evenements\ → 307 \Location: /seance-de-groupe\; \/en/evenements\ → 307 \/en/seance-de-groupe\; \/evenements/undefined\ → 404. Targets \/seance-de-groupe\ + \/en/seance-de-groupe\ → 200. Journey hub regression → 200.

**Code-quality:** \
px tsc --noEmit\ clean; \
px eslint next.config.ts\ clean; \
pm run build\ 270 static pages (kill-node + \Remove-Item .next\ before rebuild). Prod server left running on :3002. NOT committed/pushed.

### 2026-09-09 — Clinic "Parcours de Soins" cinematic swipe gallery (FR + EN /about-us)

Added a new image-led care-journey gallery section to the Clinic page (FR `/about-us` + EN `/en/about-us`) reusing the platform's proven snap-rail mechanics. Section presentation only — journey detail pages, practice routes, booking architecture, APIs, other Clinic sections, hero, CMS, Shop untouched. Nothing committed (branch pre-production-cleanup).

**Files created:**
- `src/hooks/useSnapGallery.ts` — **NEW shared snap-rail hook** (extracted from the duplicated PracticesSection/SessionsExplorer rail logic): native `overflow-x-auto snap-x` track, pointer-capture-free mouse drag with >8px click-cancel, arrow glide ~850ms `easeOutQuint`, snap-disable-during-glide, active-index tracking. Plain inline functions (no `useCallback` — avoids React Compiler preserve-manual-memoization noise). Used by the new section ONLY; existing sections not refactored.
- `src/components/clinic/ParcoursDeSoins.tsx` — **NEW cinematic journey gallery** (client, `useLocale` + `t`/`tRaw` + `useSnapGallery`). Semantic `<section id="parcours-de-soins" role="region" aria-roledescription="carousel">` + localised aria-label, ivory `#FAF8F4` bg. Badge → serif H2 → supporting paragraph → header CTA row. Panels: `aspect-[3/4]` (portrait), 4:5-ish image full-bleed (`next/image` fill + bottom navy gradient `rgba(11,18,32,.78)→.28→transparent`, no cards/borders), overlay = H3 title + bronze divider + one-line supporting text + CTA row: **Book Now** primary bronze-gradient `<a>` (aria `Réserver — {title}`/`Book — {title}`) + **Explore** underline arrow (aria `Explorer — {title}`/`Explore — {title}`). Sizing `w-[85vw]` (1 + peek) / `md:w-[calc((100%_-_24px)/2)]` (2) / `lg:w-[calc((100%_-_48px)/3)]` (3), `gap-3 md:gap-6`. Left/right round arrow `<button>`s (aria prev/next, disabled at ends) + progress dots (1 active elongated bronze `w-4`, 5 inactive `w-1.5 bg-[#0B1220]/20`). Only first image `priority`, rest lazy; `PANEL_SIZES` `(max-width:767px) 85vw, (max-width:1023px) 48vw, 32vw`. Distingu refresh: `.cj-img` hover-zoom (rest scale 1 → `group-hover` scale 1.06).
- **7 journeys sourced from `CARE_JOURNEYS` directly** (NOT `getCareJourneysForHub`, which strips `relatedPracticeSlug`/`ctaListing`). No EN title field in data → FR panel title = `hubLabel`, EN = i18n `clinic.careJourneys.titles.{slug}`; supporting lines both locales via i18n. Journey images have no data field → mapped via `JOURNEY_IMAGE` to relevant Wenaya-owned `/pratiques/*` images (grossesse→yoga, apprentissage→orthophonie, vertige→kinesitherapie, alzheimer→neuropsychologie.png, holistique→meditation.png, tecar→sono-therapie, avc→massotherapie).

**Book Now routing** (canonical helpers `getPratiqueBookingCta` + `getSpecialistsForPractice`, NOT the journey page): grossesse (multi-practice) → `/professional`; apprentissage (orthophonie→mehdi-irzi) → `/professional/mehdi-irzi`; vertige/tecar/avc (kinesitherapie→nadine-kita) → `/professional/nadine-kita`; alzheimer (neuropsychologie, 0 specialists) → `/professional`; holistique (ctaListing) → `/professional`. EN mirrors `/en/professional*`. **Explore** → `/parcours-de-soins/{slug}` / `/en/parcours-de-soins/{slug}`.

**Files modified:**
- `src/i18n/fr.ts` + `src/i18n/en.ts` — `clinic.careJourneys` block: `badge` (`Parcours de soins`/`Care journeys`), `heading`/`sub`, `bookNow`/`bookNowAria` (`Réserver`/`Réserver — {title}`; `Book Now`/`Book — {title}`), `explore`/`exploreAria` (`Découvrir`/`Explorer — {title}`; `Explore`/`Explore — {title}`), `galleryLabel` (`Parcourir les parcours`/`Browse care journeys`), `prev`/`next`, and `titles` + `supporting` per 7 slugs (EN genuine: Pregnancy & Motherhood, Learning Difficulties, Vertigo, Alzheimer's Disease, Holistic Health, TECAR Therapy, Physiotherapy & Stroke).
- `src/app/globals.css` — `.cj-img` (hover-zoom) + `@media (prefers-reduced-motion: reduce)` disable, beside the `ch-*`/`hp-*` helpers.
- `src/app/(fr)/about-us/page.tsx` — `<ClinicParcoursDeSoins />` inserted **between ClinicHealthNeeds and HomecareBanner** (import + render).
- `src/app/(en)/en/about-us/page.tsx` — `<ClinicParcoursDeSoins />` inserted **between HealthNeeds and Recruitment** (EN has no Homecare banner).

**SSR/static verified (prod build, `next start` :3002, HTTP checks):** FR + EN `\about-us` → exactly **1 `<h1>`** each; section id + `role="region"` + `aria-roledescription="carousel"` present; all **7 journey panel H3 titles** per locale (FR from `hubLabel` verbatim incl. accented `Grossesse &amp; Maternité`; EN genuine, no FR leak); **7 Book Now + 7 Explore `<a>`** per locale; FR booking hrefs `/professional`, `/professional/mehdi-irzi`, `/professional/nadine-kita` (×4) and EN `/en/professional*` mirrors all present; Explore hrefs `/parcours-de-soins/{slug}` FR + `/en/…` EN (incl. `&amp;`-escaped grossesse/avc slugs); **zero FR leakage on EN** (`Découvrir le parcours`/`Réserver`/`Parcours de soins` absent); placement byte-verified (`HealthNeeds badge < parcours < homecare` FR; `< parcours < recruitment` EN); 1 active + 5 inactive dots; compiled CSS chunk on `/about-us` contains `.cj-img{`, `.hp-track{`, `calc(33.3333% - 16px)`, `calc(50% - 12px)`; all 7 `/_next/image?url=%2Fpratiques%2F…` paths present (files exist in `public/pratiques/`; optimizer 400 on my double-encoded HEAD probe is a harness artifact — same files already serve via the practice cards, real browser OK). Smoke: journey detail routes `/parcours-de-soins/{slug}` + `/en/…` → 200.

**Test-harness gotchas worth logging:** (1) My optimizer probe double-encodes `%2F` (`[uri]::EscapeDataString("/pratiques/…")`) → 400; the browser sends the literal SSR `src` (`%2Fpratiques%2F…`) which works — verify image integrity by file-existence + known-good device, not a proxy HEAD. (2) Section-slice probes must bound by the NEXT component marker or a distinctive following string (`soins-a-domicile` CTA on FR), not by an assumed `id` that doesn't exist. (3) Journey AVC/`&` titles are SSR-escaped `&amp;`; apostrophes `&#x27;` — probe escaped forms. (4) `hp-slide` count = 13 on `/about-us` (7 journeys + 6 clinic sessions — both galleries use the shared track util; expected, not a bug).

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline, no new files flagged); `npm run build` **270 static pages** (no new routes; section lives on existing pages). Prod server left running on :3002. NOT committed/pushed.

**Browser-only runtime remaining (no real browser in this env):** drag-vs-Book Now/Explore click-cancel, arrow glide + dot sweep, image hover-zoom, GSAP-free (none added), 1440×900 / 1024 / 768 / 390×844 visual QA — exactly 3/2/1+peek panels, `aspect-[3/4]` subject framing (all sources are landscape → vertical `object-cover` center-crop may clip; frame with `object-position` if a subject gets cut).

### 2026-09-09 — Clinic Parcours gallery REAL-browser QA complete (FR + EN /about-us) — PASS

Real-browser CDP verification of the Parcours de Soins swipe gallery (`%TEMP%\opencode\pds-qa.mjs`, headless Chrome `--headless=new`, random port, per-session kill/relaunch; report `%TEMP%\opencode\pds-qa-report.md`; screenshots `pds-qa-shots\*.png`). **62/62 assertions PASS, 0 FAIL — no app bugs found, NO source changes, NOT committed/pushed.**

- **Geometry FR+EN** @1440/1024/768/390: exactly 1 h1, **7 slides**, panel ratio ≈1.33 (3:4), **no horizontal body/html overflow** (delta 0). Visible panels: **3 @1440 AND 1024** (lg breakpoint IS 1024 — 3 is by design, not a bug; 2-panel zone is md 768–1023 → **2 @768**), **1+peek @390** (2nd slide just intersects). SectionH 1040/814/826/883.
- **Images:** all 7 download at every viewport FR+EN (forced via track scroll + `scrollIntoView` for lazy); first `priority`, rest lazy; **0 broken** after full scroll-through.
- **Interaction (FR 1440):** init prev disabled/next enabled; Next glides exactly 1 step (0→435); Prev returns to 0 + disables; **7 dots (7 journeys), exactly 1 active** — the earlier "6 dots" log note was WRONG, it's 7; drag moves rail in real-time + release re-snaps (300→435, no jump); image has `cj-img`; hover rule is **`.group:hover .cj-img { scale(1.06) }`** (global CSS globals.css ~line 410, NOT a Tailwind `group-hover:` utility); rest transform scale(1), no pre-zoom jump; interaction console (none).
- **Routing (scoped to `#parcours-de-soins`):** FR 7 Book = 3×`/professional` (grossesse/alzheimer/holistique) + `/professional/mehdi-irzi` (apprentissage) + 3×`/professional/nadine-kita` (vertige/tecar/avc) ✅; EN `/en/professional*` mirrors ✅; 7 FR + 7 EN Explore → `/parcours-de-soins/{slug}` / `/en/...` direct; **browser click no-hop:** FR Explore s0 → grossesse detail, EN Explore s0 → EN detail, EN Book s0 → `/en/professional` (all single-hop, no redirect chains).
- **Placement (SSR byte-verified):** FR HealthNeeds(101617) < Parcours(113157) < soins-a-domicile(140429) < Recruitment ✅; EN HealthNeeds(101189) < Parcours(112642) < Recruitment("Join the Wenaya team", 139361) ✅ (EN rendered H2 is "Join the **Wenaya** team" — the journey-hub H2 "Your journey in…" is NOT the next section marker).
- **Console:** zero full-page console errors/exceptions/hydration.

**Harness bugs fixed (not app):** async IIFEs to `ev()` need `awaitPromise:true` (3rd arg); expected Book arrays 3×/professional + 3×nadine (not 4+2); dots=7 not 6; hover selector `.group:hover .cj-img`; EN placement marker `Join the Wenaya team`. **Remaining user-only visual check** (this model cannot view images): pixel framing of portrait `object-cover` center-crop (all sources landscape → may clip; use `object-position` if a subject gets cut) — screenshots saved for eyeball.

### 2026-09-09 — Parcours de Soins made INFORMATIONAL: journey booking removed (FR + EN)

Refactor: care journeys are now presented as informational guidance (explain the situation → recommended practices → orientation), NOT bookable services. No redesign, no route/URL/canonical/SEO change, no medical-content change, no real practitioner/session booking change. Gallery + all 7 detail pages × FR+EN. Nothing committed (branch pre-production-cleanup).

**Files changed:** `src/components/clinic/ParcoursDeSoins.tsx` (gallery rewritten: single bronze "Découvrir le parcours"/"Explore the journey" CTA → canonical detail; Book Now removed; `useSnapGallery`, PANEL_WIDTH 3/2/1+peek, arrows/dots/drag, `cj-img` hover, first-priority all kept). `src/components/care-journeys/CareJourneyDetail.tsx` (rewritten: `getSpecialistsForPractice`/`getPratiqueBookingCta`/`bookingLabels` removed; adds recommended-practices resolution via `getJourneyRecommendedSlugs`, hero scroll CTA, orientation intro, `RecommendedPractices`, `OrientationCta` replacing `RelatedPractice`, informational `contactHref`). `CareJourneyIntro.tsx` (booking right-panel → ORIENTATION panel: category + "Trouvez l'accompagnement adapté"/"Find the right support" + Primary "Voir les pratiques recommandées"→`#recommandations` + Secondary "Être orienté(e)"→contact; `bookHref`/`bookLabel`/`isMulti` deleted). `CareJourneyHero.tsx` (new optional `ctaHref`/`ctaLabel`: pill "Découvrir les recommandations"/"Explore recommendations" scrolls to `#recommandations`, added to GSAP timeline; no practitioner routing). **NEW** `RecommendedPractices.tsx` (light `id="recommandations"`: single editorial split or card grid, canonical `/pratiques/{slug}` links, zero booking). **NEW** `OrientationCta.tsx` (navy closing band: SINGLE = "Pratique recommandée" + "Découvrez cette pratique et les professionnels qui peuvent vous accompagner." + "Découvrir la pratique"→practice + "Trouver un spécialiste"→`/professional` listing + subtle "Être orienté(e)"; MULTI = "Plusieurs approches peuvent vous accompagner" + "Voir les pratiques recommandées"→`#recommandations` + "Être orienté(e)"). `RelatedPractice.tsx` DELETED. `src/lib/care-journey-presentation.ts` (+`recommendedSlugs`, `RECOMMENDED` map, `getJourneyRecommendedSlugs`). `src/i18n/fr.ts`+`en.ts` (gallery `bookNow`/`bookNowAria` deleted; new `detail.heroCta/orientationTitle/orientationText/viewRecommended/getGuidance/recommendedEyebrow/recommendedHeading/recPracticeEyebrow/recPracticeCopy/findSpecialist/multiCloseHeading`; dead `explorePathway`/`viewAllPractices` deleted).

**Recommended-practice resolution** (derived from each journey's own content, canonical-practice-resolved, missing-slug-skipped): grossesse→4 (yoga/massotherapie/nutrition/psychologie, multi); apprentissage→2 (orthophonie/neuropsychologie, multi); vertige→1 (kinesitherapie); alzheimer→1 (neuropsychologie); holistique→3 (naturopathie/yoga/meditation, multi); tecar→1 (kinesitherapie); avc→1 (kinesitherapie). Multi list = `pratiques.length > 1` (not the old `ctaListing` flag).

**Orientation/contact:** `/contact-us?source=care-journey&journey={slug}` (informational only — `service=` NEVER used for a journey). SSR: `/contact-us?source=care-journey&amp;journey=grossesse-%26-maternite` (etc.) / `/en/contact-us?...`. **Direct practitioner routing removed** — no `/professional/nadine-kita` or `/professional/mehdi-irzi` anywhere on journeys; `/professional` appears only as the single-journey "Trouver un spécialiste" listing CTA (asserted ABSENT on multi pages).

**Verification (prod :3002, final fresh build, HTTP):** `%TEMP%\opencode\pds-informational-qa.mjs` **300 PASS / 0 FAIL** on both pre- and post-final-build. Gallery FR+EN: 7 panels, 7 discovery CTAs (`Explorer — {title}` / `Explore — {title}`), 7 canonical journey hrefs, 0 booking words in section, dots 1/6, panel-width classes, EN zero FR leak + genuine titles. Details ×7×2: 200, 1 h1 each, hero CTA→`#recommandations`, orientation copy exact (FR accented/EN genuine), Primary+Secondary, encoded contact params, `#recommandations` links == recommendation count + per-slug, closing band single vs multi correct, "Continuer à explorer"/"Continue exploring" intact, zero FR orientation leak on EN, **zero booking language inside `<article>`** on every page. `npx tsc --noEmit` clean; `npx eslint .` 0E/12W (pre-existing baseline unchanged); `npm run build` 270 static pages (kill-node + `Remove-Item .next` first). Content adapter `care-journeys.ts` untouched this step → medical content preserved by construction; body-probes (dysorthographie, Diagnostic précoce, orthophoniste) present. `pds-diff.mjs` 2 "missing" lines = hero/nav/footer chrome composites (the multi-journey hero related-practice pill removal shifts normalized text-run boundaries) — NOT article body.

**Gotchas logged:** (1) The sitewide Nav "Réserver"→`/professional` CTA exists on every page — booking-absence probes must be scoped to the `<article>` region, not whole page. (2) `h()` prefixes `/en` for EN → EN practice-link hrefs are `/en/pratiques/...`; count probes per locale. (3) Dead i18n keys (`viewAllPractices`, `explorePathway`, gallery `bookNow*`) now unreferenced — removed. (4) Final authored intro copy ("...identifiez l'accompagnement le plus adapté...") supersedes the earlier brief variant ("ou laissez notre équipe vous orienter"). Remaining user check: real-browser visual/interaction QA (drag vs CTA click, arrow glide, 1440/768/390, portrait `object-cover` framing) — dev :3000 + prod :3002 running.

### 2026-09-09 — PDS detail: hero-to-intro band removed + intro paragraph de-sized (FR + EN)

Fixed the two visual issues on all 7 `/parcours-de-soins/[slug]` + `/en/...` detail pages: (1) the large empty ivory band between hero and intro, (2) the oversized intro lead that read as a "second H1". Presentation only — medical wording, routes, SEO, orientation CTAs, i18n untouched; shared components only, zero per-journey special-casing. Nothing committed (branch pre-production-cleanup).

**Files changed:**
- `src/components/care-journeys/CareJourneyHero.tsx` — content wrapper `pt-32 pb-16 sm:pb-20 lg:pt-40 lg:pb-24` → `pt-28 sm:pt-32 pb-12 sm:pb-14 lg:pt-40 lg:pb-16`; bottom sand melt `h-40 sm:h-48` → `h-16 sm:h-20 lg:h-24` with tighter gradient (`0.98@0, 0.6@30, 0@100`).
- `src/components/care-journeys/CareJourneyIntro.tsx` — section top padding `pt-14 lg:pt-20` → `pt-8 sm:pt-10 lg:pt-12`; lead paragraph `heading-serif ... text-[clamp(1.3rem,2.2vw,1.75rem)] leading-[1.45]` → `font-serif font-normal text-[#0B1220] text-lg leading-[1.5] sm:text-xl lg:text-2xl max-w-[700px]`.

**Root cause (two-fold):** (a) stacked spacing — melt 160/192px + hero `pb` 64–96px + intro `pt` 56–80px ≈ 272px desktop of empty sand; (b) the paragraph kept `.heading-serif`, an **unlayered** rule (globals.css) whose `line-height: 1.08` + weight 500 beat the `leading-[1.45]` Tailwind utility in the cascade (unlayered > `@layer utilities`) → it really rendered at Manrope 500 / ~28px / LH 1.08, i.e. an H1-sized dense block. Removing `heading-serif` lets the utility `leading-[1.5]` apply.

**After:** desktop 18→24px (`text-lg sm:text-xl lg:text-2xl`), LH 1.5, weight 400 — within the 22–26px desktop / 18–20px mobile spec; hero→intro content at `lg:pt-12` = 48px after the hero edge (within 48–80px). Grid kept `lg:col-span-7/5` (58/42, within 55–60/40–45); grossesse (empty intro) keeps full-width `lg:col-span-12 lg:max-w-2xl` panel.

**SSR verified (prod :3002, `%TEMP%\opencode\pds-gap-qa.ps1`):** **76/76 PASS** across alzheimer/apprentissage/grossesse × FR+EN — 1 h1 each; new hero wrapper padding + compact melt present, old `h-40 sm:h-48` absent; new intro `pt-8 sm:pt-10 lg:pt-12` present, old `pt-14 lg:pt-20` absent; lead pages show the new class string + intro copy byte-preserved (`maladie d&#x27;Alzheimer est une pathologie…`, `dysfonctionnements neurologiques qui affectent…`), old clamp + old heading-serif-on-paragraph combo absent; grossesse shows no lead + full-width panel; orientation panel + localised title present both locales; `heading-serif` still used by H1/panel H2/dd.

**Harness gotchas logged:** (1) React SSR escapes ONLY `'`→`&#x27;` (`&`→`&amp;`) — `é` passes through raw, so probe `l&#x27;accompagnement adapt` NOT `adapt&#x27;`. (2) EN pages render a localised orientation title — make the panel probe locale-aware. (3) `lg:pb-18`-style arbitrary values avoided; used step of stock scale (`pb-14`, `pb-16`).

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline, no new files); `npm run build` **270 static pages** (kill-node + `Remove-Item .next` first). Report: `%TEMP%\opencode\pds-gap-report.md`. Remaining user check: real-browser pixel QA at 1440/768/390 (perceived dead-space, melt opacity, panel balance) — dev :3000 + prod :3002 running.

### 2026-09-09 — Homepage hero: location/date meta line removed (FR + EN)

Removed the decorative meta line (`Casablanca · Maroc`/`Casablanca · Morocco` + `Depuis 2019`/`Since 2019`) from the homepage hero on both locales. Headline, sub, CTA, video/poster, overlay, spacing, animation rhythm and trust bar untouched; block removed cleanly with its dead animation + orphaned i18n/editor references. Nothing committed (branch pre-production-cleanup).

**Files changed:**
- `src/components/HeroSection.tsx` — deleted the whole `.hero-eyebrow` block (bronze dot + `t("hero.eyebrow")` + `w-8 h-px` divider + `t("hero.depuis")`, wrapper `mb-8`); removed the now-dead `.hero-eyebrow` `fromTo` from the GSAP timeline (first tween; the `-=0.25` overlap offset was dropped and the `hero-line` tween became the timeline head — other tweens keep their own offsets). No new spacing added: content wrapper `pt-28 sm:pt-36` + headline start is the new rhythm (eyebrow was ~43px of the top cluster).
- `src/i18n/fr.ts` + `en.ts` — removed `hero.eyebrow` + `hero.depuis` keys (fully orphaned).
- `src/lib/homepage-editor-fields.ts` — removed the `{ label: "Eyebrow text", key: "eyebrow", i18nPath: "hero.eyebrow" }` field from the hero editor def (its fallback would otherwise resolve as the literal key string); updated the stale JSDoc example to `hero.vousMéritez`. `HeroContent.eyebrow?` type field left intact (optional CMS data contract, harmless — nothing renders it now).

**SSR verified (prod :3002, clean 270-page build):** FR `/` + EN `/en` → 200; `Casablanca · Maroc`, `Depuis 2019`, `Casablanca · Morocco`, `Since 2019` and the `hero-eyebrow` class all ABSENT; exactly 1 `<h1>` each; headline (`Vous méritez`/`You deserve`), sub (`pour une santé préventive, personnalisée et durable`/`for preventive, personalized and sustainable`), and trust-bar stats (`thérapeutes certifiés`/`certified therapists`) all still present.

**Gotcha logged:** `t()` on a missing i18n key falls back to the KEY PATH STRING itself (`"hero.eyebrow"`) — so any editor field whose `i18nPath` references a removed key renders the literal key in the admin editor. When deleting a translation key, also delete its `SECTION_EDITOR_DEFS` field.

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint src/components/HeroSection.tsx src/i18n/fr.ts src/i18n/en.ts src/lib/homepage-editor-fields.ts` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline); `npm run build` **270 static pages** (kill-node + `Remove-Item .next` first). Remaining user check: real-browser visual QA at 1440/768/390 (headline now starts at the top of the hero cluster, trust-bar rhythm) — dev :3000 + prod :3002 running.

### 2026-09-09 — Hero trust metric swap + nav item removal (FR + EN)

Swapped the trust metrics between the homepage and Clinic page heroes, and removed the "Spécialistes" item from both main navs. No redesign, no route/content/API/booking change. Nothing committed (branch pre-production-cleanup).

**Changes:**
- `src/components/HeroSection.tsx` — homepage trust-bar stat `{ value: "4,7 ★", label: t("hero.stats.avis") }` → `{ value: "99%", label: t("hero.stats.satisfaction") }` (4-stat row keeps 35 / +2 000 / 99% / 6).
- `src/i18n/fr.ts` + `en.ts` — `hero.stats.avis` (`avis Google Maps`/`Google Maps reviews`) → `hero.stats.satisfaction` (`de nos utilisateurs recommandent leur praticien`/`of our users recommend their practitioner`); removed `nav.specialistes` keys (orphaned by the nav removal below).
- `src/lib/clinic-content.ts` — `clinicMetrics` first metric `99% · of our users recommend their practitioner`/`de nos utilisateurs recommandent…` → `4,7 ★ · Google Maps reviews`/`avis Google Maps` (Clinic trust band now leads with the rating; 99% removed from the Clinic page).
- `src/components/Nav.tsx` (desktop link array) + `src/components/nav/MobileMenu.tsx` (mobile link array) — removed the `nav.specialistes` → `/professional` item. THE `/professional` ROUTE IS UNTOUCHED: the "Réserver"/"Book" CTA (desktop + mobile) still links to it, and the Team-section eyebrow on `/about-us` ("Nos Spécialistes"/"Our Specialists") is a pre-existing section heading, not the nav item.

**SSR verified (prod :3002, clean 270-page build):** FR `/` + EN `/en` → 200, exactly 1 `<h1>` each; homepage hero trust bar shows `99%` + the satisfaction label (EN `of our users recommend their practitioner` verified) and NO `4,7` (the remaining `4,7` hits on `/` are the `<meta description>` (`Notée 4,7/5 sur Google Maps…`) and an SVG `d="M 4,71.2…"` path — both pre-existing, not the hero stat); `/about-us` + `/en/about-us` trust band leads with `4,7 ★` (U+9733 byte-verified) + `avis Google Maps`/`Google Maps reviews` and has ZERO `99%`; `nav.specialistes` string absent from both navs; `/professional` + `/en/professional` → 200. (The `99%`/`Stat 99%` hits elsewhere on `/` are the pre-existing TestimonialsSection award stat — untouched.)

**Gotchas logged:** (1) PowerShell console mangles accented chars + `★` — for character-level probes use UTF-8 byte dumps (`'U+{0:X4}' -f [int][char]…`), not console echo. (2) `.IndexOf("Sp")` false-positives on `openingHoursSpecification` in JSON-LD — assert exact strings, not prefixes. (3) Regex literal `Spécialistes` in a PS here-string silently drops the accent → count 0 regardless; use `[regex]::Matches($html, [regex]::Escape($s))`.

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint src/components/Nav.tsx src/components/nav/MobileMenu.tsx src/components/HeroSection.tsx src/lib/clinic-content.ts src/i18n/fr.ts src/i18n/en.ts` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline); `npm run build` **270 static pages** (kill-node + `Remove-Item .next` first). Prod server left running on :3002. Remaining user check: real-browser visual QA at 1440/768/390 (trust-bar copy widths with the longer 99% label, nav now 4 items) — dev :3000 + prod :3002 running.

### 2026-09-09 — Nav "Réserver"/"Book" CTA → booking-request route (`/contact-us?type=booking`, FR + EN)

Repointed the sitewide nav CTA (desktop + mobile) from `/professional` to a booking-request flow that reuses the existing contact page/form (no separate booking page, no booking engine, no patient auth). Submitted to the SAME `/api/contact` seam (`firstName/lastName/email` validated; extra fields pass through harmlessly — no backend change). Nothing committed (branch pre-production-cleanup).

**Files changed:**
- `src/components/Nav.tsx` + `src/components/nav/MobileMenu.tsx` — Réserver/Book CTA `href` `h(locale, "/professional")` → `` `${h(locale, "/contact-us")}?type=booking` `` (FR `/contact-us?type=booking`, EN `/en/contact-us?type=booking`). `/professional` route untouched (hero/gallery/homescare-so other CTAs still use it).
- `src/components/contact/ContactPage.tsx` — now takes `isBooking` prop; header swaps heading/sub for booking mode (`Réserver`/`avec Wenaya` gradient split, EN `Book`/`with Wenaya`). Dropped the client `useSearchParams` variant in favor of a server-passed prop so the correct H1 is SSR'd per query (page became dynamic — correct for query-based mode).
- `src/app/(fr)/contact-us/page.tsx` + `(en)/en/contact-us/page.tsx` — async pages read `searchParams.type === "booking"` and pass `isBooking` down.
- `src/components/contact/ContactForm.tsx` — `isBooking` prop: booking title, booking-category required `<select>` (5 exact options via i18n, native `required` + `aria-required`, native constraint validation), phone becomes required, details `<textarea>` label/placeholder swap, submit `Envoyer ma demande`/`Send my request`, success copy `Votre demande a bien été envoyée. Notre équipe vous contactera pour vous orienter et confirmer les prochaines étapes.`/`Your request has been sent. Our team will contact you to guide you and confirm the next steps.`, payload adds `bookingCategory` + `source:"nav-booking"` + `type:"booking"` (trailing `service`/`subject` still forwarded when present). A11y: every field now has `id` + `label htmlFor` + `aria-required`; textarea labelled; success block `role="status"`, error `role="alert"`. Booking `?service=<group-session slug>` pre-fills the category to `group-session` (spec §10) + keeps the session notice.
- `src/i18n/fr.ts` + `en.ts` — `contact.booking*` keys (heading1/2, sub, formTitle, category label+placeholder, 5 × `{value,label}` categories with stable values `consultation|practice|group-session|homecare|unsure` — informational, never a medical service ID, details label+placeholder, submit, successMsg).

**Untouched (regression-proven):** generic `/contact-us` + `/en/contact-us` (original H1/formTitle/submit/success), group-session `?service=X&type=group-session` prefill, `?subject=recrutement|recruitment` prefill, care-journey `?source=care-journey&journey=` orientation links, corporate `/api/contact` consumers, `/professional` routes, login. Page-count note: `/contact-us` + `/en/contact-us` moved from static (○) to dynamic (ƒ) — 270 pages total unchanged.

**Verified (prod :3002, fresh build):** SSR harness 63/63 PASS (nav CTA hrefs FR/EN incl. header-scoped no-`/professional` check; booking H1/sub/5 options/details/submit/required ids + phone-required + lone-h1; EN zero FR leak; generic mode original copy + NO booking UI/select; all pre-existing flows stay generic; `?type=booking&service=yoga-prenatal` pre-selects `group-session`; `/api/contact` accepts the booking payload 200; source-level i18n success copy byte-checks). Real-browser CDP (headless Chrome, prod) 29/29 PASS: FR+EN booking mode hydrated (H1, select 5 options, labelled textarea, phone + category native-required, submit labels, success submit shows booking success copy, empty-category submit blocked by native `validity.valueMissing`); FR+EN generic (Prenez rendez-vous / Book an appointment, no booking select, Envoyer/Send); nav click-through FR + EN: click Réserver/Book → lands `/contact-us?type=booking` / `/en/contact-us?type=booking` with booking H1; screenshots `%TEMP%\opencode\booking-shots\`. Success copy is client-side post-submit only (correct — not in SSR HTML). `/professional`-label false-positives on `/` come from the gallery Book Now buttons (sophrologie/yoga → `/professional`) — intentional, not nav.

**Build/code-quality:** `npx tsc --noEmit` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline, no new files flagged); `npm run build` 270 pages (kill-node + `Remove-Item .next` first). Prod server left running on :3002. NOT committed/pushed. Remaining user check: real-browser visual QA at 1440/900 + 390×844 (booking form rhythm, select styling, success state) and mobile menu Book tap-through.

### 2026-09-09 — Clinic "News/Actualités" section removed from /about-us (FR + EN)

Removed the `clinic/News` section ("Nos dernières actualités"/"Latest news", `clinic.news.*` i18n, last main section before Footer) from the Clinic page on BOTH `/about-us` and `/en/about-us`. Blog/article functionality everywhere else untouched: global `/articles` + `/en/articles` + detail pages, and the homepage blog section remain intact. Nothing committed (branch pre-production-cleanup).

**Files changed (the ONLY two):** `src/app/(fr)/about-us/page.tsx` + `src/app/(en)/en/about-us/page.tsx` — removed `import ClinicNews` + `<ClinicNews locale lang />` + the "…, News, and Footer" header-comment mention. `src/components/clinic/News.tsx` is Clinic-only (imported by those two pages alone) but was **NOT deleted** — unwired from composition only (minimal diff, future-reuse optional). No spacing gap to close: News was the final main section, remaining Clinic order unaffected (Hero, Trust, Intro, Practices, Courses, Pathologies, Team, HealthNeeds, ParcoursDeSoins, HomecareBanner, Recruitment, Practical, Footer).

**Verified (prod :3002, clean 270-page build):** SSR harness `%TEMP%\opencode\news-qa.mjs` **21/21 PASS** — FR+EN `/about-us` 200 with exactly 1 h1 each, no News heading/badge/articles-feed in HTML, Practical (`Nous trouver`) retained, Recruitment (`Rejoignez l') before Practical; `/articles`, `/en/articles`, FR+EN article detail all 200; homepage `/` + `/en` 200. Real-browser CDP `%TEMP%\opencode\news-cdp.mjs` **4/4 PASS** (hydrated DOM): FR+EN about-us show zero `Actualit|News|Latest news` and zero `/articles/` links; FR+EN homepage blog section renders after hydration.

**Gotchas logged:** (1) The homepage blog section (`BlogSection` in `HomepageRenderer`, `src/components/homepage/HomepageRenderer.tsx:22`) is fetched CLIENT-side from `/api/blog/posts` via `BlogSectionWrapper` and returns `null` when post-data hasn't loaded — so it is intentionally ABSENT from SSR HTML. Probing SSR for its heading ("Insights & Recherche" FR) always false-negatives; verify via API (`/api/blog/posts` → 3 posts) + a hydrated-DOM CDP check instead. (2) FR `recruitment.heading1` = "Rejoignez l'Équipe Wenaya" and `practical.heading1` = "Nous trouver" (not "Rejoindre l'équipe"/"Informations pratiques") — order assertions must use the real i18n strings. (3) Git diff before/after confirms this task changed only the two about-us page files (the 6+/6- in those files includes the prior ParcoursDeSoins wiring already on the branch); `News.tsx`, `globals.css`, i18n all untouched. (4) PowerShell mangles accents — byte-safe Node harnesses kept in `%TEMP%\opencode\`.

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline, no new files flagged); `npm run build` **270 static pages** (kill-node + `Remove-Item .next` first). Prod server left running on :3002. NOT committed/pushed. Remaining user check: visual QA at 1440/900 + 390×844 (page ends cleanly at Practical before Footer; nav still links /articles).

### 2026-09-09 — Corporate Programmes: dedicated /corporate/programmes/[slug] detail pages (FR + EN)

Migrated the 4 labelled corporate programmes (Leadership 360°, Process Communication Model®, L'Art des Priorités, People Model Canvas) onto clean **static detail pages** (FR `/corporate/programmes/{slug}` + EN `/en/...`) with **live-verbatim FR body content** captured 2026-09-09. Single shared data source (listing + carousel + detail), one content set used by both locales (matches live: `/en/...` serves French under `lang="en"`). Old sidebar-tab `ProgrammesPage` (client, hardcoded `list`) replaced. NO commit/push (branch pre-production-cleanup).

**Files created:**
- `src/lib/corporate-programmes.ts` — single data source: `PROGRAMMES[]` (slug/badge/name/pitch/intro/blocks [bullets|cards|paragraphs]/practical[]/note/ctas[]) with verbatim live copy; `PROGRAMME_AUDIT_CALENDAR_URL` = `https://calendar.app.google/YyAirdPSc2ugGbnh9`; helpers `getProgramme/getAllProgrammeSlugs/getAllProgrammes/getProgrammeHref/getProgrammesListingHref/toProgrammeCard/getAllProgrammeCards`.
- `src/components/entreprises/ProgrammeDetail.tsx` — server detail renderer (eyebrow band → H1 → pitch → intro → labelled blocks → dark practical section → pricing note → exchange/devis CTAs → listing CTA footer); no images. `ProgrammeDetailLabels` = back/backEnterprise/practicalLabel/practicalNote/othersLabel/othersCta.
- `src/app/(fr)/corporate/programmes/[slug]/page.tsx` + `(en)/en/corporate/programmes/[slug]/page.tsx` — `generateStaticParams`, `generateMetadata` (live-verbatim descriptions in per-page `SEODescriptions`; title `{name} | Wenaya Corporate | Wenaya`; self canonical; `languageAlternates`), `notFound`, Breadcrumbs with `[slug]` label, one light WebPage JSON-LD, Footer. EN page serves the same French content (matches live), chrome localized.

**Files modified:**
- `src/components/entreprises/ProgrammesPage.tsx` — REWRITTEN as a server component: 2-col card grid from `getAllProgrammes()`, CTA band (audit calendar + `requestQuote` → `/corporate#contact` / `/en/corporate#contact`), no sidebar tabs, no `list`/`details` i18n, no chartData/demo figures.
- `src/components/entreprises/ProgrammesSection.tsx` — carousel rewritten over `getAllProgrammeCards()`, cards link to detail pages via `getProgrammeHref`; Unsplash `cardImages` REMOVED (live pages have no images); framer-motion/gsap/drag behavior kept.
- `src/app/(en)/en/corporate/programmes/page.tsx` — passes `locale="en"`.
- `src/i18n/fr.ts` (771–945) + `en.ts` (754–928) — `entreprises.programmes` block SLICED to chrome keys only: title/subtitle/discoverLabel/swipeLabel/prevLabel/nextLabel/back/backEnterprise/practicalLabel/requestQuote/othersCta/ctaTitle/ctaDesc/ctaPrimary/ctaNote (+internal othersLabel). Old 173-line `list` + `details` arrays deleted (content now in lib).
- `src/app/sitemap.ts` — `getAllProgrammeSlugs()` flat-mapped → 8 detail URLs (FR+EN) below the `/corporate/programmes` entry.
- `next.config.ts` — 2 legacy redirects (308): `/corporate/programmes/programmes/pcm` + `/en/...` → canonical `/corporate/programmes/pcm` (the malformed double path, 404 on live). Redirect source count: 113 → 115.

**CTA mapping (live → project):** `Réserver un échange` → Google Calendar audit slot (external, kept verbatim); `Demander un devis` → project `/corporate#contact` (`/en/corporate#contact`) — live target `/for-entreprise#contact-section` already 308s to `/corporate`; `Retour aux programmes` → `/corporate/programmes` (`/en/...`). No fake booking/checkout.

**SSR verified (prod :3002, fresh 270-page build):** `%TEMP%\opencode\prog-qa.mjs` **68/68 PASS** AND `prog-verbatim.mjs` **4/4 programmes 100% verbatim**:
- Listing FR+EN: 200, exactly those 4 card hrefs each, h1 present, FR title `Programmes Bien-Être Labellisés pour Entreprises | Wenaya Corporate | Wenaya` / EN `Certified Corporate Wellness Programs | Wenaya Corporate | Wenaya`.
- Details 8/8 (FR+EN): 200, H1 = live name (accents + `&#x27;` apostrophes escaped), self canonical `https://www.wenaya.com{path}` (SITE_URL-based), fr-MA/en-MA hreflang both directions, breadcrumb trail, one WebPage JSON-LD; unknown slug → 404; other-malformed double paths (e.g. `programmes/programmes/leadership-360`) → 404.
- Verbatim diff: every 25+ char live body line present word-for-word (chrome-filtered: live nav/footer/cookie composite lines excluded; CSS-uppercase differences like live `DURÉE` vs our `Durée` normalized by case-insensitive compare) — 100% each.
- Redirects: both PCM legacy sources → 308 exact `Location` + single-hop 200; sitemap.xml contains all 8 detail URLs, no redirect sources.

**Gotchas logged:** (1) `tsc` caught a real type bug first pass: `CardBlock` was typed `Programme["blocks"][number] & { cards: ... }` — intersect with array type unassignable; fixed to `{ cards: ProgrammeBlockCard[] }`. (2) My first "fix" edit accidentally collapsed the `Block()` cards/paragraphs branches (removed closing tags) — repaired by re-reading the file before re-building; VERIFY every multi-line edit with a read-back. (3) Harness "failures" were expectation bugs, not app bugs: listing h1 is the title string (`Des méthodes éprouvées...`), not a "Programmes" heading; EN card href regex missed the `/en` slash; canonical is SITE_URL not localhost; `tab` substring matches `véritable`; art-des-priorites H1 apostrophe is `&#x27;`-escaped. (4) EN listing title has no literal "Programs" token — probe `Corporate Wellness Programs`. (5) Splice script clip-guard sanity branch was a no-op expression but harmless; always `git diff` the i18n hunk after splicing. (6) i18n t() on a missing key returns the KEY PATH as text — when deleting a translation block, update every component that consumes it (done: ProgrammesPage/ProgrammesSection/ProgrammeDetail).

**Code-quality:** `npx tsc --noEmit` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline, no new files flagged); `npm run build` **270 static pages** (4 new FR + 4 new EN programme routes SSG'd; kill-node + `Remove-Item .next` first). Prod server left running on :3002. NOT committed/pushed. Remaining user check: visual QA at 1440/900 + 390×844 (listing card grid, carousel cards now link to details, detail hero band + practical section rhythm).

### 2026-09-09 — Corporate Programmes: real-browser visual QA complete FR + EN — PASS, no source changes

Ran the whole programme feature through headless Chrome (CDP, prod `next start` :3002) at 1440×900 + 390×844: listing FR/EN, /corporate carousel interactions FR desktop/mobile + EN desktop, all 4 programme detail pages FR ×2 viewports, EN detail spot-checks, route health. **229/229 PASS, 0 FAIL — no app bugs, no source edits** (harness `%TEMP%\opencode\prog-visual-qa.mjs`, report `%TEMP%\opencode\programmes-visual-qa-report.md`, 16 screenshots `%TEMP%\opencode\prog-visual-shots\`).

**Key measured facts:** listing = exactly 4 cards, h1 fits (768/342px), 2-col desktop (x=104,730) / 1-col mobile (x=24), no horizontal overflow anywhere; CTA band = `Réserver un audit gratuit` (Google Calendar) + `Demander un devis` (/corporate#contact) + the pre-existing floating StickyCta (`Book Free Consultation`) — count relaxed to ≥ 2, it is NOT a duplicate band link; carousel = typographic cards (ZERO images inside the section — stock photos removed in migration), active card 552px @1440 / 174px @390 (container 222, 1+peek), counter 1/4, interactions all verified in-browser (Next→Prev, <40px drag stays, >40px drag navigates, arrow-after-drag works, active-card CTA click lands `/corporate/programmes/art-des-priorites`); detail pages = pitch/no-bullet-overflow/no-CTA-overflow, navy practical band, devis note, audit `_blank` + new-tab aria, back + list-all → listing, H2 blocks per programme, 0 console errors on every route; EN chrome genuine (`Previous/Next program`, `Back`/`View all programmes`, quote →`/en/corporate#contact`), html `lang="en"`, zero FR chrome leak, zero raw i18n keys.

**Harness bugs fixed this pass (NOT app bugs):** (1) active card = `[class*="will-change-transform"]` with `style.zIndex==='3'` scoped to the `.pg-head` parent chain, counter = `[class*="tabular-nums"]` in the same section — page-wide probes hit testimonial components (10 elements, "1 / 3" counter). (2) Practical labels (`Durée`/`Public`) render CSS-uppercased in `innerText` ("DURÉE"/"PUBLIC") — assert case-insensitively. (3) `includes() === 0` on a boolean → always-false; return `? 1 : 0` ternaries from page eval. (4) Detail/console notes: `html lang="en"` verified; EN direct-listening detail pages have zero JS.

**Remaining user check (model cannot view pixels):** eyeball the saved screenshots for subjective quality (card spacing rhythm, mobile 174px card readability, navy practical band breathing room). Nothing blocking. Prod server left running on :3002. NOT committed/pushed.

# Wenaya — Phase 1: Dead Code Audit Report

**Date:** 2026-10-06
**Type:** READ-ONLY audit. No source edits, no builds, no commits/pushes.
**Scope:** 329 `ts`/`tsx` files in `C:\Users\hp\wenaya\src`, plus `scripts/`. Evidence = compiler graph (518 import edges), repo-wide grep (incl. string/dynamic/template-literal refs, `route.ts` consumers, scripts, config), App Router discovery, `next.config.ts` redirects.
**Analyzers (all `%TEMP%\opencode\` scaffolding):** `deadcode-graph.mjs`, `deadcode-candidates.mjs`, `deadcode-ctx.mjs`, `deadcode-symbols.mjs` (+ `-verify`, `-ownfile`), `deadcode-routes.mjs`, `deadcode-refcheck.mjs`, `deadcode-imports.mjs`, `deadcode-dormant-i18n.mjs`. Outputs: `deadcode-*.json`.

---

## Category legend

- **A** — genuinely dead today (zero reachable consumers). Safe-removal candidate.
- **B** — dead *within* a live file (dead export / dead i18n leaf / registry residue that *references* dead code). Safe-removal candidate in most cases.
- **C** — intentional dormant / intentionally kept (explicit keep-or-reenable comments, documented freeze, CLI/build-time entry, reference data). **NOT** removal candidates.

---

## 1. Whole-file findings

| File | Lines | Evidence | Category | Safe removal? |
|---|---|---|---|---|
| `src/components/PracticesSection.tsx` | 597 | zero in-degree; no import anywhere in src/scripts; previously embedded in TestimonialsSection (removed 2026-09-14); consumers only via its own i18n `homePractices.*` | **A** | Yes — content still reachable at `/pratiques` |
| `src/components/produits/ProductsGrid.tsx` | 353 | zero in-degree; `/produits` page now renders `ShopComingSoonLanding`; `api/produits/route.ts` documents it as unreferenced keep-guard; emits `products-update` events (listener residues `Nav.tsx:55-67`) | **A** (shop-freeze note) | Yes today, *unless* the SHOP LAUNCH FREEZE intends re-enable — confirm intent before deleting |
| `src/components/produits/ActiveFilters.tsx` | 65 | sole importer = ProductsGrid | **A** (cascade) | Yes (only with ProductsGrid) |
| `src/components/produits/EmptyState.tsx` | 48 | sole importer = ProductsGrid | **A** (cascade) | Yes (only with ProductsGrid) |
| `src/components/produits/SkeletonCard.tsx` | 61 | sole importer = ProductsGrid | **A** (cascade) | Yes (only with ProductsGrid) |
| `src/components/clinic/HomecareBanner.tsx` | 73 | only refs = commented import `(fr)/clinique/wenaya-casablanca/page.tsx:20` + hidden JSX `:86` (`{/* <ClinicHomecareBanner /> - HIDDEN temporarily */}`). EN page: zero mentions | **C** | No — per code comment, hidden only temporarily |
| `src/components/CoursAteliers.tsx` | 221 | zero in-degree; renderer + editor keep it alive by design | **C** | No (`HomepageRenderer.tsx:114-118` + `homepage-editor-fields.ts:123-127` keep intact) |
| `src/components/Pricing.tsx` | 147 | zero in-degree; renderer + editor keep it alive by design | **C** | No (`HomepageRenderer.tsx:109-113` + `homepage-editor-fields.ts:113-116` keep intact) |

Cascade-child files `FilterDropdown`, `ProductCard`, `ProductDetail`, `CartActions`, `lib/format.ts`, `lib/produits.ts` have **other** importers → keep.

---

## 2. Dead API route

| File | Evidence | Category | Safe removal? |
|---|---|---|---|
| `src/app/api/admin/homepage/reorder/route.ts` | grep `homepage/reorder` = **0 hits** repo-wide. `HomepageEditor` reorders client-side (`HomepageEditor.tsx:165-166`) and saves the full config via `PUT /api/admin/homepage` | **A** | Yes (dead route) |
| `reorderSections` in `src/lib/homepage.ts:83` | only consumer = the dead route above | **A** (cascade) | Yes (cascade) |

Note: `GET/PUT /api/admin/homepage`, `/api/admin/homepage/sections/[id]` (DELETE via `HomepageEditor.tsx:117` template literal) are **live** — do NOT touch. `/produits`, `/panier`, `/checkout` redirects in `next.config.ts` are intentional mappings, not dead code.

---

## 3. Dead exports in live files (B)

Verified zero external refs (grep over src + scripts; no dynamic/`import()` hits). "File alive" = file is imported for other symbols.

| File | Fully dead export(s) |
|---|---|
| `src/lib/admin-auth.ts` | `createUser`, `clearAuthCookie` (live: `getUser`, `verifyBcrypt`, `signToken`, `setAuthCookie`). Cascade: `hashPassword` (sole caller = dead `createUser`) |
| `src/lib/availability.ts` | `WEEKDAY_INITIALS` |
| `src/lib/clinic-content.ts` | `clinicFeatures`, `whoStatement`, `clinicPracticalInfo` (file alive via `clinicMetrics` → Trust.tsx) |
| `src/lib/group-sessions-active.ts` | `sanitizeGroupSessionHtml` |
| `src/lib/homepage-types.ts` | `HomepageState` |
| `src/lib/pathologies.ts` | `getPathologyBySlug`, `getAllPathologySlugs` (file alive via `getPathologies` → Pathologies.tsx) |
| `src/lib/patient-auth/profile-dev-fallback.ts` | `PROFILE_DEV_FALLBACK_SOURCE` |
| `src/lib/pratiques.ts` | `PracticeFilterKey` (type) |
| `src/lib/product-adapter.ts` | `getLegacyProductBySlug`, `getProductListItems` (file alive via `getProductBySlug`/`getProducts`/`getAllProductSlugs`) |
| `src/lib/professional-availability-client.ts` | `toIsoDate` — dead and a **duplicate** of `todayIso` (same impl); live exports re-export `todayIso`/`ISO_DATE_RE` at `:136` |
| `src/lib/specialistes.ts` | `getSpecialistBySlug`, `getAllSpecialists`, `getSpecialistsBySpecialty`, `getSpecialistBySlugAsync`. Cascade: `getAllSpecialistsAsync` (sole caller = dead `getSpecialistBySlugAsync`). File alive via `specialists` array + `Specialist` type |

**Total: 21 fully-dead exports + 2 cascade-dead = 23** across 11 live files.

118 other exported symbols are "export-unused-but-internally-used" in their own file (type-only exports such as `IntroLabels`, `CartItem`, `AdminUser`, `SectionContentMap`) → low-value `export`-keyword removal only, **not** dead code.

---

## 4. Registry residues (B — keep by design)

| Location | Note |
|---|---|
| `src/components/homepage/HomepageRenderer.tsx:96-118` | null-returning `case "disease-marquee"` / `"pricing"` / `"cours-ateliers"` with explicit "kept intact" comments. Do **not** flag the renderer; residues are intended |
| `src/lib/homepage-types.ts` sections union (:9,:10,:161,:207) | kept because CMS schema/Redis may still carry those section types |
| `src/lib/homepage-editor-fields.ts:113-127` | `pricing.*` + `coursAteliers.*` `i18nPath` keep those **i18n keys alive** through the editor — never remove the keys while editor-fields reference them |
| `src/components/Nav.tsx:55-67` | `products-update` listener — dispatcher is `ProductsGrid` (A). Harmless but becomes dead residue if `ProductsGrid` is deleted |

---

## 5. i18n dead leaves (B)

| Key | Evidence | Safe removal? |
|---|---|---|
| `diseaseMarquee.voirPlus` (`fr.ts:138`, `en.ts:138`) | **only** dead leaf under `diseaseMarquee`; other keys (badge/heading1/heading2/sub/specialites/services/therapies) consumed by `api/admin/specialties/route.ts:27-32` (`const m = fr.diseaseMarquee`) | **REMOVED in Phase 1** (both locales) |

**Cascade leaves** (survive only via A/C components — remove only with them):
- Deleted-with-`PracticesSection` (A): `homePractices.*` (18 keys ×2 locales) — **REMOVED in Phase 1 with the component**
- Kept-with-`ProductsGrid` (A, NOT removed — shop-adjacent, see §9): `produits.hero.sub`, `produits.hero.title1`, `produits.hero.title2`, `produits.noProducts` — **KEPT**
- Kept-with-`Pricing` (C): `pricing.plan1.badge`
- Kept-with-dormant shop (C): `checkout.*` (6 keys), `panier.checkout/clearCart/continueShopping/empty/emptyDesc/perUnit/remove/subtotal` (8 keys; `panier.title` is ALIVE via Nav)
- **ALIVE (do not flag):** `coursAteliers.*` (5, via editor-fields i18nPath), `pricing.eyebrow/heading1/heading2/sub` (via editor-fields), `produits.count/search/filters.*` (via alive `ProduitsFilterBar` + `ProductDetail`)

---

## 6. Intentional dormant / keep (C)

| Item | Reason |
|---|---|
| `src/components/cart/PanierView.tsx` (160L), `CheckoutView.tsx` (115L) | SHOP LAUNCH FREEZE; panier/checkout pages render `ShopComingSoonNotice` |
| `src/lib/produits.ts` (82L) | documented reference data + RESTORE condition |
| `src/scripts/seed-admin.ts` (62L) | CLI entry (uses bcryptjs directly — confirms `createUser` truly dead) |
| `src/app/api/produits/route.ts` | always-404 guard, documented intent |
| panier/checkout shop pages | redirect-folded by `next.config.ts`, dormant |
| `Pricing.tsx`, `CoursAteliers.tsx`, `HomecareBanner.tsx` | explicit keep/re-enable comments (see §1) |

---

## 7. Category counts

- **A — genuinely dead: 5 files (~1 124 lines) + 1 dead API route + 1 cascade export**
- **B — dead exports: 21 fully-dead + 2 cascade = 23; 1 dead i18n leaf (`voirPlus` ×2); residues (keep): renderer cases, editor-fields refs, Nav listener**
- **C — intentional dormant (keep):** PanierView, CheckoutView, lib/produits, seed-admin, api/produits route, Pricing, CoursAteliers, HomecareBanner + their cascade i18n keys

---

## 8. Smallest safe cleanup set

1. Delete **A** files: `PracticesSection.tsx`, `ProductsGrid.tsx`, `ActiveFilters.tsx`, `EmptyState.tsx`, `SkeletonCard.tsx`.
2. Delete dead route `app/api/admin/homepage/reorder/route.ts` + `reorderSections` (`homepage.ts:83`).
3. Remove `products-update` listener at `Nav.tsx:55-67` (residue of deleted ProductsGrid).
4. Remove the 23 dead exports from §3 (per-file; keep live exports + `todayIso`/`ISO_DATE_RE` re-exports untouched).
5. Remove `diseaseMarquee.voirPlus` (fr + en).
6. Remove cascade i18n keys from §5 tied to A: `homePractices.*` (18×2), `produits.hero.sub/title1/title2`, `produits.noProducts`.
7. **Do NOT touch** (C): `Pricing/CoursAteliers/HomecareBanner/PanierView/CheckoutView`, `lib/produits.ts`, `seed-admin.ts`, `api/produits`, editor-fields, renderer null cases — until intent confirmed.
8. **Open latent defect (separate flag):** `/images/dummy-man.png` broken refs in `src/lib/professionals.ts:28,51` + `src/lib/professionals-detail.ts:45,70` → 404 image. Fix or drop fallback in a follow-up (needs backend fixture or local asset). **→ RESOLVED (verified 2026-10-07):** fallbacks **dropped**, not fixed — both adapters fall back to `""` and consumers render no image; see §9 note.

Expected build impact of set 1-6: zero (all removed symbols unreferenced by live graph; verified via refcheck/imports analyzers).

---

## 9. Execution status (Phase 1 applied — READ-ONLY audit complete → removals EXECUTED, uncommitted)

**Status: this § supersedes the audit-only wording in the header. The safe removals below were applied to the working tree. Nothing committed/pushed.** Gates are green (see below). This documented which planned set-8 items were executed vs deliberately deferred.

**Executed removals:**
- **A-file:** `src/components/PracticesSection.tsx` deleted (whole-file cat A; only A file actually removed).
- **Dead API route + cascade export:** `src/app/api/admin/homepage/reorder/route.ts` deleted; `reorderSections` (`src/lib/homepage.ts:83`) removed (sole consumer was the dead route).
- **Dead exports removed via 14 splice ranges** (script `%TEMP%\opencode\phase1-splice.mjs`, EOL-preserving, abort-on-failure) across 11 live files — the 23 dead exports catalogued in §3 (21 fully-dead + 2 cascade), excluding intentionally-kept live-file symbols:
  - `admin-auth.ts`: `createUser`, `clearAuthCookie`, cascade `hashPassword`.
  - `availability.ts`: `WEEKDAY_INITIALS`.
  - `clinic-content.ts`: `clinicFeatures`, `whoStatement`, `clinicPracticalInfo`.
  - `group-sessions-active.ts`: `sanitizeGroupSessionHtml`.
  - `homepage-types.ts`: `HomepageState`.
  - `pathologies.ts`: `getPathologyBySlug`, `getAllPathologySlugs`.
  - `patient-auth/profile-dev-fallback.ts`: `PROFILE_DEV_FALLBACK_SOURCE`.
  - `pratiques.ts`: `PracticeFilterKey` (type).
  - `product-adapter.ts`: `getLegacyProductBySlug`, `getProductListItems` (kept: `getProductBySlug`/`getProducts`/`getAllProductSlugs` API + import narrowed to `import type { Product }`).
  - `professional-availability-client.ts`: `toIsoDate`.
  - `specialistes.ts`: `getSpecialistBySlug`, `getAllSpecialists`, `getSpecialistsBySpecialty`, `getSpecialistBySlugAsync`, cascade `getAllSpecialistsAsync`.
- **BCRYPT_ROUNDS:** removed from `src/lib/admin-auth.ts` (its own local `BCRYPT_ROUNDS` in `src/scripts/seed-admin.ts:19,56` correctly untouched — CLI-local).
- **i18n leaves:** `diseaseMarquee.voirPlus` ×2 locales + cascade `homePractices.*` (18 keys ×2 locales). NOT removed: `produits.*` cascade (ProductsGrid kept).

**Verification sweeps after splices (Grep over whole `src`, zero matches):** `voirPlus`, `homePractices`, `reorderSections`, `HomepageState`, `sanitizeGroupSessionHtml`, `getSpecialistBySlugAsync`, `getAllSpecialistsAsync`, `toListItem`, `createUser`, `clearAuthCookie`, `hashPassword`, `WEEKDAY_INITIALS`, `clinicFeatures`, `getPathologyBySlug`, `PROFILE_DEV_FALLBACK_SOURCE`, `PracticeFilterKey`, `getSpecialistsBySpecialty`, `getSpecialistBySlug`. Keep-symbols re-confirmed present + referenced: `verifyBcrypt` (admin-auth.ts:31), `decodeEntitiesStripped` (group-sessions-active.ts:99, used :326), `getProducts`/`getProductBySlug`/`getAllProductSlugs` (product-adapter.ts), `todayIso` (availability.ts:89), `PRACTICE_FILTER_KEYS` (pratiques.ts:123).

**Deliberately NOT executed (set-8 items deferred; values unchanged):**
- `ProductsGrid.tsx`, `ActiveFilters.tsx`, `EmptyState.tsx`, `SkeletonCard.tsx` — KEPT (shop-adjacent / listing composables; ProductsGrid belongs to the SHOP FREEZE keep-list, not A-as-removable).
- Nav `products-update` listener (`Nav.tsx:55-67` residue) — harmless, kept (registry residue).
- `produits.hero.sub/title1/title2` + `produits.noProducts` i18n — KEPT with ProductsGrid.
- `dummy-man.png` broken-ref follow-up (set-8 #8) — **RESOLVED (verified 2026-10-07):** the `DUMMY_IMAGE` fallbacks are already absent from the working tree — `src/lib/professionals.ts:48` = `image: pro.avatar || ""` and `src/lib/professionals-detail.ts:67` = `return user.avatar || professional.logo || "";` (git diff vs HEAD proves the removal; whole-repo `dummy-man` grep = 5 doc-only matches, 0 in `src/`, no asset in `public/`). All three consumers guard `{specialist.image && <Image/>}` so an empty image renders nothing. `isRealRemoteImage`'s `!value.includes("dummy")` guard is KEPT — it is a protection rail (the backend still serves `dummy-man.png` as `professional.avatar` for some corporate accounts per the group-sessions report), not a fallback.
- All §6 (C) keep items untouched.

**Gate results (on the splices + deletions):**
- `npx tsc --noEmit` — **clean** (in-build typecheck also clean).
- `npx eslint .` — **5E / 9W, all pre-existing baseline** (5 errors = `CompteClient.tsx` committed `22c40d7`, untouched; warnings: CoursAteliers ×2, ExpertiseSection ×1, Team ×1, CompteClient ×3, ProductsGrid ×2). Zero findings in files touched by Phase 1 (the old `@typescript-eslint/no-unused-vars` BCRYPT_ROUNDS warning is gone).
- `npm run build` — **252 static pages** (clean, kind `.next` first). Page count lower than the 300+ baseline solely because `dev-api.wenaya.com` was unreachable at build time (pre-existing env condition), so API-driven `/professional/[slug]` + `/[article-slug]` params came up short — **no route changes from Phase 1**.
- Prod `npx next start -p 3002` verified serving **200** (retro-check after relaunch).
# Practices Image System — Full Audit (READ-ONLY)

Date: 2026-10-08 · Zero source changes, nothing committed/pushed.
Scope: every image URL the Practices pages render, its source, reachability, and cleanliness class.

> ## ⚠️ CORRECTION 2026-10-09 — this audit's "19/19 reachable" was MASKING-INDUCED
>
> The §2/§3/§4 cleanliness verdict ("All URLs reachable (200)", Class A "19/19", Class D "0 broken") was produced while `practice-adapter.ts` still carried a **`normalizeSpecialityImage` host rewrite** (`https://dev-api.wenaya.com/storage/` → `https://api.wenaya.com/storage/`) that hid the real backend defect. That rewrite was **REMOVED by user direction**, so the adapter is now strict pass-through.
>
> **Ground truth (probe of the live DEV API, 2026-10-09 — `%TEMP%\opencode\practices-dev-images-probe.json` + `practices-prod-storage-probe.mjs`):** of 19 records, **12 serve `nbg1.your-objectstorage.com` URLs (200)**, but **7 serve `https://dev-api.wenaya.com/storage/uploads/specialties/...` URLs that 404 on DEV storage — 14 image URLs (web+mobile) — while the IDENTICAL paths return 200 on `api.wenaya.com/storage`.** The dead-host records: 13 Méditation, 6 Naturopathie, 7 Neuropsychologie, 3 Orthophonie, 11 Psychologie, 2 Psychomotricité, 8 Sexologie. → The "old missing-image hypothesis" was NOT fully disproven; it holds for these 7 records. See `wenaya-practices-dev-discrepancy-report.md` (Addendum) + `wenaya-practices-dev-storage-action.md`.
>
> Treat §2 "All URLs reachable", §3's `normalizeSpecialityImage` descriptions, §4 Class A/D, and §6 fix #3 below as **superseded**. The fix is backend/storage (restore/copy the 14 files to DEV storage at the recorded paths), NOT a frontend rewrite. A regression guard now lives in `scripts/verify-practices-api.mjs` (pass-through test, green 19/19).

---

## 0. FINAL VERDICT (2026-10-09) — authoritative

This supersedes §2/§3/§4/§5/§6 above. Two independent probes + a real-browser audit agree exactly.

**Method (all read-only; DEV-only requests — never prod as a workaround):**
1. **API enumeration + HTTP image probe** — `%TEMP%\opencode\practices-full-audit.mjs` → `practices-full-audit.json`. Walked the DEV paginator (p1=12, p2=7, `total=19`), fetched every `image_web` + `image_mobile` URL with redirects disabled, recorded status / content-type / magic bytes.
2. **Real-browser CDP audit** — `%TEMP%\opencode\practices-grid-cdp-audit.mjs` → `practices-grid-cdp-audit.json`, headless Chrome against a fresh prod build of THIS repo on `:3006` (`WENAYA_API_URL=https://dev-api.wenaya.com`). FR `/pratiques` + EN `/en/pratiques` × desktop 1440×900 + mobile 390×844, full scroll-through to trigger infinite scroll (both pages), probing every `a.pratique-card`, its `next/image` `naturalWidth`, the `/_next/image` optimizer responses, network failures, console errors. Screenshots: `%TEMP%\opencode\practices-audit-shots\{fr,en}-{desktop,mobile}.png`.

**Consistent result across all 4 CDP runs:** **19 cards rendered / 19 expected**, **12 card images render (`naturalWidth>0`)**, and **exactly the 7 `dev-api.wenaya.com/storage/...` records show an EMPTY media area** — because `/_next/image` returns `404 text/plain` for those remote URLs and the card's `onError` hides the `<img>` (no local/demo substitute, by design). **No missing cards, no duplicates, no additional blanks.** FR desktop logged 8 optimizer 404s = 7 unique URLs (one URL was requested twice); the 7 unique broken URLs are identical in every run. `net::ERR_ABORTED` entries are scroll-aborted lazy requests, not real failures.

### Complete per-practice table (19/19)

| id | FR name | EN name | `image_web` URL | web HTTP | `image_mobile` URL | mobile HTTP | Browser | Diagnosis |
|----|---------|---------|-----------------|----------|--------------------|-------------|---------|-----------|
| 2 | Psychomotricité | Psychomotricity | `https://dev-api.wenaya.com/storage/uploads/specialties/65190e7705723-web.png` | 404 | `https://dev-api.wenaya.com/storage/uploads/specialties/65190e7705723-mobile.png` | 404 | BLANK | Broken legacy storage — file absent on DEV |
| 3 | Orthophonie | Speech Therapy | `https://dev-api.wenaya.com/storage/uploads/specialties/65184533392de-web.jpeg` | 404 | `https://dev-api.wenaya.com/storage/uploads/specialties/65184533392de-mobile.jpeg` | 404 | BLANK | Broken legacy storage — file absent on DEV |
| 4 | Kinésithérapie | Kinesitherapie | `https://nbg1.your-objectstorage.com/westo/specialties/images/web/2025/11/23/6923309354d1e.jpg` | 206 JPEG | `.../mobile/2025/11/23/6923309381406.jpg` | 206 JPEG | OK | Healthy (objectstorage) |
| 5 | Nutrition | Nutrition | `.../web/2025/11/23/69232b2016327.jpg` | 206 JPEG | `.../mobile/2025/11/23/69232b203c7c2.jpg` | 206 JPEG | OK | Healthy (objectstorage) |
| 6 | Naturopathie | Naturopathie | `https://dev-api.wenaya.com/storage/uploads/specialties/651847dacdd0b-web.jpeg` | 404 | `.../651847dacdd0b-mobile.jpeg` | 404 | BLANK | Broken legacy storage — file absent on DEV |
| 7 | Neuropsychologie | Neuropsychologie | `https://dev-api.wenaya.com/storage/uploads/specialties/65191db386825-web.png` | 404 | `.../65191db386825-mobile.png` | 404 | BLANK | Broken legacy storage — file absent on DEV |
| 8 | Sexologie | Sexologie | `https://dev-api.wenaya.com/storage/uploads/specialties/6519d664eddb3-web.png` | 404 | `.../6519d664eddb3-mobile.png` | 404 | BLANK | Broken legacy storage — file absent on DEV |
| 9 | Cupping therapy-Hijama | Cupping therapy-Hijama | `.../web/2025/11/23/6923327178f4a.jpg` | 206 JPEG | `.../mobile/2025/11/23/692332718f77e.jpg` | 206 JPEG | OK | Healthy (objectstorage) |
| 11 | Psychologie | Psychology | `https://dev-api.wenaya.com/storage/uploads/specialties/6519db2bbb6b9-web.png` | 404 | `.../6519db2bbb6b9-mobile.png` | 404 | BLANK | Broken legacy storage — file absent on DEV |
| 12 | Yoga | Yoga | `.../web/2025/11/23/6923281154107.jpg` | 206 JPEG | `.../mobile/2025/11/23/692328125d151.jpg` | 206 JPEG | OK | Healthy (objectstorage) |
| 13 | Méditation | Meditation | `https://dev-api.wenaya.com/storage/uploads/specialties/651923ee355cc-web.png` | 404 | `.../651923ee355cc-mobile.png` | 404 | BLANK | Broken legacy storage — file absent on DEV |
| 14 | Psychothérapie | Psychothérapie | `.../web/2026/02/17/6994ad2b6a5fd.jpg` | 206 JPEG | `.../mobile/2026/02/17/6994ad42df9df.jpg` | 206 JPEG | OK | Healthy (objectstorage) |
| 16 | Massothérapie | Massothérapie | `.../web/2025/11/23/69233102ca267.jpg` | 206 JPEG | `.../mobile/2025/11/23/69233104cda7f.jpg` | 206 JPEG | OK | Healthy (objectstorage) |
| 18 | Art Martial Thérapie | Art Martial Thérapie | `.../web/2025/11/23/69232aa9038bf.jpg` | 206 JPEG | `.../mobile/2025/11/23/69232aadc59dd.jpg` | 206 JPEG | OK | Healthy (objectstorage) |
| 22 | Ostéopathie | Osteopathie | `.../web/2025/11/23/69232a602c1b8.jpg` | 206 JPEG | `.../mobile/2025/11/23/69232a6168589.jpg` | 206 JPEG | OK | Healthy (objectstorage) |
| 23 | Sono-thérapie | Sound Healing | `.../web/2025/11/23/692329a0ce7c7.jpg` | 206 JPEG | `.../mobile/2025/11/23/692329a0f072e.jpg` | 206 JPEG | OK | Healthy (objectstorage) |
| 24 | Coaching Sportif | Sport Coaching | `.../web/2025/12/02/692efb3e6e0cb.jpg` | 206 JPEG | `.../mobile/2025/12/02/692efb3f329f6.jpg` | 206 JPEG | OK | Healthy (objectstorage) |
| 25 | Sophrologie | Sophrology | `.../web/2026/02/16/699373dd84272.jpg` | 206 JPEG | `.../mobile/2026/02/16/699373de54a09.jpg` | 206 JPEG | OK | Healthy (objectstorage) |
| 26 | Infirmerie | Nursing | `.../web/2026/02/22/699b1515dce4d.jpg` | 206 JPEG | `.../mobile/2026/02/22/699b1516b344b.jpg` | 206 JPEG | OK | Healthy (objectstorage) |

`.../` in the objectstorage rows expands to `https://nbg1.your-objectstorage.com/westo/specialties/images/`. All objectstorage URLs responded `206` (range) `image/jpeg` with a valid JPEG magic — reachable and valid. All dev-api URLs responded `404` `text/html; charset=UTF-8` (an HTML error body, not an image).

### Evidence-based totals

| Metric | Value |
|--------|-------|
| Practices (records) | **19** |
| Unique image URLs (web + mobile) | **38** |
| Reachable + valid images | **24** (12 records × 2) — all on `nbg1.your-objectstorage.com` |
| Broken URLs (404, not an image) | **14** (7 records × 2) — all on `dev-api.wenaya.com/storage/uploads/specialties/` |
| **Broken records (empty media area in browser)** | **7** — ids **2, 3, 6, 7, 8, 11, 13** |
| Empty/missing `image_web`/`image_mobile` fields | **0** |
| Duplicate image URLs | **0** |
| Redirects on any image URL | **0** |
| Cards rendered / expected (CDP) | **19 / 19** (both locales, desktop + mobile) |
| Cards with rendered image (CDP) | **12 / 19** |
| Missing cards | **0** |
| Duplicated cards | **0** |

**Confirmed findings (the 7 broken records):** each points to legacy `dev-api.wenaya.com/storage/...` paths; the 14 files are **absent on DEV storage (404)** while the **identical paths return 200 on prod storage** → diagnose as a DEV storage-migration gap, NOT a frontend/host bug. Fix belongs in backend/storage (restore the 14 files to DEV, or migrate the 7 records to the `nbg1.your-objectstorage.com` scheme). Backend action: `wenaya-practices-dev-storage-action.md`.

**Contrast with the original §2/§4 verdict:** the old "19/19 reachable / 0 broken" was produced while the adapter still carried a `dev-api.../storage/ → api.wenaya.com/storage/` rewrite that masked the defect. With the rewrite removed (strict pass-through) the real browser confirms **12/19 render, 7 blank — exactly these 7 records**; there is no other missing/broken/duplicated/incorrect/blank image on either locale at any of the four audited viewports.

---

## 1. Surfaces inventory

| # | Surface | Renders | Source | Verification |
|---|---------|---------|--------|--------------|
| S1 | `/pratiques` + `/en/pratiques` listing | 12 card `image_web` URLs | Live API only (`PratiquesGrid` ← `getPracticesPageAsync` ← `practices-api` + `practice-adapter`) | SSR probe **10/10** |
| S2 | `/pratiques/[slug]` + `/en/pratiques/[slug]` detail | 1 local editorial hero + objectstorage business logo + (some) dev-api avatar | `practice-content.ts` `image` via `PratiqueDetail`; logos/avatars from API-linked records | SSR probe **6/6** |
| S3 | Clinic `/about-us` + `/en/about-us` "Nos Pratiques" explorer | 8 API images, existence-filtered | `getLivePratiques` (API only, never local) → `PratiquesExplorer` | prior read confirmed |
| S4 | Homepage `/` + `/en` | **none** | Section removed 09-14 (homepage restructure) | glob + grep: zero `PracticesSection.tsx`, zero `homePractices` |

## 2. API image contract (all 19 specialties)

- `GET https://dev-api.wenaya.com/api/v1/getAllPublicSpecialitiesWithPaginate` → 19 records, 2 pages (12+7).
- **All 19** `is_visible=true` AND carry BOTH `image_web` + `image_mobile` (no null/dangling `image_web` — the old "missing image on listing" hypothesis is disproven).
- All URLs reachable (200) and inside `next.config.ts` remotePatterns (`nbg1.your-objectstorage.com` 12×, `api.wenaya.com` 7× via `/storage`, `dev-api.wenaya.com` only avatar/logos on detail pages).
- Rendered host set on BOTH locales of the listing (script-stripped SSR): `{ nbg1.your-objectstorage.com, api.wenaya.com }` only.

## 3. Responsible code (exact)

- **Listing image selection:** `src/lib/practice-adapter.ts:165` — `normalizeSpecialityImage(firstNonEmpty(api.image_web, api.image_mobile) ?? "")`. Strict API-only; **deliberately no local fallback** (doc block lines 151–156): empty ⇒ grid renders an empty image area (`PratiquesGrid` `onError` hides, never substitutes).
- **Host rewrite:** `normalizeSpecialityImage` (practice-adapter.ts) — `https://dev-api.wenaya.com/storage/` → `https://api.wenaya.com/storage/` (dev storage 404s, prod serves 200 same path). Non-hardcoded, per-record.
- **Listing proxy:** `getPracticesPageAsync` `src/lib/pratiques.ts:221` (native backend pagination p1→12, p2→7; `emptyPracticesPage` on failure — honest empty state).
- **Detail hero:** `src/lib/pratiques.ts:101` (`image: content.image` from `practice-content.ts`) rendered by `PratiqueDetail.tsx:125-132` unguarded `<Image src={pratique.image} fill priority sizes="100vw">`. Local by design; all 19 files exist under `public/pratiques/`.
- **Clinic explorer:** `getLivePratiques` `src/lib/pratiques.ts:298` (API only, `[]` on failure), curated 8-discipline subset + `psychologie` → `/pratiques/psychotherapie.jpg` substitute (`clinic/Practices.tsx`).
- **Homepage:** no code — section deleted 09-14 across Redis/renderer/fallback; the only leftover is a stale admin note `src/components/admin/HomepageEditor.tsx:438-443`.

## 4. Classification (A/B/C/D)

| Class | Meaning | Result |
|-------|---------|--------|
| **A** | API supplies usable image, renders | **19/19** listing images (both `image_web`+`image_mobile` present, reachable, pattern-allowed) |
| **B** | Local editorial image used by design | 19 detail heroes — all files exist on disk (no 404-on-disk) |
| **C** | Static fallback / duplicate / non-API | none on listing (fallback is hard-blocked by design) |
| **D** | Missing / broken at render | **0** (both locales, all 38 SSR pages probed; optimizer 200 on sample URLs) |

## 5. Findings

1. No broken or missing practice image renders anywhere today (SSR-verified).
2. The one visible 404s on the site's professional pages (rose-mavoungou, amira-naji, ghita-el-moubariky avatars) are **backend data**, not practice images — out of scope, previously documented.
3. `PratiqueDetail.tsx:125-132` is the only **unguarded** local image (`<Image fill priority>` with no existence guard). It never fails today (files on disk), but would throw on a missing asset. Candidate hardening, not a bug.
4. Detected nuance: detail pages also render objectstorage **business logos** and a `dev-api.wenaya.com` **avatar** (`/pratiques/yoga`). `dev-api.wenaya.com` is allowed by remotePatterns; the `/storage` variant of that host is NOT rewritten (only prod `/storage` is the rewrite target) — avatar happens to serve 200.

## 6. Cleanup plan (no-op today; optional hardening)

| Priority | Action | Effort |
|----------|--------|--------|
| P3 | Nothing to fix — audit closes clean. | — |
| P2 (optional) | Guard `PratiqueDetail` hero with `{pratique.image && <Image/>}` (mirror `SpecialistListItem` consumer pattern). | 2 lines |
| P3 (optional) | If `dev-api.wenaya.com` /storage avatar 404s appear, extend `normalizeSpecialityImage`'s rewrite to that host too. | 1 line |
| P0 (backend note) | Fix the 3 deleted professional avatars server-side; frontend already guards them. | backend |

## 7. Evidence

- `%TEMP%\opencode\practice-images-audit.mjs` — 19-record API scan (both image fields, reachability, remotePatterns).
- `%TEMP%\opencode\practice-ssr-qa.mjs` — listing SSR probe **10/10** (FR+EN).
- `%TEMP%\opencode\practice-detail-qa.mjs` — detail SSR probe **6/6** (FR+EN).
- Shots: `%TEMP%\opencode\practice-ssr-shots\ssr-summary.json`, `detail-summary.json`.

Gates: read-only — no tsc/eslint/build run (zero tree changes).
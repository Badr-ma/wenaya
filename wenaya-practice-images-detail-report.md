# Practice detail pages — dev-API-only image enforcement (report)

**Scope:** `/pratiques/[slug]` + `/en/pratiques/[slug]` (19 practices × FR/EN).
**Rule:** display practice images ONLY from the DEV API (`image_web` / `image_mobile` on `https://dev-api.wenaya.com`), preserve API URLs unchanged, never substitute a local static image; when the API field is empty or the image fails, hide it cleanly and keep the frame.
**Status:** implemented + SSR-verified + real-browser verified. NOT committed/pushed.

---

## 1. What changed

| File | Change |
|------|--------|
| `src/components/pratiques/PracticeHeroImage.tsx` | **NEW** client wrapper — `<Image fill priority>` with `onError` → returns `null`; never renders a broken `<img>`. |
| `src/components/pratiques/PratiqueDetail.tsx` | Hero now uses `PracticeHeroImage` inside the navy frame `relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden rounded-2xl bg-[#0B1220]` (L124). No more `next/image` with a local `pratique.image`. |
| `src/app/(fr)/pratiques/[slug]/page.tsx` | Overrides the local image with `getLivePracticeImageMap("fr")[slug]`; `revalidate = 3600`; conditional OG/Twitter image; conditional JSON-LD image. |
| `src/app/(en)/en/pratiques/[slug]/page.tsx` | Same, locale `"en"`. |
| `src/lib/practice-images.ts` | `getLivePracticeImageMap(locale)` — iterates `getLivePratiques`, keeps only non-empty API images, returns `{}` on any failure. |

Root cause fixed: detail pages previously used `getPratiqueBySlug()` → local `practice-content.ts` (`content.image = /pratiques/*.jpg`).

---

## 2. Per-practice inventory (rendered source, FR == EN)

All 19 practice detail pages were fetched from the running server and their hero `<img>` traced to the underlying API URL, which was then fetched directly.

| id | slug | page | source | api image | http |
|----|------|------|--------|-----------|------|
| 2 | psychomotricite | 200 | API | https://dev-api.wenaya.com/storage/uploads/specialties/65190e7705723-web.png | **404** |
| 3 | orthophonie | 200 | API | https://dev-api.wenaya.com/storage/uploads/specialties/65184533392de-web.jpeg | **404** |
| 4 | kinesitherapie | 200 | API | https://nbg1.your-objectstorage.com/westo/specialties/images/web/2025/11/23/6923309354d1e.jpg | 200 |
| 5 | nutrition | 200 | API | https://nbg1.your-objectstorage.com/westo/specialties/images/web/2025/11/23/69232b2016327.jpg | 200 |
| 6 | naturopathie | 200 | API | https://dev-api.wenaya.com/storage/uploads/specialties/651847dacdd0b-web.jpeg | **404** |
| 7 | neuropsychologie | 200 | API | https://dev-api.wenaya.com/storage/uploads/specialties/65191db386825-web.png | **404** |
| 8 | sexologie | 200 | API | https://dev-api.wenaya.com/storage/uploads/specialties/6519d664eddb3-web.png | **404** |
| 9 | cupping-therapy-hijama | 200 | API | https://nbg1.your-objectstorage.com/westo/specialties/images/web/2025/11/23/6923327178f4a.jpg | 200 |
| 11 | psychologie | 200 | API | https://dev-api.wenaya.com/storage/uploads/specialties/6519db2bbb6b9-web.png | **404** |
| 12 | yoga | 200 | API | https://nbg1.your-objectstorage.com/westo/specialties/images/web/2025/11/23/6923281154107.jpg | 200 |
| 13 | meditation | 200 | API | https://dev-api.wenaya.com/storage/uploads/specialties/651923ee355cc-web.png | **404** |
| 14 | psychotherapie | 200 | API | https://nbg1.your-objectstorage.com/westo/specialties/images/web/2026/02/17/6994ad2b6a5fd.jpg | 200 |
| 16 | massotherapie | 200 | API | https://nbg1.your-objectstorage.com/westo/specialties/images/web/2025/11/23/69233102ca267.jpg | 200 |
| 18 | art-martial-therapie | 200 | API | https://nbg1.your-objectstorage.com/westo/specialties/images/web/2025/11/23/69232aa9038bf.jpg | 200 |
| 22 | osteopathie | 200 | API | https://nbg1.your-objectstorage.com/westo/specialties/images/web/2025/11/23/69232a602c1b8.jpg | 200 |
| 23 | sono-therapie | 200 | API | https://nbg1.your-objectstorage.com/westo/specialties/images/web/2025/11/23/692329a0ce7c7.jpg | 200 |
| 24 | coaching-sportif | 200 | API | https://nbg1.your-objectstorage.com/westo/specialties/images/web/2025/12/02/692efb3e6e0cb.jpg | 200 |
| 25 | sophrologie | 200 | API | https://nbg1.your-objectstorage.com/westo/specialties/images/web/2026/02/16/699373dd84272.jpg | 200 |
| 26 | infirmerie | 200 | API | https://nbg1.your-objectstorage.com/westo/specialties/images/web/2026/02/22/699b1515dce4d.jpg | 200 |

**Totals:** 19/19 source from the API · 0 local fallbacks · 12 healthy (200) · 7 broken (404).

**Rule satisfied:** every rendered hero image is the unmodified dev-API URL. No `/pratiques/*.jpg` appears as an `<img src>` on any detail page.

---

## 3. Broken-image root cause (backend, not frontend)

The 7 broken records all point at the **legacy path** `dev-api.wenaya.com/storage/uploads/specialties/<hash>-web.{png,jpeg}`; every healthy record points at the **new object-storage path** `nbg1.your-objectstorage.com/westo/specialties/images/web/...`. The legacy storage migration left those 7 files missing on the origin → 404. Frontend behavior is correct: `PracticeHeroImage.onError` hides the `<img>`, leaving the navy frame (`#0B1220`) — no broken image, no placeholder substitution.

**Flag for backend/Jamal:** re-upload the 7 legacy specialty images (ids 2, 3, 6, 7, 8, 11, 13) to the object-storage path and update `image_web`/`image_mobile` accordingly.

---

## 4. Verification

- **Inventory probe** (`pdc-inventory.mjs`): 19/19 pages 200; 0 local sources; per-image HTTP status above.
- **SSR hero probe** (`pdc-hero-qa.mjs`): **48/48 PASS** — no local `/pratiques` image in any FR/EN detail hero; healthy practices' heroes source from dev-api/objectstorage; FR/EN 200; single `<h1>`; navy frame present.
- **CDP real-browser** (`pdc-detail-cdp.mjs`, headless Edge): **96/96 PASS** — healthy practices render exactly 1 hero `<img>` (h≈549) in the navy frame; broken practices render 0 visible/broken images with the navy frame retained; 0 broken visible images.
- **API contract** (`npm run verify:api`): **19/19 PASS** including "API image URLs pass through UNCHANGED" and "backend down → honest empty page".

## 5. Gates

`npx tsc --noEmit` clean · eslint clean on the 5 touched files · `npm run build` success (346 static pages) · `npm run verify:api` 19/19.

## 6. Remaining

- User pixel QA of the empty navy hero on the 7 broken practices at 1440/768/390 (intended look).
- Backend: fix the 7 legacy image URLs (section 3).

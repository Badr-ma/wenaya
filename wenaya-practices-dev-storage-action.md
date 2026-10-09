# Wenaya Practices — DEV storage action (backend fix request)

Date: 2026-10-09 · Read-only investigation; no frontend behaviour change required.
Owner: backend / infrastructure (DEV storage + database).
Related: `wenaya-practices-dev-discrepancy-report.md` (Addendum 2026-10-09), `wenaya-practices-images-audit.md` (Correction 2026-10-09).

---

## 1. Problem (one line)

7 of the 19 live practices returned by the DEV API reference specialty images on
`https://dev-api.wenaya.com/storage/uploads/specialties/...` that **404 on DEV**, while the
**identical paths return 200 on prod** (`https://api.wenaya.com/storage/...`). The other 12
records already serve images from the new objectstorage host and are healthy.

So the files exist on prod but are missing on DEV — a **backend data/storage defect**, not a
frontend bug. The frontend adapter is strict pass-through (no dev→prod rewrite) and correctly
renders an empty image area for the 7 broken records (no broken-image icon, no fabricated URL).

## 2. Evidence

- DEV API population probe: `%TEMP%\opencode\practices-dev-images-probe.mjs` → `.json`
  (`GET https://dev-api.wenaya.com/api/v1/getAllPublicSpecialitiesWithPaginate`, 19 records / 2 pages).
  - Result: **12 records OK on `nbg1.your-objectstorage.com`**, **7 records → 404 on `dev-api.wenaya.com/storage/uploads/specialties/`**.
  - `storageUrlsOnDev.ok = 0`, `storageUrlsOnDev.broken = 14` (7 records × web+mobile).
- Prod-storage probe: `%TEMP%\opencode\practices-prod-storage-probe.mjs`
  - All **14/14 broken DEV paths return 200 on `api.wenaya.com/storage`** at the identical path.

## 3. Exact missing assets (14 files / 7 records)

All DEV URLs below 404; the prod URL is the **same path** on `https://api.wenaya.com`.

| id | Practice | Object name (under `storage/uploads/specialties/`) | Ext |
|----|----------|----------------------------------------------------|-----|
| 13 | Méditation | `651923ee355cc-web.png` / `651923ee355cc-mobile.png` | png |
| 6 | Naturopathie | `651847dacdd0b-web.jpeg` / `651847dacdd0b-mobile.jpeg` | jpeg |
| 7 | Neuropsychologie | `65191db386825-web.png` / `65191db386825-mobile.png` | png |
| 3 | Orthophonie | `65184533392de-web.jpeg` / `65184533392de-mobile.jpeg` | jpeg |
| 11 | Psychologie | `6519db2bbb6b9-web.png` / `6519db2bbb6b9-mobile.png` | png |
| 2 | Psychomotricité | `65190e7705723-web.png` / `65190e7705723-mobile.png` | png |
| 8 | Sexologie | `6519d664eddb3-web.png` / `6519d664eddb3-mobile.png` | png |

## 4. Fix options

**Option A — minimal restore (fast, unblocks DEV).**
Copy the 14 files from prod storage into DEV storage at the exact same relative paths
(`storage/uploads/specialties/<hash>-<variant>.<ext>`). No DB change, no API change. The existing
records then resolve on DEV immediately.

**Option B — migrate to the new objectstorage scheme (preferred, durable).**
Re-upload the 7 records' images to objectstorage like the healthy 12 and update
`image_web` / `image_mobile` in the `specialties` table to the new
`https://nbg1.your-objectstorage.com/westo/specialties/images/{web|mobile}/...` URLs. This removes
the two competing storage schemes and prevents recurrence. Requires a DB write.

> Note: the 7 broken records are the only ones still on the **legacy `/storage/uploads/` scheme**;
> the other 12 were already migrated to objectstorage. Option B is the scheme-consistent fix.

## 5. Acceptance check

Re-run `practices-dev-images-probe.mjs` against DEV and confirm
`brokenRecords = 0` and `storageUrlsOnDev.ok = 14` (or 0 legacy URLs if Option B is taken), i.e.
every one of the 19 records' `image_web` and `image_mobile` returns 200.

## 6. Frontend status (no work needed)

- `src/lib/practice-adapter.ts` is pass-through: `firstNonEmpty(api.image_web, api.image_mobile) ?? ""`.
- `PratiquesGrid` `onError` hides an image that fails — a broken record shows an empty area, never a broken-image icon.
- Regression guard: `scripts/verify-practices-api.mjs`, test
  "adapter: API image URLs pass through UNCHANGED — no host rewriting to api.wenaya.com" (green 19/19).

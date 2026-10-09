# Wenaya — Practices listing images: live DEV deployed-site vs API discrepancy report

Date: 2026-10-09 (follow-up to `wenaya-practices-images-audit.md`). READ-ONLY investigation — **no source changes, no commit/push, no workaround.** All probe scripts live under `%TEMP%\opencode\`.

---

## TL;DR — root cause

Some practice cards on the **deployed** `https://dev.wenaya.com/pratiques?page=1` render **without an image** because:

1. **Layer A — API serves dead URLs.** The DEV API (`dev-api.wenaya.com`) returns `image_web`/`image_mobile` pointing at `https://dev-api.wenaya.com/storage/uploads/specialties/...` for **7 of the 19 practices**, and those files **no longer exist on that host (HTTP 404)**. The same files DO exist at `https://api.wenaya.com/storage/uploads/specialties/...` (verified HTTP 206), i.e. the images were migrated to the `api.wenaya.com/storage` bucket but the API records still reference the dead dev-api host.
2. **Layer C — the deployed site is NOT the current local code.** `dev.wenaya.com` is running a **legacy Next.js Pages-router build** (build id `7uCao7CTswJgO0YZuIXMF`, chunk layout `_next/static/chunks/pages/_app-…`), whereas the local repo is **App-router** (`src/app/...`, local build id `KuUFYORoyYTPunfHX9CoR`). The deployed card component passes `image_web` **verbatim** into `next/image` — it has **no `normalizeSpecialityImage` rewrite** (`dev-api.wenaya.com/storage/` → `api.wenaya.com/storage/`) and **no `image_mobile` fallback** (both exist in the local `practice-adapter.ts:165`). So the dead URL reaches the optimizer → 404 → broken `<img>`.
3. **Why the prior audit showed 19/19 OK:** the local audit ran against the **local** SSR build, whose adapter rewrites the host — masking the same backend data problem. The deployed old build has no such masking layer.

**Not at fault:** layer D (Next/Image optimizer — correctly returns 404 when upstream is 404; returns 200 for objectstorage URLs), layer E (remotePatterns — `dev-api.wenaya.com` IS allowed and objectstorage 200s prove config is fine), layer F (CSS/layout), layer G (cache — API is `Cache-Control: no-cache, private`, no CDN involved).

## Addendum 2026-10-09 — probe verdict + adapter now pass-through (supersedes Layer B and fix #2 below)

Following this report, the local adapter was changed **by user direction**: `normalizeSpecialityImage` (the dev→prod host rewrite) was **REMOVED** from `src/lib/practice-adapter.ts:152` (now `firstNonEmpty(api.image_web, api.image_mobile) ?? ""` — strict pass-through, no host rewriting, no prod dependence). Consequently the below claims marked accordingly are superseded:

- **Layer B / §6 fix #2 are now OBSOLETE.** The local adapter no longer masks the backend data problem, so "deploy the current local code" would **not** fix the 7 records. The ONLY complete fix is **§6 fix #1 (backend data/storage)**.
- **Probe verdict (2026-10-09, `%TEMP%\opencode\practices-dev-images-probe.json` + `practices-prod-storage-probe.mjs`):** across all 19 live records, **14 image URLs (7 records)** point at `https://dev-api.wenaya.com/storage/uploads/specialties/<hash>-<web|mobile>.<ext>` and **all 14 return 404 on DEV storage while the IDENTICAL paths return 200 (206) on `api.wenaya.com/storage`**. The 12 objectstorage records are 200 both-sides. → Root cause is storage/DB: the 14 files exist on PROD storage but are missing (or not served) on DEV storage; the API records still reference the dead dev host. No path change needed — restore/copy the 14 files to DEV storage. See `wenaya-practices-dev-storage-action.md`.
- **The prior audit's "19/19 reachable" was masking-induced** — it probed local SSR output produced while the adapter still carried the rewrite. Post-removal, the audit's §2/§3 conclusions at that date are superseded by this probe.
- **Regression guard added:** `scripts/verify-practices-api.mjs` (new adapter test "API image URLs pass through UNCHANGED — no host rewriting to api.wenaya.com", green 19/19) asserts both a `dev-api.wenaya.com/storage/...` URL and an objectstorage URL survive `normalizeApiSpeciality` byte-identical and never force the prod host.

---

## 1. Same-code check: deployed vs local

| | Deployed `dev.wenaya.com` | Local repo |
|---|---|---|
| Router | **Pages-router** (`/_next/static/chunks/pages/_app-c7e2567d…js`, `…/pages/pratiques-784e718a….js`) | **App-router** (`src/app/(fr)/pratiques/`) |
| Build id | `7uCao7CTswJgO0YZuIXMF` | `KuUFYORoyYTPunfHX9CoR` |
| Card image prop | `image: e.image_web` passed straight to `next/image` | `normalizeSpecialityImage(firstNonEmpty(image_web, image_mobile))` (practice-adapter.ts:165) |
| API base | `https://dev-api.wenaya.com/` (axios, `dl-4960-…chunk` line: `baseURL:"https://dev-api.wenaya.com/"`) | `https://dev-api.wenaya.com` (`.env.local`) |
| Endpoint | `/api/v1/getAllPublicSpecialitiesWithPaginate?page=1` | same |

**Conclusion: `dev.wenaya.com` is NOT running the code currently present locally.** It is an older Pages-router deployment that predates the App-router migration and the adapter rewrite.

## 2. Rendered-cards matrix (live deployed page)

Captured with CDP (headless Edge, port 9260/9261) against `https://dev.wenaya.com/pratiques?page=1` → 12 rendered `<a>` cards. `next/image` served at `w=640&q=75`.

| # | href (slug) | id | API `image_web` | Rendered status | natural W×H | Result |
|---|---|---|---|---|---|---|
| 1 | kin%C3%A9sith%C3%A9rapie | 4 | `nbg1.your-objectstorage.com/westo/specialties/images/web/2025/11/23/6923309354d1e.jpg` | 200 | 640×316 | OK |
| 2 | massoth%C3%A9rapie | 16 | `…/massothérapie…/69233102ca267.jpg` (objectstorage) | 200 | 640×427 | OK |
| 3 | sophrologie | 25 | `…/sophrologie…/699373dd84272.jpg` (objectstorage) | 200 | 640×428 | OK |
| 4 | cupping-therapy-hijama | 9 | `…/6923327178f4a.jpg` (objectstorage) | 200 | 640×427 | OK |
| 5 | osteopathie | 22 | `…/69232a602c1b8.jpg` (objectstorage) | 200 | 640×427 | OK |
| 6 | **psychologie** | 11 | `https://dev-api.wenaya.com/storage/uploads/specialties/6519db2bbb6b9-web.png` | **404** | **0×0** | **BROKEN** |
| 7 | **neuropsychologie** | 7 | `https://dev-api.wenaya.com/storage/uploads/specialties/65191db386825-web.png` | **404** | **0×0** | **BROKEN** |
| 8 | **sexologie** | 8 | `https://dev-api.wenaya.com/storage/uploads/specialties/6519d664eddb3-web.png` | **404** | **0×0** | **BROKEN** |
| 9 | **psychomotricit%C3%A9** | 2 | `https://dev-api.wenaya.com/storage/uploads/specialties/65190e7705723-web.png` | **404** | **0×0** | **BROKEN** |
| 10 | **orthophonie** | 3 | `https://dev-api.wenaya.com/storage/uploads/specialties/65184533392de-web.jpeg` | **404** | **0×0** | **BROKEN** |
| 11 | coaching-sportif | 24 | `…/692efb3e6e0cb.jpg` (objectstorage) | 200 | 640×360 | OK |
| 12 | **naturopathie** | 6 | `https://dev-api.wenaya.com/storage/uploads/specialties/651847dacdd0b-web.jpeg` | **404** | **0×0** | **BROKEN** |

Network-level confirmation (via CDP `Network.responseReceived`): 6× `200` objectstorage `/_next/image` responses, 6× `404` dev-api `/_next/image` responses, 0 console exceptions. Broken `<img>` state: `{complete:true, naturalWidth:0, broken:true}`.

**6 of 12 rendered cards are broken on the deployed site** — exactly those whose `image_web` targets `dev-api.wenaya.com/storage`.

> Caveat (data variance): the rendered DOM set is not identical to the canonical current `page=1` — it includes page-2 records (psychologie/sexologie/psychomotricité/sophrologie) and omits some page-1 records (art-martial/infirmerie/m%C3%A9ditation/nutrition). The DEV API is **live and mutable** (its data changed between the initial CDP capture and the later curls; the page-context fetch a minute earlier returned the canonical 12). This ordering drift does NOT affect the conclusion: across **all 19 API records**, the 7 with `dev-api.wenaya.com/storage` image URLs all 404, the 12 with objectstorage URLs all load.

## 3. Full API population check (all 19)

| id | name | image_web host | raw GET | rendered |
|---|---|---|---|---|
| 18 | Art Martial Thérapie | objectstorage | 206 | OK |
| 24 | Coaching Sportif | objectstorage | 206 | OK |
| 9 | Cupping therapy-Hijama | objectstorage | 206 | OK |
| 26 | Infirmerie | objectstorage | 206 | OK |
| 4 | Kinésithérapie | objectstorage | 206 | OK |
| 16 | Massothérapie | objectstorage | 206 | OK |
| 13 | **Méditation** | **dev-api.wenaya.com/storage** | **404** | BROKEN |
| 6 | **Naturopathie** | **dev-api.wenaya.com/storage** | **404** | BROKEN |
| 7 | **Neuropsychologie** | **dev-api.wenaya.com/storage** | **404** | BROKEN |
| 5 | Nutrition | objectstorage | 206 | OK |
| 3 | **Orthophonie** | **dev-api.wenaya.com/storage** | **404** | BROKEN |
| 22 | Ostéopathie | objectstorage | 206 | OK |
| 11 | **Psychologie** | **dev-api.wenaya.com/storage** | **404** | BROKEN |
| 2 | **Psychomotricité** | **dev-api.wenaya.com/storage** | **404** | BROKEN |
| 14 | Psychothérapie | objectstorage | 206 | OK |
| 8 | **Sexologie** | **dev-api.wenaya.com/storage** | **404** | BROKEN |
| 23 | Sono-thérapie | objectstorage | 206 | OK |
| 25 | Sophrologie | objectstorage | 206 | OK |
| 12 | Yoga | objectstorage | 206 | OK |

**7/19 broken on the API side; 12/19 fine.**

## 4. Why the files 404 on dev-api but exist on api.wenaya.com

Verified HEAD/GET with `Range: bytes=0-0` on the 4 audit-representative files:

| file | `dev-api.wenaya.com/storage` | `api.wenaya.com/storage` |
|---|---|---|
| `651923ee355cc-web.png` (Méditation) | 404 | 206 |
| `651847dacdd0b-web.jpeg` (Naturopathie) | 404 | 206 |
| `65191db386825-web.png` (Neuropsychologie) | 404 | 206 |
| `65184533392de-web.jpeg` (Orthophonie) | 404 | 206 |

And through the deployed optimizer: `/_next/image?url=<dev-api…>&w=640&q=75` → **404**; `/_next/image?url=<objectstorage…>&w=640&q=75` → **200**. → The migration moved the files to `api.wenaya.com/storage`; the dev API records were never updated, and the deployed old build has no host-rewrite to compensate.

## 5. Layer attribution (requested A–G)

- **A — API: ROOT CAUSE.** Returns `image_web`/`image_mobile` pointing at dead `dev-api.wenaya.com/storage` URLs for 7/19 records.
- **B — practice-adapter:** local adapter (practice-adapter.ts:165) rewrites the host → masks the API issue locally. The deployed build contains no such adapter logic.
- **C — deployed frontend build: CONTRIBUTING (same-code mismatch).** dev.wenaya.com runs a legacy Pages-router build (build id `7uCao7CTswJgO0YZuIXMF`) ≠ local App-router code (`KuUFYORoyYTPunfHX9CoR`); passes `image_web` raw, no fallback.
- **D — Next/Image optimizer:** not at fault (404 passthrough is correct behavior).
- **E — remotePatterns/config:** not at fault (dev-api host IS allowed; objectstorage 200 proves config).
- **F — CSS/layout:** not at fault.
- **G — stale deployment/cache:** the deployed build is stale relative to local code (different router + build id), but the API response itself is `no-cache` — no CDN cache factor.

## 6. Recommended fix (no action taken)

1. **P0 — API data fix (backend, not this repo):** update the 7 records' `image_web`/`image_mobile` in the DEV API to `https://api.wenaya.com/storage/uploads/specialties/<hash>-web/mobile.<ext>` (files verified present, 206). This fixes the root cause for any consumer.
2. **P0 — deployment:** deploy the **current local App-router code** to `dev.wenaya.com` (it carries `normalizeSpecialityImage` dev-api→api rewrite + `image_mobile` fallback, so the same API records render correctly without a backend change). This also resolves the "deployed ≠ local" mismatch.
3. **P1 — hardening (already noted in prior audit, still optional):** none required once (1) or (2) lands; local adapter already covers all 7 URLs. Optionally add an image-onError guard in the listing grid for parity with the detail-page hardening candidate — **do not implement without approval.**

## Evidence artifacts (all in `%TEMP%\opencode\`)
- `devpratiques.html` — raw SSR of deployed page (0 `<img>` in SSR → client-side card rendering).
- `deployed-pratiques.js` / `probe-deployed-pratiques.js` — deployed Pages-router page chunk (card `image:e.image_web`, no rewrite).
- `dl-4960-e5601280a8558bc8.js` (+ others) — deployed axios baseURL `https://dev-api.wenaya.com/`.
- `dev-api-page1.json` / `dev-api-page1b.json` / `dev-api-page2.json` — canonical API page 1 (12) + page 2 (7).
- `dev-rendered-cards.json` — CDP rendered-card matrix + network statuses.
- `dev-page-context-api.json` — page-context fetch from deployed origin (canonical page 1 = 12 items HTTP 200).
- `probe-dev-image-status.js`, `probe-rewrite-target.js` — raw image URL status matrix.
- Harnesses: `dev-practices-cdp.mjs`, `dev-page-context.mjs`.
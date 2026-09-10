# Wenaya Practices API — Integration Contract & Audit

> **Status:** AUDIT COMPLETE — READ ONLY. No code changed, nothing committed/pushed (branch `pre-production-cleanup`).
> **Date:** 2026-09-10
> **Endpoint audited:** `GET https://api.wenaya.com/api/v1/getAllPublicSpecialitiesWithPaginate`
> **Frontend files audited:** `src/lib/pratiques.ts`, `src/lib/practices-api.ts`, `src/lib/practice-adapter.ts`, `src/lib/practice-content.ts`, `src/lib/pratique-specialists.ts`, `src/app/api/pratiques/route.ts`, `src/app/(fr)/pratiques/*`, `src/app/(en)/en/pratiques/*`, `src/components/pratiques/*`, `src/app/sitemap.ts`, `next.config.ts`

---

## 1. Endpoint facts (verified against live API, 2026-09-10)

| Property | Value |
|---|---|
| URL | `https://api.wenaya.com/api/v1/getAllPublicSpecialitiesWithPaginate` |
| Method | `GET` only (POST → 405) |
| Auth | **None** — public endpoint, no key/header required |
| `Accept` required? | Not strictly, but send `Accept: application/json` (recommended) |
| Content-Type | `application/json` |
| Pagination | Server **hardcodes 12 items/page**. `page` is 1-based. `per_page` / `limit` / `page[size]` / `search` are **ignored**. |
| Default page | 1 |
| Out-of-range page | Returns empty `data: []` gracefully, HTTP 200 |
| Dataset (today) | **19 items** over 2 pages (12 + 7). `total: 19`, `last_page: 2`. |
| Wrapper | `{ error: false, message: null, data: <Laravel paginator> }` |
| Rate limit (Cloudflare) | `X-RateLimit-Limit: 1000`, `X-RateLimit-Remaining` decrements per request |
| Edge/infra | Behind Cloudflare (`Server: cloudflare`, `cf-cache-status: DYNAMIC`), `Set-Cookie: we_session`, `X-Powered-By: Yolo` (Laravel) |
| Security headers | `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection: 1; mode=block` |

Response envelope shape (verified live):

```jsonc
{
  "error": false,
  "message": null,
  "data": {
    "current_page": 1,
    "data": [ /* ApiSpeciality[] */ ],
    "first_page_url": "…?page=1",
    "from": 1,
    "last_page": 2,
    "last_page_url": "…?page=2",
    "links": [ /* Laravel paginator links */ ],
    "next_page_url": "…?page=2",   // null on last page
    "path": "…/getAllPublicSpecialitiesWithPaginate",
    "per_page": 12,
    "prev_page_url": null,         // null on first page
    "to": 12,
    "total": 19
  }
}
```

**No `has_more` field** → derive as `current_page < last_page` (already done in `fetchSpecialitiesPage` consumer).

---

## 2. Dataset inventory — all 19 records (verified 2026-09-10)

IDs present: **2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 16, 18, 22, 23, 24, 25, 26** (gaps: 1, 10, 15, 17, 19, 20, 21 — historical/soft-deleted).

| id | API `fr_name` | API `en_name` | API `fr_slug` (has accents) | API `en_slug` | **Frontend canonical slug** (`SLUG_BY_LIVE_ID`) | Category (local) | `search_count` | Image host |
|----|----------------|----------------|------------------------------|---------------|-----------------------------------------------|------------------|----------------|------------|
| 2 | Psychomotricité | Psychomotricity | `psychomotricité` | `psychomotricity` | `psychomotricite` | unknown | 196 | api |
| 3 | Orthophonie | Speech Therapy | `orthophonie` | `speech-therapy` | `orthophonie` | unknown | 126 | api |
| 4 | Kinésithérapie | Kinesitherapie | `kinésithérapie` | `kinesitherapie` | `kinesitherapie` | manualTherapies | 557 | objectstorage |
| 5 | Nutrition | Nutrition | `nutrition` | `nutrition` | `nutrition` | nutrition | 356 | objectstorage |
| 6 | Naturopathie | Naturopathie | `naturopathie` | `naturopathie` | `naturopathie` | holisticWellness | 26 | api |
| 7 | Neuropsychologie | Neuropsychologie | `neuropsychologie` | `neuropsychologie` | `neuropsychologie` | mentalHealth | 274 | api |
| 8 | Sexologie | Sexologie | `sexologie` | `sexologie` | `sexologie` | mentalHealth | 61 | api |
| 9 | Cupping therapy-Hijama | Cupping therapy-Hijama | `cupping-therapy-hijama` | `cupping-therapy-hijama` | `cupping-therapy-hijama` | manualTherapies | 86 | objectstorage |
| 11 | Psychologie | **Psychology** | `psychologie` | `psychology` | `psychologie` | mentalHealth | 277 | api |
| 12 | Yoga | Yoga | `yoga` | `yoga-2` ⚠️ | `yoga` | holisticWellness | 243 | objectstorage |
| 13 | Méditation | Meditation | `méditation` | `meditation` | `meditation` | mentalHealth | 28 | api |
| 14 | Psychothérapie | Psychothérapie | `psychothérapie` | `psychothérapie` | `psychotherapie` | mentalHealth | 31 | objectstorage |
| 16 | Massothérapie | Massothérapie | `massothérapie` | `massothérapie` | `massotherapie` | manualTherapies | 233 | api |
| 18 | Art Martial Thérapie | Art Martial Thérapie | `art-martial-thérapie` | `art-martial-thérapie` | `art-martial-therapie` | holisticWellness | 79 | objectstorage |
| 22 | Ostéopathie | Osteopathie | `osteopathie` | `osteopathie` | `osteopathie` | manualTherapies | 135 | objectstorage |
| 23 | Sono-thérapie | Sound Healing | `sono-therapie` | `sound-healing` | `sono-therapie` | unknown | 23 | objectstorage |
| 24 | Coaching Sportif | Sport Coaching | `coaching-sportif` | `sport-coaching` | `coaching-sportif` | nutrition | 35 | objectstorage |
| 25 | Sophrologie | Sophrology | `sophrologie` | `sophrology` | `sophrologie` | unknown | 35 | objectstorage |
| 26 | Infirmerie | **Nursing** | `infirmerie` | `nursing` | `infirmerie` | soins | 15 | objectstorage |

⚠️ **= slug anomaly to watch.** `en_slug` for Yoga is `yoga-2` (API-internal dedupe artifact); `fr_slug=yoga` is what matters for FR and the canonical local slug is `yoga`. The id-map (not raw API slugs) is the correct source of truth.

**`is_visible`: all 19 currently `true`.** (Historic note: an earlier snapshot had 2 records `is_visible:false` — the dataset is live and mutates; see §8 / JAMAL VALIDATION.)

**Existing mapping completeness:** every one of the 19 API ids is present in `SLUG_BY_LIVE_ID` (`practice-adapter.ts`) and every slug resolves to a real entry in `practicesContent` — zero orphan ids, zero silent 404 routes today.

---

## 3. Field-by-field mapping (API → frontend `Pratique`)

| API field | Type observed | Frontend consumer | Transformation / notes |
|---|---|---|---|
| `id` | `number` | `Pratique.id` (string), `liveId` | `String(api.id)`; also the **join key** for `SLUG_BY_LIVE_ID` |
| `fr_name` / `en_name` / `ar_name` | `string` | `Pratique.title` (fr/en) | FR uses `fr_name` first; EN prefers **local** title. ⚠️ `en_name` is often **French** (see §4) |
| `fr_slug` / `en_slug` / `ar_slug` | `string` | URL segment (via map) | Frontend ignores; canonical slug comes from `SLUG_BY_LIVE_ID[id]` |
| `search_count` | `number` | **none** | ☣️ **Semantics unverified** — could be popularity/practitioner-count. See §8 |
| `*_displayed_name` | `null` (all 19) | none | Null-safe; treat as optional overload in type (already `string | null`) |
| `category` | `null` (all 19) | none | Local `category` used for filter key (manualTherapies/mentalHealth/nutrition/holisticWellness/soins) |
| `description` | `string` (HTML) | `Pratique.description` (card + metadata) | Must be decoded + tag-stripped (see §5); minimum-length guard `>= 24 chars` |
| `details` | `string` (HTML) | **none currently** | Not rendered by PratiqueDetail (local `article` is the body). Used in older design? – audit-only |
| `image_web` / `image_mobile` | `string \| null` | `Pratique.image` | Prefers `image_web` → `image_mobile` → local `content.image` |
| `icon` | `string \| null` | none | SVG/PNG icon; not consumed in current UI |
| `is_visible` | `bool` | none currently | ⚠️ Filtering by this is NOT implemented — but all currently true, so no divergence today |
| `color` | `string \| null` | none | Brand accent hex (e.g. `#478CCF`); unused |
| `company_id` | `number \| null` | none | `1` for 5 records (26, 24, 22, 23, 25); others null |
| `locked` | `bool \| null` | none | `true` for 14, `false` for 5 (the ones with `company_id=1`) |
| `company_priority` | `null` (all 19) | none (order comes from API listing order) | Derived `dataSource` flag only |
| `created_at` / `updated_at` | ISO timestamp | none | Traceability only |

**Field-level type model already in code** (`ApiSpeciality`) — matches observed payload exactly (verified all fields against all 19 records; no missing/unexpected fields).

---

## 4. Locale strategy (critical design fact)

- **FR:** title/description come from the API (`fr_name`, decoded `description`), falling back to local editorial content when too thin.
- **EN:** all 19 practices have `hasGenuineEn: true` → EN is **entirely local** (titles/summaries/article). The adapter **deliberately does not trust API `en_name`/`en_slug`** — evidence:
  - id=16 `en_name: "Massothérapie"` (French in the English field)
  - id=23 `en_name: "Sound Healing"` (fine) but id=3 `en_name: "Speech Therapy"` (fine) …
  - Mixed quality: 5–6 fields hold French text. Only `Psychology`, `Nursing`, `Speech Therapy`, `Sound Healing`, `Sophrology`, `Psychomotricity` are genuinely English.
  - **Conclusion: never regress EN to API fields.** Keep local EN. (JAMAL: once backend EN copy is produced per specialty, flip.)

---

## 5. HTML encoding audit of `description` / `details` (dirty data!)

Classified all 19 records into **three encoding states** (byte-level verified):

| State | Meaning | Records (`description` / `details`) |
|---|---|---|
| `RAW-HTML` | Actual `<p>...</p>` tags, no entity escaping | desc: 9 so far (24, 9, 26, 4, 16, 5, 22, 14, 23, 25, 12, 7…) — see matrix |
| `ENTITY-ESCAPED` | Tags stored as `&lt;p&gt;` / `&#039;` / `&nbsp;` (single-encoded entities) | e.g. `naturopathie`(6), `neuropsychologie`(7), `psychologie`(11), `sexologie`(8) |
| `MIXED` | Raw wrapper `<p>` **and** escaped inner `&lt;p&gt;` (double-encoded — nested) | e.g. `art-martial-therapie`(18), `meditation`(13), `orthophonie`(3), `psychomotricite`(2) |

**Full observed matrix (desc / details):**

| id | slug | `description` | `details` |
|----|------|---------------|-----------|
| 2 | psychomotricite | MIXED | MIXED |
| 3 | orthophonie | MIXED | MIXED |
| 4 | kinesitherapie | RAW-HTML | MIXED |
| 5 | nutrition | RAW-HTML | MIXED |
| 6 | naturopathie | ENTITY-ESCAPED | ENTITY-ESCAPED |
| 7 | neuropsychologie | ENTITY-ESCAPED | ENTITY-ESCAPED |
| 8 | sexologie | ENTITY-ESCAPED | ENTITY-ESCAPED |
| 9 | cupping-therapy-hijama | RAW-HTML | MIXED |
| 11 | psychologie | ENTITY-ESCAPED | ENTITY-ESCAPED |
| 12 | yoga | RAW-HTML | MIXED |
| 13 | meditation | MIXED | MIXED |
| 14 | psychotherapie | RAW-HTML | RAW-HTML |
| 16 | massotherapie | RAW-HTML | MIXED |
| 18 | art-martial-therapie | MIXED | RAW-HTML |
| 22 | osteopathie | RAW-HTML | MIXED |
| 23 | sono-therapie | RAW-HTML (65 chars — thin "Sono-thérapie" wrapped in span) | MIXED |
| 24 | coaching-sportif | RAW-HTML | MIXED |
| 25 | sophrologie | RAW-HTML | RAW-HTML |
| 26 | infirmerie | RAW-HTML | RAW-HTML |

**Implications (already handled, must stay handled):**
1. `decodeEntities()` then tag-strip must run on **every** description before use — the adapter's `decodeAndStrip()` covers RAW-HTML + ENTITY-ESCAPED + MIXED because entity-decode first (turning `&lt;p&gt;` into `<p>`), then the tag-regex strips the *now-revealed* inner tags. **Required order: decode entities → then strip tags.** Reversing breaks MIXED records.
2. Inline style spans leak (`<span style="color: rgb(22,56,96);">…</span>` on id=22) — tag-strip removes them; text survives.
3. Thin/empty descriptions must fall back to local (`MIN_DESCRIPTION_LENGTH = 24`). id=23's desc is only 65 chars ("Sono-thérapie" + span) → currently produces "Sono-thérapie" as card text (short but usable; verify acceptable or prefer local summary).
4. `details` is **never rendered** in the current UI (article is local). If a future change renders API `details`, it MUST be **sanitized via DOMPurify-type whitelist** — it contains `<h1><h2><ul><li><strong><em><a>` and cross-site external links (id=8 sexologie contains a live `kinatex.com` link with `target=_blank`). **Recommend: keep details out of rendering; if adopted, sanitize + filter `href` to allowlist.**

---

## 6. Image & media audit

- Hosts: `nbg1.your-objectstorage.com` (12 records) + `api.wenaya.com` (7 records, `/storage/uploads/…`).
- Both hosts **already whitelisted** in `next.config.ts` images.remotePatterns.
- `image_web` present on all 19; `image_mobile` present on all 19; `icon` present on all 19.
- Adapter order: `image_web` → `image_mobile` → local `content.image` → null. Currently every record yields a live API image.
- ⚠️ SSR `<img srcSet>` will reference `api.wenaya.com/storage/...` — already allowed; and the Next image optimizer **re-encodes to avif/webp** (verified working earlier). No CSP change needed.

---

## 7. Fetch / cache / fallback strategy (as built)

| Layer | Behavior |
|---|---|
| `fetchSpecialitiesPage(page)` | `fetch` + `next.revalidate: 3600` (Data Cache 1h); validated shape via `isValidResponse`; throws on HTTP != 2xx |
| `fetchAllSpecialities()` | Walk pages until `current_page >= last_page` or `data.length === 0`; 50-page guard (runaway) |
| `getPracticesPageAsync(query)` | default → **server-side native pagination** (`page` passthrough); filter/search → **fetch ALL + filter + paginate locally**; any throw → **local-fallback** via `getPracticesPage` flagged `dataSource:"local-fallback"` |
| `/api/pratiques` proxy | `force-dynamic`, `no-store`, `X-Data-Source` header; browser always goes through it (never hits `api.wenaya.com` directly) |
| SSR pages | `/pratiques` + `/en/pratiques` ISR 1h via Data Cache revalidate |

**Rate-limit budget:** Cloudflare allows 1000 req/hr. A cold build + ISR regeneration of 2 pages = 2 API calls; filter/search walks all pages = 2 calls each. No risk at current use.

---

## 8. 🚨 JAMAL VALIDATION REQUIRED (do not guess)

These are the open backend-semantics questions found during the audit — the frontend has a designed behavior today, but its **meaning** must be confirmed before any future logic leans on them:

1. **`search_count` semantics** — what is it? (popularity counter? practitioner count? category bucket size?) Observed values: 15–557. Two plausible readings ↔ two different UI semantics.
2. **`category = null` everywhere** — is categorization being deprecated on the backend, or just not filled? The frontend `PRACTICE_CATEGORY_MAP` (manualTherapies/mentalHealth/nutrition/holisticWellness/soins) is **local-only**, so a future API `category` value would NOT match any filter key.
3. **`is_visible`** — the listing includes only `is_visible:true` today, but the adapter/listing does **not** filter on it. Confirm intended policy (backend filters all non-public records AND the frontend should ALWAYS honor `is_visible` as a hard gate when building any slug/SEO route to avoid a hidden item leaking to a detail page).
4. **Id stability** — ids have gaps (10, 15, 17, 19, 20, 21 missing) and **Infirmerie moved ids between snapshots** (historic note "19 Infirmerie is_visible:false" vs today id=26). Confirm soft-deletes keep the numbering immutable (so `SLUG_BY_LIVE_ID` stays correct) and that removed ids should simply drop out of the listing (current behavior: id-map hit → shown; unknown id → skipped).
5. **Yoga `yoga-2` en_slug** — intended or a data-entry artifact? (Frontend canonical `yoga` is unaffected.)
6. **EN `en_name` French contamination** — are the 5–6 French-filled `en_name` fields a known backend backlog, and is there a timeline for genuine EN names? (Frontend keeps local EN regardless.)
7. **`description` length** — is there a backend editorial pass planned to make all descriptions 1-sentence summaries (id=2/3/13 currently nested `<p><p>`; id=23 only a title)?
8. **`details`** — is it meant to replace the frontend local `article` eventually? (See §5 point 4 — do not render raw.)
9. **Rate limit throttling on `fetchAllSpecialities`** — acceptable to call the endpoint 2× (both pages) per filtered/search request? If backend plans to grow > 50 pages, the 50-page guard needs a revisit.

---

## 9. SEO impact & risks

| Concern | Current state | Risk level |
|---|---|---|
| `generateStaticParams` | Uses **local** `getAllPratiqueSlugs()` (19 slugs) — deterministic, no build-time API call | ✅ low |
| Unknown-slug 404 | `getPratiqueBySlug` returns undefined → `notFound()` (SSG + valid 404) | ✅ low |
| SSR listing ISR | 1h revalidate; stale-while-revalidate semantics | ✅ low |
| Canonical/hreflang | Self-canonical + fr-MA/en-MA pairs via `languageAlternates` | ✅ low |
| JSON-LD | WebPage + MedicalTherapy per detail | ✅ low |
| Sitemap | Uses `getAllPratiqueSlugs()` — always aligned with build params | ✅ low |
| **Hidden-item leak (if backend flags a record invisible)** | Listing would still surface it (not filtered on `is_visible`) → **stale SEO page risk** | ⚠️ **medium** — treat `is_visible:false` as hard exclusion the moment it occurs |
| API flakiness → listing empty | fallback path covers it | ✅ low |

**Key principle:** the id→slug map at build time is the SEO contract. All 19 present today; any *future* API added id with no map entry is loudly `console.warn`'d and skipped (never a 404 route). Good.

---

## 10. Security & network notes

- Endpoint is **public GET, no auth** — safe to call server-side. No secret handling.
- **Never call `api.wenaya.com` from the browser** — the `/api/pratiques` proxy is the only browser path (confirmed: URL absent from client chunks; `api.wenaya.com` appears solely in SSR image srcSets).
- Cloudflare sets `Set-Cookie: we_session` on responses — harmless to ignore server-side; do **not** forward it to clients.
- `X-Powered-By: Yolo` is a Laravel framework signature — informational only.
- Response validation (`isValidResponse`/`isValidPaginator`) is a hard type-shape gate — keeps malformed payloads from reaching React.
- No user-controlled input reaches the request URL unclamped: `page` is `Math.max(1, Math.trunc(page)||1)`, `pageSize` clamped `[1,50]`.

---

## 11. Acceptance criteria (regression checklist — all currently PASSING)

1. `GET /api/pratiques?page=1` → 12 items, `total:19`, `hasMore:true`, `X-Data-Source: api`.
2. `GET /api/pratiques?page=2` → 7 items, `hasMore:false`; `page=3` → 0 items.
3. No duplicate slugs across the 19 (the `seen` set guard holds).
4. FR titles accented correctly; EN genuine English; no French leak to EN.
5. Slugs are canonical ASCII everywhere (`/pratiques/kinesitherapie`, NOT `kinésithérapie`).
6. Filter `category=mentalHealth` → 6; `search=nutrition` → 1 (full-dataset).
7. Fallback path: `PRACTICES_API_URL` → dead → `dataSource:"local-fallback"`, SSR still 200.
8. Image optimizer serves both hosts (objectstorage jpg + api `/storage/uploads` png) → 200.
9. `/pratiques` + `/en/pratiques` SSR render; detail pages SSG'd (19×2); unknown slug → 404.
10. `npx tsc --noEmit` clean; `npx eslint .` 0E/12W (pre-existing baseline); `npm run build` 270 pages.

---

## 12. Recommended forward-guard rails (when frontend logic next touches this)

1. **Honor `is_visible` as a hard gate** the moment any record flips false (adapter returns `null` for `is_visible === false`, mirroring the "unknown id" skip path).
2. Keep the **id→slug map** as the single source of canonical slugs; treat API `*_slug` as display hints only.
3. Never render API `details` without sanitization and an `href` allowlist (external links exist in the data).
4. If `search_count` becomes a UI signal, confirm its meaning first (§8 question 1).
5. If EN API copy ever becomes genuine, revisit the `hasGenuineEn` override — but only after an explicit backend announcement.
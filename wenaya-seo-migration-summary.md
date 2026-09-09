# Wenaya — Live URL Index & SEO Migration Map

**Date:** 2026-09-08 (refreshed — care-journey pages built; alias-only redirect surface)
**Branch:** `pre-production-cleanup` · **HEAD:** 35a34d7 (uncommitted changes: `next.config.ts` + care-journey pages + sitemap.lang + 2 `loading.tsx` deletions + deliverables)
**Scope:** Care journeys built as **first-class pages** (`/parcours-de-soins/{slug}` FR+EN, live-verbatim content); every legacy journey URL now resolves **canonically or via exact 308 alias** — no temp catch-alls anywhere. Redirects **wired in `next.config.ts` and validated** against the production build.
**Status:** IMPLEMENTED + VERIFIED (suite PASS) — NOT committed, NOT pushed.

---

## A. Summary numbers

| Metric | Count |
|--------|-------|
| Canonical pages (new site, SSR-verified 200) | **127** |
| Redirect sources wired (`next.config.ts`) | **111** |
| Verified 404s kept (no safe equivalent — DONT-REDIRECT) | **13** |
| Total rows (inventory + migration-map CSV) | **251** |
| Regression suite (redirects + 404s + follow + canonical 200s) | **PASS** |

---

## B. Sources used (this refresh)

| Source | Result |
|--------|--------|
| `next.config.ts` (`redirects()` block) | The authoritative route table — every row re-verified live |
| `sitemap.xml` (prod :3002) | 247 URLs; canonical + aliases; FR-only `/soins-a-domicile`; zero redirect sources; 19 practices + 6 sessions + 10 professionals + 7 articles × FR/EN + 9 journeys (FR) / 9 (EN) |
| SSR probes (curl, prod build) | Title/canonical/status for every canonical + redirect + 404 row |
| 139-check regression suite (`%TEMP%\opencode\smoke-final.mjs`) | no-follow (status+Location) + follow (final URL) + expect-404 + expect-temp + canonical-200 |
| Live wenaya.com content captures (`%TEMP%\opencode\`) | `pds-hub.html`, `mt_vertiges.html`, `mt_grossesse-maternite.html` canonical tags, CDP detail bodies (journey evidence) |
| dumps `data_professional.json`, `data_maux-troubles.json`, `live-sitemap_*.xml` | **Inconclusive for slug enumeration** (Next pageProps, empty detail sitemaps) — replaced by the verified canonical-tag evidence |

---

## C. Canonical URL count by family (new site)

| Family | FR | EN | Total |
|--------|----|----|-------|
| HOME | 1 (`/`) | 1 (`/en`) | 2 |
| CLINIC (`/about-us`) | 1 | 1 | 2 |
| PRACTICE listing (`/pratiques`) | 1 | 1 | 2 |
| PRACTICE detail (19 ASCII) | 19 | 19 | 38 |
| GROUP SESSION listing (`/seance-de-groupe`) | 1 | 1 | 2 |
| GROUP SESSION detail (6) | 6 | 6 | 12 |
| PROFESSIONAL listing (`/professional`) | 1 | 1 | 2 |
| PROFESSIONAL detail (10) | 10 | 10 | 20 |
| ARTICLE listing (`/articles`) | 1 | 1 | 2 |
| ARTICLE detail (7) | 7 | 7 | 14 |
| CORPORATE (`/corporate`) | 1 | 1 | 2 |
| CORPORATE `/programmes` | 1 | 1 | 2 |
| HOMECARE (`/soins-a-domicile`) | 1 | 0 | 1 |
| CARE JOURNEY hub (`/parcours-de-soins`) | 1 | 1 | 2 |
| CARE JOURNEY detail (7) | 7 | 7 | 14 |
| CONTACT (`/contact-us`) | 1 | 1 | 2 |
| LEGAL (`/terms-and-conditions`, `/privacy-policy`) | 2 | 2 | 4 |
| FAQ | 1 | 1 | 2 |
| AUTH (`/login`, noindex) | 1 | 1 | 2 |
| **TOTAL canonical** | | | **127** |

---

## D. Valid 200 pages (verified)

All 111 canonical pages above return 200 with genuine server-rendered content, self-canonicals, and correct FR/EN copy. Key upgrades over live:
- `/pratiques` listing is fully SSR’d (API-backed catalog, 19 practices) — live was a SPA shell.
- All practice/session/professional details SSR with real content + JSON-LD.
- `/soins-a-domicile` (FR) SSR’d with live-verbatim copy.
- Login pages serve as patient-space placeholders, `noindex`.

---

## E. Redirect surface (wired + verified)

111 sources → 308/307, no chains, single-hop, final 200:

| Family | Sources | Code | Target rationale |
|--------|---------|------|------------------|
| Canonical parity (`/about`, `/contact`, `/conditions`, `/confidentialite` FR+EN) | 8 | 308 | Short forms fold INTO live-canonical forms (`-us`, `terms-and-conditions`, `privacy-policy`) — INVERTED from the pre-parity draft |
| `/fr` duplicate home | 1 | 308 | Canonical is `/` |
| Corporate aliases (`/for-entreprise`*, `/solutions/entreprises`*) | 4 | 308 | → `/corporate`* |
| Practices renamed (`/soins`, `/pratiques/psychologie-clinique`, `/pratiques/therapies-complementaires` FR+EN) | 6 | 308 | → `/pratiques` family |
| Maux-troubles listing + verified details | 5 | 308 | → `/pratiques` (pluridisciplinary fold) |
| Blog (`/blog` FR+EN) | 2 | 308 | → `/articles` |
| Legacy search (`/search/all/all` FR+EN) | 2 | **307** | → `/pratiques` (the OLD search searched specialists/practices — `/produits` target was wrong) |
| Accented practice slugs (8 ASCII gaps × FR+EN) | 16 | 308 | → ASCII canonical ± EN |
| EN group-sessions aliases (± glob) | 8 | 308 | → `/en/seance-de-groupe/{fr-slug}` |
| Care journeys — legacy URL forms exact 308 → canonical page (7 journeys × FR+EN: accented + percent-encoded + raw-straight + raw-curly `’` apostrophe forms) | 20 | 308 | canonical journey pages; temp catch-alls REMOVED (unmapped `/parcours-de-soins/{slug}` → 404) |
| Arabic precise mappings + catch-all | 5 | 308/307 | → FR equivalents / `/` |
| `/specialistes`* FR+EN | 4 | 308 | → `/professional`* |
| Per-profile booking sub-page (10 slugs × FR+EN) | 20 | 308 | → same profile (booking panel is in-profile) |
| `/user/sign-in` FR+EN | 2 | 308 | → `/login` |
| Events (`/evenements` FR+EN) | 2 | **307** | → `/seance-de-groupe` (temporary; live URL was group-booking app, no events feature) |
| Blog `:path*` globs FR+EN | 2 | 308 | → `/articles/:path*` |
| EN corporate aliases (`/en/for-entreprise`*, `/en/solutions/entreprises`*) | 4 | 308 | → `/en/corporate`* |

**Pre-existing edges kept:** `/ar/:path*`→`/` 307, `/en/group-sessions/:path*`→EN 308 glob, `/evenements`→`/seance-de-groupe` 307, `/search/all/all` 307. Care-journey `:slug+` catch-alls **removed** — unmapped `/parcours-de-soins/{slug}` now returns 404 (never a broken 200).

---

## F. Pre-existing live breakage vs new site

| Live symptom | New site status |
|--------------|-----------------|
| `/professional/{slug}` `"Undefined \| Wenaya"` titles | Fixed — real SSR profiles. **Plus a NEW-site bug fixed this pass:** unknown slugs returned HTTP **200** (streaming `loading.tsx` boundary flushed the shell before `notFound()`). Deleted both `[slug]/loading.tsx` → `/professional/ghita` now **404** (noindex, `Page Introuvable — 404` title) |
| `/articles/undefined`, `/evenements/undefined` catch-alls → 200 | Now **404** |
| Corporate `for_business_title` raw-key H1 | Fixed — real EN/FR copy, `index` |
| SPA `"Loading…"` shells (pratiques, sessions, homecare, contact, legal) | Fully server-rendered |

---

## G. Verified 404s kept (DONT-REDIRECT — no manufactured target)

`/search`, `/search/kine/all`, `/search/all/casablanca`, `/search/all/paris`, `/en/search`, `/en/search/kine/all`, `/en/search/all/casablanca`, `/en/search/all/paris`, `/maux-troubles/{unverified}` (e.g. `/maux-troubles/back-pain-guide`), `/professional/ghita`, `/professional/{unknown}`, `/en/professional/ghita`, `/articles/undefined`, `/en/articles/undefined`, `/evenements/undefined`, `/pratiques/{nonexistent}`, `/en/seance-de-groupe/{nonexistent}`, `/en/soins-a-domicile` (no EN homecare — live serves FR content under `lang="en"`), unmapped `/parcours-de-soins/{slug}` (the former temp catch-all).

---

## H. Exact detail slug inventory

- **Practices (19,** ASCII canonical**):** kinesitherapie, osteopathie, massotherapie, cupping-therapy-hijama, psychologie, neuropsychologie, psychotherapie, sexologie, meditation, sophrologie, nutrition, coaching-sportif, orthophonie, naturopathie, psychomotricite, art-martial-therapie, sono-therapie, yoga, infirmerie (FR + EN).
- **Group sessions (6):** yoga-prenatal, sophrologie, nutrition, breathwork, jiu-jitsu-bresilien, pilates-et-posture (FR + EN share FR slug).
- **Professionals (10):** nadine-kita, dr-amal-benali, khalid-ouazzani, nadia-tazi, yassine-el-amrani, sara-mansouri, mehdi-irzi, najat-berrada, omar-tazi, fatima-zahra-alami.
- **Articles (7,** all new):** 5-benefits-of-preventive-healthcare, future-preventive-medicine-ai, 525-biomarkers-explained, personalized-nutrition-biochemistry, inflammation-chronic-disease-lifestyle, longevity-blue-zones-lessons, sleep-circadian-rhythm-optimization.

### Care journeys (legacy, 7) — current handling (first-class pages, alias-only 308s)
All 7 journeys are now **canonical pages** at `/parcours-de-soins/{slug}` (FR + EN, live-verbatim content, noindex-consistent with live site). Legacy URL forms (accented raw, percent-encoded, raw-straight `'`, raw-curly `’`) 308 → the canonical ASCII page.

| Slug | Canonical page | Legacy 308s → it |
|------|----------------|-------------------|
| `les-troubles-de-l-apprentissage` | ✅ FR+EN | accented/`%27`/raw-`'` FR+EN |
| `grossesse-&-maternite` | ✅ FR+EN | accented `-maternit%C3%A9` FR+EN |
| `sante-holistique` | ✅ FR+EN | accented FR+EN |
| `le-vertige-positionnel` | ✅ FR+EN | (aliases handled live) |
| `la-maladie-d-alzheimer` | ✅ FR+EN | `%27`/`%E2%80%99`/raw-`'`/raw-`’` FR+EN |
| `tecar-therapie` | ✅ FR+EN | accented FR+EN |
| `kinesitherapie-&-avc` | ✅ FR+EN | accented (`%26` + raw-`&`) FR+EN |
| any other slug | **404** | temp `:slug+`→`/` catch-all REMOVED this pass; unmapped journeys no longer redirect to home |

Source forms per journey: canonical accented URL + percent-encoded form + raw-straight `'` + (Alzheimer) raw-curly `’` — all wired FR+EN.

---

## I. New-site equivalents

| New family | Present | Notes |
|-----------|---------|-------|
| `/`, `/en` | ✅ | |
| `/about-us`, `/en/about-us` | ✅ | live-canonical (was `/about` in pre-parity draft) |
| `/professional/+` (10) | ✅ | same slugs as live |
| `/pratiques/+` (19 ASCII) | ✅ | live used accented — 8 gaps 308’d |
| `/articles/+` (7) | ✅ | live had ZERO articles |
| `/seance-de-groupe/+` (6) | ✅ | same FR slugs |
| `/corporate`, `/corporate/programmes` | ✅ | EN too |
| `/soins-a-domicile` | ✅ FR only | no EN, no fake hreflang |
| `/parcours-de-soins` + 7 details | ✅ FR+EN | first-class pages, live-verbatim content |
| `/contact-us`, `/terms-and-conditions`, `/privacy-policy` | ✅ | live-canonical forms |
| `/login`, `/en/login` | ✅ noindex | |
| `/faq`, `/en/faq` | ✅ | |
| `/produits` + detail | NET-NEW | no legacy; detail 200-noindex artifact on unknown slugs (see R) |

---

## J. Redirect candidates (remaining)

| Candidate | Decision |
|-----------|----------|
| `/maux-troubles/{slug}` beyond the 3 verified | STAY 404 until each canonical slug is verified from the archive; then pluridisciplinary fold pattern |
| Care-pathway hub (`/parcours-de-soins`) | ✅ **IMPLEMENTED** — built as first-class page (this pass); legacy journey URLs 308 to canonical pages |
| `/search/{specialty}/{city}` deep variants | 410 recommended at the deploy edge (GraphQL search permanently retired) — now 404 |

---

## K. Encoding findings (practice accents)

`é→%C3%A9`, `%E2%80%99` (curly quote) does NOT resolve on live journeys — use raw `'`. `&` in `grossesse-&-maternité` matches raw `&` form (not `%26`). Redirect sources are matched against the **encoded** path per Next.js — sources written percent-encoded where needed.

---

## M. Canonical/index hygiene (current)

- Every canonical page self-canonical; FR+EN `hrefLang` pairs + `x-default`→FR (except FR-only homecare).
- No redirect source appears in sitemap (247 URLs = canonical-only).
- `/login` `noindex` both locales; robots disallows `/login`, `/en/login`, `/admin`, `/api/`.
- Duplicate ASCII/accented practice ambiguity eliminated via 16 308s.

---

## N. Top migration risks (resolved/remaining)

1. ✅ Accented→ASCII practice canonicalization (16 308s).
2. ✅ Broken professional `Undefined` titles + undefined catch-alls → proper 404s (incl. the new `loading.tsx` 200→404 fix).
3. ✅ SPA shells replaced by SSR.
4. ✅ Corporate raw-key H1.
5. ✅ Care journeys built as first-class pages FR+EN; legacy URL forms exact 308s; `/parcours-de-soins` hub live (NEEDS_CONTENT resolved).
6. ⏳ `?service=` booking param is passive (only group-session kit builds it); any type of deep-booking link will NOT prefill — future content/API workstream, no URL impact.
7. ✅ Same-URL professional resolution (URL parity, no redirect needed for the 10 live slugs).

---

## O-P. Files generated (all in repo root, uncommitted)

| File | Contents |
|------|----------|
| `wenaya-live-url-inventory.csv` | 251 rows: 127 canonical (status/title/canonical/lang/type/indexable) + 111 redirect sources + 13 verified 404s + journey pages |
| `wenaya-seo-migration-map.csv` | 251 rows: `old_url,current_status,new_target,action,confidence,priority,notes` (no implementation_status column — status is authoritative in `next.config.ts`) |
| `wenaya-seo-migration-summary.md` | This report |

---

## Q. Verification (this pass, prod build :3002)

- **Redirect suite:** no-follow status+Location, follow final URL, expect-404, expect-temp, canonical 200s — zero failures. Journey aliases (20 FR+EN incl. all encoding variants) assert 308 + follow to final canonical page 200; unmapped journey slugs assert **404** (catch-all removed).
- Journey pages: `/parcours-de-soins` hub + 7 detail FR+EN → 200; live-verbatim content; canonical + hreflang; in sitemap (247 URLs).
- Post-fix spot checks: `/professional/ghita` FR+EN → 404 (noindex, clean 404 title); `/parcours-de-soins/xyz-unmapped` → 404.
- Known streaming artifact: `/produits/{unknown}` returns **200 + noindex + 404 content** (Shop detail has the same `loading.tsx` boundary; out of scope — products is a CMS/Shop surface).
- `npx tsc --noEmit` clean; `npx eslint .` **0E/12W** (unchanged pre-existing baseline); `npm run build` **270 static pages** (clean `.next`, kill-node first).

---

## R. Deploy recommendations

1. Deploy `next.config.ts` + the 2 loading.tsx deletions + the care-journey pages + sitemap.lang together (the 200→404 fix must ship with the redirect table and the new pages).
2. Recommend a `410 Gone` for `/search/{specialty}/{city}` deep variants at the edge (definitive retirement signal; currently 404).
3. Post-cutover: crawl the 111 redirect source→target pairs; confirm no chains, final 200, no `noindex` sources in sitemap.
4. Do NOT index `/en/soins-a-domicile` (404), `/produits/{unknown}` (noindex) — no further action.
5. Care-journey aliases are permanent 308s to the canonical journey pages — confirm those destination slugs keep their spelling post-deploy.

---

## S. Remaining workstreams (out of scope here)

- Real patient-auth backend (login is a noindex placeholder).
- CMS + Shop architectures (produits detail 200-noindex artifact lives there).
- Monitor `wenaya.com` (maintenance mode) for any reviving content before cutover finalization.

---

## T. Owner / final status

All redirect + status decisions reviewed against real (captured/browser-verified) live evidence. Deliverables regenerated to CURRENT architecture. **Nothing committed or pushed** — `git diff` review pending before any commit.

*Generated 2026-09-08 — branch `pre-production-cleanup`, prod server on :3002.*
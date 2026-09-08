# Wenaya — Live URL Index & SEO Migration Map (AUDIT ONLY)

**Date:** 2026-09-08
**Scope:** Inventory every existing/indexed public URL on `https://wenaya.com` and map it to the new Wenaya canonical architecture.
**Status:** AUDIT ONLY — NO code changes, NO redirects wired, NO commit, NO push.

---

## A. Total live URLs discovered

**~122 unique URLs** catalogued (FR + EN + AR + infra). Of these:
- ~51 individual detail URLs (19 practices × FR+EN, 6 group sessions × FR+EN, 10 professional profiles × FR+EN)
- ~45 FR static/listing/utility URLs
- ~21 EN static/listing/utility URLs
- ~6 AR URLs
- 2 infrastructure URLs (llms.txt, manifest.json)

> Note: artistic/article detail URLs are **not** enumerated because the live sitemap_articles.xml is **empty** — there are zero indexed article detail pages on live.

---

## B. Sources used

| Source | Result |
|--------|--------|
| `https://wenaya.com/sitemap.xml` | Sitemap index → 6 child sitemaps |
| `sitemap_static/search/practices/articles/professionals/troubles.xml` (FR) | Fetched (practices/professionals/troubles/articles **empty**) |
| `sitemap_articles.xml` | **EMPTY** (no article URLs) |
| `sitemap_practices.xml`, `sitemap_troubles.xml`, `sitemap_professionals.xml` | **EMPTY** (details not in sitemap — practice details sourced via API instead) |
| `sitemap_search.xml` | Only `/search/all/all` |
| `/en/sitemap.xml` + child sitemaps | Fetched (parallel structure) |
| `/ar/sitemap.xml` + child sitemaps | Fetched (parallel structure) |
| `robots.txt` | Lists `/en/` + `/ar/` sitemaps; allows `articles`, `pratiques`, `maux-troubles`, `seance-de-groupe`, `search`, `professional` |
| Live navigation + footer (homepage render) | Discovered `parcours-de-soins`, `evenements`, `fr`, `search/{spec}/{city}`, `professional/{slug}/booking` |
| `llms.txt` | Confirmed URL families incl. `/professional/{slug}/booking`, `/search/{specialty}/{city}` |
| Backend API `getAllPublicSpecialitiesWithPaginate` | Discovered all **19 public practice slugs** (accented `fr_slug`) |
| Web search (Google/Bing index surface) | Confirmed indexed `/articles`, `/en/articles/undefined`, `/corporate`, broken-profile titles |
| Live HTTP probing (HEAD + GET, status/title/canonical/lang/robots) | Verified every URL status + meta |
| Project source (`sitemap.ts`, `next.config.ts`, `src/app/**`) | Current-site canonical route map |

---

## C. URL count by page family

| Family | FR | EN | AR | Total |
|--------|----|----|----|-------|
| HOME | 2 (`/`, `/fr`) | 1 (`/en`) | 1 | 4 |
| CLINIC (About) | 1 | 1 | 1 | 3 |
| PRACTICE (listing) | 1 | 1 | 1 | 3 |
| PRACTICE (detail, 19) | 19 | 19 | 0 | 38 |
| GROUP SESSION (listing+d) | 7 | 7 | 0 | 14 |
| PROFESSIONAL (listing+d+booking) | 12 | 12 | 0 | 24 |
| TROUBLE / MAUX | 2 | 1 | 0 | 3 |
| CARE JOURNEY (parcours) | 8 | 1 | 1 | 10 |
| CORPORATE | 1 | 1 | 0 | 2 |
| HOMECARE | 1 | 1 | 0 | 2 |
| ARTICLE (listing) | 1 | 1 | 1 | 3 |
| LEGAL | 2 | 2 | 0 | 4 |
| AUTH | 1 | 1 | 0 | 2 |
| CONTACT | 1 | 1 | 0 | 2 |
| STATIC (search/evenements/faq) | 7 | 5 | 1 | 13 |
| OTHER (infra) | 2 | 0 | 0 | 2 |
| **TOTAL** | | | | **~122** |

---

## D. Valid 200 pages

All FR/EN/AR public listing + static pages return 200. Notably:
- `/pratiques`, `/en/pratiques` (listings) — 200
- All 19 practice detail pages FR+EN — 200 (accented slugs)
- All 6 group-session detail pages FR+EN — 200
- All 10 professional profiles FR+EN — 200
- `/soins-a-domicile`, `/en/soins-a-domicile`, `/faq`, `/search/*`, `/parcours-de-soins/*`, `/about-us`, `/corporate` — 200

---

## E. Redirecting pages (live)

- `/en/` → 308 → `/en` (trailing-slash normalization; same content)
- `/ar/` → 308 → `/ar`
- Trailing-slash / non-www / mixed variants normalize to canonical (standard)

No other live 301/302 redirects detected at the edge (redirects to the new site are configured only in the **new** `next.config.ts`, not live).

---

## F. Broken / placeholder 200 pages (CRITICAL)

These return HTTP 200 but are broken or empty:

| URL | Problem |
|-----|---------|
| `/professional/{slug}` + `/en/...` | **Title renders `"Undefined | Wenaya"`** — professional name lookup broken on live |
| `/corporate`, `/en/corporate` | **H1 renders raw translation key `for_business_title`** — untranslated/placeholder content |
| `/articles/undefined`, `/en/articles/undefined` | **Catch-all returns 200 with `undefined` slug** — broken detail route indexed in Google |
| `/evenements/undefined` | Same catch-all pattern returning 200 |
| **SPA "Loading…" shells:** `/pratiques`, `/soins`, `/seance-de-groupe`, all practice details, all group-session details, `/maux-troubles`, `/evenements`, `/contact-us`, `/terms-and-conditions`, `/privacy-policy`, `/soins-a-domicile`, `/faq`, `/en/soins-a-domicile` (and most EN equivalents) | Body is only `"Loading..."` server-side — **no crawlable content** for these key pages |
| `/search/all/all` | Minimal body (search UI) |

**Impact:** Google currently sees near-empty shells on the highest-value pages (practices, sessions, homecare, contact). The new site **fully server-renders** these → this is a significant upgrade and should be a positive ranking signal post-migration.

---

## G. 404 / dead URLs on live

| URL | Live | New site target status |
|-----|------|------------------------|
| `/for-entreprise`, `/en/for-entreprise` | **404** (sitemap still lists it) | New `/corporate` is live → safe 301 |
| `/specialistes`, `/en/specialistes`, `/specialistes/*` | **404** | Project alias → 301 to `/professional/*` |
| `/blog`, `/en/blog` | **404** | `/articles/*` |
| `/login`, `/en/login` | **404** | New `/login`, `/en/login` exist |
| `/group-sessions*` | **404** | `/seance-de-groupe/*` |
| `/solutions/entreprises*` | **404** | `/corporate*` |
| `/produits*`, `/en/produits*` | **404** (no shop on live) | NEW route (no legacy to preserve) |
| `/conditions`, `/en/conditions`, `/confidentialite`, `/en/confidentialite` | **404** (live uses `terms-and-conditions`) | NEW route |
| `/corporate/programmes*` | **404** | NEW route (no legacy) |

---

## H. Exact detail URLs discovered

### Practice (19) — FR at `/pratiques/{slug}`, EN at `/en/pratiques/{slug}` (accented live slugs)
`art-martial-thérapie · coaching-sportif · cupping-therapy-hijama · infirmerie · kinésithérapie · massothérapie · méditation · naturopathie · neuropsychologie · nutrition · orthophonie · ostéopathie · psychologie · psychomotricité · psychothérapie · sexologie · sono-thérapie · sophrologie · yoga`

### Group session (6) — FR + EN share the same FR slug `/seance-de-groupe/{slug}`
`yoga-prenatal · sophrologie · nutrition · breathwork · jiu-jitsu-bresilien · pilates-et-posture`

### Professional (10) — FR+EN at `/professional/{slug}`
`nadine-kita · dr-amal-benali · khalid-ouazzani · nadia-tazi · yassine-el-amrani · sara-mansouri · mehdi-irzi · najat-berrada · omar-tazi · fatima-zahra-alami` (+`/booking` sub-pages)

### Care pathway / parcours-de-soins (7)
`grossesse-&-maternité · les-troubles-de-l'apprentissage · le-vertige-positionnel · la-maladie-d'Alzheimer · santé-holistique · tecar-thérapie · kinésithérapie-&-avc`

---

## I. Current-new-site equivalents

New site map (from `src/app/sitemap.ts` + routes):

| New family | Present | Notes |
|-----------|---------|-------|
| `/` , `/en` | ✅ | |
| `/about` , `/en/about` | ✅ | live `/about-us` |
| `/professional/+` , `/en/...` | ✅ 10 | same slugs as live |
| `/pratiques/+` , `/en/...` | ✅ 19 ASCII | live uses accented slugs |
| `/articles/+` , `/en/...` | ✅ 7 | live has **no articles**; all new |
| `/seance-de-groupe/+` , `/en/...` | ✅ 6 | same slugs |
| `/corporate` , `/programmes` , EN | ✅ | new `/corporate/programmes` |
| `/soins-a-domicile` | ✅ FR only | no EN route |
| `/contact` , `/en/contact` | ✅ | |
| `/conditions` , `/confidentialite` + EN | ✅ | |
| `/login` , `/en/login` | ✅ | |
| `/faq` , `/en/faq` | ✅ | |
| `/produits` + detail + EN | ✅ | NET-NEW (no legacy on live) |

---

## J. URLs requiring redirects

| Live → New | Type | Priority |
|------------|------|----------|
| `/about-us` → `/about` (FR + EN) | 301 | HIGH |
| `/soins` → `/pratiques` | 301 | HIGH |
| `/maux-troubles` → `/pratiques` | 301 | MED |
| `/contact-us` → `/contact` | 301 | HIGH |
| `/terms-and-conditions` → `/conditions` | 301 | HIGH |
| `/privacy-policy` → `/confidentialite` | 301 | HIGH |
| `/for-entreprise` → `/corporate` | 301 | HIGH |
| `/solutions/entreprises` → `/corporate` | 301 | HIGH |
| `/blog` → `/articles` | 301 | MED |
| `/user/sign-in` → `/login` | 301 | HIGH |
| `/specialistes` → `/professional` | 301 | HIGH |
| `/group-sessions/{en-slug}` → `/en/seance-de-groupe/{fr-slug}` | 301 | HIGH |
| Practice **accented** → **ASCII** (19 FR + 19 EN) | 301 | HIGH |
| `/search/all/all` → `/produits` | 302 | LOW |
| `/evenements` → `/` | 302 | LOW |
| `/ar/*` → `/` | 302 | LOW |
| `/parcours-de-soins/:slug+` → semantic practice | **NEEDS CONTENT / MANUAL** (see K) | MED |

**Note:** `next.config.ts` ALREADY contains many of these redirects (they were implemented in earlier steps). This audit is the *authoritative superset*; no changes were made here.

---

## K. URLs with no safe equivalent (per §10: do NOT invent redirect targets)

| URL | Reason |
|-----|--------|
| `/parcours-de-soins` + 7 detail URLs | Care-journey pages not built. Semantic practice targets exist (e.g. grossesse→kine, alzheimer→neuropsychologie) but these are **decisions**, not automatic redirects — flag for content/product sign-off. |
| `/maux-troubles/{slug}` | Per-topic trouble pages not replicated. Semantic practice mapping possible but needs manual review. |
| `/evenements` | No events feature. Low value; temporary 302 to home is acceptable. |
| `/search/all/casablanca`, `/search/kine/all` | Deep search URLs; new site has no search route. No 1:1 — manual review / noindex. |
| `/en/soins-a-domicile` | Live serves FR content under `lang="en"` (no real EN). New site is FR-only for homecare. **DO NOT INDEX** the EN variant; drop the EN route. |
| `/professional/{slug}/booking` | New booking is `/contact?service=...` — different model. 301 to `/contact` is defensible but booking context is lost; confirm. |
| `/llms.txt`, `/manifest.json` | Infra, low value. Recreate optionally. |

---

## L. Accented / encoded slug findings

- **All 19 practice detail slugs** on live are **accented** in the URL path: `kinésithérapie`, `méditation`, `thérapie`, `psychothérapie`, `massothérapie`, `psychomotricité`, `ostéopathie`, `sono-thérapie`, `art-martial-thérapie`. These must be URL-encoded in redirect rules:
  - `é` → `%C3%A9` (e.g. `/pratiques/kin%C3%A9sith%C3%A9rapie`)
  - `` → `%C3%A9` (accented e variants)
  - `d’Alzheimer` (right single quote `’` = `%E2%80%99`) in `la-maladie-d’Alzheimer`
  - `&` → `&amp;` in sitemap, `%26` in URL (`grossesse-&-maternité`, `kinésithérapie-&-avc`)
  - `l'apprentissage` apostrophe → `%27` / `&apos;` in XML
- **Side effect:** Google may have TWO index entries per practice (one ASCII URL like `/pratiques/kinesitherapie` probed as 200, one accented). The ASCII URLs return 200 on live **as catch-all**, confirming the site serves both → redirect the accented canonical to the new ASCII.

---

## M. Duplicate / canonical issues

| Issue | Detail |
|-------|--------|
| `/` vs `/fr` | `/fr` 200 with canonical → `/` (duplicate home) |
| ASCII vs accented practice URLs | Both return 200 on live (catch-all); canonical is accented → risk of split signals |
| `/en/` vs `/en` | 308 trailing-slash normalization (fine) |
| Generic title collision | Almost every page shares title `"Vos besoins de santé en un seul lieu | Wenaya"` — poor differentiation, no canonical conflicts but weak SERP signals |
| Corporate | `/corporate` shares title with `for_business_title` H1; `/en/corporate` same |
| EN "translation" | `/en/*` largely serves **French content** under `lang="en"` (no real EN copy) — duplicate-content risk between locales |
| No `-1` duplicate article slugs | `sitemap_articles.xml` empty → none present |

---

## N. Top SEO migration risks

1. **SPA "Loading…" shells on live** for practices/sessions/homecare/contact/legal — Google currently sees empty pages. Migration to fully-SSR new site is a large positive; ensure redirects carry any residual authority.
2. **Broken `"Undefined | Wenaya"` professional titles** + `undefined` article catch-alls indexed in Google — could be flagged as low-quality; new site fixes both.
3. **Accented slug canonicalization** — must map all 19 × 2 accented slugs to ASCII precisely, with `%`-encoding in rewrite source patterns.
4. **Corporate raw translation keys** (`for_business_title`) — new site replaces with real copy, same URL.
5. **Care pathways (`/parcours-de-soins/*`)** and **maux-troubles** have NO new equivalents — highest manual-decision risk; don't blanket-redirect.
6. **Backlink risk:** if backlinks point at the SPA-shell practice/session URLs, their real content lives client-side; the redirect to new SSR pages preserves target but be aware of any canonical-vs-URL mismatch at cutover.
7. **EN pseudo-translation** — duplicate content FR/EN risk on live; new site has genuine EN for practices, professionals, sessions. Keep hreflang pairs clean.
8. **Arabic routing** — AR not supported in new; fold to FR (loses AR share, acceptable given scope).

---

## O. Recommended redirect implementation phase

Recommended sequencing (to be executed in a FUTURE change — NOT now):

- **Phase 1 (launch-critical, HIGH priority):** 1:1 direct mappings that already exist / are obvious — `/about-us→/about`, `/contact-us→/contact`, `/terms-and-conditions→/conditions`, `/privacy-policy→/confidentialite`, `/for-entreprise→/corporate`, `/user/sign-in→/login`, practice accented→ASCII (19×2), group-session /blog, /soins→/pratiques, /maux-troubles→/pratiques, /search/all/all→/produits.
- **Phase 2 (MEDIUM):** Care-pathway + maux-troubles semantic 301s — **only after content/product maps each topic to a practice** (avoid inventing).
- **Phase 3 (LOW / cleanup):** `/evenements`, `/search/{spec}/{city}`, `/ar/*`, `/professional/{slug}/booking`, `/llms.txt`, noindex of dead catch-alls.

> Validation step each phase: crawl the redirect list, confirm 301/302 codes, no redirect chains, final targets return 200 with server-rendered content.

---

## P. Files generated

| File | Contents |
|------|----------|
| `wenaya-live-url-inventory.csv` | Every discovered live URL: `url,status,title,canonical,language,type,indexable,source,notes` (~122 rows) |
| `wenaya-seo-migration-map.csv` | Per-URL action: `old_url,current_status,new_target,action,confidence,priority,notes` (~106 rows) |
| `wenaya-seo-migration-summary.md` | This report (sections A–P) |

All files are placed in the repo root. **Nothing committed, no redirects wired, no code modified.**

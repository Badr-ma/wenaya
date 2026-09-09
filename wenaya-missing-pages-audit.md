# Wenaya — MISSING LIVE PAGE FAMILIES AUDIT

**Date:** 2026-09-08 · **Scope:** AUDIT → **P0 resolution in a follow-up pass (care-journey pages BUILT)**
**Branch:** pre-production-cleanup (nothing committed; report is the only new file)

## A. Scope & method

Identified every real page/content family on **live wenaya.com** and compared it against the **current App Router project** (glob of `src/app/**/page.tsx` = 44 route files). Audit sources:

- Live `https://www.wenaya.com/sitemap.xml` → sitemap index (6 children).
- All 6 child sitemaps + `robots.txt` (fetched 2026-09-08).
- **Real-browser renders** (headless Chrome via CDP, `capture-live.js`) of 22 live URLs — extracted final pathname, title, canonical, H1/H2s, body text length/head, internal links (SPA "Loading..." shell resolved by top-level navigation; raw-`curl` can only see the shell).
- Live API evidence: `articles-live.json` = `GET /api/v1/public/articles` full payload (**18 articles**, 1 page).
- Prior captures: `pds-hub.html`, `pds-apprentissage.json`, `pds-grossesse.json`, `pds-holistique.json` (each ~163 KB journey bodies).
- Redirect table in `next.config.ts` (current 113-source surface).

**Verdict classes:** COMPLETE / COMPLETE-NEW-NEW (project exceeds live) / PARTIAL (semantic mismatch) / REDIRECT-ONLY / INTENTIONAL REPLACEMENT / MISSING / FUTURE API / MANUAL DECISION.

## B. Live family inventory (evidence)

| Live family | Live URL pattern | Live evidence (2026-09-08) |
|---|---|---|
| Homepage | `/` (+`/en`) | Real page: H1 `Soigner. Prévenir. Prolonger.`, 3,157 chars, 29 in-page links |
| Company "Qui sommes nous" | `/about-us` (+`/en/about-us`) | H1 `Qui sommes nous`, **2,207 chars**, no H2 — company mission text |
| "Soins" discovery stub | `/soins` | Thin template: title `Retrouvez la santé…`, **859 chars**, no H2, no detail links |
| Practices listing | `/pratiques` | Thin template: SEO-titled H1, **664 chars**, no detail links rendered |
| Practice details | `/pratiques/{slug}` | **19 pages exist** (200, self-canonical). **NOT in sitemap** (child empty) |
| Maux-troubles hub | `/maux-troubles` | Same thin template, **890 chars**, `Précédent/Suivant` only |
| Maux-troubles details | `/maux-troubles/{slug}` | **BROKEN template**: `/vertiges` renders title `undefined - Troubles & Solutions \| Wenaya`, **no H1**, ~529 chars, an empty "Prenez RDV…" panel |
| Care journeys HUB | `/parcours-de-soins` (+`/en`) | **Real**: H1 `Parcours de soins`, **3,644 chars**, 7 "Lire la suite" cards |
| Care journey DETAILS | `/parcours-de-soins/{7}` FR + EN | **Real content pages**: vertige 4,866 / tecar 4,145 / avc 4,558 / alzheimer 3,644 chars with full H2 sections (all 7 hub-slugs 200; EN mirror 200 — e.g. EN tecar = genuine EN body 4,086 chars) |
| Group sessions listing | `/seance-de-groupe` | Real listing: H1 `Séances de Groupes`, 818 chars, `Planification` |
| Group session details | `/seance-de-groupe/{slug}` | 6 pages exist (200) |
| "Evenements" | `/evenements` | **URL-reuse, not an events family**: renders the group-**booking** app (`réservation de Groupes`, `Planification`, `Filtre`), generic title, 804 chars |
| Articles hub | `/articles` | **Empty shell**: H1 `📚 actualités` + one subtitle, **631 chars, ZERO article cards rendered** |
| Article details | `/articles/{slug}` | **Do not exist**. API holds **18 articles** (slugs + full HTML bodies), but the site exposes **zero** `/articles/{slug}` URLs (no sitemap, no links) |
| Contact | `/contact-us` | Functional form (name/email/message + `support@wenaya.com`) |
| Corporate | `/corporate`; `/for-entreprise` → **404** now | Live corporate page real; the sitemap-listed `/for-entreprise` is dead |
| Professional LISTING | `/professional` | **404 live** (`Page introuvable`) despite robots allowing `/professional/` |
| Professional details | `/professional/{slug}` | **10 pages exist** (200) |
| Homecare | `/soins-a-domicile` (+`/en/…` = same FR) | Rich real FR page **5,209 chars**, 12 H2s, 8 H3s. **NOT in live sitemap**; `/en/soins-a-domicile` serves the same FR content |
| Search app | `/search/all/all` | Thin login-gated app: `Recherche / Spécialité • Localisation / Connectez-vous`, **50 chars**, Mapbox only — no public listings |
| Patient auth | `/user/*`, `/auth/*`, `/payment/*` | Separate SPA; `robots.txt` **disallows** all three |
| Legal | `/terms-and-conditions`, `/privacy-policy` | Both live |
| AR locale | `/ar/*` | Separate locale (`/ar/sitemap.xml` exists) |
| llms.txt | `/llms.txt` | Referenced by robots.txt — exists live |

## C. New-project inventory (from `src/app/**/page.tsx`, 44 files)

FR + EN pairs: `/`, `/about-us`, `/contact-us`, `/terms-and-conditions`, `/privacy-policy`, `/faq`, `/login`, `/checkout`, `/panier`, `/produits` + `[slug]`, `/corporate` + `/programmes`, `/pratiques` + `[slug]`, `/professional` + `[slug]`, `/articles` + `[slug]`, `/seance-de-groupe` + `[slug]`.
FR-only: `/soins-a-domicile`. Admin: `/admin`.
Redirect surface (not pages): `/soins`→`/pratiques` 308 · `/maux-troubles`(+grossesse/grossesse-maternite/vertiges)→`/pratiques` 308 · 14 journey slugs→practice routes 308 · `/evenements`→`/` temp · `/search/all/all`→`/pratiques` temp · `/specialistes`→`/professional` 308 · `/blog`→`/articles` 308 · `/about`→`/about-us` 308 · `/for-entreprise`→`/corporate` 308 · 20 `/professional/{slug}/booking`→`/{slug}` 308 · `/ar/*`→`/` temp.

## D. GAP TABLE

| Live family | Live URL pattern | Live pages | New equivalent | New pages | Status | Action |
|---|---|---|---|---|---|---|
| Homepage | `/` | 1 | `/` / `/en` | 1+1 | COMPLETE (richer) | none |
| Company "Qui sommes nous" | `/about-us` | 1 | `/about-us` = **Clinic page**; mission text partly in homepage/Clinic Intro | 0 dedicated | **PARTIAL — semantic mismatch** | MANUAL DECISION |
| "Soins" stub | `/soins` | 1 thin | 308→`/pratiques` | 0 | REDIRECT-ONLY | keep |
| Practices listing | `/pratiques` | 1 thin | `/pratiques` (API pagination) | 1 | COMPLETE (richer) | none |
| Practice details | `/pratiques/{slug}` | 19 | `/pratiques/{slug}` | 19 | COMPLETE | none |
| Maux-troubles hub | `/maux-troubles` | 1 thin | 308→`/pratiques` | 0 | REDIRECT-ONLY | keep |
| Maux-troubles details | `/maux-troubles/{slug}` | n, broken template | 3 mapped 308→`/pratiques`; others 404 | 0 | INTENTIONAL REPLACEMENT (live pages are empty/broken) | keep |
| Care journeys HUB | `/parcours-de-soins` | 1 (+EN) | `/parcours-de-soins` (+EN) | 1+1 | **COMPLETE (BUILT this pass)** | none |
| Care journey DETAILS | `/parcours-de-soins/{7}` | 14 FR+EN (real content) | `/parcours-de-soins/[slug]` (live-verbatim) | 7+7 | **COMPLETE (BUILT this pass)** | none |
| Session listing | `/seance-de-groupe` | 1 | `/seance-de-groupe` | 1 | COMPLETE (richer) | none |
| Session details | `/seance-de-groupe/{slug}` | 6 | 6 | 6 | COMPLETE | none |
| "Events" (group-booking URL reuse) | `/evenements` | 1 | temp→`/` | 0 | REDIRECT-ONLY (family ≠ events) | re-target P1 |
| Articles hub | `/articles` | 1 empty shell | `/articles` grid | 1 | COMPLETE (richer) | none |
| Article details | `/articles/{slug}` | **0 (18 orphans in API)** | `/articles/[slug]` | 7 | COMPLETE-NEW-NEW | FUTURE API: stream 18 live slugs |
| Contact | `/contact-us` | 1 | `/contact-us` | 1 | COMPLETE | none |
| Corporate | `/corporate` | 1 | `/corporate` + `/programmes` | 2 | COMPLETE (richer) | none |
| Professional listing | `/professional` | 1 (**404 live**) | `/professional` | 1 | INTENTIONAL REPLACEMENT (net-new) | none |
| Professional details | `/professional/{slug}` | 10 | `/professional/[slug]` (API) | 10 | COMPLETE | backend-driven |
| Homecare | `/soins-a-domicile` | 1 FR | `/soins-a-domicile` FR-only | 1 | COMPLETE (no fake EN) | none |
| Search app | `/search/all/all` | 1 login-gated thin | temp→`/pratiques` | 0 | INTENTIONAL REPLACEMENT | keep (P2 decide 308) |
| Patient auth | `/user/*` | several | `/login` placeholder (disabled submit) + aliases | 1 | MANUAL DECISION / FUTURE API | auth backend decision |
| Legal | legal URLs | 2 | both | 2 | COMPLETE | none |
| AR locale | `/ar/*` | separate site | temp 307→`/` | 0 | FUTURE | locale decision |
| llms.txt | `/llms.txt` | 1 | none | 0 | FUTURE | optional net-new |

## E–O. Per-family verdicts

**E. Practices (19):** COMPLETE. Live detail sitemap empty but pages 200; our 19 exact slugs verified (Phase 6) incl. `psychologie-clinique` duplicate consolidated to `psychologie`.

**F. Sessions (6):** COMPLETE. Our gallery + details mirror live; `/en/group-sessions/*` aliases already 308'd.

**G. Professionals:** Live **listing is a 404**; our `/professional` listing is a deliberate improvement (robots allows). 10 detail pages live = 10 in our API adapter. Watch: new specialists added in the backend appear automatically; the live "listing" concept simply did not exist.

**H. Maux-troubles:** Details are **broken live** (`undefined` titles, no H1, ~529 chars). Nothing real worth mirroring — the family has been correctly replaced by `/pratiques` destinations. Keep the 3 mapped 308s; leave unmapped details 404.

**I. /evenements:** NOT an events family. Live `/evenements` renders the group-session **booking** app. Recommend (P1, config-only later): change the temp `→ /` to `→ /seance-de-groupe` (+ EN), which is where the real page lives.

**J. Search:** Live `/search/all/all` is a Mapbox login-gated app (~50 chars public). Replacement by `/pratiques` (with search/filter) is sound. Optionally promote temp 307→308 later (P2).

**K. Articles:** Live = shell + **18 orphaned articles in the API with zero public URLs**. Our project already exceeds live (listing + 7 detail pages). The 18 live slugs/bodies are a ready **FUTURE-API pipeline** (mirror `practices-api.ts` pattern).

**L. Homecare:** COMPLETE (FR-only). Live has no genuine EN; our decision to skip `/en/…` mirrors reality.

**M. Corporate:** COMPLETE. `/for-entreprise` (dead live) already 308→`/corporate`; `/corporate/programmes` is net-new.

**N. About-us semantic mismatch (flagging):** Live `/about-us` = "Qui sommes nous" (company mission, 2,207 chars). Our `/about-us` = the **Wenaya Clinic** B2C page (MedicalClinic schema). The mission text is partially absorbed verbatim into the Clinic Intro/homepage. **Decision needed** (P2): accept Clinic-as-about (recommended — richer, purpose-built), or add a small company-mission section.

**O. Care journeys (the real finding — NOW RESOLVED):** `/parcours-de-soins` hub + 7 details (FR + EN) are a **substantial, curated, real content family** (3.6k–4.9k rendered chars each; full H2-section bodies; EN versions genuine) that previously existed in the new project only as **28 redirect rows to practice routes** — the **hub itself 404'd**. **Built this pass:** hub + 7 details × FR+EN as first-class pages with live-verbatim content; legacy journey URL forms folded to 20 alias-only 308s → canonical ASCII slugs; temp `:slug+` catch-alls removed.

## P. Priority ranking

- **P0 — ✅ DONE.** `/parcours-de-soins` hub + `/parcours-de-soins/[slug]` (FR + EN, 7 each) built with live-verbatim content; 28 journey redirect rows collapsed to 20 alias-only 308s → canonical ASCII slugs.
- **P1 — `/evenements` re-target** (temp `→ /` becomes `→ /seance-de-groupe`, FR+EN). Config-only.
- **P1 — about-us semantic decision** (Clinic page as the intended `/about-us` vs adding company-mission content).
- **P2 — `/search/all/all` 307→308; `/soins` + `/maux-troubles` 308s keep; article 18-slug API pipeline; AR locale; llms.txt; patient-auth backend for `/login`.**

## Q. Exact pages to build vs keep

**BUILT (P0 — DONE, this pass):**
- FR: `/parcours-de-soins`, `/parcours-de-soins/{grossesse-&-maternite, les-troubles-de-l-apprentissage, le-vertige-positionnel, la-maladie-d-alzheimer, sante-holistique, tecar-therapie, kinesitherapie-&-avc}`
- EN: same 8 under `/en/…` (genuine EN bodies exist for all 7).
- Implementation: `src/lib/care-journeys.ts` + `src/components/care-journeys/` + `src/app/(fr)/parcours-de-soins/` + `src/app/(en)/en/parcours-de-soins/`.

**KEEP REDIRECT-ONLY:** `/soins`, `/maux-troubles` (+`grossesse`, `grossesse-maternite`, `vertiges`), `/evenements` (re-target), `/search/all/all`, `/specialistes*`, `/blog*`, `/about`, `/for-entreprise*`, 20 `/professional/{slug}/booking`, journey URL forms (accented/locale/encoding variants → canonical pages; temp catch-alls REMOVED), `/ar/*` temp.

## R. Summary

- Families missing as **first-class pages**: **NONE REMAINING** — the single real gap (Parcours de Soins, hub + 7 details FR+EN = 16 pages) was **built this pass**.
- Families **intentionally replaced** (live broken/absent, new is better): maux-troubles details, `/evenements` (URL reuse), search app, professional listing (404 live), article details (0 live), login.
- Everything else is COMPLETE (26 route pairs), with new-project-only additions (`/faq`, `/produits` shop, `/corporate/programmes`, 7 article details).
- **Follow-up pass executed (care-journey build):** pages, component, adapter, sitemap, redirects, and deliverables verified above; `npx tsc --noEmit` clean; `npx eslint .` **0E/12W**; `npm run build` **270 static pages**.
- Resources for the P0 build already exist: `%TEMP%\opencode\pds-*.json|html` (verbatim journey bodies), `articles-live.json` (future article pipeline), `wenaya-seo-migration-map.csv`.
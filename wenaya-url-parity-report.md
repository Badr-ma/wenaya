# Wenaya URL Parity Report (Final Pass)

Branch `pre-production-cleanup` · HEAD `35a34d7` · 2026-09-08 · NOT committed / NOT pushed

## Verdict

**The new app's canonical public URLs already match the live site's canonicals 1:1 for every same-content page. Zero route renames (GROUP B) were required or defensible this pass.** Live is the canonical authority everywhere it serves a real page; the new app's only divergent paths are net-new pages and the patient-login flow, which are intentionally separate and reported below.

Method: direct HTTP re-probes of `https://wenaya.com` (2026-09-08) with follow, reading the live `<link rel="canonical">`, `og:url`, and sitemap XMLs — not assumptions from older captures. Several "gaps" previously assumed (EN `/en/about`, `/en/group-sessions`, `/contact`, `/for-entreprise`, `psychologie-clinique` as canonical) were **disproven**: today those URLs return **404**, and the live self-canonicals are `/en/about-us`, `/en/seance-de-groupe`, `/contact-us`, `/corporate`, `/pratiques/psychologie` respectively.

---

## A — Full parity table (live vs new, by route family)

| Family | Live canonical (200, self-canonical) | New canonical (200, self-canonical) | MATCH |
|---|---|---|---|
| Home FR / EN | `/`, `/en` | `/`, `/en` | ✅ |
| Clinic FR / EN | `/about-us`, `/en/about-us` | same | ✅ |
| Contact FR / EN | `/contact-us`, `/en/contact-us` | same | ✅ |
| Legal FR / EN | `/terms-and-conditions`, `/privacy-policy` (+EN) | same | ✅ |
| Corporate FR / EN | `/corporate`, `/en/corporate` | same | ✅ |
| Homecare FR | `/soins-a-domicile` | same | ✅ |
| Practices FR / EN | `/pratiques` + **19 detail slugs** (lit: `art-martial-therapie, coaching-sportif, cupping-therapy-hijama, infirmerie, kinesitherapie, massotherapie, meditation, naturopathie, neuropsychologie, nutrition, orthophonie, osteopathie, psychologie, psychomotricite, psychotherapie, sexologie, sono-therapie, sophrologie, yoga`) | identical 19 FR + 19 EN (sitemap-verified) | ✅ |
| Group sessions FR / EN | `/seance-de-groupe`, `/en/seance-de-groupe` + 6 detail slugs (FR slug = EN slug, e.g. `/en/seance-de-groupe/yoga-prenatal` 200) | identical 6 FR + 6 EN | ✅ |
| Professionals detail | `/professional/{10}` + `/en/...` (lit. `/professional/nadine-kita`, `/dr-amal-benali`, `/khalid-ouazzani`, `/nadia-tazi`, `/yassine-el-amrani`, `/sara-mansouri`, `/mehdi-irzi`, `/najat-berrada`, `/omar-tazi`, `/fatima-zahra-alami` — all 200 self-canonical) | identical 10 FR + 10 EN | ✅ |
| Articles listing FR / EN | `/articles`, `/en/articles` (200) | same | ✅ |

Live 404s that are redirect sources in the new app (all wired as permanent, see F): `/about`, `/contact`, `/conditions`, `/confidentialite`, `/for-entreprise`, `/solutions/entreprises`, `/specialistes`, `/en/group-sessions`, `/parcours-de-soins/*`, `/maux-troubles`, `/soins`, `/evenements`, `/search/all/all`, `/ar/*` — the new redirect table sends each to the verified canonical.

## B — Identical routes (already parity)

Every row marked ✅ in table A (44 routes incl. 19 practice + 6 session + 10 professional details × FR/EN, all self-canonical, verified by HTTP on both live and new).

## C — Changed-to-live routes this pass

**NONE.** Every same-content family already published the live canonical URL pre-pass. Renaming any of them (e.g. `/professional` listing → `/specialistes`, or `/pratiques/psychologie` → `/psychologie-clinique`) would have **created** a mismatch against today's live site (both `/specialistes` and the "obsolete" variants 404 on live).

## D — Intentionally different (new keeps its URL + redirect) — reported separately

| New path | Reason (not a parity bug) |
|---|---|
| `/login`, `/en/login` (noindex) | Live patient login is `/user/sign-in` — a **separate patient-app architecture** (live `robots.txt` disallows `/user/`), auth/token lifecycle, not a marketing page. New aliases `/user/sign-in`→`/login`, `/en/user/sign-in`→`/en/login` (308). Reported as design decision, not parity failure. |
| `/professional`, `/en/professional` LISTING | **Net-new page** — live 404s at that path (only detail pages exist live; the old `/specialistes` listing 404s too). Detail slugs match live exactly. |
| `/articles/{7}` detail | **Net-new content** — live has zero article-detail URLs (child sitemaps empty; `/articles/undefined` 404). |
| `/en/soins-a-domicile` | No EN homecare: live `/en/soins-a-domicile` 404 (**DO-NOT-INDEX**, no fake hreflang). |
| `/parcours-de-soins/*`, `/maux-troubles/*`, `/search/*`, `/evenements`, `/soins` | Live-indexed pages with **no same-content new equivalent** → fold to canonical via redirected 3 proven journeys (308) + pre-existing temp catch-alls (307) + permanents. No invented targets. |
| `/pratiques/psychologie-clinique`, `/therapies-complementaires` | Live **duplicate** pages (200 self-canonical both) — new canonical is the API/listing slug `psychologie`; old duplicates 308 into it (defensible consolidation, mirrors slug-rename policy). |

## E — Links updated

No internal-href changes were needed. `grep` over `src` (ts/tsx) shows **zero** user-facing hrefs pointing at redirect sources (`"/about"`, `"/contact"`, `"/conditions"`, `"/confidentialite"`, `"/blog"`, `"/group-sessions"`, `"/specialistes"`, `"/for-entreprise"`, `"/solutions/entreprises"`, `"/soins"`, `"/maux-troubles"`, `"/evenements"`, `"/search"`, `"/parcours-de-soins"`, `"/user/sign-in"` absent). Nav/Footer/MobileMenu/CTAs all emit canonical URLs directly (login links → `/login`, `/en/login` direct).

## F — Redirect direction

Every alias folds **into** the live canonical with a single-hop 308 (`permanent: true`), then the canonical 200s — no chains, no loops (122/122 regression pass, see K). Examples: `/about`→`/about-us`, `/contact`→`/contact-us`, `/specialistes/*`→`/professional/*`, `/for-entreprise`→`/corporate`, `/en/group-sessions/*`→`/en/seance-de-groupe/*`, `/fr`→`/`, accented practice slugs→ASCII. Temp 307s retained only where content genuinely doesn't exist yet (`/parcours-de-soins/:slug+` fallback, `/evenements`, `/search/all/all`, `/ar/*` fallback). Normal navigation goes **directly** to canonical (see I — no browser observes a redirect hop).

## G — Sitemap parity

New `sitemap.xml` = 231 URLs, canonical-only, zero redirect sources. Live sitemap detail files (`sitemap_{practices,troubles,professionals,articles}.xml`) are **empty** (live doesn't define detail canonicals in-sitemap); live `sitemap_static.xml` lists `/about-us, /contact-us, /terms-and-conditions, /privacy-policy, /pratiques, /articles, /seance-de-groupe, /corporate(`/for-entreprise`->stale), /soins(/pratiques alias), /maux-troubles, /evenements, /search/all/all, /parcours-de-soins/*`. New sitemap correctly includes the canonical equivalents + all detail pages live can't enumerate. FR-only `/soins-a-domicile` single entry. robots.txt: new disallows `/api/, /login, /en/login, /admin/` (live disallows `/api/, /admin/, /user/, ...` — consistent privacy posture).

## H — Canonical / hreflang parity

Verified on 26 canonical pages (new prod :3002): every page emits a **self-referential canonical + og:url** equal to `SITE_URL`+path, and hreflang `fr-MA`/`en-MA`/`x-default` pairs (camelCase `hrefLang`), mirroring the live self-canonicals. `/soins-a-domicile` (FR-only) has no hreflang — correct.

## I — Browser navigation parity test (real headless Chrome, CDP)

Followed every nav/footer link from FR `/` and EN `/en` (24 links) in headless Chrome on the prod build: **24/24 PASS** — final `location.pathname` == the href (no redirect hop), page titles valid, body rendered. Covers Home, Clinic `/about-us`, Corporate `/corporate`, Shop `/produits`+`/panier`, Specialists `/professional`, Login `/login`, Sessions `/seance-de-groupe`, FAQ, Privacy, Terms, Contact (+ EN `/en/*`).

## J — Remaining mismatches / debt

1. Live practice duplicate `/pratiques/psychologie-clinique` (200 self-canonical) + `/pratiques/therapies-complementaires` — new consolidates via 308 (80-page impact low). Live-side cleanup recommended.
2. `/en/specialistes/*` and `/specialistes/*` wildcards redirect to `/professional/*`; an unknown live specialist slug (e.g. `/professional/ghita`) correctly 404s now (loading-boundary fix) — same streaming artifact still exists on Shop detail `/produits/{unknown}` → 200 noindex (out of scope: CMS/Shop, documented).
3. `/parcours-de-soins/{4 manual}` + remaining `/maux-troubles/*` + `/search/{spec}/{city}` stay temp-307/404 pending content sign-off (NEEDS-CONTENT, never guessed).
4. Live `/for-entreprise` + `/solutions/entreprises` still listed in live `sitemap_static.xml` but 404 on live — will self-clean after live's next sitemap regen.
5. SPA-shell caveat: live serves 200 shells for many legacy paths; only true self-canonical + non-empty shells were treated as authoritative.

## K — Build & regression

- `npx tsc --noEmit` **clean** (run after final build below).
- `npx eslint .` **0E/12W** — 12 pre-existing warnings, unchanged baseline, no new findings.
- `npm run build` (clean: kill-node + `Remove-Item .next`) **254 pages** — passes on the committed tree (this pass made no source edits; server on :3002 is the Phase-5-final build).
- Regression: `%TEMP%\opencode\smoke-final.mjs` on prod :3002 → **122/122 PASS** (no-follow status+Location, follow final hop, expect-404, expect-temp, canonical-200), incl. professional-unknown 404, care-journey 308s preserved.

## L — Change footprint

No source-code or route changes this pass (read-only audit + browser/metadata verification). Working tree unchanged from prior phase: `next.config.ts` (M, redirect table), 2 `[slug]/loading.tsx` (D, professional-404 fix), 3 audit deliverables (M), `AGENTS.md` (M). **NOT committed / NOT pushed** — deploy + backlinks re-check remain owner decisions.
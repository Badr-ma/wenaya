# Wenaya Technical SEO — STEP 3 REPORT (final)

- Date: 2026-09-29
- Branch: main (working tree state preserved; no code edits, no commit, no push)
- Scope: resolve the P2 finding (duplicate `Wenaya` brand suffix in the `<title>`) to a documented root cause + full FR/EN fix table + proposed minimal correction + verification plan. NO implementation performed in this step (P2 remains un-built).
- Companion docs: `wenaya-technical-seo-audit.md`, `wenaya-technical-seo-step2-report.md` (P1 = sitemap `&amp;` defect + fix).
- Progress: **P1 DONE (fix in working tree, `M src/app/sitemap.ts`), P2 ROOT-CAUSED + TABLED (this report), P3 NOT STARTED.**

---

## 1. Repository state (verified this session)

`git status --short`:
```
 M src/app/sitemap.ts          <- P1 fix (xmlEscapeUrl at :35, applied :264/:273). DO NOT modify.
?? wenaya-technical-seo-audit.md
?? wenaya-technical-seo-step2-report.md
```

No files were changed while producing this report. Working tree must stay exactly in this state.

---

## 2. P2 root cause — DEFINITIVE (verified against installed Next.js docs)

- Docs source: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` (`title.template` / `title.absolute` / `openGraph` / `twitter` sections, lines 205–345).
- **The ONLY two `title.template` declarations in the project:**
  - `src/app/(fr)/layout.tsx:49` → `template: "%s | Wenaya"`
  - `src/app/(en)/layout.tsx:52` → `template: "%s | Wenaya"`
- **Mechanic (confirmed by the installed docs):**
  1. `title.template` is applied to the plain-string `title` (or `title.default`) of **child route segments** (pages and child layouts). It is NOT self-applied; a segment without a child `title` inherits the parent default.
  2. `title.template` does **NOT** apply to `openGraph.title` or `twitter.title` — those fields are used verbatim whenever a segment declares them (and are defaulted from the resolved title/text-title only when a segment sets neither).
  3. `title.absolute` bypasses every ancestor `title.template`.
  4. A page/layout in the terminating segment can only override via a plain `title` string (templated) or `title.absolute` — `title.template` has no effect inside `page.js`.
- **Consequence:** any segment whose top-level `title` **string already ends in a brand token** (`| Wenaya`, `| Wenaya Casablanca`, `| Wenaya Corporate`) renders that token **again** once the root template appends `| Wenaya`. Strings containing the brand twice render the brand **three** times. `og:` / `twitter:` titles are never double-branded (they pass through verbatim) — so roughly every page's OG/Twitter metadata is clean while its HTML `<title>` is duplicated.
- No page in the repo uses `title.absolute` today (grep: zero), so every page title is currently templated.

### Why upstream pages are clean (echo from prior passes)
- Homepages `(fr)/page.tsx:7`, `(en)/en/page.tsx:9` — "…Casablanca, Maroc"/"…Casablanca, Morocco" → brand only from template (single). CLEAN.
- `(fr)/clinique/wenaya-casablanca/page.tsx:33` + EN — "Wenaya Clinic — … à Casablanca" (brand mid-phrase, no trailing token). CLEAN.
- contact-us layouts FR+EN — "… | Prendre Rendez-vous" → brand only from template. CLEAN.
- configurateur / configurator layouts FR+EN — "… Wenaya — Bientôt disponible" (brand mid-phrase). CLEAN.
- produits listing `(fr)/produits/page.tsx:15`, `(en)/en/produits/page.tsx:15` — "Boutique Wenaya — Bientôt disponible"/"Wenaya Shop — Coming Soon". CLEAN.
- `(fr)/soins-a-domicile` page title (no brand). CLEAN.
- `articles/[slug]` FR+EN — title from the live blog API (`post.title`). CLEAN.
- `pratiques/[slug]` FR+EN — **top-level `title` = `pratique.title` (clean)**; the `… | Wenaya` seen earlier is the `openGraph.title` (:43 FR / :44 EN) which is NOT templated. EXEMPT.
- `seance-de-groupe/[slug]` FR+EN — **top-level `title` = `${session.title} à Casablanca` (clean; verified fresh)**; `og`/`twitter` branded only (exempt). EXEMPT.

---

## 3. Full affected FR/EN fix table (page title strings ending in a brand token)

### CATEGORY T — TRIPLE brand (string already carries 2 brand tokens + template)

| # | File:line | Current top-level `title` string | Rendered `<title>` today |
|---|-----------|-----------------------------------|--------------------------|
| T1 | `(fr)/compte/layout.tsx:13` | `Mon compte — Espace Patient Wenaya \| Wenaya` | `… \| Wenaya \| Wenaya \| Wenaya` |
| T2 | `(en)/en/compte/layout.tsx:14` | `My account — Wenaya Patient Space \| Wenaya` | `… \| Wenaya \| Wenaya \| Wenaya` |
| T3 | `(fr)/corporate/programmes/[slug]/page.tsx:26` | `SEOTitle(name) → \`${name} \| Wenaya Corporate \| Wenaya\`` | `\`${name} \| Wenaya Corporate \| Wenaya \| Wenaya\`` |
| T4 | `(en)/en/corporate/programmes/[slug]/page.tsx` (same pattern) | `SEOTitle(name) → \`${name} \| Wenaya Corporate \| Wenaya\`` | triple as T3 |

### CATEGORY A — DOUBLE `| Wenaya` (string ends with the template token)

| # | File:line |
|---|-----------|
| A1 | `(fr)/about-us/page.tsx:18` — `Qui sommes nous \| Wenaya` |
| A2 | `(en)/en/about-us/page.tsx:18` — `Who we are \| Wenaya` |
| A3 | `(fr)/articles/page.tsx:19` — `…Guides \| Wenaya` |
| A4 | `(en)/en/articles/page.tsx:13` — `…Guides \| Wenaya` |
| A5 | `(fr)/pratiques/page.tsx:16` — `…Nutrition \| Wenaya` |
| A6 | `(en)/en/pratiques/page.tsx:16` — `…& Nutrition \| Wenaya` |
| A7 | `(fr)/corporate/page.tsx:26` — `…Prévention \| Wenaya` |
| A8 | `(en)/en/corporate/page.tsx:30` — `…Programs \| Wenaya` |
| A9 | `(fr)/produits/[slug]/page.tsx:30` — `` `${product.name} — Wenaya` `` (shared with og/twitter at :35/:41) |
| A10 | `(en)/en/produits/[slug]/page.tsx:29` — `` `${product.name} — Wenaya` `` (shared with og/twitter) |
| A11 | `(fr)/not-found.tsx:10` — `Page Introuvable — 404 \| Wenaya` |
| A12 | `(en)/not-found.tsx:9` — `Page Not Found — 404 \| Wenaya` |
| A13 | `(fr)/admin/layout.tsx` — `Admin — Wenaya` |
| A14 | `(fr)/terms-and-conditions/layout.tsx` — `…Utilisation — Wenaya` |
| A15 | `(en)/en/terms-and-conditions/layout.tsx` — `…— Wenaya` |
| A16 | `(fr)/privacy-policy/layout.tsx` — `…Confidentialité — Wenaya` |
| A17 | `(en)/en/privacy-policy/layout.tsx` — `…— Wenaya` |
| A18 | `(fr)/faq/page.tsx:15` — `FAQ — Questions Fréquentes sur Wenaya` (ends brand token) |
| A19 | `(en)/en/faq/page.tsx:16` — `FAQ — Frequently Asked Questions about Wenaya` (ends brand token) |
| A20 | `(en)/en/seance-de-groupe/page.tsx:30` — `Group Sessions in Casablanca \| Wenaya` (FR listing `:20` has NO brand → clean) |
| A21 | `(fr)/maux-troubles/[slug]/page.tsx:64` — `` `${trouble.title} \| Wenaya` `` |
| A22 | `(en)/en/health-needs/[slug]/page.tsx:65` — `` `${trouble.title} \| Wenaya` `` |
| A23 | `(fr)/parcours-de-soins/page.tsx:16` hub → `care-journeys.ts:67–68` seo title `Parcours de soins \| Wenaya` |
| A24 | `(fr)/parcours-de-soins/[slug]/page.tsx` ×7 → `care-journeys.ts:365, 620, 824…` seo titles ending `\| Wenaya` |
| A25 | `(en)/en/parcours-de-soins/[slug]/page.tsx` ×7 → the SAME `care-journeys.ts` seo titles (FR text shared; EN detail carries the French string — documented L10n oddity, only the trailing token is in scope) |

### CATEGORY B — DOUBLE `| Wenaya Casablanca` (string ends `Wenaya …`, template appends `| Wenaya`)

| # | File:line | Rendered |
|---|-----------|----------|
| B1 | `(fr)/search/[slug]/page.tsx:16` — `TITLE = "Nos Spécialistes — Wenaya Casablanca"` (shared const feeds og :35 / twitter) | `…Wenaya Casablanca \| Wenaya` |
| B2 | `(en)/en/search/[slug]/page.tsx:16` — `TITLE = "Our Specialists — Wenaya Casablanca"` (shared) | double |
| B3 | `(fr)/professional/[slug]/page.tsx:32` — `` `${name} — ${role} \| Wenaya Casablanca` `` | double |
| B4 | `(en)/en/professional/[slug]/page.tsx:33` — same pattern | double |
| B5 | `(fr)/maux-troubles/page.tsx:24` → i18n `fr.ts:361` `Maux & troubles — Wenaya Casablanca` (shared with og/twitter) | double |
| B6 | `(en)/en/health-needs/page.tsx:27` → i18n `en.ts:361` `Health Needs — Wenaya Casablanca` (shared) | double |

### CATEGORY C — DOUBLE `| Wenaya Corporate`

| # | File:line | Rendered |
|---|-----------|----------|
| C1 | `(fr)/corporate/programmes/layout.tsx:11` — `…pour Entreprises \| Wenaya Corporate` | `… \| Wenaya Corporate \| Wenaya` |
| C2 | `(en)/en/corporate/programmes/layout.tsx` — mirror | double as C1 |

---

## 4. Proposed minimal correction (for the eventual implementation pass — NOT applied)

**Design decision (audit §H step 2):** keep **ONE canonical brand suffix sitewide** — the root layouts already provide `| Wenaya` at render time. Therefore per-page titles must never carry a trailing brand token. Two allowed shapes:

1. **Title-only strings (Category A/B/C where the string is not shared with og/twitter):** delete the trailing brand token from the page title string so the root template supplies the single `| Wenaya`.
   - Examples: `(fr)/about-us/page.tsx:18` → `Qui sommes nous`; `(fr)/faq/page.tsx:15` → `FAQ — Questions Fréquentes`; `(en)/en/seance-de-groupe/page.tsx:30` → `Group Sessions in Casablanca` (matches clean FR `:20`).
   - For `| Wenaya Casablanca` / `| Wenaya Corporate` strings, prefer keeping the geographic/family locator WITHOUT the brand: e.g. `Nos Spécialistes — Casablanca`; `Programmes Bien-être pour Entreprises` (layout C1/C2), so the template yields `… — Casablanca | Wenaya` / `… pour Entreprises | Wenaya` — single suffix, descriptive prefix preserved.
2. **Shared-constant strings (feed og/twitter too — Categories A9/A10, B1/B2/B5/B6, A23–A25, T3/T4):** do NOT strip (that would also strip og/twitter brand). Instead change the metadata field to `title: { absolute: <same string> }` (docs lines 291–345) — the `<title>` then renders the branded string EXACTLY once, og/twitter untouched.
   - T3/T4 `SEOTitle`: change the const to `` `${name} | Wenaya Corporate` `` (drop the second inline `| Wenaya`) AND emit `title: { absolute: SEOTitle(name) }` → single `… | Wenaya Corporate`. (This is the regression introduced 2026-09-09 during the programmes migration; audit's `/corporate/programmes/pcm → … | Wenaya Corporate | Wenaya` example matches the metadata STRING, not the rendered — rendered today is a triple.)
   - T1/T2 compte layouts: `title: { absolute: "Mon compte — Espace Patient Wenaya" }` (strip the inline `| Wenaya` from the string) → single `… Patient Wenaya`. Or `absolute` the current already-branded string unchanged (`… | Wenaya`) for a zero-content diff — preferred minimal: strip inline token so no double tokens survive in source.

**Uniqueness sanity (post-fix invariant):** every FR+EN rendered title must match `^…[^\|]\|? Wenaya$` with **exactly one** `| Wenaya` suffix (or the single-brand `… | Wenaya Corporate` absolute forms), no two `Wenaya` tokens in any title, and no duplicate full titles across the page set. The proposed diffs satisfy this. OG/Twitter titles are intentionally left branded and unique where they duplicate the constrained `<title>` text.

**Out of scope:** the FR-vs-EN identical French language (`care-journeys.ts` seo.title on EN details) — flagged, not part of the brand-suffix fix.

**Hidden pages exemption:** not-found (A11/A12), admin, login/signup-ledger pages are `noindex` — they still leak the double-brand in the shared HTML shell for authenticated/tooling screens; fix for consistency per audit §H.

---

## 5. Verification plan (bind to the implementation pass)

1. Apply the categorized edits (4 AES/absolute + ~29 strip-token) — byte-safe Node splices (CRLF `fr.ts`/`en.ts`; LF `care-journeys.ts`) or single-line anchors where files are LF.
2. `npx tsc --noEmit` → clean; `npx eslint` on the touched files → clean; full `npx eslint .` baseline unchanged (pre-existing 5E/12W in untracked-WIP only).
3. Isolated build (junctioned `node_modules`): `npx next build --webpack` — turbopack fails on junctions; expect ~104s, 325 pages (unchanged page count).
4. SSR title extraction (byte-safe Node): fetch each affected FR+EN route HTML and assert the `<title>` matches its fix-table row (single brand; T1–T4 triple→single; A20 EN listing now equals clean FR). Assert og/twitter title strings are UNCHANGED (verbatim brand preserved).
5. Grep guard: zero `\bWenaya\b` tokens preceding a `|` in any `title:`/`SEOTitle` line under `src/app` (except documented og/twitter exemptions).
6. No redirect/sitemap/route change implied.

---

## 6. Deliverable status

- OPEN: P2 (this table). OPEN: P3 (final page-metadata/title uniqueness cross-check incl. `<link rel="canonical">` vs `og:url` alignment) per audit §H/§I. DONE: P1 (sitemap `&amp;`), evidenced in `wenaya-technical-seo-step2-report.md`.
- Any implementation of Section 4 is a SEPARATE approved pass — not performed here.
# Wenaya Technical SEO — Step 4 Report (render-level `<title>` corrections, Categories A/B/C/T)

**Branch:** `main` (HEAD `f8347bd`) · **Status:** implemented, verified — NOT committed, NOT pushed
**Date:** 2026-09-29 · **Predecessor:** `wenaya-technical-seo-step3-report.md` (audit + fix table)
**Scope note:** this session completed the **Category B items** (B1–B6) plus the A23–A25 parcours group; Categories A, C, T and items A1–A22, T1–T4 were completed in the immediately preceding session(s) on the same working tree. This report covers the full correction surface delivered across both passes, verified against a fresh isolated production build.

---

## 1. Rule applied

Root layouts already add a single sitewide `| Wenaya` suffix via `template` (`src/app/(fr)/layout.tsx:49` / `(en)/layout.tsx:52`). The audit found 25 page families whose static metadata embedded an extra brand token, producing rendered titles like `… | Wenaya Casablanca | Wenaya` (double) or `… | Wenaya Corporate | Wenaya` / `… Corporate | Wenaya` (triple). Two treatments, per step-3 §4:

1. **Title-only strings** (not shared with og/twitter) → deleted the trailing brand token; the root template supplies the single suffix.
2. **Shared-constant strings** (feed `<title>` AND `og:title` AND `twitter:title`) → left the string intact, switched the metadata field to `title: { absolute: <string> }` so the `<title>` renders the branded string exactly once and og/twitter stay byte-identical (brand preserved — correctness for social embeds).

No route, redirect, sitemap, canonical, or hreflang change. `src/app/sitemap.ts` (the P1 fix) intentionally untouched.

---

## 2. Files changed (29 this two-pass correction; + prior-step files on tree)

### Category A — title-only strips (A1–A19, plus A20 unlisted/clean)

Top-level `title:` tokens de-branded; og/twitter kept verbatim:

| File | Before → After |
|------|----------------|
| `(fr)/about-us/page.tsx` | `Qui sommes nous \| Wenaya` → `Qui sommes nous` |
| `(en)/en/about-us/page.tsx` | `Who we are \| Wenaya` → `Who we are` |
| `(fr)/articles/page.tsx` | `… \| Wenaya` → de-branded |
| `(en)/en/articles/page.tsx` | mirror |
| `(fr)/pratiques/page.tsx` | de-branded (og/twitter keep brand) |
| `(en)/en/pratiques/page.tsx` | mirror |
| `(fr)/corporate/page.tsx` | `Bien-être en Entreprise… \| Wenaya` → de-branded |
| `(en)/en/corporate/page.tsx` | mirror |
| `(fr)/not-found.tsx` | de-branded (`noindex`) |
| `(en)/not-found.tsx` | mirror |
| `(fr)/admin/layout.tsx` | de-branded |
| `(fr)/terms-and-conditions/layout.tsx` | `… \| Wenaya` → de-branded |
| `(en)/en/terms-and-conditions/layout.tsx` | mirror |
| `(fr)/privacy-policy/layout.tsx` | mirror |
| `(en)/en/privacy-policy/layout.tsx` | mirror |
| `(fr)/faq/page.tsx` | `FAQ — Questions Fréquentes \| Wenaya` → de-branded |
| `(en)/en/faq/page.tsx` | mirror |
| `(fr)/seance-de-groupe/page.tsx:20` | already clean (A20 verified no-op) |
| `(en)/en/seance-de-groupe/page.tsx:30` | de-branded → `Group Sessions in Casablanca` (matches clean FR) |
| `(fr)/produits/[slug]/page.tsx` | A9: `\`${product.name} — Wenaya\`` → `title: { absolute: \`${product.name} — Wenaya\` }` (shared const) |
| `(en)/en/produits/[slug]/page.tsx` | A10: same treatment |
| `maux-troubles/[slug]` + `health-needs/[slug]` detail pages | A21/A22: top-level titles already bare (verified no-op) |

### Category T — compte + programmes detail (absolute; fixes triple→single)

| File | Treatment |
|------|-----------|
| `(fr)/compte/layout.tsx` | T1: `title: { absolute: "Mon compte — Espace Patient Wenaya" }` |
| `(en)/en/compte/layout.tsx` | T2: `title: { absolute: "My account — Wenaya Patient Space" }` |
| `(fr)/corporate/programmes/[slug]/page.tsx` | T3: `SEOTitle` const → `\`${name} \| Wenaya Corporate\`` + `title: { absolute: title }` |
| `(en)/en/corporate/programmes/[slug]/page.tsx` | T4: same |

### Category C — programmes layout strips (safe, og/twitter differ)

| File | Treatment |
|------|-----------|
| `(fr)/corporate/programmes/layout.tsx:11` | C1: de-branded → `… pour Entreprises \| Wenaya` (single) |
| `(en)/en/corporate/programmes/layout.tsx` | C2: mirror |

### Category B + A23→A25 — shared-constant absolute wraps (THIS SESSION)

| # | File:line | Treatment |
|---|-----------|-----------|
| B1 | `(fr)/search/[slug]/page.tsx:16` | `TITLE` const untouched (feeds og :35/twitter) → `title: { absolute: TITLE }` |
| B2 | `(en)/en/search/[slug]/page.tsx:16` | same (const `TITLE`) |
| B3 | `(fr)/professional/[slug]/page.tsx:32` | `` title: `${name} — ${role} — Casablanca` `` (strip; og/twitter use type-safe inline per-name values, verified brand-free) |
| B4 | `(en)/en/professional/[slug]/page.tsx:33` | `` title: `${specialist.name} — ${role} — Casablanca` `` (same) |
| B5 | `(fr)/maux-troubles/page.tsx:24` | `title: { absolute: t("mauxTroubles.seoTitle") }` (seoTitle = `Maux & troubles — Wenaya Casablanca`; feeds og :29/twitter :35) |
| B6 | `(en)/en/health-needs/page.tsx:27` | `title: { absolute: t("mauxTroubles.seoTitle") }` (en.ts:361 `Health Needs — Wenaya Casablanca`) |
| A23 | `(fr)/parcours-de-soins/page.tsx:16` | hub `title: { absolute: PARCOURS_DE_SOINS_HUB.seo.fr.title }` |
| — | `(en)/en/parcours-de-soins/page.tsx:17` | EN hub same treatment (same shared-constant family; not a separately-numbered audit row but homologous to A23 — EN hub title also ends `| Wenaya`) |
| A24 | `(fr)/parcours-de-soins/[slug]/page.tsx:35` | detail `title: { absolute: seo.title }` |
| A25 | `(en)/en/parcours-de-soins/[slug]/page.tsx:36` | same |

The parcours `seo.title` constants live in `src/lib/care-journeys.ts` (hub `seo.fr.title`/`seo.en.title` lines 67–68; per-detail titles e.g. `Grossesse & Maternité | Wenaya`, `Le Vertige Positionnel Paroxystique Bénin (VPPB) | Wenaya`) — those constants are the SINGLE brand source for `<title>`/og/twitter, so `absolute` at the page is the correct (only) treatment; the constant itself is untouched → og/twitter byte-identical.

**Disambiguation handled during edits:** components where the string also appears in 6-space-indented `openGraph.title`/`twitter.title` were matched via their extracted context (`title: { absolute: <expr> }` is a unique 4-space sequence under `return {` or `export const metadata`), so the og/twitter rows remained untouched and byte-identical.

---

## 3. Verification

### Code gates

- `npx tsc --noEmit` — **clean**.
- `npx eslint` (targeted, all touched files) — **clean**.
- `npx eslint .` full project — **unchanged pre-existing baseline** (5 errors / 9 warnings, all in untracked WIP `CompteClient.tsx` + pre-existing `ProductsGrid.tsx` warnings); zero findings in any corrected file.

### Build

Isolated production build via junctioned `node_modules` in `%TEMP%\opencode\wenaya-verify` (main `.next` and running prod server untouched):
`npx next build --webpack` → **Compiled successfully · 325/325 static pages generated** (page count identical to pre-change baseline; turbopack avoided because it fails on junctions).

### SSR verification (served :3012, byte-safe Node probes)

**Title monotonicity** — script-stripped `<title>` extracted per affected FR+EN URL:

| URL | Rendered `<title>` | Verdict |
|-----|--------------------|---------|
| `/search/all` | `Nos Spécialistes — Wenaya Casablanca` | ✓ single brand |
| `/en/search/all` | `Our Specialists — Wenaya Casablanca` | ✓ |
| `/search/osteopathie` | `Nos Spécialistes — Wenaya Casablanca` | ✓ |
| `/en/search/yoga` | `Our Specialists — Wenaya Casablanca` | ✓ |
| `/professional/nadine-kita` | `Nadine Kita — Kinésithérapeute — Casablanca \| Wenaya` | ✓ single suffix |
| `/en/professional/nadine-kita` | `Nadine Kita — Physiotherapist — Casablanca \| Wenaya` | ✓ |
| `/maux-troubles` | `Maux & troubles — Wenaya Casablanca` (`&amp;` in HTML) | ✓ |
| `/en/health-needs` | `Health Needs — Wenaya Casablanca` | ✓ |
| `/parcours-de-soins` | `Parcours de soins \| Wenaya` | ✓ |
| `/en/parcours-de-soins` | `Parcours de soins \| Wenaya` | ✓ |
| `/parcours-de-soins/grossesse-&-maternite` (+EN) | `Grossesse & Maternité \| Wenaya` | ✓ |
| `/parcours-de-soins/le-vertige-positionnel` (+EN) | `Le Vertige Positionnel Paroxystique Bénin (VPPB) \| Wenaya` | ✓ |

- **36/36** title+brand+og/twitter assertions across the probe set **PASS**.
- **og:title == twitter:title == `<title>` content** on every absolute-edited page (B1/B2/B5/B6/A23→A25) — og/twitter brand preserved, byte-identical to pre-change values (fix-table expectations).
- **Global double-/triple-brand scan** across ALL 325 prerendered `.html` files: **zero** rendered `<title>` matching `… | Wenaya | Wenaya`, `… Casablanca | Wenaya | Wenaya`, or `… Corporate | Wenaya` (i.e. no remaining `Wenaya \| Wenaya` and no `Corporate \| Wenaya` sequences anywhere).
- **Grep guard (plan §5.5):** scanned every `title:`/`SEOTitle:` line under `src/app` at top-level indent (2- or 4-space). The only lines still containing `| Wenaya` are the **6-space-indented og:title/twitter:title exemptions** (22 hits = 11 doubles per-file og/twitter pairs). Zero top-level violations.

### Route/SEO immutability

- `canonical` links unchanged on every edited page (self URL verbatim, entity-encoded `&amp;` where applicable).
- `hrefLang` fr-MA/en-MA toggle pairs + `x-default` intact (spot-checked search, parcours hub + grossesse detail × FR/EN).
- `sitemap.xml` unaffected (`/parcours-de-soins/*`, `/maux-troubles/*`, `/health-needs/*` entries present; no redirect source added).
- No redirects, no routes, no content text altered.

### Test-harness notes (NOT app bugs)

- First probe run showed apparent failures that were all expectation bugs on my side: (a) absolute titles render WITHOUT the `| Wenaya` template suffix — that is the intended single-brand outcome; (b) `&` appears as `&amp;` in SSR attr/text (entity encoding, standard); (c) the vertige detail's real seo.title is the full scientific name `Le Vertige Positionnel Paroxystique Bénin (VPPB)` (from `care-journeys.ts`), not the short audit-form; (d) the `.*Casablanca$` regex missed because the template appends `| Wenaya` after `Casablanca`. After aligning probes with real data/encoding: **all PASS**.

---

## 4. Acceptance criteria (from plan §5 + step-3 §4)

1. ✅ Every FR+EN rendered title carries **exactly one** brand token (`… | Wenaya` suffix via template, or the single-brand absolute forms).
2. ✅ No `… | Wenaya | Wenaya` or `… Corporate | Wenaya` (double/triple) anywhere in 325 prerendered pages.
3. ✅ og:title/twitter:title **unchanged** (brand preserved) on all absolute-wrapped pages; title-only strips left og/twitter intact by construction.
4. ✅ T1–T4 (compte, programmes detail) triple→single verified.
5. ✅ A20/A21/A22 (already-clean) confirmed no-op — no spurious edits.
6. ✅ Grep guard clean (only exempt og/twitter rows contain the literal).
7. ✅ No redirect/sitemap/canonical/hreflang/route change.

---

## 5. State & next steps

- **Working tree:** 36 modified + 3 untracked report files. **NOT committed, NOT pushed** (per instructions). HEAD unchanged at `f8347bd`.
- **P3 (remaining audit items)** — intentionally NOT implemented this pass; listed in step-3 report §4/§6 as future work.
- Optionally re-run the isolated smoke suite before commit; a normal `npm run build` in-repo will reproduce the 325-page output.

## Gotchas reinforced (this session)

1. Absolute `title: { absolute: … }` **bypasses** the root template — so `<title>` = the string exactly, no extra suffix. Probes must expect the branded string, NOT `branded | Wenaya`.
2. SSR entity-encodes `&` → `&amp;` in `<title>`/canonical/hreflang; probe the encoded form or decode first.
3. Disambiguation for Edit-tool: use the full `title: { absolute: <expr> }`/`export const metadata`/`return {` context so 4-space top-level matches don't collide with 6-space og/twitter duplicates.
4. `npx next build --webpack` in a junctioned temp copy is the safe verification path when a prod `next start` holds the main `.next`; turbopack (`next build`) errors on junctions.
5. Full-project eslint output is dominated by the pre-existing untracked-WIP baseline; targeted lint of the touched files + `git diff` inventory is the reliable sign-off.
6. Old screen-scraped slug guesses (e.g. `stress-et-anxiete`) are stale — derive slugs from live page hrefs (`/maux-troubles/stress-anxiete-sante-mentale`).
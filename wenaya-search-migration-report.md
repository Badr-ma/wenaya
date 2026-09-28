# Professionals listing migrated to `/search` (FR + EN)

**Date:** 2026-09-23 | Branch: `pre-production-cleanup` | **NOT committed/pushed**

## Outcome

The Professionals listing (formerly `/professional`) now lives on a dedicated, URL-driven `/search` route family.

| Listing page | FR | EN |
|---|---|---|
| All professionals | `/search/all` (dynamic) | `/en/search/all` (dynamic) |
| Pre-filtered by specialty (x20) | `/search/<specialty-slug>` (dynamic) | `/en/search/<specialty-slug>` (dynamic) |

Permanent 308 redirects map every legacy listing URL (plus the `/specialistes` aliases) onto the clean `/search/...` paths. **Detail pages are untouched:** `/professional/[slug]` + `/en/professional/[slug]` (FR+EN), their sitemap entries, JSON-LD employee URLs, and the `/professional/<slug>/booking` rows all stay as-is.

## URL contract (single source of truth = URL)

- `/search/all` — no specialty selected, optional `?q=<term>` search
- `/search/<canonical-slug>` — pre-filtered by specialty (in the PATH, canonical-friendly)
- `/en/search/<...>` — EN mirrors
- Specialty slug IS the canonical practice slug (`pratiques.ts` `SLUG_ORDER`); `all` = unfiltered.
- Server-side filtering over the fetched live dataset; the client `SpecialistsPage` pushes URL changes (350ms debounced search input, chip clicks), never filters locally. Back/forward, reload, and direct-paste all work.

## Redirects (next.config.ts, `permanent: true`)

- **80 per-slug `has` rows**: `{ source: /professional|/specialistes (FR+EN), has: [{ type: "query", key: "specialty", value: <slug> }] }` -> `/search/<slug>` / `/en/search/<slug>`, for all 20 live-verified slugs x 4 legacy sources.
- **4 bare rows**: `/professional`, `/en/professional`, `/specialistes`, `/en/specialistes` -> `/search/all` / `/en/search/all`.
- **Order (first-match-wins)**: per-slug `has` rows BEFORE bare rows; bare rows before the `:path*` wildcards.
- **Wildcards kept**: `/specialistes/:path*` -> `/professional/:path*` and EN mirror (detail pages; bare rows precede since `:path*` also matches zero segments).
- **Booking rows kept**: `/professional/<slug>/booking` x20 FR+EN untouched.
- **Pre-existing `/search/all/all` -> `/pratiques` (307)** kept.

### Documented Next behavior (accepted wart, not a bug)

Non-`has` query params survive redirects: `/professional?specialty=osteopathie&q=sarah` -> `/search/osteopathie?specialty=osteopathie&q=sarah`. The extra `specialty` param is cosmetic — the page reads only `q`; the emitted canonical (no query) stays clean. Not fixable without a path-rewrite; accepted and documented in the redirects code comment.

## Pages

- `src/app/(fr)/search/[slug]/page.tsx` + `(en)/en/search/[slug]/page.tsx` — dynamic: `slug === "all" ? "" : slug`; read only `q` from `searchParams`; server-side `filterSpecialists(all, { specialty, q })`; `generateMetadata` with clean canonical `${SITE_URL}/search/{slug}`, `languageAlternates`, EN `og:locale: en_MA`; `notFound()` on invalid slug in BOTH metadata + body; `MedicalBusiness` JSON-LD with `employee` (detail URLs FR/EN).
- Deleted: `src/app/(fr)/professional/page.tsx`, `(en)/en/professional/page.tsx` (old listing).
- `SpecialistsPage.tsx` — chips / All-reset / search wired to `/search/<slug>` + `buildSearchQuery` (q-only).

## Repointed links (10)

`Footer.tsx` nav, `SpecialistDetail.tsx` back-link, `Pricing.tsx`, `clinic/Hero.tsx`, `clinic/Practical.tsx`, `clinic/Team.tsx`, `about/ExpertiseSection.tsx`, `care-journeys/OrientationCta.tsx`, `QuickAccessSection.tsx`, `pratique-cta.ts` (0-specialists -> `/search/all`). All now `h(locale, "/search/all")` / practice-specific `/search/<slug>`. `practice-professionals-link.ts` keys off `getSpecialtyOptions` (canonical slugs) — already compatible.

## Sitemap (src/app/sitemap.ts)

- `/professional` bare listing row REMOVED.
- `dual("/search/all", { weekly, 0.9 })` added.
- `dual("/search/<slug>", { monthly, 0.8 })` x20 derived live from `getSpecialtyOptions(await getLiveSpecialists())` (any new backend specialty auto-appears).
- `/professional/<slug>` detail rows KEPT.
- Verified: 42 search locs (21 FR + 21 EN), 198 total.

## Micro-copy / docs

- Header comments in `specialist-filters.ts` / `professionals.ts` / `specialistes.ts` updated to the `/search/<slug>` contract.
- `buildSpecialistsQuery` fully removed (replaced by q-only `buildSearchQuery`); zero references remain.
- robots.ts does not disallow `/search`.

## QA (fresh 306-page prod build, :3002, headless-Chrome CDP)

- **SSR harness `search-redirect-qa.mjs`: 55 PASS / 0 FAIL** — per-slug `has` redirects (incl. preserved `specialty`/`q`), 4 bare listing 308s, wildcard aliases, `/search/*` 200s + clean canonical + hreflang, invalid-slug 404s, sitemap checks, home EN CTA.
- **CDP harness `search-cdp-qa.mjs`: 14 PASS / 0 FAIL** — FR `/search/all` (1 h1, cards, chips, All-chip default active, no horizontal overflow); chip Nutrition click -> `/search/nutrition`; All-chip clear -> `/search/all`; EN `/en/search/all` (lang en, h1, cards); EN chip Osteopathy -> `/en/search/osteopathie`; debounced search -> `q=` in URL; unknown slug 404.
- **CDP harness `search-switch-cdp.mjs`: 3 PASS / 0 FAIL** — language switcher round-trips `/search/osteopathie` <-> `/en/search/osteopathie` and `/search/all` <-> `/en/search/all`.
- Practice detail -> `/search/<slug>` link renders once per locale (nutrition FR + EN verified).

## Gates

- `npx tsc --noEmit` clean.
- eslint targeted clean; `npx eslint .` unchanged pre-existing baseline.
- `npm run build` 306 static pages (kill-node + `Remove-Item .next` first).

Prod server left running on :3002. NOT committed/pushed — pending user review + commit.

## Gotchas logged

1. Next.js `has`-rule redirects preserve ALL non-matched query params — the same `specialty` key used in `has` also survives in the destination. Verified by probe; accepted (cosmetic, canonical stays clean).
2. The 308 redirect definitions must be read with UTF-8 encoding; percent-encoded vs raw unicode slug forms are distinct rows.
3. CDP eval after a navigation-triggering click returns null (context torn down) — probe the path from the Node side after a settle delay, not inside the same `Runtime.evaluate` that clicks.
4. `check()` in these harnesses treats empty-string falsy as FAIL — pass explicit booleans.
5. Kill ALL node + Chrome between CDP runs or the port/profile locks.
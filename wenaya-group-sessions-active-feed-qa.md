# Group Sessions — STEP 3.1 Final QA Report (FR + EN)

Date: 2026-09-10 · Branch: `pre-production-cleanup` (NOT committed / NOT pushed)
Scope: QA-ONLY verification of the STEP 3 group-session listing integration (live backend active feed) + one confirmed layout regression fix. No feature work, no refactor, no route/content/SEO/booking-architecture change.

---

## A. Verdict

**PASS.** The `/seance-de-groupe` + `/en/seance-de-groupe` live-feed integration is production-ready. Verification totals:

| Suite | Result |
|------|--------|
| Live visual QA (headless Chrome CDP, FR+EN × 1440/768/390) | **84/84 PASS** |
| Click-through (real browser, FR + EN) | 2/2 PASS |
| Booking target routes (HTTP) | 4/4 → 200 |
| Forced-fallback QA (headless Chrome CDP, FR+EN × 3 viewports) | **54/54 PASS** |
| SEO / route coverage (HTTP) | All PASS |
| Gates: `tsc --noEmit` / `eslint` / `build` | Clean / 0E–12W baseline / 278 pages |

One source change was required and applied (Section D). Everything else passed as-is.

---

## B. What was tested (live feed artifact)

Browser harness `%TEMP%\opencode\gs31-visual-qa.mjs` against `next start :3002` (final clean 278-page build):

- **Structure** — exactly 1 `<h1>`, `<h2>` section title present, first heading is `H1`; exactly 2 card anchors with correct booking-request hrefs:
  - FR: `/contact-us?service=api-269&type=group-session` + `/contact-us?service=api-922&type=group-session`
  - EN: `/en/contact-us?service=api-269&type=group-session` + `/en/contact-us?service=api-922&type=group-session`
  - Zero editorial detail links on the live feed (no guessed/dead `/seance-de-groupe/{slug}` anchors under API mode).
- **Layout** — no horizontal overflow anywhere (doc + body delta 0 at every viewport). Cards equal width on all viewports. Desktop/tablet: same row (2-up). Mobile: stacked with proper 16px gap.
- **Images** — 0 broken images after scroll-through (lazy images fetch on demand).
- **CTAs** — both card links are in layout (non-zero rect, visible) at every viewport.
- **Runtime** — 0 console errors, 0 exceptions, 0 hydration markers.
- **Click-through** — real programmatic click from each locale navigates single-hop to the booking-request page with the backend `service` id:
  - FR: → `/contact-us?service=api-269&type=group-session`
  - EN: → `/en/contact-us?service=api-922&type=group-session`
- **Booking target routes** — all 4 (FR/EN × api-269/api-922) return **200**.

Screenshots: `%TEMP%\opencode\gs31-shots\*.png` (FR+EN × 3 viewports).

---

## C. Confirmed regression found → fixed (layout only)

**Finding:** on desktop the listing grid was `lg:grid-cols-3` in a `max-w-5xl` container. With the STEP-3 live feed the backend exposes only **2** active programs today, so at ≥1024px the two cards rendered at **331px** wide inside a 1024px container with **≈380px of dead space** in the empty third column (previously the 6-card editorial set filled 3×2, so this imbalance is a regression introduced by the data-source change, not a pre-existing design choice).

**Minimal count-agnostic fix** (`src/components/seance-de-groupe/GroupSessionsList.tsx`, one class-wide change — no redesign, no conditional logic, no component restructure):

```
lg:grid-cols-3                         →
lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]
```

Verified outcomes (browser, final build):
- **Live feed (2 cards)** @1440: cards now **504px** wide, 2 balanced columns filling the container, no empty third column. @768 unchanged (2-up, 352px each). @390 stacked (342px).
- **Fallback (6 cards)** @1440: **3 columns × 2 rows preserved** (331px each — `auto-fit` still fits 3 tracks when 6 items exist), identical to the pre-change editorial layout. @768: 2 cols × 3 rows (352px). @390: stacked.

The `minmax(280px,1fr)` lower bound keeps ≥2 tracks per row even if the active set ever drops to 1 (card fills full width).

---

## D. Source changes in this QA session

Exactly ONE line:

| File | Change | Why |
|------|--------|-----|
| `src/components/seance-de-groupe/GroupSessionsList.tsx` | grid `lg:grid-cols-3` → `lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]` | Section C regression fix, count-agnostic |

No other files touched during QA. `git status --short` post-QA confirms the tree is exactly: the 7 STEP-3 tracked modifications (2 listing pages, GroupSessionsList, GroupSessionsPage, practices-api.ts, package.json, AGENTS.md) + the 6 untracked STEP-3/QA deliverables (`scripts/`, `src/lib/api/`, `group-sessions-active.ts`, `group-sessions-api.ts`, both audit/feed reports). `git diff --stat` = 7 files, +92/−53 (no deletions, no removed routes).

---

## E. Forced-fallback verification

Method (matches the stale-ISR gotcha — a runtime data-cache clear is NOT enough; the page must be **built** with the broken env): kill node → `Remove-Item .next` → build with `PRACTICES_API_URL=http://127.0.0.1:9` → `next start :3003` → browser QA → rebuild clean and restore `:3002`.

Harness `%TEMP%\opencode\gs31-fallback-qa.mjs`:

- **6 editorial sessions** render on FR + EN at all 3 viewports (Group Training / Jiu Jitsu Kids absent in fallback mode).
- **Zero** `service=api-*` links; **all** card anchors are the local detail routes (`/seance-de-groupe/{slug}` FR, `/en/seance-de-groupe/{slug}` EN) — per-locale prefix verified.
- Uniform card widths, no horizontal overflow, 1 h1, 0 broken images, 0 console errors/exceptions on every viewport × locale.
- Fallback build completes with no crash (the adapter's full-local fallback path is exercised at prerender time).

After the test the fallout was cleared: node killed, `.next` removed, clean **live** rebuild, `:3002` restarted, live feed re-verified (2 API cards, 1 h1, 6 `service=api-*` text occurrences = 2 DOM hrefs + 4 RSC-flight matches — not cards).

---

## F. Build-count reconciliation (previous "270" vs "278")

- The current clean build (final tree, grid fix included) reports **`Generating static pages … (278/278)`** — identical to the last pre-STEP-3 build (copy-quality audit, 2026-09-10, 278 pages).
- The "**270 static pages**" figure recorded in the STEP-3 session notes was **an inaccurate summation** in that log, not a real 8-page drop. Evidence:
  - The STEP-3 integration adds **no routes** (two existing pages became async + ISR; two new lib files, no new route files).
  - The audit-only steps between the copy-audit build and STEP-3 changed nothing.
  - The current route tree is structurally identical to the pre-STEP-3 tree (`git diff` shows no route file added/removed).
- **Correct page count: 278** (matches the copy-quality baseline). No routes disappeared; the 2 listing pages changed classification only:
  - `/seance-de-groupe` + `/en/seance-de-groupe`: `● Static` → `○ Static (ISR)`, **`10m` revalidate** — still prerendered at build time (ISR is a cache policy, not a route removal), prerendered HTML present on disk (`.next/server/app`, 238 `.html` outputs across static/SSG/ISR).
  - Detail routes unchanged: **12 SSG** pages (`/seance-de-groupe/{slug}` ×6 FR + ×6 EN), all confirmed on disk + all returning 200.

Route classification summary (final build): `○` static/ISR incl. both listings (`10m`), `●` SSG incl. all 12 session details + practices/produits/articles/parcours/programmes, `ƒ` dynamic incl. `/`, `/en`, `/contact-us` pair, `/professional*` pair, `/sitemap.xml`, `/api/*`.

---

## G. SEO / routes (HTTP, final build on :3002)

| Check | Result |
|-------|--------|
| FR listing canonical | `https://www.wenaya.com/seance-de-groupe` (self) ✅ |
| EN listing canonical | `https://www.wenaya.com/en/seance-de-groupe` (self) ✅ |
| `og:url` | self on both ✅ |
| hrefLang (camelCase `hrefLang`) | fr-MA ↔ en-MA + x-default, both directions ✅ |
| ItemList JSON-LD | present on both pages ✅ (schema set = server-rendered active set) |
| Unknown detail slug | `/seance-de-groupe/xyzzy` + `/en/…/xyzzy` → **404** ✅ |
| All 12 editorial detail routes | **200** (FR + EN × 6) ✅ |
| Sitemap | exactly **2** listing URLs + **12** detail URLs, all canonical `https://www.wenaya.com…` ✅ |

---

## H. Gates

- `npx tsc --noEmit` → **exit 0** (no type errors).
- `npx eslint` on all 7 STEP-3 changed/new files → **exit 0**; full `npx eslint .` → **0 errors / 12 warnings** (unchanged pre-existing baseline — no new warnings introduced).
- `npm run build` (clean `.next`, node killed first) → **passes, 278 pages**.

---

## I. Files

| File | Status |
|------|--------|
| `src/components/seance-de-groupe/GroupSessionsList.tsx` | modified (sessions prop, auto-fit grid fix) |
| `src/components/seance-de-groupe/GroupSessionsPage.tsx` | modified (sessions prop passthrough) |
| `src/app/(fr)/seance-de-groupe/page.tsx` + `(en)/en/seance-de-groupe/page.tsx` | modified (async, `getActiveGroupSessions`, ItemList JSON-LD, genericized metas) |
| `src/lib/practices-api.ts` | modified (Phase-1 plumbing) |
| `src/lib/group-sessions-api.ts`, `src/lib/group-sessions-active.ts`, `src/lib/api/*` | new (STEP-3) |
| `wenaya-group-sessions-api-contract.md`, `wenaya-group-sessions-active-feed-report.md` | new (deliverables) |
| `AGENTS.md` | modified (session log) |

---

## J. Known limitations / remaining user checks

- **Visual/pixel judgment** (model cannot view image frames): screenshot eyeball at 1440/768/390 — card image cropping (local placeholder imagery used for backend programs per STEP-3 decision; backend logos are remote and intentionally not hot-linked), 504px two-up card rhythm at desktop, auto-fit whitespace behaviour if the active set changes count later.
- **Live set drift:** today the backend exposes exactly 2 parents (922 Group Training, 269 Jiu Jitsu Kids 7-12). The UI is count-agnostic via the auto-fit grid; the active-name/price/date policy follows the STEP-3 adapter contract and re-validates on the 10m ISR window.
- **Cart/payment/submit:** booking flow stops at the contact form (preselected `service` = backend id); actual appointment creation remains a Jamal-gated future workstream (per `wenaya-group-sessions-api-contract.md`).

---

## K. Gotchas worth logging (QA-relevant, verified today)

1. **ISR page count**: an ISR (`○ 10m`) listing page still counts toward the static-page total and is prerendered on disk — classification changed, count did not.
2. **`service=api-*` text count ≠ card count**: the string appears in the RSC flight payload too (6 text hits for 2 card anchors) — count card anchors via `href` only.
3. **Stale served HTML**: `next start` serves the baked artifact; fallback tests must rebuild with the broken env (runtime cache-clear insufficient). Always `Remove-Item .next` + kill node first.
4. **auto-fit arbitrary-value in Tailwind**: `lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]` compiles cleanly (no spaces in the arbitrary value → no underscore escaping needed) and the `sm:grid-cols-2` responsive rule is correctly overridden at lg.
5. **CDP page-eval regex**: interpolating a literal `/` into a regex literal emitted to the page breaks it (`/^/en/…/`). Use `new RegExp('^'+prefix+…, …)` when the prefix is runtime-determined.
6. **hreflang attribute is camelCase `hrefLang`** in Next output — probe that, not `hreflang`.

---

## L. Sign-off

QA-only pass complete. One confirmed layout regression found and fixed with a single count-agnostic class change; the entire feature verified in a real browser (FR+EN × 3 viewports), fallback proven by build-time env forcing, SEO/routes intact, all gates green. **NOT committed, NOT pushed.** Prod server left running on :3002 with the final live-feed build.
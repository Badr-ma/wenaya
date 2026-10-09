# Maux-troubles / Health-needs — « Recommandations » content restored (FR + EN)

Date: 2026-10-09 · Branch: `main` · Status: **fixed & verified — NOT committed/pushed**

## 1. Objective

Restore the missing « Recommandations & hygiène de vie » content on every
`/maux-troubles/[slug]` (FR) and `/en/health-needs/[slug]` (EN) detail page by
fixing the **shared content pipeline**, not a one-off page exception. Preserve
original headings/copy verbatim (no rename, no invention), and report any
records genuinely lacking recommendations.

## 2. Root cause

The recommendations block is **not** a separate API property. It lives inside the
backend `details` rich-HTML field as a `<strong>` heading followed by a `<ul>`
(the API is FR-only, no locale field). `TroubleDetail.tsx` renders
`sanitizeSafeHtml(details)` inside the About section.

`sanitizeSafeHtml` runs a `collapseConsecutiveParagraphs` step whose regex was:

```js
/(<p>(?:[\s\S]*?)<\/p>\s*){2,}/g
```

When a single `<p>` sat immediately before a `<ul>`, the `{2,}` quantifier forced
the lazy group `[\s\S]*?` to span **across the list** in order to find a second
`<p>`. The replacement callback only re-emitted `<p>` inner content
(`texts.join("</p><p>")`), so the span-absorbed `<ul>` was **silently discarded**.

This is why the therapies `<ul>` survived (two adjacent `<p>`s matched first) but
the recommendations `<ul>` vanished (its single preceding `<p>` forced the span).
Reproduced exactly with a standalone port of the sanitizer against the live API.

## 3. Fix

Single file: `src/lib/sanitize-html.ts` — `collapseConsecutiveParagraphs`.

The paragraph-content matcher now refuses to cross a block boundary
(`</p>`, `<ul>`, `<ol>`, `<li>`), so a group can only ever contain consecutive
`<p>` elements and never absorb an intervening list:

```diff
-    /(<p>(?:[\s\S]*?)<\/p>\s*){2,}/g,
+    /(?:<p>(?:(?!<\/?(?:p|ul|ol|li)\b)[\s\S])*?<\/p>\s*){2,}/g,
```

Inline `strong`/`em`/`br` are unaffected (the whitelist only permits those inside
`<p>`). No content is renamed, reordered, or invented. Behaviour for
consecutive-`<p>`-only runs is unchanged.

## 4. Verification

### Gates
- `npx tsc --noEmit` — clean.
- `npx eslint src/lib/sanitize-html.ts` — clean.
- `node scripts/verify-practices-api.mjs` — **19/19 pass** (shared API client +
  sanitizer pipeline healthy).
- Regression spot-checks of the sanitizer's other consumers: blog article detail
  renders full content (`/articles/tda-h-…` → 200, 16 KB bio block); professional
  bio renders (`/professional/amer-hdidou` → 200).

### Per-page table (source vs rendered, FR + EN)

Each page: source recommendations items found in the raw API `details` vs. present
in the rendered page (dev server :3000).

| id | slug | source heading | src items | FR render | EN render |
|----|------|----------------|-----------|-----------|-----------|
| 1 | maux-de-tete-cephalees-migraines | Recommandations & hygiène de vie | 3 | OK | OK |
| 2 | douleurs-du-dos-lombalgies-troubles-du-dos | Recommandations & prévention | 3 | OK | OK |
| 3 | troubles-digestifs-…-transit-intestin-irritable | Recommandations & prévention | 3 | OK | OK |
| 4 | stress-anxiete-sante-mentale | Recommandations & hygiène de vie | 3 | OK | OK |
| 5 | troubles-du-sommeil-fatigue-chronique-insomnie | Recommandations & hygiène de vie | 3 | OK | OK |
| 6 | troubles-musculosquelettiques-articulaires-musculaires | Recommandations & prévention | 3 | OK | OK |
| 7 | dyslexie-dyspraxie-dysorthographie-… | Conseils & recommandations pour les parents | 4 | OK | OK |
| 8 | troubles-neurocognitifs-demence-vieillissement | Conseils & bonnes pratiques | 4 | OK | OK |

### Actual-browser rendering (headless Chrome CDP)
`document.querySelector('.bio-content').innerText` confirms the restored lists
render in a real browser (not just SSR):

- FR + EN sleep: 2 `<ul>` / 6 `<li>`, includes « routine de sommeil » and
  « Mettre en place… ».
- FR dyslexie: 3 `<ul>` / 16 `<li>`, « Conseils » heading present.
- FR neurocognitifs: 3 `<ul>` / 12 `<li>`, « Conseils » heading present.

## 5. Records genuinely lacking recommendations

**None.** All 8 troubles carry a recommendations-style heading + list in the
backend. Headings vary by record («Recommandations & hygiène de vie»,
«Recommandations & prévention», «Conseils & recommandations pour les parents»,
«Conseils & bonnes pratiques»); all are preserved verbatim.

## 6. Remaining gaps / notes

- **EN translation:** the backend `details` field has no locale variant, so the
  EN routes render the same French recommendations content under `lang="en"`
  (consistent with the site's documented live-parity policy). No translated copy
  exists to restore; none was invented.
- **Design:** the recommendations content renders inside the About/Details block
  (the existing `detailHtml` design from `e6edfe7`), not as a separate labelled
  section. Splitting it into its own headed section would be a design change
  beyond this pipeline fix.
- The production server artifact (:3002) still serves pre-fix HTML until a
  rebuild / ISR revalidation; the dev server (:3000) reflects the fix immediately.
- Working tree: only `src/lib/sanitize-html.ts` modified. **Not committed/pushed.**

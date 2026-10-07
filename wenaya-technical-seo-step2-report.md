# Wenaya Technical SEO — Step 2: Sitemap XML-escaping fix (P1)

Branch: `main` (user-selected for application + verification). NOT committed / NOT pushed.

## 1. Root cause (verified against Next.js source)

`node_modules/next/dist/esm/build/webpack/loaders/metadata/resolve-route-data.js`
(lines 46–79) builds the sitemap XML by interpolating the `url` (and each
alternate-language `href`) **verbatim into the document, with zero XML escaping**.
This is a Next.js serializer-level gap, not an app-side data bug.

Exactly **two canonical slugs contain a raw `&`**, both from
`src/lib/care-journeys.ts` (untouched this step — the `&` is correct inside the
URL path):

- `grossesse-&-maternite` (line 78)
- `kinesitherapie-&-avc` (line 1299)

No other slug dataset in `src/lib` contains `&`.

Because the App Router `sitemap.xml` route returns the data model to Next's
serializer (which writes `&` straight into the XML text node), the emitted
document was invalid XML — a `.NET` strict `[xml]` load threw
`EntityName` at line 1365, position 58.

## 2. Change (smallest correction)

**File:** `src/app/sitemap.ts` (+45 / −1)

1. **New helper `xmlEscapeUrl(value)`** — escapes ONLY a bare `&` to `&amp;`,
   with a negative-lookahead guard
   (`/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[0-9a-fA-F]+;)/g`) so already-escaped
   entities are never double-escaped.
2. **Final return** — the single spread line is now a typed `entries` array
   (`staticPages → troubleEntries`, same 8 groups, same order) mapped through a
   transformer that:
   - applied `xmlEscapeUrl` to `entry.url`
   - re-applies `xmlEscapeUrl` to every `alternates.languages` href that is a
     string (the `Languages<T>` mapped type is `[lang]?: T | undefined`, so
     values are filtered to strings — resolves the one TS2345 the first map
     build hit at `sitemap.ts:272`).

**Deliberately NOT changed:** slugs, URL architecture, FR/EN alternates,
`dual()` semantics, priorities/changeFrequency, all other datasets, and the two
`&` slugs themselves. No P2/P3 items touched. No commit, no push.

## 3. Verification

Isolated webpack production build (`--webpack`, Turbopack rejects the
junctioned `src`) in `%TEMP%\opencode\step2-sitemap-verify` with junctioned
`src`/`public`/`node_modules` + copied root configs; `next start` on `:3027`;
actual `/sitemap.xml` fetched and validated. Shared `.next` and the running
`:3002` prod server were NOT disturbed.

| Check | Before (audit) | After | Result |
|---|---|---|---|
| Strict XML parse (`[xml]` load, .NET) | FAIL — `EntityName` line 1365 pos 58 | Loads clean, `urlset` ns sitemap.org/0.9 | PASS |
| `<loc>` count | 217 | 217 (unchanged) | PASS |
| Raw `&` in document | 12 | **0** | PASS |
| `&amp;` entities emitted | 0 | **12** (exactly the 12 raw `&` converted) | PASS |
| Byte size | 86,211 | 86,259 (+48 = 12 × “&amp;” is +4) | PASS |
| Double-escapes (`&amp;amp;`, `&&`) in any url/href | — | 0 | PASS |
| Bare `&` inside any `<loc>`/`href` | 12 | 0 | PASS |
| `grossesse-&-maternite` FR URL | raw `&` | `&amp;` in XML → decodes to raw `&` | PASS |
| `kinesitherapie-&-avc` FR URL | raw `&` | same | PASS |
| EN mirrors of both | raw `&` | same | PASS |
| Both families rendered exactly once (FR + EN = 4 `<loc>`) | — | 1 each | PASS |
| Alternates intact (FR: `x-default`→FR + `en`→EN; EN: same pair per `dual()` model) | — | verified byte-wise | PASS |
| No duplicate `<loc>` across all 217 | — | 0 dupes | PASS |
| Affected detail routes (FR+EN, 4 URLs) | — | all **200** | PASS |
| Detail page `<link rel="canonical">` | — | `…grossesse-&amp;-maternite` (HTML attr escape, decodes to raw `&`) | PASS |

Gates: `npx tsc --noEmit` clean; `npx eslint src/app/sitemap.ts` clean; full
`npx eslint .` unchanged at the known pre-existing baseline (no sitemap.ts
findings); isolated `next build --webpack` **325 pages** passes.

## 4. Remaining problems

- **None introduced.** Follow-ups from the step-1 audit (P2 duplicate brand
  title suffix; P3 findings) remain open and out of scope here.
- Watch-only: if any future slug ever contains a raw `&`, `xmlEscapeUrl` covers
  it automatically; no other XML special char is possible in a canonical slug
  dataset without much earlier breakage.

## 5. Files

- Modified: `src/app/sitemap.ts` (+45 / −1)
- Untracked (existing, unchanged): `wenaya-technical-seo-audit.md`

Cleanup: `:3027` listener stopped, `step2-sitemap-verify` temp dir removed.
NOT committed / NOT pushed.
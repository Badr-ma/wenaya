# Corporate copy compression — second-pass visible-copy reduction (FR + EN /corporate)

Date: 2026-09-11. Branch: `pre-production-cleanup`. Nothing committed/pushed.

Extends the first-pass i18n tightening with render-level section compressions, then closes the loop with
the SSR + real-browser verification suite and reduction metrics.

## Objective

Remove the explanatory / repeated / "padding marketing" copy layer from `/corporate` + `/en/corporate`
(same content set for both locales, per the pre-existing parity convention). The user explicitly accepted
the intentional break from the byte-verbatim live parity previously established.

## Headline metrics

| Metric | FR | EN |
|---|---|---|
| Removed visible-copy bytes (hidden strings) | 1 790 | 1 592 |
| Remaining main-section copy (script-less body, header/footer excluded) | 6 753 bytes / 743 words | 5 968 bytes / 661 words |
| **Removed share of current page copy** | **~20.9 %** | **~21.1 %** |

Within the touched editorial/feature clusters (levels, packs, retreat design, how-it-works steps, programme
cards, testimonials) the removed share is far higher — those sections lost their entire "supporting copy"
layer (all `Idéal pour` / `Inclus` / `Option` lines, step descriptions, descriptor/animator sentences,
and 2 of 3 testimonials).

## What changed — render-level (second pass)

- **StatsTestimonialsSection** — now renders exactly **one featured testimonial** (first item); the 2 other
  quotes stay in i18n but are never displayed. Band strip kept (`Chez Wenaya : 35 thérapeutes certifiés…`).
- **LevelsSection** — each level row = name + one value line + duration + CTA; `ideal`/`includes` lines
  removed from display (values remain in data/i18n).
- **PacksSection** — tier + name + one-sentence pitch + **first 3 inclusions** (`features.slice(0,3)`) + CTA;
  `ideal` line removed; 4th-or-later inclusions no longer rendered.
- **RetreatSection** — `chaptersIntro` / `design.intro` and per-step descriptions removed; design area shows
  **4 numbered step labels only** (Objectif / Expertises / Format / Expérience).
- **HowItWorksSection** — both desktop and mobile variants show **4 numbered step titles only** (step
  descriptions removed from render; still in i18n).
- **ProgrammesSection** — row content = number + name + pitch + format + CTA; the programme `desc`
  sentence and the `Animée par un formateur Wenaya certifié` line are no longer rendered.
- `src/lib/corporate-programmes.ts` French data **byte-unchanged**; trimming happens at render.

## Verification

- `npx tsc --noEmit` — clean.
- `npx eslint` (all changed i18n + components) — clean; `npx eslint .` **0E/10W**
  (pre-existing component warnings only, no i18n files flagged).
- `npm run build` — Next.js 16.2.7 Turbopack, **278/278 static pages** (kill-node + `Remove-Item .next`
  first). Prod `:3002` + dev `:3000` restarted on the new artifact.
- **SSR harness** `%TEMP%\opencode\corp-ssr-qa.mjs` — **135/135 PASS** both locales: 1 `<h1>`, all
  compressed copy present (incl. `3 500 €`/`€3,500`, `+13 %`/`+13%`, `× 5`, `Tarif sur devis personnalisé` ×3,
  `Custom quote` ×3, retreat/design labels ×1), all hidden strings **0 occurrences**, zero FR⇄EN leaks.
- **Real-browser CDP** `%TEMP%\opencode\corp-r2-visual-qa.mjs` — **300/300 PASS** FR+EN at 1440×900 /
  768×900 / 390×844: exactly 1 `<h1>`, no horizontal overflow, all compressed strings present, all hidden
  strings absent (script-less `textContent`), no raw i18n keys, 0 console errors / exceptions / hydration
  markers. Screenshots `%TEMP%\opencode\corp-r2-shots\`.

## Untouched (constraints honoured)

Section order; Retreat kept; Yolo/catalogue sections still excluded; API integration (`source="corporate-quote"`,
`teamSize`/`programmeLevel` stable values); routes/SEO/metadata; CTAs and images; PDF download titles;
stat digit values consumed by the counter; FAQ questions (7) and PDF titles.

## Gotchas logged

1. **`innerText` vs GSAP opacity**: below-fold subtrees can be excluded from `innerText`; the honest check is
   a stepped `scrollTo` pass then `textContent` on a script-cloned body (`script,style,noscript` removed —
   RSC flight payloads and inline styles pollute both absence checks and byte counting).
2. **i18n-key fingerprint regex**: `/entreprises\.[a-zA-Z]+/ ` matches legitimate French prose ending in
   `entreprises.` (e.g. the footer line `au service des entreprises.`); require a second segment
   (`entreprises\.\w+\.\w+`).
3. **PowerShell console mangles accents/`€`/`’`** — all character-level assertions run in byte-safe Node.
4. **Hidden strings stay in dictionaries** by design (testimonials 2–3, level `ideal`/`includes`, pack `ideal`,
   retreat `chaptersIntro`/`design.intro`/step descs, howItWorks step descs, programme `desc`/`animator`) —
   they are counted in the report as "removed visible copy", not deleted.
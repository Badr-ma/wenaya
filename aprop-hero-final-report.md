# A-propos hero editorial redesign — QA & final report

**Scope:** hero section of `/a-propos` (`src/components/about/APropos.tsx`) only — editorial two-column layout (content left, photo right, bronze accents, 01/02/03 positioning row). No commit/push/deploy. All other sections and files untouched by this pass.

## Result: 92/92 CDP checks PASS (FR, 1440/768/390)

Both tsc and ESLint clean. Hero copy required ZERO edits (already verbatim-matched the spec).

## The 3 harness "failures" were ALL harness expectation bugs (app was correct)

1. **Paragraph detection** — the harness matched `p`'s against the OLD pre-redesign hero copy (`imaginons un avenir`, `avenir où les entreprises…`). Fixed by testing all `p` in the hero against the current copy: eyebrow `À propos de Wenaya`, lead `Parce que la santé est à la base de tout.`, plus the 2 content paragraphs — assertion `paraCount === 2` now green.
2. **Bronze rule color** — SSR/CDP serializes the alpha color as `lab(61.224 13.854 32.7521 / 0.6)`, not `rgba(184, 138, 90, 0.6)`. Accepted both.
3. **`fetchpriority="high"`** — **is NOT emitted anywhere on this platform.** New SSR probe (`aprop-hero-probe2.cjs`) proved the dev `img` carries NO `fetchpriority` and NO `loading` attribute. In this codebase the `priority` signal is a `<link rel="preload" as="image" imageSrcSet="…/about-hero.jpg…">` in `<head>` (same convention as the Clinic hero, per AGENTS.md). Assertion changed to require that preload link. The `priority` prop remains in source at `APropos.tsx:290`.

## Key measured values (@1440 desktop)

- H1: 56.16px, `text-wrap: balance`, verbatim copy
- content col 467px left / image col right, same row, gutter 161px ≥ 30
- image portrait ratio 1.250 (4/5), offset bronze block behind bottom-left image edge (128×128), visible
- eyebrow + rule (56px), bronze lead 25.6px, exactly 2 paragraphs, CTA `Découvrir notre écosystème →` → `#notre-ecosysteme`
- positioning row: 3 items, numerals `01/02/03`, labels Prévention/Longévité/Performance, 2 separators
- no horizontal overflow (1425/1440), exactly 1 h1, 5 h2, anchors intact, 0 JS exceptions

## Responsive behavior verified

- Tablet 768: image 3/2 landscape, stacked below content, offset block hidden
- Mobile 390: image 4/3 landscape, stacked below, offset block hidden

## State

- Only `src/components/about/APropos.tsx` changed in this pass; sitemap/Nav/href + new a-propos route dir were pre-existing (untracked) work.
- dev :3000 (PID 23384) running new code. Prod build deferred (would require killing node/removing `.next`).
- NOT committed/pushed.
- Snapshots: `%TEMP%\opencode\apar-hero-{desktop,tablet,mobile}.json` (note the "apar-" typo prefix is deliberate legacy).
- Remaining: human visual review of the composition (photo↔alt match, offset block placement).
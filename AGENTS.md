<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Session Log

### 2026-08-13 — STEP 2: Booking panel verification (production build, real browser)

Verified the redesigned booking flow end-to-end against the production build via CDP (headless Chrome + raw WebSocket driver scripts in `%TEMP%\opencode`). **29/29 checks passed** (two stable runs). No app bugs found — no source changes needed this step.

**Covered:** FR locale; inline calendar (heading, month nav disabled states, past-day/closed-day disabling); panel open via header CTA; calendar-first step 1 (hint before selection, scoped month nav, `+6 max` to Fév. 2027, back to current month); day 17 → caption "lundi 17 août"; slot availability (10:00 disabled, 09:00 selectable); Continue gating on service; step 2 form fill + Back preserving selection; terms links; Confirm → local-only pending screen; step-3 Fermer; reopen fresh step 1; inline calendar → panel seeding directly into step 2; mobile sticky bar + bottom sheet full flow; no i18n/console errors; `/conditions` + `/confidentialite` → 200.

**Test-harness bugs fixed (not app bugs):**
- Cleanup clicks used footer text "Fermer", but step 1 has no footer Fermer (only the step-3 footer does); close affordance on every step is the header X (`aria-label="Fermer"`). Driver now closes via `__closePanel()`.
- `__calGrid` matched only `mb-4` grids = the **panel**'s grid; the inline day grid is `mb-5`. So the seeding check was clicking day 17 inside the *closed panel*. Added `__calGridInline`/`__clickDayInline` for the inline calendar.

`npx tsc --noEmit` and `npm run build` (Next.js 16.2.7, 108 pages) both pass on the final tree.



**Global color swap:**
- Page background → `#F2EFE9` (warm sand)
- Big titles (h1–h3 on light bg) → `#0B1220` (deep navy)
- Dark section backgrounds → `#0B1220`
- All `#1F1F1F` and `#F8F5EF` references eliminated across all components

**Files changed:**
- `src/app/globals.css` — already had correct colors, no edit needed
- `src/components/Biomarkers.tsx` — bg `#F8F5EF` → `#F2EFE9`, text `#1F1F1F` → `#0B1220`
- `src/components/HowItWorks.tsx` — bg `#F8F5EF` → `#F2EFE9`, text `#1F1F1F` → `#0B1220`
- `src/components/Nav.tsx` — bg `#1F1F1F` → `#0B1220`
- `src/components/Footer.tsx` — bg `#1F1F1F` → `#0B1220`
- `src/components/CtaSection.tsx` — bg `#1F1F1F` → `#0B1220`
- `src/components/ComparisonTable.tsx` — bg `#1F1F1F` → `#0B1220`
- `src/components/DiseaseMarquee.tsx` — bg `#1F1F1F` → `#0B1220`
- `src/components/Testimonials.tsx` — text `#1F1F1F` → `#0B1220`
- `src/components/Pricing.tsx` — text `#1F1F1F` → `#0B1220`

**Nav bar layout:**
- Changed from full-width to constrained centered layout with `max-w-7xl mx-4 lg:mx-auto`
- Added `mt-4`, `rounded-xl`, `backdrop-blur-[40px]` (matching Function Health's glass nav)
- Inner wrapper holds the glass effect, outer header just positions it

**Pricing card dimensions:**
- Changed from 3-column grid to vertical stacked layout (`flex flex-col items-center`)
- Each card set to `w-[808px] min-h-[473px]` (matching Function Health's `.pricing_card_wrap`)
- Cards centered with gap-6 between them

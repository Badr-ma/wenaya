<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Session Log

### 2026-06-08 — Color palette & Pricing card dimensions

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

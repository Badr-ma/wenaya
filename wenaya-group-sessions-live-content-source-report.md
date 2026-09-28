# Wenaya Group Sessions — live content-source verification (Jiu Jitsu Kids + Group Training)

**Date:** 2026-09-24 · **Branch:** pre-production-cleanup · **Type:** READ-ONLY investigation — no code changed, nothing committed/pushed.
**Question answered:** *Where does the original live site get its full Jiu Jitsu Kids description + "instructor photo"?*

**Verdict:** The description **and** the hero photo both come from the **group-session record itself** — NOT a related service, NOT the professional profile, NOT separate editorial static content.

- **Description** → the programme record's `description` HTML field (5 paragraphs, 874 chars for JJK; one short paragraph, 58 chars for GT). Live detail fetches it via the **plural** `getAppointmentsGroupBySlug/{event_slug}` (parent carries it), and it is **also** carried on every active `children[]` slot in our own paginator feed (`children[0].description`).
- **"Instructor photo"** → the live page renders the **event `logo`** (`storage/uploads/events/20241004093540_8974E824.png`) as the hero image through `/_next/image`. There is **no coach portrait rendered on the live page** — the professional appears as **text only** ("Professionnel: Amer Hdidou"). The backend `professional.avatar` is not displayed (and is unreliable: `dummy-man.png` placeholder in bySlug vs a real `.jpeg` in the paginator).

---

## 1. Live page data pipeline (captured via headless-Chrome network log, 2026-09-24)

Live detail URL: `https://wenaya.com/seance-de-groupe/jiu-jitsu-kids-7-12-ans-13` (legacy pages-router Next.js SPA — raw HTML is an empty loading shell; real-browser capture required).

Endpoints called by the page, in order:

| # | Endpoint | Verdict | Payload |
|---|---|---|---|
| 1 | `getAppointmentsGroupBySlug/jiu-jitsu-kids-7-12-ans-13` | **200** (2,470 B) | parent 269: `id,title,logo,description,parent:null,nbr_of_participants,capacity,event_key,event_slug,event_date,event_time,event_status,price,firstUseprice,duration,professional,company` — **`description` = full 874-char editorial**, `logo` = event PNG, `professional.avatar` = `dummy-man.png` |
| 2 | `getAppointmentGroupByParent/269` | **200** (58,335 B) | array of 24 active child slots, **each carrying the same 874-char description** + logo + price/duration/capacity |
| 3 | `getPackagesByProfessionalId/36` | 200 | "Les forfaits" packages |
| 4 | `getGroupPackagesListToPurchase/1` | 200 | "Les forfaits de Groupe" deals |

Rendered facts on the live page (CDP): title "Jiu Jitsu Kids (7-12 ans) | Wenaya", H1 (x2 in DOM), the 5 editorial paragraphs verbatim (first opens *"Wenaya lance cette discipline avec notre coach @AmerHDIDOU ceinture noire de Jiu Jitsu Brésilien…"*), coach Amer Hdidou, 17:00 / 1h / 200 DH, essai 150 DH, address, date grid, pay-later + pay-online buttons, package sections.

**Group Training (922)** — same topology: `getAppointmentsGroupBySlug/group-training` → 200, `description` = 58-char `<p>Session de renforcement musculaire en petit groupe </p>`, `logo` = `events/20260226213217_AE48C136.png`, `professional` = Thomas Sabrou (id 176, avatar `avatars/20251202163418_916DA11A.jpeg`). Live GT page renders the same chrome (labels "Professionnel :", "Durée:", "Prix:").

---

## 2. Endpoint-name correction (supersedes the 09-10 contract doc)

The 09-10 contract doc's finding *"`getAppointmentGroupBySlug` is a dead route → 404"* was tested with the **wrong (singular) suffix**. Live uses the **plural**:

| Suffix | JJK (event_slug) | 269 (parent id) |
|---|---|---|
| `getAppointmentGroupBySlug/{slug}` (singular) | 404, 9,766 B "route could not be found" | — |
| `getAppointmentsGroupBySlug/{slug}` (plural) | **200** (parent w/ description + logo) | — |
| `getAppointmentGroupByParent/{id}` (singular) | — | **200** (children array) |
| `getAppointmentsGroupByParent/{id}` (plural) | — | 404, 9,746 B |

So the **singular-bySlug/plural-byParent are dead; plural-bySlug/singular-byParent are live** — do not conflate the two suffix conventions.

---

## 3. Our feed vs the live data (paginator `getAppointmentsGroupsWithPagination` — what our app actually reads)

| Programme | parent `description` | children[0].description | logo | pro avatar |
|---|---|---|---|---|
| 269 (JJK) | **empty** | **874 chars (full editorial)** | `events/20241004093540_8974E824.png` (parent + children) | `avatars/20250113150823_40F230E4.jpeg` (real) |
| 922 (GT) | **empty** | **58 chars** | `events/20260226213217_AE48C136.png` | `avatars/20251202163418_916DA11A.jpeg` (real) |

Key fact: **our paginator feed carries the full editorial description on `children[]`, and the live detail page fetches the same content on the parent via bySlug.** The launchable signal is identical — the app currently just discards it.

---

## 4. Current adapter behavior (exact discard points)

`src/lib/group-sessions-active.ts`:

1. **description** — `normalizeProgram` (line 281) sets `description = BACKEND_PROGRAM_DESC[locale]` (a hardcoded 1-liner "Séance collective en présentiel…"). The real 874-char editorial that the live page shows is **present in the feed but never read**. A `decodeEntitiesStripped()` helper already exists for HTML decode+strip (line ~80).
2. **image / hero photo** — line 299: `image: FALLBACK_IMAGES[identity] ?? DEFAULT_FALLBACK_IMAGE` → `api-269` currently maps to a local `/images/wellness-stretch.jpg`. The **real event `logo` is never read**. (`api.wenaya.com/storage/...` is already a permitted `next.config.ts` remotePattern.)
3. **coach avatar** — `coachDisplay` (lines 191–204) already passes `professional.avatar` through into `live.coachAvatar`, and `GroupSessionDetail`/`BookingPanel` **render the coach name but never the avatar** (grep: `coachAvatar` defined in the model at `group-sessions.ts:84` + set at `active.ts:214`, referenced nowhere else). Matches live (no portrait shown).
4. `coach`, `price`, `priceFirstUse`, `durationMinutes`, next-slot facts all already track live values.

---

## 5. Exact changes needed to reproduce the live info (if/when this moves to code)

All changes are confined to `src/lib/group-sessions-active.ts` `normalizeProgram` + the live facts (no row shape change):

- **description:** replace the constant with the decoded long-form editorial from the feed:
  `const raw = program.description || activeChildren(program)[0]?.description || "";`
  → `description = raw.trim() ? decodeEntitiesStripped(raw) : BACKEND_PROGRAM_DESC[locale];`
  (For our paginator feed the source is `children[0]`; using `program.description` first also covers the bySlug shape if the feed ever switches.)
- **image/hero:** `image: program.logo || activeChildren(program)[0]?.logo || FALLBACK_IMAGES[identity] ?? DEFAULT_FALLBACK_IMAGE` — the `logo` host is already whitelisted, so the img optimizer will re-encode it; no `next.config.ts` change.
- **coach avatar:** leave the pass-through as-is (live shows no portrait). No render change needed — `BookingPanel` already lists coach as text in the STEP-5 facts band.
- **EN:** the backend is FR-only (`description` is always French; live EN page shows the same French body under `lang="en"`). If long-form EN is ever wanted, map it locally like the rest of the site (out of scope here).

**Verification trail (byte-verified captures):**
- `%TEMP%\opencode\gs-contract\live-byslug-jjk.json` (bySlug 269, 2,470 B), `live-byparent-269.json` (children ×24), `probe_getAppointmentsGroupBySlug_...json` (200) + `probe_getAppointmentGroupBySlug_...json` (404, 9,766 B) + singular-byParent (200) + plural-byParent (404), `probe_getAppointmentGroupByParent_269.json`; `2_full.json` (our paginator feed: parent desc empty, children carry desc + logo).
- `%TEMP%\opencode\live-jjk\*-capture.json` + `jjk-network.json` (live page render + network), `en-detail.json` + `gt-detail.json`.

**No gate runs were performed** (read-only — no source changes this session).

---

## 7. IMPLEMENTED (2026-09-25): real description (dek split) + real event logo + compact booking panel

Closed the flagged gaps from §4/§5 with source changes on FR + EN detail & listing pages (branch `pre-production-cleanup`, NOT committed/pushed):

- **description / dek split** — `GroupSession` gained optional `dek?: string` (`src/lib/group-sessions.ts`). `normalizeProgram` (`src/lib/group-sessions-active.ts`) now decodes the real backend body ONCE (`decodedBody`, parent → first active child → empty) and derives:
  - FR `description` = `decodedBody` (fallback `BACKEND_PROGRAM_DESC.fr`); FR `dek` = `buildDek(decodedBody)` (first paragraph, whitespace-collapsed, ≤170 chars, word-boundary ellipsis cut when needed; for GT the 58-char body *is* the dek — a single short sentence cannot be split).
  - EN `description` = `dek` = `BACKEND_PROGRAM_DESC.en` (the approved one-liner; no long-form EN translation exists in the backend — live EN serves French under `lang="en"`, so EN stays a genuine one-liner; policy documented, no invented translation).
  - Render sites (`GroupSessionDetail.tsx`): hero paragraph + visual band + related rows use `session.dek ?? session.description`; the "La séance / About this session" section renders the FULL body exactly once. Editorial sessions have no `dek` → `?? description` fallback keeps them byte-stable. Listing cards intentionally unchanged.
- **real event logo** — hero image chain now `program.logo → first active child logo → placeholder`; `decodeEntitiesStripped` also preserves paragraph breaks (`</p>` → `\n\n`, `<br>` → `\n`) shown with `whitespace-pre-line` (hero, About, visual band) + `line-clamp-2` on listing cards.
- **compact booking panel** (`BookingPanel.tsx`, spacing-only — logic/props/contracts untouched): header `px-5 sm:px-6 pt-5 sm:pt-6`, sub `mt-1.5 text-[13px]`; facts `mt-4 gap-y-3 pt-4`; date carousel `mt-4 pt-4`, chips `h-[64px]`, nav `w-8 h-8`; time chips `px-3.5 py-2.5`; pay block `mt-4 pt-4 pb-5 sm:pb-6`, selection `min-h-[16px]`, `mt-2.5 space-y-2.5`, pay-later (link + disabled span) `h-12`, pay-online `h-10`.

**QA (fresh 325-page build, prod :3002):**
- SSR harness `%TEMP%\opencode\gs-dek-ssr.mjs` **59/59 PASS** — FR JJK: full body marker (`La pratique d`) x1 inside About only, paragraph-2 tail x1, About carries ≥3 paragraph breaks, dek (5th-paragraph sentence) present; FR GT: dek==body ≈3 ×, FR generic fallback `Séance collective en présentiel` 0; EN JJK/GT: one-liner **x4** (hero + About + visual + related card) + zero French; FR/EN meta descriptions unchanged (`verifyMeta` long-form FR / one-liner EN); editorial yoga-prenatal FR/EN: no panel chips, no pay-later, editorial copy present, byte-stable; panel present on all 4 live pages, date chips ≥3 ≤6, pay-later starts disabled, no raw `&nbsp;`.
- Real-browser CDP `%TEMP%\opencode\gs-dek-cdp.mjs` **30/30 PASS**, 0 console errors — FR GT @1440: panel within viewport, pristine disabled pay-later span → time chip click arms real Link with `service=api-922&slot=<id>&date=YYYY-MM-DD&time=HH%3AMM` → click lands on `/contact-us` with `Créneau demandé :` notice + `Demande pour` prefill; FR JJK @1440: full body exactly once in About with paragraph breaks, dek in hero, no FR generic fallback; EN JJK @390 (`Emulation.setDeviceMetricsOverride`): html `lang="en"`, no horizontal overflow, one-liner 3–5, zero French, mobile slot flow → `service=api-269` → `/en/contact-us` `Requested slot` notice; editorial yoga-prenatal: no `#booking`; screenshots `%TEMP%\opencode\gs-dek-shots\` (before: `gs-livecontent-shots\`).
- Harness-expectation fixes (NOT app bugs): EN one-liner count is **4** (hero+About+visual+related card, matches the earlier 4× prod probe) not 3; EN editorial yoga title is `Prenatal Yoga` (localized) so the FR needle false-negatived; shot dir must be created (ENOENT).
- Gates: `npx tsc --noEmit` clean · `npx eslint` on the 4 touched files clean (full baseline unchanged 5E/12W pre-existing untracked-WIP) · `npx next build` 325 pages. Prod :3002 left running on the final artifact. NOT committed/pushed.
# Wenaya — Group Sessions UX / Flow Audit (READ-ONLY)

Audit date: 2026-09-24. Branch: `pre-production-cleanup`. No code was modified, nothing committed/pushed.
Real-browser evidence: prod `next start` :3002 (306-page build); live API `api.wenaya.com` checked 2026-09-24.

---

## D1 — Current listing page structure (`/seance-de-groupe` FR + `/en/seance-de-groupe` EN)

Static wrapper + client hydratables, servers render the active backend feed.

- `src/app/(fr)/seance-de-groupe/page.tsx` / `(en)/en/seance-de-groupe/page.tsx` — async server pages:
  - `const sessions = await getActiveGroupSessions(locale)` (live backend feed, editorial fallback on API failure).
  - Metadata: FR `Séances de groupe — Wenaya Casablanca | Wenaya`; EN genuine title; canonical self + `languageAlternates("/seance-de-groupe")` + hreflang camelCase fr-MA/en-MA/x-default, OG/Twitter en_MA on EN.
  - `ItemList` + `FAQPage` JSON-LD built from the **rendered set**.
  - Renders `Breadcrumbs` → `GroupSessionsHero` → `GroupSessionsList sessions={sessions}` → `Footer`.
- `GroupSessionsHero.tsx` — client component, ivory `#F2EFE9`, `data-section-bg="light"`: bronze dot + badge eyebrow `Cours & Ateliers` (uppercase), exactly-one `<h1>` `hero.title` (`Cours & Ateliers` / `Courses & Workshops`), one intro paragraph. No CTA in the hero (i18n `cta` unused there).
- `GroupSessionsList.tsx` — client component, sand bg, centered `<h2>` `list.title` (`Nos séances de groupe` / `Our group sessions`) + `<p>` `list.sub`; then a **card grid**:
  - `grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]`
  - Each card = whole-card `<Link href={s.path}>`, dark `#0B1220` bg, `rounded-2xl` overflow-hidden, subtle hover lift + bronze `focus-visible` ring.
  - Image: `aspect-[16/10]` `next/image fill` with navy bottom gradient; **mono `0{i+1}` numeric badge** (`String(i+1).padStart(2,"0")`, accent color in a tinted dot). Accent per session.
  - Body: `<h3>` title (white) + one-line `description` (white/60).
- **Data source (live now):** exactly **2 backend programs** in the active feed → 2 cards:
  - `Jiu Jitsu Kids (7-12 ans)` → `/contact-us?service=api-269&type=group-session`
  - `Group Training` → `/contact-us?service=api-922&type=group-session`
  - Backend-only records are MINIMAL: title, generic `description` derived from `company.name` + location copy, decorative local placeholder image (`yoga`, `breathwork` etc. category shots), `typeLabel` = localised generic (`Atelier`/`Workshop`). Detail-linkless — cards route straight to contact.

**No editorial 6-session set in the live listing** (they appear only in the offline fallback); the 12 editorial detail routes (FR+EN `yoga-prenatal` …) are simultaneously pre-rendered but NOT reachable from the live listing (their cards are absent). They ARE reachable from `/about-us` Clinic `SessionsExplorer` and `/en/about-us`.

## D2 — Current detail page structure (`/seance-de-groupe/{slug}` FR + EN)

`src/components/seance-de-groupe/GroupSessionDetail.tsx` — server component, premium editorial rhythm, `Image`less client logic. Sections in order:

1. **Hero (Ivory)** — back link (`labels.back`,→ listing), bronze eyebrow `session.typeLabel`, exactly-one H1 = session title (serif, `clamp(2.2rem,5vw,4rem)`), one description paragraph, bronze-gradient pill **booking CTA** (`labels.bookCta` `Réserver une place` → `session.bookingHref`) + dominant 4/5 editorial image (`priority`, `rounded-[28px]`).
2. **Info band (Warm Sand)** — horizontal divide-x columns built from `session.format` (FORMAT title+desc), `session.audience` (PUBLIC), `session.location` (LIEU title+desc).
3. **About (Ivory)** — typeLabel eyebrow + H2 `labels.whatTitle` + bronze rule + description.
4. **Visual band (Navy)** — full-width re-use of the same image (`aspect-[2.4/1]`, navy overlay, typeLabel + description in white).
5. **Related (Ivory, when ≥1)** — numbered editorial list rows (edge-numbered `01`.., 80px thumbnails, H3 title, clamped desc, arrow) → each `r.path` detail page; header has `labels.viewAll` link back to listing.
6. **Final booking CTA (Navy)** — centered `ctaEyebrow` + H2 `ctaHeading` + optional `bookingNote` + bronze pill → `session.bookingHref`.

The detail H2/H3 cascade: one H1, info-band labels are `<span>` (not headings), About/Related/final-band have `<h2>`, related rows `<h3>`. No i18n leakage concerns — all labels resolve via a locale-parameterised `getGroupSessionLabels`.

**SEO/routes:** `getAllGroupSessionSlugs()` powers `generateStaticParams` (12 SSG detail pages); unknown slug → 404; canonical + hreflang both locales; metadata `<title> = "{title} à Casablanca"` FR / `"{title} in Casablanca"` EN.

## D3 — Exact booking / contact flow (verified in browser)

Entry points all funnel to `/contact-us` (+query) → shared `ContactPage` → `ContactForm` (Suspense-wrapped, reads query params client-side):

1. **Detail-page pill** → `session.bookingHref` = `${h(locale,"/contact-us")}?service={slug}&type=group-session` (FR `/contact-us?service=yoga-prenatal&type=group-session`; EN `/en/contact-us?service=prenatal-yoga&type=group-session`).
2. **Backend-list card** → `/contact-us?service=api-{id}&type=group-session` (e.g. `service=api-922`).
3. **Nav `Réserver`/`Book` desktop + mobile** → `/contact-us?type=booking` (booking-mode form).
4. **Group-session CTA in booking mode** (`?type=booking&service=yoga-prenatal`) → category select preselected to `group-session`.

`ContactFormInner` behaviour:
- `requestedSession = service ? getGroupSessionForBooking(service, locale) : undefined`. **This resolves only known editorial slugs** (`yoga-prenatal`, `prenatal-yoga`, …).
- When it resolves (editorial case): a bronze **session-notice strip** renders `contact.sessionNotice` (`Demande pour…` / `Inquiry for…`) + session title, and the **message textarea is pre-filled** with `contact.sessionPrefill` (`Bonjour, je souhaite réserver une place pour la séance de groupe : {title}`). ✅ Verified in headless Chrome.
- When it does NOT resolve — **the live-feed backend cards case** — `service=api-922` matches no local slug → `requestedSession` is undefined → **no notice strip, no prefill, no mention of which session**: the user lands on the bare generic contact form (`Envoyez-nous un message`) with zero session context. ✅ Verified. (The opaque `api-922` id is invisible to the user — it only rides through in the hidden POST payload.)
- Message prefill is a textarea the user can edit; the notice is read-only.
- Submit → `POST /api/contact` with `{firstName,lastName,email,phone,message,source,service,type,subject,…}` → success card `contact.successMsg` / booking `bookingSuccessMsg`. **No availability, no price, no date, no payment, no confirmation — it is a message-to-team handoff.**

Recruitment variant: `?subject=recrutement|recruitment` → recruitment prefill + breadcrumb label.

## D4 — API-backed vs static content

| Surface | Current source | Notes |
|---|---|---|
| Listing cards | **Live API** `getAppointmentsGroupsWithPagination` (parents + active children; `revalidate 600`) | Only programs with ≥1 `active` slot dated ≥ today appear. Today: 2 (Jiu Jitsu Kids, Group Training). Backend payload carries per-child **price, duration, capacity, event_date, room, coach/participants_count** — none of it rendered. |
| Backend-only card content | Minimal adapter fields | Title from API; desc from `company.name` + location copy (NOT the program's own description); placeholder local image; no price/duration/next-date shown. |
| Detail pages | **Static editorial** `src/lib/group-sessions.ts` | 6 sessions (Yoga Prénatal, Sophrologie, Nutrition, Breathwork, JJB, Pilates) — hand-authored FR + genuine EN, no booking data (no prices/dates/schedules). Only reachable from Clinic `/about-us` explorers + direct URL in live-feed mode. |
| Fallback (API down) | Full editorial `getAllGroupSessions` | All 6 editorial cards, per-locale detail links + bookingHrefs. |
| Contact/booking backend | `/api/contact` proxy | Message handoff only; no reservations/payments/confirmations exist anywhere (verified via group-sessions API contract doc, D4 of `wenaya-group-sessions-api-contract.md` — `bySlug` GET is DEAD, no writing endpoint in play). |

**Key structural gap:** the backend has real, bookable, dated/priced programs (Jiu Jitsu Kids, Group Training — with children slots) but the site surfaces them as minimal contact cards with no dates/prices; the editorial 6 are rich pages with no dates/prices. The two worlds never meet.

## D5 — UX problems + severity

**Functional (high):**
- **F1.** Backend live-feed cards lose all real context: no next date, price, duration, capacity, coach, or schedule — the very data the backend has. A user cannot make an informed booking decision from the listing.
- **F2.** Booking click from a live-feed card produces a **bare generic contact form** (`service=api-{id}` unresolved) — no "Demande pour : Group Training", no prefill, no echo of what they clicked. Verified. Misdirected, confusing handoff.
- **F3.** **Editorial 6 and backend 2 are mutually invisible.** The marquee editorial sessions (Yoga Prénatal, JJB, …) don't appear in the live listing at all (they're only on `/about-us`), while the live bookable programs route only to contact. Listing no longer matches the brand's actual catalogue.
- **F4.** Detail pages exist but are **unreachable from their own listing** in live-feed mode (12 SSG pages orphaned in navigation; only direct-URL / SEO). A crawler/UX dead-end risk for that content.

**Visual / structural (medium):**
- **V1.** With only 2 cards and `auto-fit,minmax(280px,1fr)`, desktop shows **2 wide cards + a large empty gutter** — sparse. `0{1}`, `0{2}` monotone numbering over two cards looks arbitrary.
- **V2.** Minimal backend cards (generic placeholder photo; no meta) read as placeholder/demo content, and every card uses the same generic `Atelier`/`Workshop` eyebrow — no differentiation.
- **V3.** Editorial detail cards never show price/duration/next-session, so "Réserver une place" sets availability expectations the form cannot meet (no date picker, no attendees count).
- **V4.** The final navy CTA band repeats the exact same booking action + copy as the hero pill (redundant reiteration on an already-short page).

**Low:**
- **V5.** `01`-badging on a dynamic feed list is semantically wrong (order is backend order, not importance).
- **V6.** EN detail pages reuse FR slugs (`/en/seance-de-groupe/yoga-prenatal`) — technically proven, URL-string inconsistency the user will notice in reviews (EN slug `prenatal-yoga` exists in the adapter but is not used for the route).

## D6 — Proposed listing-page design

Editorial, data-rich, matches the Clinic visuEral language and the live catalogue:

1. **Show the real catalogue = backend feed (authoritative) + editorial known sessions.** Merge on program identity: known editorial sessions keep their rich slug page; live-feed programs get canonical detail page + cards. Never invent 404 routes.
2. **Card = editorial 4:5 image + solid meta**: title (which IS the real one), one-line description, and a true **meta row** from backend data when present — `Durée · 60 min`, `Prochaine séance · 24 sept.`, `À partir de 200 MAD`, capacity; fallback to editorial copy when absent. No fabricated fields.
3. **Whole-card link → detail page** (each program gets one page: backend programs get a generated detail from their API fields; editorial sessions keep existing pages). Remove `0{N}` numeric badges (not a ranking); differentiate with the bronze editorial eyebrow + image variety.
4. **Grid**: `sm:grid-cols-2 lg:grid-cols-3`, `gap-5`; keep `#F2EFE9` sand + navy/dark cards, hover lift + bronze focus ring. Header keeps the existing `Nos séances de groupe` H2 + sub.
5. **Cta accent on factual clarity**: small bronze "Réserver une place" pill on each card linking to the contact flow **with the session name carried through** (fix F2).

## D7 — Proposed detail-page design

Reuse the existing editorial `GroupSessionDetail` shell (it's good) with surgical upgrades:

1. **Info band extended to real meta when backend data exists**: FORMAT / PUBLIC / LIEU stay; add *Durée*, *Prochaine séance* (nearest `event_date`), *Tarif* (min `price`), *Places restantes* (capacity − participants) when the feed supplies them; keep editorial soft-copy otherwise (no invented numbers).
2. **Booking CTA carries the session identity through the whole handoff** (fix F2): the notice strip shows the real session title + date/price; prefill message includes program name + "souhaite réserver une place pour {title}"; hidden `service` remains stable.
3. **Expectation-setting line** under the pill: "Réponse sous 24 h ouvrées · Sans engagement" / "We reply within 24h · No obligation" (matches other Wenaya forms) so "booking" reads as a request, not a confirmed reservation (F-consistency).
4. **Final navy CTA**: keep the band but diversify copy — a reinforcement + secondary "Voir d'autres séances" link back to listing (removes the redundant double-pill, V4).
5. **Removal of the redundant local `description` repeat in the visual band** when the feed gives real meta to show — the navuet band can show the schedule/price snapshot instead of re-printing the same sentence third time (V4, minor).

## D8 — Proposed end-to-end journey (current vs proposed)

| Step | Current | Proposed |
|---|---|---|
| Discover | 2 minimal backend cards (Jiu Jitsu Kids, Group Training) with placeholder images, no dates/prices | Listing shows the full catalogue: backend-feed programs (dates/prices/duration) + editorial sessions merged |
| Choose | Cards differ only by tiny title + generic desc; no basis for choice | Cards carry real meta row (next date, price, duration, capacity) |
| Learn | Detail pages unreachable from live listing (editors only via /about-us) | Every program has one canonical detail page (generated for feed programs; existing pages for editorial) with true info band |
| Act (book) | Click → bare generic form, no session echo (`service=api-{id}` unresolved) | Click → contact form with session-notice strip + prefilled message + date/price context |
| Confirm | Success card "Votre message a bien été envoyé" (24h reply) | Same handoff but the user sees what they requested; copy sets 24h/no-commitment expectation everywhere |
| Locale parity | FR/EN listings both OK; EN uses FR slugs on detail | Keep localised chrome; EN detail slugs stay as-is (documented) or adopt `slugEn` for freshness item (see V6, optional) |

## D9 — Screenshots

Fresh real-browser captures saved to `%TEMP%\opencode\gs-audit-shots\`:
- `fr-listing-1440.png` / `fr-listing-390.png` — FR listing (2 backend cards; sparse gutter desktop, stacked mobile)
- `en-listing-1440.png` — EN listing
- `fr-detail-yoga-1440.png` / `fr-detail-yoga-390.png` — FR editorial detail page
- `en-detail-yoga-1440.png` — EN detail page

(Harness: `%TEMP%\opencode\gs-audit-shots.mjs`, 36/36 PASS incl. listing card set, booking hrefs, detail section order, hero image `priority`, no overflow, no console/hydration errors.)

## D10 — Implementation plan (small, independent, testable steps)

1. **Adapter enrichment (foundation).** Add optional real fields to the backend-only record in `group-sessions-active.ts`: `price?`, `duration?`, `nextDate?` (nearest child `event_date` ≥ today), `capacityInfo?`, `room?`, `coachName?` — sourced strictly from the API payload, never invented. *Test: SSR listing shows meta row on the 2 live cards; editorial cards unchanged.*
2. **Session-identity handoff fix (F2).** Make `service=api-{id}` representable: either teach `getGroupSessionForBooking`/notice-strip to recognize backend ids (resolve title from the feed) or emit a `service` that the form can echo. *Test: browser click from Group Training card → contact shows "Demande pour : Group Training" + prefilled message.*
3. **Detail page for backend programs (F4/F1/D6).** Serve backend-feed programs a generated detail page (safe slug keyed by numeric id, e.g. `/seance-de-groupe/group-training`) reusing `GroupSessionDetail` with real meta; keep editorial pages as-is. *Test: each live program's card links to its own 200 page; FR+EN; unknown slug 404.*
4. **Listing visual refresh (V1/V2/V5).** Drop `0{N}` badges; 3-up grid `lg:grid-cols-3`; per-program image variety + real meta line. *Test: SSR counts, 1440/768/390 no-overflow, equal card heights.*
5. **Booking expectation copy (V3/D7-3).** Add the 24h/no-commitment line to listing pill + contact notice. *Test: string present FR+EN in SSR + hydrated DOM.*
6. **Full-regression pass.** `npx tsc --noEmit`, `npx eslint .`, clean rebuild (kill-node + `Remove-Item .next`), route smoke on :3002, CDP screenshots of every changed viewport. NOT committed — hand back for review.

---

*No source files were modified; report is informational only.*---

## STEP 3 (FINAL, 2026-09-24): Dedicated live-program detail pages (FR + EN)

Second accepted structural trade-off from STEP 2, implemented: the live-backend programs (Group Training, Jiu Jitsu Kids) now get FIRST-CLASS DETAIL PAGES under /seance-de-groupe/{slug} + /en/seance-de-groupe/{slug} instead of the booking-request booklet page. The 6 editorial sessions keep their Detail architecture untouched.

### Design
- Editorial-first resolution, live fallback (mirrors the proven resolveDetailSession pattern):
  - `resolveDetailSession(slug, locale)`: editorial (getGroupSessionBySlug) → live (LIVE_PROGRAM_SLUGS by-id map 269↔jiu-jitsu-kids, 922↔group-training, then generic slugify-title-id fallback) → normalizeProgram → undefined → notFound() (404 on miss or feed failure).
  - Live slug map avoids collisions: reverse lookup prefers the explicit id→slug map over slugify(title) (jiu-jitsu-bresilien editorial vs jiu-jitsu-kids backend).
  - normalizeProgram: path = the live detail route, slug = live slug, id keeps api-{id} (booking key unchanged), bookingHref unchanged (/contact-us?service=api-{id}&type=group-session), accent #B88A5A, description stays the verified-fact BACKEND_PROGRAM_DESC (company.name + in-person location — no sanitized HTML inject).
- Live detail experience (GroupSessionDetail live band, gated session.live?):
  - Replaces the editorial Format/Audience/Location band with a live-facts info band: Coach / Prochaine séance / Durée / Prix (each a label + heading-serif value) + a slot-count sub and a first-use-price sub.
  - Sub format: `HH:MM · N séance(s) à venir` / `HH:MM · N upcoming session(s)` and `Première séance à X MAD` / `First session at X MAD`.
  - i18n keys (6 per locale, `X MAD` hardcoded): fr Coach/Prochaine séance/Durée/Prix/Lieu, séance(s) à venir, Première séance à; en Coach/Next session/Duration/Price/Lieu, upcoming session(s), First session at.
  - JSON-LD addOffer: Service offers { price: live.price, priceCurrency: MAD } only when session.live?.price present.
  - Hreflang/canonical/OG via getLiveGroupSessionAlternateUrls (fr-MA self / en-MA /en/... pair); ESP when live → title + ' in Casablanca' only for EN (FR unchanged).
- Related: getLiveRelatedSessions(id, locale, 3) → all programs (editorial + live) except self, slices 3.
- Pages: export const revalidate = 600 (the 12 editorial detail pages — previously SSG static — become 10-min ISR; same routing trade as the listing). generateStaticParams stays editorial-only (live slugs resolve on-demand at first request; not promoted to the build-time set to keep ISR bounded).
- JSON-LD offers/OG: offers only for live; OG unchanged otherwise.

### Build
- 272 static pages + both live-slug detail routes ISR 10m (on-demand), editorial detail 12×2 remain prerendered ISR 10m.
- Build-time network timeouts (api.wenaya.com connect timeout; dev-api ENOTFOUND) are the PRE-EXISTING fallback behavior (blog/maux/troubles/professionals fall back gracefully; group-sessions listing falls back to the 6 editorial) — not regressions, present before this step.

### QA (prod :3002, fresh build + byte-safe Node SSR harness)
- gs-step3-qa.mjs: 96/96 PASS
  - FR+EN jiu-jitsu-kids + group-training: 200, exactly 1 h1, title, live band labels (Coach/Prochaine séance|Next session/Durée|Duration/Lieu), slot count 'séance(s) à venir'|'upcoming session(s)', duration 60 min, price 200|300 MAD, precedent/format band ABSENT, canonical self, hreflang fr-MA↔en-MA, og:url self, JSON-LD offers MAD, booking CTA → /contact-us?service=api-{id}&type=group-session, no invented Format band, related = the OTHER live program (sibling).
  - FR+EN editorial yoga-prenatal (and EN alias prenatal-yoga → canonical slugFr route): untouched editorial experience (Format band present, no Coach/MAD bands), whole-card links intact (image + title + book/explore CTAs), canonical correct (EN alias canonicals to /en/seance-de-groupe/yoga-prenatal), exactly 1 h1.
  - Unknown slug → 404 on both locales.
  - Listing /seance-de-groupe + /en: NO direct contact links; all 6 editorial card links now → detail routes (the STEP 2 flagged behavior change), plus the 2 live slugs → their new detail pages.
  - Sitemap: editorial slugs only (2 listing + 12 detail URLs); live slugs intentionally excluded (transient backend catalog: they appear as routes, not sitemap URLs).
- gs-step3-cdp.mjs (headless Chrome CDP): 22/22 PASS — FR+EN live pages hydrate (1 h1, coach/price text, no overflow, correct doc titles, no error portal), AND (fresh build) the listing/ISR serves the live cards (earlier stale-ISR bake showed the 6-editorial fallback until a fresh build with the backend reachable).

### Gotchas re-verified
1. Stale-ISR masks source fixes AFTER a build whose fetch failed: the listing page baked the 6-card fallback at build time when api.wenaya.com was timing out; the RUNNING prod kept serving that baked HTML until a fresh rebuild (kill-node + Remove-Item .next). Detail pages were fine because they re-resolve live on-demand per request. ALWAYS confirm the backend was reachable at build time before trusting listing SSR output.
2. CDP harness bugs (not app): pick the type:page target from /json/list (list[0] can be a chrome-extension background page); CDP result shape is r.result.result.value (not r.result.value); wait for WebSocket open event before send.
3. Boolean-expression precedence in harness: `a && b || c` — parenthesize.
4. The RSC flight payload duplicates class strings but NOT id attributes — count by id for card assertions.
5. Eslint/tsc: all changed files clean; full `npx eslint .` baseline unchanged (pre-existing WIP findings only).

## STEP 4 (2026-09-24): Interactive slot-selection booking panel on live detail pages (FR + EN)

Implements the approved booking-step UX (audit §D2 problem "no actionable booking step"): live-backend session detail pages gain an interactive **slot-selection panel** that lets the user pick a date + time from the VERIFIED backend slot feed and hands off to the existing participation-request contact flow carrying the chosen slot. Editorial sessions stay untouched (no panel). Nothing committed (branch pre-production-cleanup).

### Design
- New client component `src/components/seance-de-groupe/BookingPanel.tsx` — rendered ONLY for live sessions with selectable slots (`{session.live && session.live.slots.length > 0 && <BookingPanel … />}`), placed after the live-facts info band (Warm Sand), before About (Ivory). Editorial pages show zero booking-panel markup.
- Slot data: `src/lib/group-sessions.ts` `LiveGroupSessionSlot` (`id/date/time/price/capacity`) + `slots` + `slotCount` (backend-verified via `activeChildren` group-children aggregation + `findNextSlot` by largest future datetime; capacity/price from the backend group-event model — no invented availability).
- Interaction model (fully client-side, no server writes):
  - **Date chips** (`gs-date-chip`, `aria-pressed`, `role="group"`): first date active by default; picking a date resets the slot selection.
  - **Time chips** (`gs-time-chip`): one per slot on the active date (grid `1-col → sm:2-col`), each labelled with time·price·capacity aria-label; picking one arms the Continue CTA.
  - **Summary card** (`gs-summary`, `aria-live="polite"`): shows selected date/time/price·capacity; hint line before any selection.
  - **Continue CTA**: until a slot is selected it is a disabled-looking `<span class="gs-continue" aria-disabled="true">` (never a dead link); once selected it becomes a real `<Link class="gs-continue">` to `{bookingHref}&slot={id}&date={date}&time={HH:MM}` (bookingHref = `/contact-us?service=api-{id}&type=group-session` FR / `/en/…` EN). SSR HTML never contains a navigable booking href (client-only Link) — verified >0 in SSR would be a leak.
  - Disabled state ≠ fabricated target; reduced-motion/SSR-safe (state only ever derives from client interaction, initial markup shows date chips + disabled continue).
- Contact handoff (`src/components/contact/ContactForm.tsx`): reads `slot`/`date`/`time` from `useSearchParams`; `hasSlot = Boolean(slotId && slotDate && slotTime)`.
  - Prefill appends a slot line: `\n{Créneau demandé :|Requested slot:} {jeu. 24 sept.|Thu, Sep 24} — 18:00.` via `formatSlotDate(isoDate, locale)` (UTC-safe Intl.DateTimeFormat fr-FR/en-GB, raw-ISO fallback).
  - A second notice strip renders under the session notice when `hasSlot` (same bronze-tinted style as the existing session strip).
  - POST body to `/api/contact` adds `slot`/`slotDate`/`slotTime` (submit seam already echoes extra string fields — participation-request, no payment/server write activated).
- i18n: 14 detail-key labels (panelEyebrow/panelTitle/panelSub/dateLabel/timeLabel/dateHint/timeHint/capacityLabel/slotCapacity/summaryTitle/summarySelected/continueCta/continueHint/noAvailability) + `contact.slotNotice` (`Créneau demandé :` / `Requested slot:`).

### QA (prod :3002, fresh build with backend reachable)
- Gates: `npx tsc --noEmit` clean; `npx eslint` (BookingPanel, GroupSessionDetail, ContactForm, group-sessions.ts, group-sessions-active.ts) clean; full eslint baseline unchanged; `npm run build` 272 pages (detail route stays `● 10m`).
- SSR harness `gs-booking-qa.mjs`: **57/57 PASS** — editorial FR/EN (yoga-prenatal, sophrologie): no `#booking`/`gs-date-chip`/`gs-continue`, exactly 1 h1, booking CTA row intact; live FR/EN (group-training 922, jiu-jitsu-kids 269): 200, 1 h1, `#booking`, date chips ≥1 (first `aria-pressed="true"`), time chips ≥1, continue present as disabled span, continue label, NO navigable direct href in SSR, no raw i18n-key leaks; contact-us with slot params → 200 FR/EN (slot params don't break the page).
- CDP harness `gs-booking-cdp.mjs` (real browser, 1440×900): **35/35 PASS** — FR + EN gold path: pick a time chip → Continue becomes a real link carrying `slot=1288&date=2026-09-24&time=18%3A00` (FR) / `slot=1226…17%3A00` (EN) → click lands on contact page → slot notice strip + prefilled textarea (`…Group Training.\nCréneau demandé : jeu. 24 sept. — 18:00.`) / EN mirror; disabled state verified; editorial pages show no panel; zero console/hydration errors.
- CDP mobile harness `gs-booking-mobile.mjs` (Emulation.setDeviceMetricsOverride 390×844): **12/12 PASS** — FR+EN: no horizontal overflow, booking section fills the viewport (no clip), time chips present + selectable, Continue link fits within viewport.

### Gotchas (this step)
1. **The first mobile "489px overflow" was a HARNESS ARTIFACT, not an app bug**: `--window-size=390,844` on headless Chrome is NOT honored for the layout viewport (Chrome resolved clientWidth=489). Always use `Emulation.setDeviceMetricsOverride {width,height,mobile:true}` + `Emulation.setTouchEmulationEnabled` for a true mobile viewport, and assert section-width vs actual `document.documentElement.clientWidth` (not a hardcoded 390).
2. First CDP run's one FAIL was a harness string: FR `contact.sessionNotice` is `"Demande pour"` (not `"Séance :"`) — the strip rendered `Demande pour : Group Training` correctly; probe i18n byte-for-byte, never word-assume.
3. SSR chip markup order: in the `<button>` tag `aria-pressed` precedes `class` (regex assert accordingly).
4. Booking href is client-only → SSR asserts must check ABSENCE of the navigable href (leak test), CDP must click-to-derive it.
5. Keep venue: `#booking` section id matches the info-band/About rhythm (Warm Sand → Ivory); do not restyle parent sections this step.

### STEP 5 (2026-09-24) — PANEL MOVED INTO THE HERO (URGENT CORRECTION)

Per the approved spec: the live group-session slot panel now LIVES IN THE HERO (not a standalone
section between info-band and About), desktop = intro/image left + sticky panel right, mobile =
intro+image then panel. Date carousel is windowed (~5 visible dates, NOT all 12 at once) with
prev/next nav. NO capacity UI, NO summary/recap card, NO redundant CTAs on live pages (the fierce
"red/CASQ" event flow was watered-down to the approved conversion surface). Pay-later + Pay-online
buttons live INSIDE the panel (until a slot is picked pay-later is a disabled span; pay-online is a
clearly-labelled, always-disabled preview). Editorial sessions remain byte-stable (hero CTA + navy
CTA band unchanged, no panel).

**Files changed:**
- `src/components/seance-de-groupe/GroupSessionDetail.tsx` — hero restructured to two variants via
  `liveWithPanel = Boolean(session.live && session.live.slots.length > 0)`: hero section grid
  `grid-cols-1 lg:grid-cols-[1fr_430px] lg:items-start` (live) vs the editorial `lg:grid-cols-2 lg:items-center`;
  live hero left = eyebrow/H1/desc + `aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]` image below (no decorative
  blur circle), right = `lg:sticky lg:top-9` <BookingPanel>. Section className drops `overflow-hidden`
  for the live variant (sticky breaks under overflow-hidden). Info band wrapped in `{!liveWithPanel && (…)}`;
  the old standalone booking <section> deleted; the navy CTA band wrapped in `{!liveWithPanel && (…)}`;
  header doc comment updated.
- `src/components/seance-de-groupe/BookingPanel.tsx` — rewritten around the hero-embedded spec:
  new `facts` prop (coach → duration → price → first-use → location) replacing the old label list;
  windowed date carousel `VISIBLE_DATES = 5`, `stepDate(±1)` keeps the selected date in view and
  clears the slot when the window moves away; NO capacity row, NO summary card; `gs-selection`
  `aria-live` line shows the chosen date · time · price; pay-later becomes a real <Link> only after
  a slot is picked (`bookingHref&slot=..&date=..&time=..`), pay-online stays a disabled preview;
  dates `Intl.DateTimeFormat` UTC-safe.
- `src/components/contact/ContactForm.tsx` — new `slotNotice` line + bronze strip when the handoff
  params are present (unchanged behavior for the step-3 handoff; added earlier this feature).
- `src/lib/group-sessions.ts` — `GroupSessionDetailLabels` + `getGroupSessionLabels` re-grid;
  `LiveGroupSessionSlot` + live-facts wiring.
- `src/i18n/fr.ts` + `en.ts` — `seanceDeGroupe.detail` re-gridded (raw UTF-8); removed panel keys
  (`panelTitle, dateHint, capacityLabel, slotCapacity, summaryTitle, summarySelected, continueCta,
  continueHint` + `contact.slotNotice` collapsed into the selection line); kept info-band keys
  (`nextTitle`, `slotCountLabel`) only for editorial sessions.

**Verified (fresh clean rebuild, prod :3002):**
- SSR harness `gs-panel-ssr.mjs`: **144/144 PASS** — 4 live pages (group-training, jiu-jitsu-kids ×
  FR+EN): 1 h1, `#booking` + `.gs-panel` present, ~5 date chips (windowed), `gs-date-prev` has the
  native `disabled` attr at window 0, `gs-paylater` initial = disabled span (never a navigable href
  in SSR, leak-tested), `gs-selection` shows the hint, pay-online note visible; hero bookCta absent.

  EMPHASIS: use `disabled=""` (React boolean attr) probes, NOT `[aria-disabled]`, on the date-nav buttons.
  3 editorial pages × FR+EN (yoga-prenatal, sophrologie): ZERO panel, ZERO `gs-date-chip`,
  hero CTA + navy CTA band present, info band present, no `system-generated` slot UI.
- CDP harness `gs-panel-cdp.mjs` (headless Chrome): **54/54 PASS** — FR group-training @1440
  (sticky panel, 5 chips, window advance changes the visible dates, prev toggles, time select →
  pay-later Link with `slot/date/time` + `type=group-session` + `service=api-922`, click lands on
  `/contact-us` with slot notice + prefilled textarea, no horizontal overflow), EN jiu-jitsu-kids
  @390 mobile (intro above panel, no overflow, pay-later slot handoff to `/en/contact-us`,
  `Requested slot:`),
  editorial negatives (no `#booking`, hero CTA + navy band intact), zero console/hydration errors.
- Tooling: `npx tsc --noEmit` clean; `npx eslint` on the changed files clean; `npx eslint .`
  baseline unchanged. Prod :3002 left running.

### Gotchas (this step)
1. Sticky + `overflow-hidden` on the hero section collide — drop overflow-hidden exactly when the
   panel is present (`lg:items-start` + sticky top-9 also required).
2. The date-nav buttons are native `disabled` (React boolean attr → `disabled=""` in SSR/DOM), NOT
   `aria-disabled` — CDP/SSR probes must use `[disabled]`/`disabled=""`.
3. Panel class markers for tests: `.gs-panel`, `.gs-panel-title`, `.gs-fact`, `.gs-date-chip`,
   `.gs-date-prev`/`.gs-date-next`, `.gs-time-chip`, `.gs-selection`, `.gs-paylater` (link or
   disabled span), `.gs-payonline`.
4. FR/EN `panelEyebrow` == `ctaEyebrow` (both "Réserver"/"Book") — never probe ctaEyebrow to test
   navy-band absence; probe `ctaHeading` (`Prêt(e) à rejoindre la séance ?` / `Ready to join the session?`).

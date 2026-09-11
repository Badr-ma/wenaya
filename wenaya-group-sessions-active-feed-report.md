# STEP 3 — Group Sessions Active-Feed Integration (read-only listing, FR + EN)

Branch: `pre-production-cleanup` (nothing committed/pushed) · 2026-09-10

## A. Executive summary

The `/seance-de-groupe` and `/en/seance-de-groupe` listings are now sourced
from the **live Wenaya backend ACTIVE group-appointment feed**
(`GET /api/v1/getAppointmentsGroupsWithPagination`) during prerender/ISR. The
backend controls what is listable: programs with no active, today-or-future
slots disappear automatically; newly-published programs appear automatically.
The local 6-session editorial set (`group-sessions.ts`) is retained purely as
the **offline/exception fallback** and for the detail pages, which are
untouched (`generateStaticParams` stays local → same canonical routes, 404s,
hreflang, sitemap).

- Read-only wire: the listing card never calls the backend from the browser;
  everything happens server-side via the shared GET client
  (`src/lib/api/client.ts`) and is Data-Cache cached with a 10-minute
  revalidation window.
- Backend-only programs (today: Group Training, Jiu Jitsu Kids 7-12) are
  mapped to **minimal records from verified API fields** — their card routes
  to the contact flow (`/contact-us?service=api-{id}&type=group-session`),
  never a guessed detail-slug route.
- Verified both paths end-to-end: live-feed render (2 cards) and dead-backend
  fallback render (6 editorial cards) on clean builds.

## B. Scope & out-of-scope

**In scope:** API transport + validation, active-feed adapter, listing wiring
(FR + EN), ItemList JSON-LD alignment, metadata description genericization,
fallback behavior, ISR/caching.

**Out of scope (untouched):** group-session **detail** pages (routes,
`generateStaticParams`, `getGroupSessionBySlug`, 404s, hreflang, canonical —
all local), sitemap entries, booking/payment, any write/auth, the homepage
CoursAteliers + Clinic Courses sections (still local), `/contact-us` backend
seam, `/api/contact` contract.

## C. Live API facts re-verified (2026-09-10)

- `getAppointmentsGroupsWithPagination` → Laravel paginator; `data` = parent
  programs each embedding `children[]` (dated slots). Today exactly **2
  parents**: id 269 `Jiu Jitsu Kids (7-12 ans)` (event_key `WE-GROUPCEEB200633`,
  `event_slug` irregular `jiu-jitsu-kids-7-12-ans-13`, cap 12, `price: 200`) and
  id 922 `Group Training` (event_key `WE-GROUPD575E1CD2E`, `event_slug`
  `group-training`, cap 4, `price: 300`).
- Each parent carries **29 active children** (dates today → 2026-10-02 /
  2026-12-17); ALL are `event_status: "active"`. Full flat feed = 59 slots =
  58 `active` + 1 `completed` (a same-day 09:00 slot) → today-or-future gate is
  meaningful.
- `company.name = "Wenaya Clinic"` present on both parents; `professional`
  empty, `description` empty, `logo` = remote `/storage/uploads/events/*.png`.
- Trap endpoints avoided: bySlug = router 404 for every value; byPracticeSlug
  is keyed by **company** slug and 400s otherwise.

## D. Endpoint choice

`getAppointmentsGroupsWithPagination` (parents + active children) selected as
the **listing feed**: it matches the frontend "one card per session family"
model and needs exactly one request (page-walk). The flat slot feed
(`getAllAppointmentsGroup`) and the filter-attributes feed
(`getAppointmentGroupFilterAttributes`) remain the alternates/validation
source in `wenaya-group-sessions-api-contract.md` §3, not wired.

## E. Active predicate (exact, verified)

A program is listable ⇔ `children.some(c => c.event_status === "active" &&
c.event_date >= todayIso)`. `event_date` is ISO `YYYY-MM-DD`, so the date gate
is a lexicographic `>=`. Evidence: same-day `completed` slot is today-stamped;
endpoint-2 `children[]` contains only `active` slots; both current programs
have today-or-future children. No ambiguity → no JAMAL block.

## F. Identity & slug policy

Identity is the backend numeric `id`, surfaced as the stable model key
`api-{id}` (e.g. `api-922`, `api-269`). **`event_slug` is never used as an
identity** (269's slug carries an irregular `-13` suffix; child slugs
`group-training-255` don't match child ids). `service` query param on backend
cards = `api-{id}` → `getGroupSessionForBooking` fails cleanly → no prefill
notice (intended; flows as informative context through `/api/contact`).

## G. Data model & mapping

`GroupSession` model preserved. Backend-only programs use only verified
fields: `title` (API), a one-line description derived from the verified
`company.name` fact + location copy (`Séance collective en présentiel au
centre Wenaya à Casablanca.` / `Group session in person at the Wenaya centre
in Casablanca.`), `typeLabel` = localised generic, `location` = local
`enPresentiel` copy, existing-public-image placeholder, bronze accent. No
prices, coaches, dates, capacities or practice relations are exposed (the
model has no such fields; no new UI this step).

## H. Fallback & resilience

`getActiveGroupSessions(locale)` wraps the network in try/catch: on **any**
transport/shape failure it `console.warn`s and returns the full local
editorial set. API-success never merges local sessions; backend failure never
merges backend items. A verified success with **zero** eligible programs
renders the list header with an empty grid (the backend genuinely has nothing
sellable) — documented, by design.

## I. ISR / caching

Both `next: { revalidate: 600 }` (via `GROUP_SESSIONS_API_REVALIDATE`) on the
fetch, so the listings are **ISR with a 10-minute Data Cache**. `npm run build`
lists `/seance-de-groupe` and `/en/seance-de-groupe` as `10m` ISR — the live
feed is baked at build and revalidated; there is no client polling. Page count
unchanged (270 static + new route behaviour).

## J. Files created / changed

**Created:**
- `src/lib/group-sessions-api.ts` — transport + types + validation
  (`ApiGroupProgram`, `ApiGroupProgramChild`, paginator, `fetchGroupProgramsPage`,
  page-walk `fetchGroupPrograms`, 50-page guard, `GROUP_SESSIONS_API_REVALIDATE`).
- `src/lib/group-sessions-active.ts` — adapter: entity decoder/tag-stripper,
  active predicate, `normalizeProgram` (minimal records), `getActiveGroupSessions`,
  `sanitizeGroupSessionHtml`.

**Modified:**
- `src/components/seance-de-groupe/GroupSessionsList.tsx` — `sessions` prop
  (was client-side `getAllGroupSessions`).
- `src/components/seance-de-groupe/GroupSessionsPage.tsx` — passes `sessions`
  down.
- `src/app/(fr)/seance-de-groupe/page.tsx` + `(en)/en/seance-de-groupe/page.tsx`
  — async pages awaiting `getActiveGroupSessions("fr"/"en")`; ItemList JSON-LD
  now reflects the **rendered** set; both `description` metas genericized (the
  old copy enumerated the 6 local sessions, which is no longer authoritative).

## K. Routing / SEO impact

- Detail routes, `generateStaticParams`, per-slug 404s, hreflang, canonical,
  sitemap detail entries: **all unchanged**.
- `/seance-de-groupe` + `/en/...` canonical + hreflang unchanged.
- ItemList structured data now lists the active programs actually rendered
  (positions 1-2 today); WebPage node unchanged.
- Meta descriptions no longer enumerate local-only session names (kept honest
  for a dynamic inventory).

## L. Security

`group-sessions-api.ts` + `active.ts` are server-only. Verified the endpoint
path string appears in **0** client JS chunks and **0** SSR HTML bytes for
both locales — the browser never calls `api.wenaya.com`. No secrets, no
Authorization, no credentials in transport.

## M. Verification evidence (clean builds, `next start`)

Live build (+baked live feed):
- FR + EN `/seance-de-groupe` → 200, exactly **1 `<h1>`** (hero).
- **2 card anchors** to the contact flow (`/contact-us?service=api-922...`,
  `api-269...`; EN → `/en/contact-us?...`); `service=api-922`/`api-269` ×3
  each (card href + bookingHref + RSC flight).
- ZERO editorial detail links (`/seance-de-groupe/yoga-prenatal` etc.) on live.
- ItemList JSON-LD = the 2 active programs with the verified-fact description.
- Detail pages `/seance-de-groupe/{yoga-prenatal,sophrologie,…}` still 200.

Forced-fallback build (`PRACTICES_API_URL=http://127.0.0.1:9`):
- Both listings render the **6 editorial sessions** (Group Training / Jiu Jitsu
  Kids = 0), with per-locale detail links (`/seance-de-groupe/yoga-prenatal`,
  `/en/seance-de-groupe/prenatal-yoga` booking `service=prenatal-yoga`).
- Build completes (no crash on backend outage; `[pratiques] backend
  unavailable` logged as the parallel existing fallback).

## N. Known notes / behaviour

- **Stale-ISR gotcha:** the runtime Data Cache can mask a fallback test — a
  just-built page keeps serving its baked HTML. Verify the fallback on a build
  made *with* the broken env (done), or after clearing `.next/cache`.
- Backend `data.page` values are `…/data` arrays (Laravel 11), so the enclosing
  `data.data` wrapper is confirmed; validation enforces it.
- Decorative image placeholders and the derived description are clearly marked
  in code as placeholder/derived; the real logos are remote and not whitelisted,
  so local assets used.
- EN stays fully local for chrome; the API events have no locale field (FR-only
  data), titles like `Jiu Jitsu Kids (7-12 ans)` used verbatim on both locales.

## O. Remaining user checks

Real-browser visual QA at 1440/768/390: 2-card grid rhythm, fallback 6-card
look, contact-flow card link feel, placeholder image subject framing.

## P. Code-quality gates

`npx tsc --noEmit` clean · `npx eslint .` **0E/12W** (unchanged pre-existing
baseline; 6 changed/new files clean) · `npm run build` **270 static pages**
passes twice (live + forced-fallback). Prod `next start` :3002 restored with
the live-feed artifact.

## Q. JAMAL / future

- Surface `price`/`duration`/`capacity`/`nbr_of_participants`/coach only when a
  card/detail UI step is approved — requires backend confirmation that these
  prices are public and stable.
- Consider syncing copy/titles if backend titles become the authoritative FR
  names for the existing editorial families (a mapping table is the pending
  decision from the contract §9).
- Flat-slot feed (`getAllAppointmentsGroup` / filter-attributes) remains the
  path for any dated-slot views.

## R. Deferrals & untouched

No commit/push; no writes/auth/bookings/payments; `/api/contact`,
`ContactForm`, `group-sessions.ts` local adapter, homepage/Clinic sections,
sitemap, detail pages, professional/other families untouched.
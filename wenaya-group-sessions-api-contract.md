# Wenaya Group Sessions API — Integration Contract & Audit

> **Status:** AUDIT COMPLETE — READ ONLY. No code changed, nothing committed/pushed (branch `pre-production-cleanup`).
> **Date:** 2026-09-10
> **Endpoints audited (live `https://api.wenaya.com/api/v1`):** the 6 documented group-appointment getters — `getAllAppointmentsGroup`, `getAppointmentsGroupsWithPagination`, `getAppointmentGroupBySlug`, `getAppointmentGroupByPracticeSlug`, `getAppointmentGroupByProfessionalSlug`, `getAppointmentGroupFilterAttributes` — plus support probes (`getAllPublicCares`, `getAllPublicSpecialities`, `getAllPublicTroubles`) to decode referential fields.
> **Frontend files audited:** `src/lib/group-sessions.ts`, `src/components/seance-de-groupe/{GroupSessionsPage,GroupSessionsHero,GroupSessionsList,GroupSessionDetail}.tsx`, `src/components/clinic/{Courses,SessionsExplorer}.tsx`, `src/app/(fr)/seance-de-groupe/**`, `src/app/(en)/en/seance-de-groupe/**`, `src/app/sitemap.ts`, `src/components/contact/ContactForm.tsx`, `src/i18n/{fr,en}.ts` (`coursAteliers`, `seanceDeGroupe`, `contact.booking*`).

---

## 1. Endpoint fact sheet (all 6 getters, verified live 2026-09-10)

| # | Endpoint | Param | VERIFIED behavior | Response `data` shape | Dataset (today) |
|---|---|---|---|---|---|
| 1 | `GET getAllAppointmentsGroup` | `?page=N` (1-based, 12/page server-side, ignored `per_page`/`limit`/`search` like practices) | **200** | Laravel paginator `{current_page, data[], last_page, total, …}` of **flat upcoming slots** (children only) | **59 slots** over 5 pages, dates **2026-09-10 → 2026-12-17** |
| 2 | `GET getAppointmentsGroupsWithPagination` | `?page=N` | **200** | Laravel paginator `{data[], …}` of **parent programs**, each with embedded `children[]` (active slots) | **2 programs** (per_page 15, total 2), children 29 each |
| 3 | `GET getAppointmentGroupBySlug/{event_slug}` | path slug | **⚠️ ALWAYS 404 "route could not be found"** for every value including real parent/child slugs AND numeric ids — the route is **absent from the deployed route table** (documented, dead) | — | — |
| 4 | `GET getAppointmentGroupByPracticeSlug/{companySlug}` | path **company slug** (name misleading!) | **200** only for `wenaya-clinic`; `1`/any other → **400** `{error:true,message:"Company Not found."}` | `{ days: [30-day calendar], data: [ ALL company events (parents + children, past + future) ] }` | `days[30]` + `data[1068]` (2023-04-25 → 2026-12-17) |
| 5 | `GET getAppointmentGroupByProfessionalSlug/{profSlug}` | path **professional user slug** | **200** for known pro slugs (`amer-hdidou` ✓, `thomas-0778-224759-sabrou` ✓, `nadine-kita` ✓ empty). Unknown slug → **404** | `{ days: [30-day calendar], data: [ that pro's events ] }` | pro-filtered subset of #4 |
| 6 | `GET getAppointmentGroupFilterAttributes` | none | **200** | `array` of **all currently-active slots** with filter attributes resolved | **58 slots** (= the active set) |

**Pagination rule (endpoints 1–2):** `current_page < last_page ⇒ hasMore` (no `has_more` field). Same wire convention as the practices endpoint.

### Envelope & transport (shared with every `/api/v1` endpoint)
- Wrapper everywhere: `{ error: false, message: <string|null>, data: <…> }`. Business failures reuse the same envelope with `error:true` (HTTP 400) — **do not key on HTTP status alone**.
- Router-level misses (dead/invalid path) return Laravel's 404 `{message,exception,file,line,trace}` with **HTTP 404** — distinguishable from business 404s (which live inside the envelope).
- Behind Cloudflare (`X-RateLimit-Limit: 1000`/hr), `Set-Cookie: we_session` (ignore), `X-Powered-By: Yolo` (Laravel), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`. All GET, no auth.

### Schedule `days` objects (endpoints 4–5)
```jsonc
{ "date": "2026-09-10", "day_name": "Thu", "day": "10", "month": "09", "year": "2026" }   // 30 consecutive days
```

---

## 2. Dataset census (live, 2026-09-10)

**Upcoming feed (endpoint 1) = 59 slots, all `offline`, child-only (`parent ≠ null`):**
- `Group Training` — 30 slots (parent **922**), coach Thomas Sabrou (user 176), capacity 4, 300 MAD, 60 min.
- `Jiu Jitsu Kids (7-12 ans)` — 29 slots (parent **269**), coach Amer Hdidou (user 36), capacity 12, 200 MAD, 60 min.
- Status: **58 `active` + 1 `completed`** (today's 09:00 slot already ran). Identical title set across all pages — these are the **only** two programs with future slots today.

**Program catalog (endpoint 2) = 2 parents** (each with `children[]` = its active slots):
| id | title | `event_slug` | children |
|---|---|---|---|
| 922 | Group Training | `group-training` (no suffix) | 29 |
| 269 | Jiu Jitsu Kids (7-12 ans) | `jiu-jitsu-kids-7-12-ans-13` (⚠️ `-13` suffix) | 29 |

**Full company schedule (endpoint 4, `wenaya-clinic`) = 1068 events** spanning 2023-04-25 → 2026-12-17:
- 108 parent records (`parent: null`) + 960 child slots; 1010 `completed` + 58 `active`; all `offline`.
- **70 distinct historical titles** — the family catalogue is far richer than the current feed. It already contains names that map to our frontend sessions (see §6): `Yoga Prénatal (Méthode de Gasquet)` ×24, `Yoga prénatal` ×3, `Breathwork & Soundhealing` ×18, `Soundhealing & Breathwork` ×3, `Jiu Jitsu Adulte` ×180, `JJB Adulte` ×4, `Jiu Jitsu Kids` ×207, `Jiu Jitsu Ados (7-12 ans→12-15)` ×142, `Small group training` ×75, `Group Training` ×240, `Gentle Hatha (Mobilité)` ×36, `Bains Sonores / Soundhealing` ×4+2, `Stretch & Defend` ×11, `Candlelight Yin Yoga` ×5, plus many one-off/legacy (typo-ridden) titles.

**Filter attributes (endpoint 6) = 58 slots** — byte-same active set; each row carries resolved `room`, `professional` (flat), `company` (flat), `specialty`, `capacity`, `participants_count`, `nbr_of_participants`, `parent`, `event_date/_time/_status/_slug`, `logo`.

**Referential decoding:**
- `care` (206 / 116) is an **internal** care row — **not present** in `getAllPublicCares` (19 cares, 2 pages). Care catalog is for booking write-pricing, not for public rendering.
- `logo` images live on `https://api.wenaya.com/storage/uploads/events/…` (allowed host in `next.config.ts` — same `/storage/uploads` path already serving practice images).
- Coaches are regular user records: `professional.slug` values seen `thomas-0778-224759-sabrou` (username-derived), and `amer-hdidou` / `nadine-kita` resolve as URL params.

---

## 3. Event (slot) record model — field-by-field

From a full live slot (endpoint 1) + filter row (endpoint 6). Types are observed values.

| Field | Type | Notes |
|---|---|---|
| `id` | int | slot id (5184+ range today) |
| `parent` | int\|null | parent program id (null ⇒ program record, only in endpoint 4) |
| `title` | string | **French** program title (e.g. `Group Training`, `Jiu Jitsu Kids (7-12 ans)`); no locale field on the event |
| `description` | string (HTML) | French copy, e.g. `<p><strong>Le Jiu Jitsu…</strong>…` |
| `logo` | string\|null | `https://api.wenaya.com/storage/uploads/events/<ts>_<hex>.png` |
| `images` | array | empty on samples |
| `capacity` | int | 4 (GT) / 12 (JJK) |
| `nbr_of_participants` | int | 0 today — bookability gate `nbr_of_participants < capacity` |
| `participants_count` | int | same value (endpoint 6 flag) |
| `price` | string `"300"` | MAD string; `firstUseprice: "0"` (first-visit price) |
| `currency` | string | `MAD` |
| `duration` | string `"60"` | minutes |
| `event_date` | string | `YYYY-MM-DD` local (Casablanca) |
| `event_time` | string | `HH:MM:SS` |
| `event_status` | string | `active` (bookable) / `completed` (past) — **58 active today** |
| `event_type` | string | `offline` (only value; `online` supported by design) |
| `event_key` | string | `WE-GROUPD10DC85DA9` (booking/order key) |
| `event_slug` | string | **generated `{programSlug}-{…}`** (e.g. `group-training-263`, `jiu-jitsu-kids-7-12-ans-183`) — see §9 risk R4 |
| `room` / `room_id` | int | room 2 = `Plateau Tatami` (number 5, "1er étage Psychomot/Groupes/Arts Martiaux"), room 3 = Group Training room; endpoint 6 returns full room object |
| `specialty` | int\|null | null on samples; inconsistent shape across endpoints |
| `care` | int | internal care row id (206/116) — **not in public cares** |
| `company_id` | int | 1 (Wenaya Clinic, slug `wenaya-clinic`) |
| `user_id` | int | coach user id (176 / 36) |
| `company` | object | full company (id/name/logo/slug/address…) in endpoints 1–2; flat `{id,name,logo,logo_path}` in endpoint 6 |
| `professional` | object | full user record (id/first_name/last_name/username/slug/avatar/about…) in endpoints 1–2; flat `{id,first_name,last_name,avatar,formattedCreatedAt,currency}` in endpoint 6 |
| `canceled_by` / `canceled_at` | null | so far null; a cancel state exists (`canceled` status implied) |
| `remarks`, `details`, `last_mail_sent_at`, `created_at`, `updated_at` | | operational/traceability |

## 4. Program (parent) model (endpoint 2)

Parent records are the editorial unit: `{id, title, description, logo, capacity, price, duration, event_key, event_slug, event_type, … parent: null, children: [slot…]}`. `children[]` = active dated slots of that program (29 each today). **This is the natural shape for a "program → session detail with upcoming dates" UI.**

---

## 5. Locale & content reality (critical design fact)

- **No `locale` field on events**; `title`/`description` are **French only**. The professional user object carries `locale: "ar"` — unrelated to event content.
- **EN is fully local** in the project (`coursAteliers`/`seanceDeGroupe` i18n + `getAllGroupSessions("en")`), mirroring the proven `hasGenuineEn` practices strategy. Do not trust any backend field for EN.
- **Frontend canonical sessions (6) ↔ backend real families (from the 70-title census):**

| Frontend session (slug) | Backend family exists? | Evidence (historical titles) |
|---|---|---|
| Yoga Prénatal (`yoga-prenatal`) | **Yes** – title differs | `Yoga Prénatal (Méthode de Gasquet)` ×24, `Yoga prénatal` ×3 |
| Jiu Jitsu Brésilien (`jiu-jitsu-bresilien`) | **Yes** – title differs | `Jiu Jitsu Adulte` ×180, `JJB Adulte` ×4 (+ Kids ×207 / Ados ×142) |
| Breathwork (`breathwork`) | **Yes** – title differs | `Breathwork & Soundhealing` ×18, `Soundhealing & Breathwork` ×3 |
| Nutrition (`nutrition`) | **Partial** | only `Atelier Education Alimentaire` ×3 |
| Sophrologie (`sophrologie`) | **No** | no Sophrologie title anywhere in the 1068 |
| Pilates & Posture (`pilates-et-posture`) | **No** | no Pilates title anywhere in the 1068 |

**Verdict:** 3/6 families exist in the backend but under different titles; 1 partial; 2 absent. And of those that exist, **none have bookable slots today except the 2 feed programs (§2)** — the majority of the 58 active slots (58 = 30 GT + 28 JJK-ish) belong to exactly those two programs. Integration therefore cannot be a straight "adopt the API list" unless we either (a) re-map the frontend catalog to backend programs/titles, or (b) keep an editorial catalog + map per-session to backend `{program, coach, care}` when booking — decisions for Jamal (§10).

---

## 6. Frontend integration contract (current state)

- **Adapter:** `src/lib/group-sessions.ts` — pure local, no API. 6 `CanonicalGroupSession`s keyed into i18n `coursAteliers`; URLs `/seance-de-groupe/{slugFr}` (EN uses `slugFr` too, matching live). SEO: SSG details, self-canonical + fr-MA/en-MA hreflang, sitemap entries. No price, date, capacity, coach, room, or schedule fields exist on `GroupSession` (deliberate — no invented data).
- **Booking:** `bookingHref` = `/contact-us?service={slugFr|slugEn}&type=group-session` → the contact page's **group-session prefill** (`ContactForm` sets `bookingCategory=group-session`, required phone). Informational request — the site's current booking seam.
- **Clinic gallery:** `/about-us` Courses section renders all 6 via `getAllGroupSessions(locale)` (snap-rail gallery).
- **Listing pages:** `GroupSessionsPage`/`List`/`Hero` + detail via `GroupSessionDetail` — frontend files audited, all local.
- No `/api/*` proxy for group sessions exists yet (the practices `/api/pratiques` proxy is the template).

## 7. Write / booking side (informational, NOT exercised)

The read→write bridge for group booking (from the master plan, §B.9): `POST joinPatientToGroupAppointment` `{participants:[{id,joined_at,from:"client",paid:0,transaction:null,type:"online"}]}`, `POST checkIfUserHasValidPack`, plus general appointment/Naps payment and guest `waiting-lists`. Out of scope here; flagging so a future booking integration keys on `event_key`/`care`/`price` rather than the editorial slugs.

---

## 8. Findings & risks

| # | Finding | Severity | Mitigation / implication |
|---|---|---|---|
| R1 | `getAppointmentGroupBySlug/{slug}` is **dead** (router 404 for all inputs). There is **no live per-detail-page endpoint**. | **HIGH** for any "dynamic detail" ambition | A real session-detail page must use a proxy over endpoint 2/4/5 + client-side selection, or Jamal must expose/fix a details route. Current local detail pages are unaffected (not API-backed). |
| R2 | `getAppointmentGroupByPracticeSlug` is actually **company**-keyed (`wenaya-clinic`); practice slugs 400 "Company Not found." | MEDIUM | Name is a trap; only useful for company-scoped scheduling, never per-discipline. |
| R3 | Only **2 programs/sessions have future slots** today; 3/6 frontend families exist historically under other titles; Sophrologie & Pilates absent entirely. | MEDIUM | Content mapping must be a product decision, not an adapter guess. |
| R4 | `event_slug` generation is irregular: parent 922 → `group-training` but parent 269 → `jiu-jitsu-kids-7-12-ans-13` (id suffix); child slugs `…-263`/`…-183` don't match child ids (263≠1264, 183≠1222). | MEDIUM | Never build URLs from slugs; identify by `id`/`parent`/`event_key`. |
| R5 | Coach identifiers differ from the project's specialist slugs (`nadine-kita` matches, but most group coaches are users like `thomas-0778-224759-sabrou`; `khalid-ouazzani` → 404). | LOW | Coach-join maps must be per-user-id, not by name. |
| R6 | `description` is raw HTML (needs decode+strip, like practices); endpoint-4 company schedule is a **1068-row payload** every call. | LOW | Adapter sanitizes; cache schedule with `next.revalidate`, prefer endpoint 1/2/6 for UI feeds. |
| R7 | Status semantics: `active` = bookable, `completed` = past, cancel fields exist (all null today). Feeds disagree (~58 children vs 59 flat incl. today's completed). | LOW | Define "listable slot" = `active ∧ event_date ≥ today`. |
| R8 | `room`/`specialty` shapes differ between endpoints (full object vs id; nulls). | LOW | Normalize in adapter. |
| R9 | Event images are single `logo` (square, from `/storage/uploads/events/`); no editorial landscape images backend-side → keep local imagery for cards. | LOW | Visual layer stays local; `logo` used only if/when needed. |

## 9. JAMAL VALIDATION (open questions)

1. `getAppointmentGroupBySlug/{slug}` is documented but **route-missing** on the deployed API — should it exist (and with which slug form)? Or is endpoint 4 the intended detail source?
2. The live feed holds only **2 programs** (Group Training, Jiu Jitsu Kids). Are those the entire *currently sellable* group program set, and is the 70-title history (Yoga Prénatal, Breathwork, Jiu Jitsu Adulte…) still sellable?
3. **Approved mapping** for the 6 frontend sessions → backend programs/cares (title-differing for Yoga/JJB/Breathwork, partial Nutrition, absent Sophrologie/Pilates)? Rename to backend titles, create backend records, or keep an editorial catalog?
4. Is the backend `title`/`description` authoritative enough to replace the local editorial copy for FR when a program matches?
5. Should the site expose **dated slots** (book specific date/time — needs endpoint 2/6 + backend consent on the write side) or keep **editorial sessions** → contact-form (today's model)?
6. `event_slug` irregularity (§R4) — acceptable to never use it in URLs?
7. Which coach-join keys should the frontend use (professional user id vs slug) for a future roster?
8. Booking bridge confirmation before any write work: `joinPatientToGroupAppointment` shallow participant payload + `checkIfUserHasValidPack`, or `createPendingAppointment`/`waiting-lists` for guests?
9. `price`/`firstUseprice`/`capacity`/`care` semantics stable? (Used only if booking becomes first-class.)
10. Rate budget: 5 pagination calls (upcoming feed) or 1 (filter attributes / program catalog) per refresh — acceptable at 1000/hr with `next.revalidate = 3600`?

## 10. Acceptance criteria (regression checklist — current, all PASSING for the *local* model)

1. `/seance-de-groupe` + `/en/seance-de-groupe` + 6×2 detail routes → 200, exactly 1 `<h1>` each.
2. Hreflang fr-MA/en-MA both directions + self-canonical + sitemap (no API dependency at build).
3. `bookingHref` → `/contact-us?service=…&type=group-session` (+ `/en/…`), ContactForm shows group-session category, empty-category submit blocked.
4. No API URL in client bundles; nothing client-side calls `api.wenaya.com`.
5. EN zero French leak; FR accents intact.
6. `npx tsc --noEmit` clean; `npx eslint .` 0E/12W (pre-existing baseline); `npm run build` 270 pages.

## 11. Recommended rails (when a read-side integration is green-lit)

1. **Extract a shared server fetch** (`src/lib/api/…`) + `src/app/api/group-sessions/route.ts` BFF proxy — never call `api.wenaya.com` from the browser.
2. Prefer **endpoint 6 (filter attributes)** for "active sessions" feeds and **endpoint 2 (programs + children)** for schedule views; use endpoint 4 only for company-wide admin/derived pages; keep them behind `next.revalidate` caching.
3. Adapter normalizes to a `GroupSessionAPI` type: identification by `id`/`parent`/`event_key` (never `event_slug`), `active`-only, HTML decode+strip on `description`, integer/converted `price`,`duration`,`capacity`; local images for marketing, `logo` optional.
4. Keep EN local; FR falls back to local editorial copy for anything thinner than the current descriptions (mirror `hasGenuineEn`).
5. Any future booking write path must be gated by Jamal sign-off (§9 Q8) — nothing in this repo writes to the API today.

---

## Appendix A — Probe log (raw evidence, 2026-09-10)

Caputes in `%TEMP%\opencode\gs-contract\`: `1_page*.json` (endpoint 1 walk), `2_full.json` / `2b_full.json` (endpoint 2), `4_one_event.json` (full slot record), `5_amer_schedule.json` (endpoint 5 shape), `6_bypractice_full.json` (endpoint 4, 1068 rows).

| Probe | Result |
|---|---|
| `GET …/getAllAppointmentsGroup?page=1..5` | 200 — 59 slots, last_page 5, per_page 12 |
| `GET …/getAppointmentsGroupsWithPagination` | 200 — total 2, last_page 1, per_page 15 |
| `GET …/getAppointmentGroupBySlug/{group-training}` | 404 route-not-found |
| `GET …/getAppointmentGroupBySlug/{jiu-jitsu-kids-7-12-ans-13}` | 404 route-not-found |
| `GET …/getAppointmentGroupBySlug/{group-training-263}` · `{1264}` · `{1222}` | 404 route-not-found |
| `GET …/getAppointmentGroupByPracticeSlug/wenaya-clinic` | 200 — `{days[30], data[1068]}` |
| `GET …/getAppointmentGroupByPracticeSlug/1` · `{kinesitherapie}` · `{group-training}` | 400 — `"Company Not found."` |
| `GET …/getAppointmentGroupByProfessionalSlug/amer-hdidou` | 200 — data[1] (Jiu Jitsu Kids slot) |
| `GET …/getAppointmentGroupByProfessionalSlug/thomas-0778-224759-sabrou` | 200 — data[1] |
| `GET …/getAppointmentGroupByProfessionalSlug/nadine-kita` | 200 — data[0] (no group sessions) |
| `GET …/getAppointmentGroupByProfessionalSlug/khalid-ouazzani` | 404 |
| `GET …/getAppointmentGroupFilterAttributes` | 200 — array[58] |
| `GET …/getAllPublicCares?page=1..2` | 200 — 19 cares; **no id 116/206** (internal) |
| `GET …/getAllPublicSpecialities` | 200 — array[19] (cross-check only) |
| `GET …/getAllPublicTroubles` | 200 — object (cross-check only) |

See also `wenaya-api-integration-master-plan.md` §B.9 for the documented write-side endpoints (not exercised here).
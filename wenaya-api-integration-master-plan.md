# Wenaya API → Frontend Integration Master Plan

> **Audit deliverable.** Maps every endpoint in `API_DOCUMENTATION (1).md` (the authoritative
> backend reference, generated from the legacy `wenaya-front` source, Sep 2026) to the current
> Wenaya frontend repository (`pre-production-cleanup` branch). READ-ONLY audit — **no code was
> changed, no endpoints were called (except the already-integrated practices listing), nothing
> committed.** Response shapes are NOT invented: where the doc does not state a field list, the
> integration is marked `NEEDS_BACKEND_CONFIRMATION`.
>
> Companion deliverables: `wenaya-practices-api-contract.md` (already-audited live specialities
> contract), `wenaya-seo-migration-*` series (URL surface), AGENTS.md session log.

---

## A. Frontend data-source matrix

Current repository data sources per domain (route family → source of truth). Domain numbering
follows the API doc sections; rows marked **EXISTS** mean a first-class integration path already
exists in this repo.

| # | Domain (API doc §) | Route(s) in this repo | Current data source | Integration readiness |
|---|---|---|---|---|
| 1 | Search & discovery (§6.1) | (no search page — none of `homePageSearch`/`search/getSpecialities`/`getLocations`/`getResults` is consumed) | n/a | **GAP** — no feature surface; `/pratiques` has a *local* filter bar, `/produits` a local filter bar |
| 2 | Public catalog — cares / specialities / troubles / media / articles (§6.2) | `/pratiques`, `/pratiques/[slug]` | Practices: live API (see §E.5 / practices-contract). Cares & troubles: `care-journeys.ts`, `pathologies.ts` (local, live-verbatim). Media: n/a | Partially EXISTS (practices only); cares/troubles/media have local adapters |
| 3 | Practices / clinics (§6.3) | `/pratiques`, `/pratiques/[slug]`, `/about-us` | `practices-api.ts` + `practice-adapter.ts` + `practice-content.ts` (fallback) | **EXISTS (live)** — canonical slug map, adapter, proxy route `/api/pratiques` |
| 4 | Professionals (§6.4) | `/professional`, `/professional/[slug]` (+ `BookingPanel` booking card) | `specialistes.ts` mock dataset + Redis admin CRUD (`getAllSpecialistsAsync`) + local `availability.ts` derivations | GAP for live data — mock specialists, Unsplash images, weekly-slot derivation |
| 5 | Availability & booking slots (§6.5) | `BookingPanel` (specialist page booking UI) | `availability.ts` — synthesized from mock weekday slots; no real-time slots | GAP — no live clock/date read |
| 6 | Services / pricing (§6.6) | (n/a — prices never shown) | none | GAP |
| 7 | Appointments 1:1 (§6.7) | `/contact-us?type=booking` (nav CTA) — submits to local `/api/contact`, **no appointment is created** | `/api/contact` mock (validates first/last/email only) | GAP — booking is a message, not an appointment |
| 8 | Group sessions / classes (§6.8) | `/seance-de-groupe`, `/seance-de-groupe/[slug]` | `group-sessions.ts` (i18n `coursAteliers` bundle; 6 sessions; no prices/dates/schedules) + `/contact-us?service={slug}&type=group-session` | GAP for live data |
| 9 | Events (§6.9) | `/evenements` → 308 to `/seance-de-groupe` (P1 resolution) | none | GAP (intentionally folded) |
| 10 | Packages / packs (§6.10) | (no pack storefront) | none | GAP |
| 11 | Wallet (§6.11) | (no wallet) | none | GAP |
| 12 | Favorites & reviews (§6.12) | `ProductRating` (static demo numbers) only | none | GAP |
| 13 | Patient profile / account (§6.13) | `/login` (presentational, submit disabled) | none — deliberately no patient backend yet | GAP (intentional: availability notice) |
| 14 | Location (§6.14) | (no country/city picker anywhere) | none | GAP |
| 15 | Contact / marketing (§6.15) | `/contact-us`, `/corporate` (quote), Recruitment modal, `/soins-a-domicile` | local `/api/contact` mock (validates identity, logs server-side, no POST to backend) | GAP — outbound never reaches Laravel; `sendProEmail`/`sendBusinessEmail` unused |
| 16 | Intake forms & invitations (§6.16) | (none) | none | GAP |
| — | NAPS payment (§7) | (none — checkout is a demo `CartContext`/localStorage cart) | cart/checkout are local-only demos | **GAP + is a security boundary** (see §H) |
| — | Auth (§4) | `/login`, `/en/login` | presentation-only (disabled submit + availability notice) | GAP (intentional) |

### Route families that exist today (for adapter targeting)

- Homepage: `/`, `/en` — homepage CMS sections via `homepage.ts` + Redis + `/api/homepage`.
- `src/lib/*.ts` adapters already present: `pratiques.ts`, `practices-api.ts`, `practice-adapter.ts`,
  `practice-content.ts`, `pratique-specialists.ts`, `pratique-cta.ts`, `specialistes.ts`,
  `group-sessions.ts`, `care-journeys.ts`, `pathologies.ts`, `health-needs.ts`, `blog.ts`,
  `produits.ts`, `product-adapter.ts`, `corporate-programmes.ts`, `clinic-content.ts`,
  `api-http.ts` (admin-only Bearer client — **NOT** the public API path).
- Site-owned API routes (all local, none forward to the Wenaya backend): `/api/contact`,
  `/api/blog/posts`, `/api/produits`, `/api/pratiques` (proxy to live specialities),
  `/api/homepage`, `/api/admin/*`.

**Conclusion:** the integration surface is concentrated in §6.2–6.6 (already ~60% done via
practices) + the booking/group/contact/auth families (all greenfield). No `src/lib/api/` or
`src/lib/adapters/` directory exists; existing convention is **one domain adapter file per
`src/lib/{domain}.ts`** — a new `src/lib/api/` layer should only be added if the shared client
(http/cookie/csrf/company-header) is extracted, which §E.0 proposes.

---

## B. Backend endpoint catalog

Authoritative endpoint names verbatim from `API_DOCUMENTATION (1).md`. `{v}` = `api/v1`
relative to `NEXT_PUBLIC_BACKEND_URL` except the auth/forms/NAPS families (no prefix).
Classification per §C. `Frontend target` = the adapter/route this repo would wire.

### B.1 Auth & account lifecycle (doc §4)

| Method+Path | Body | Class | Frontend target |
|---|---|---|---|
| GET `/sanctum/csrf-cookie` | — | AUTH_SENSITIVE (but inert — only seeds cookie) | shared http client |
| POST `/customer/login` | `{ email, password }` | AUTH_SENSITIVE | login adapter |
| POST `/customer/logout` | — | AUTH_SENSITIVE | logout |
| POST `/user/register` | `{firstName,lastName,email,password,countryCode,phone,timezone,isTuteurLegal,currency,role}` | AUTH_SENSITIVE | register |
| POST `/customer/forgot-password` | `{ email, operating_system, browser_name }` | AUTH_SENSITIVE | forgot-password (live one, NOT `/forgot-password`) |
| POST `/customer/reset-password` | `{ token, email, password, password_confirmation }` | AUTH_SENSITIVE | reset-password |
| POST `/email/verification-notification` | — | AUTH_SENSITIVE | resend email verification |
| POST `/verify/phone/SendCode` | — | AUTH_SENSITIVE | phone OTP |
| POST `/verify/phone/CheckCode` | `{ code }` | AUTH_SENSITIVE | phone OTP verify |
| POST `/verify/email/SendCode` | `{ origin_dns }` | AUTH_SENSITIVE | email OTP |
| POST `/verify/email/CheckCode` | `{ token, email }` | AUTH_SENSITIVE | email OTP verify |

Notes: cookie-based Sanctum SPA, **no JWT/Bearer, no OTP-at-login**. `iron-session` mirror +
`/api/set-session`, `/api/logout`, `/api/check-auth` are legacy Next-internal — NOT Laravel.
The `/forgot-password` + `/reset-password` hooks forms are unused dead variants.

### B.2 Search & discovery (doc §6.1)

| Method+Path | Class | Frontend target |
|---|---|---|
| GET `{v}/homePageSearch?{query}` | SAFE_READ (shape unknown → NEEDS_BACKEND_CONFIRMATION) | search adapter (future global search) |
| GET `{v}/search/getSpecialities` | SAFE_READ | search autocomplete |
| GET `{v}/search/getLocations` | SAFE_READ | search autocomplete |
| GET `{v}/search/getResults?{queryParams}` | SAFE_READ | search results page |

### B.3 Public catalog (doc §6.2)

| Method+Path | Class | Frontend target |
|---|---|---|
| GET `{v}/getAllPublicCares?{query}` | SAFE_READ | cares adapter (cares == care domains; likely the "Parcours/maux" family source) — shape NEEDS_BACKEND_CONFIRMATION |
| GET `{v}/getCareBySlug/{slug}` | SAFE_READ | care detail |
| GET `{v}/getAllPublicSpecialities` | SAFE_READ | practices listing (non-paginated variant) |
| GET `{v}/getAllPublicSpecialitiesWithPaginate?{query}` | SAFE_READ | **ALREADY INTEGRATED** — practices listing (verified live) |
| GET `{v}/getSpecialityBySlug/{slug}` | SAFE_READ | practices detail |
| GET `{v}/getAllPublicTroubles?{query}` | SAFE_READ | maux-troubles adapter (`pathologies.ts` replacement candidate) |
| GET `{v}/getTroubleBySlug/{slug}` | SAFE_READ | trouble detail |
| GET `{v}/getAllPublicMedia` | SAFE_READ | media gallery (no consumer today) |
| GET `{v}/public/articles?page={page}` | SAFE_READ | blog listing (`blog.ts` MDX replacement candidate) |
| GET `{v}/public/articles/{slug}` | SAFE_READ | blog detail — locale fields NOT documented → **do not assume FR/EN shape; confirm** |

### B.4 Practices / clinics (doc §6.3)

| Method+Path | Class | Frontend target |
|---|---|---|
| GET `{v}/getAllPublicPractices` | SAFE_READ | practices → clinics listing (not the speciality listing) |
| GET `{v}/getPracticeByUsername/{userName}` · `…/getPracticeBySlug/{userName}` · `…/getPracticeById/{id}` | SAFE_READ | clinic detail |
| GET `{v}/getTeamMembersByPractice/{id}` · `…/getTeamMembersByPracticeSlug/{userName}?page=` | SAFE_READ | clinic team (Team on `/about-us`) |
| GET `{v}/getTeamMembersByCareAndPractice/{practice}/{care}` | SAFE_READ | clinic filtered team |
| GET `{v}/getAllSpecialityWithCaresByPractice/{practiceId}` · `…/getSpecialityByPracticeSlug/{slug}` | SAFE_READ | clinic specialities |
| GET `{v}/getServiceByPracticeSlugAndSpecialityId/{slug}/{specialityId}` | SAFE_READ | clinic services |
| GET `{v}/getPricesByPracticeSlugAndServiceId/{slug}/{serviceId}` | SAFE_READ | clinic prices |
| GET `{v}/getPracticeProfessionals/{practice}` | SAFE_READ | practice→professional list (`pratique-specialists.ts` live replacement) |
| GET `{v}/getUnavailableDatesForPractice/{userName}` | SAFE_READ (returns `{dates[], hasClasses}`) | practice booking calendar |

### B.5 Professionals (doc §6.4)

| Method+Path | Class | Frontend target |
|---|---|---|
| GET `{v}/getProfessionalByUsername/{userName}` · `…/getProfessionalBySlug/{userName}` · `…/getProfessionalDetailsBySlug/{userName}` | SAFE_READ | `/professional/[slug]` (`specialistes.ts` replacement) — response shape NOT documented |
| GET `{v}/getAllSpecialityWithCaresByProfessional/{professional}` · `…/getSpecialityByProfessionalSlug/{slug}` | SAFE_READ | specialist practices |
| GET `{v}/getServiceByProfessionalSlugAndSpecialityId/{slug}/{specialityId}` | SAFE_READ | specialist services |
| GET `{v}/getPricesByProfessionalSlugAndServiceId/{slug}/{serviceId}` | SAFE_READ | specialist prices |
| GET `{v}/getUnavailableDatesForProfessional/{userName}/{date}` (date `YYYY-MM-DD`, defaults today) | SAFE_READ | specialist booking calendar |

### B.6 Availability & booking slots (doc §6.5)

| Method+Path | Class | Frontend target |
|---|---|---|
| GET `{v}/getAvailableTimeByProfessionalId/{professional}/{date}` | SAFE_READ | day-slot list for the specialist booking UI (replaces synthesized `availability.ts` slots) |
| GET `{v}/getAppointmentGroupByPracticeSlug/{slug}?date={date}` | SAFE_READ | clinic day classes |
| GET `{v}/getAppointmentGroupByProfessionalSlug/{slug}?date={date}` | SAFE_READ | specialist day classes |

### B.7 Services / pricing (doc §6.6)

| Method+Path | Class | Frontend target |
|---|---|---|
| GET `{v}/getPricesByCare/{id}/{professional}` | SAFE_READ | price by care (professional) |
| GET `{v}/getPricesByCareId/{id}/{practiceSlug}` | SAFE_READ | price by care (practice) |
| GET `{v}/getAllPricesByPracticeSlug/{practiceSlug}` · `…/getAllPricesByProfessionalSlug/{professionalSlug}` | SAFE_READ | full price lists |

### B.8 Appointments 1:1 (doc §6.7)

| Method+Path | Body / Query | Class | Frontend target |
|---|---|---|---|
| POST `{v}/createPendingAppointment` | `{ professional, practice?, service, price, final_price, duration, booking_date, booking_time, specialty, at:"home"\|"practice", patient:<userId>, destination? }` | WRITE_PRODUCTION_SIDE_EFFECT (creates real appointment + feeds NAPS payment link; response `data.data.{id, orderId}`) | booking submit — **never call from browser without auth + confirmations** |
| GET `{v}/getAppointmentsByCustomer?page=&pageType=` | `pageType: today\|past\|upcomming` (sic) | AUTH_READ | patient appointments |
| GET `{v}/getCustomerAppointmentById/{id}` · `…/getLastCustomerAppointmentById/{slug}` | — | AUTH_READ | appointment detail |
| PUT `{v}/cancelCustomerAppointmentById` | `{ id, reason }` (pages send `reason:2`) | WRITE_PRODUCTION_SIDE_EFFECT | cancel appointment |
| PUT `{v}/payCustomerAppointmentByWallet` | `{ appointment:<id> }` | WRITE_PRODUCTION_SIDE_EFFECT (moves real funds; errors `balance_not_available`, `this_appointment_already_paid`) | wallet-pay appointment |
| POST `{v}/getShowPhoneNumber` | `{ professional, practice, patient }` | auth-gated read (may send SMS log) → WRITE_LOW_RISK | reveal phone |
| POST `api/v1/waiting-lists` | `{ customer_name, customer_email, customer_phone, user_id, notes, booking_date, booking_time, status:"pending" }` | WRITE_LOW_RISK (creates a pending list entry, no payment) | waiting-list join (new booking UI) |
| (legacy — do not use) `AuthenticateOrRegisterUserAndCreateAppointment` | — | ignore | — |

### B.9 Group appointments / classes (doc §6.8)

| Method+Path | Class | Frontend target |
|---|---|---|
| GET `{v}/getAllAppointmentsGroup?{query}` · `…/getAppointmentsGroupsWithPagination?{query}` | SAFE_READ | `/seance-de-groupe` listing (`group-sessions.ts` replacement) — response shape undocumented |
| GET `{v}/getAppointmentsGroupBySlug/{slug}` | SAFE_READ | class detail |
| GET `{v}/getAppointmentsGroupByCustomer?{queryParams}` · `GetUpcommingAppointmentGroup` · `…/getAppointmentGroupByParent/{id}` | AUTH_READ | patient's classes |
| GET `{v}/getAppointmentGroupFilterAttributes` | SAFE_READ | class filter metadata |
| POST `{v}/joinPatientToGroupAppointment` | `{ event:<classId>, participants:[{id, joined_at:<unix>, from:"client", paid:0, transaction:null, type:"online"}] }` | WRITE_PRODUCTION_SIDE_EFFECT (registers to a real class) | join class |
| POST `{v}/checkIfUserHasValidPack` | `{ patient, patientType:"online", care, professional, duration }` | AUTH_READ (pure check, no mutation) | pack eligibility check |

### B.10 Events (doc §6.9)

| Method+Path | Class | Frontend target |
|---|---|---|
| GET `{v}/getAllEvent?{query}` · `getEventBySlug/{slug}` · `EventFilter?{query}` · `getEventFilterAttributes` | SAFE_READ | events family — currently folded into `/seance-de-groupe` (P1 decision) — resurrect only when there is real event content |

### B.11 Packages / packs (doc §6.10)

| Method+Path | Body | Class | Frontend target |
|---|---|---|---|
| GET `{v}/getPackagesByPracticeSlug/{slug}` · `…/getPackagesByProfessionalSlug/{slug}` · `…/getPackagesByProfessionalId/{id}` | — | SAFE_READ | pack listing |
| GET `{v}/getGroupPackagesListToPurchase/{practice}` | — | SAFE_READ | group packs |
| GET `{v}/getPackagesByCustomer?{queryParams}` | — | AUTH_READ | patient packs |
| POST `api/v1/createOrGetCustomerPackOrder` | `{ packId, pack_type }` | WRITE_PRODUCTION_SIDE_EFFECT (order → NAPS) | buy pack |
| POST `api/v1/createOrGetCustomerGroupOrder` | `{ groupId }` | WRITE_PRODUCTION_SIDE_EFFECT | class order |
| POST `api/v1/checkFirstUse` | `{ professional_id, patient_id }` | WRITE_LOW_RISK (flags first visit) | first-visit flag |
| (legacy — do not use) `purchasePack` | — | ignore | — |

### B.12 Wallet (doc §6.11)

| Method+Path | Class | Frontend target |
|---|---|---|
| GET `{v}/getWalletHistoryByCustomer/{id}?page={page}` | AUTH_READ | wallet history |
| (top-up) NAPS link with `orderId = generateOrderId("wlt", user.id)`, **min 100 MAD**, see §7 | PAYMENT_SENSITIVE | wallet top-up |

### B.13 Favorites & reviews (doc §6.12)

| Method+Path | Body | Class | Frontend target |
|---|---|---|---|
| GET `{v}/getFavoriteCareGiverByCustomer` · `getFavoritePracticesByCustomer` | — | AUTH_READ | favorites |
| POST `{v}/createFavoriteCareGiver` | `{ professional:<id> }` | WRITE_LOW_RISK (toggle — returns `created_successfully`/`delete_successfully`) | pro favorite |
| POST `{v}/createFavoritePractice` | `{ company_id:<id> }` | WRITE_LOW_RISK (toggle) | practice favorite |
| GET `{v}/getReviewsByProfessionalSlug/{userName}?page=` · `getReviewsByPracticeSlug/{userName}?page=` · `getAllReviewsByPractice/{id}` · `getAllReviewsByProfessional/{id}` | — | SAFE_READ | reviews (replaces `ProductRating` demo + `SpecialistReview` mock) |
| POST `{v}/createReview` | `{ rate, comment, professional:<id> }` | WRITE_LOW_RISK (public content mutation, reversible) | write review |

### B.14 Patient profile / account (doc §6.13)

| Method+Path | Body | Class | Frontend target |
|---|---|---|---|
| GET `{v}/getCustomerInformations` | — | AUTH_READ | profile |
| PUT `{v}/updateCustomerInfo` | FormData | WRITE_PRODUCTION_SIDE_EFFECT (multipart) | update profile |
| PUT `{v}/updateCustomerAvatar` | `{ image:<base64> }` | WRITE_PRODUCTION_SIDE_EFFECT | avatar |
| PUT `{v}/updateCustomerEmail` | `{ email, password }` (call `csrf()` first) | WRITE_PRODUCTION_SIDE_EFFECT | change email |
| PUT `{v}/updateCustomerPassword` | `{ current_password, new_password, new_password_confirmation }` | WRITE_PRODUCTION_SIDE_EFFECT | change password |
| PUT `{v}/updateCustomerPhone` | FormData | WRITE_PRODUCTION_SIDE_EFFECT | change phone |
| POST `{v}/createCustomerAddress` / DELETE `{v}/deleteCustomerAddress/{id}` | FormData / — | WRITE_PRODUCTION_SIDE_EFFECT | addresses |
| POST `{v}/createCustomerDestination` / DELETE `{v}/deleteCustomerDestinationById/{id}` | FormData / — | WRITE_PRODUCTION_SIDE_EFFECT | home-visit destinations |
| POST `{v}/addParentInfo` / PUT `{v}/updateParentInfo` | FormData | WRITE_PRODUCTION_SIDE_EFFECT | child records |
| POST `{v}/createProfile` / GET+PUT `{v}/getProfile/{id}` · `updateProfile/{id}` | FormData | WRITE_PRODUCTION_SIDE_EFFECT (profile is formdata; GET is AUTH_READ) | medical profiles |
| **POST `{v}/deleteUserAccount`** | `{ reason, message, email, password }` | **AUTH_SENSITIVE + WRITE_PRODUCTION_SIDE_EFFECT (irreversible account deletion)** | account deletion — requires explicit destructive-confirmation UX |

### B.15 Location (doc §6.14)

| Method+Path | Class | Frontend target |
|---|---|---|
| GET `{v}/getAllCountries` | SAFE_READ | country picker (register/address forms) |
| GET `{v}/getAllCitiesByCountry/{id}` | SAFE_READ | city picker |

### B.16 Contact / marketing (doc §6.15)

| Method+Path | Body | Class | Frontend target |
|---|---|---|---|
| POST `{v}/contact-us` | contact form | WRITE_LOW_RISK (message only) | `/contact-us` forms → currently hit local `/api/contact`; replace/wrap with this |
| POST `{v}/new-feedback` | `{ description2?, rate, … }` | WRITE_LOW_RISK | feedback widget |
| POST `{v}/sendProEmail` | join form | WRITE_PRODUCTION_SIDE_EFFECT (outbound email, staff time) | "Join the team" (Recruitment modal) |
| POST `{v}/sendBusinessEmail` | business form | WRITE_PRODUCTION_SIDE_EFFECT | corporate quote form |
| GET `api/v1/getSourceParrainage` | — | SAFE_READ (shape undocumented) | sign-up attribution dropdown |

### B.17 Intake forms & invitations (doc §6.16)

| Method+Path | Body | Class | Frontend target |
|---|---|---|---|
| GET `/forms/{id}` (no /api prefix) | — | SAFE_READ | intake form definition |
| POST `/forms/{id}/submit` | `{ answers, customer_id }` | WRITE_LOW_RISK | submit answers |
| GET `api/v1/invitation/check/{token}` · `…/invitation/accept/{token}` | — | AUTH_READ (token-gated) | invitation flow |

### B.18 NAPS payment gateway (doc §7) — direct `fetch`, NOT axios

| Method+Path | Class | Frontend target |
|---|---|---|
| POST `{GATE}/napspayment/createtocken24` | `{ institution_id, cx_user, cx_password, cx_reason:"00", mac_value }` → `{ securtoken_24 }` (valid 24h) | **PAYMENT_SENSITIVE** (gateway credentials in body) | server-side token keeper |
| POST `{GATE}/napspayment/linkpayment` | `{ capture:"Y", Transactiontype:"0", currency:"504", orderid:"<prefix><id>", recurring:"N", amount:int, promocode:"", transactionid:<uuid>, securtoken24, mac_value:"<orderid><amount>", merchantid, merchantname:"Wenaya", websitename:"Wenaya", websiteid, callbackurl:"<FRONTEND>/naps/callback", successURL:"<FRONTEND>/payment/success", failURL:"<FRONTEND>/payment/Failed", id_client, fname, lname, email, country:"504", phone, city, state, zipcode, address }` → `statuscode=="00"` → redirect `data.url` | **PAYMENT_SENSITIVE** | **server-side only** — build link in a BFF route, never in the browser |

Order-id prefixes: `rdv<appointmentId>` (appointments), `wlt<userId>` (wallet top-up).

### B.19 Endpoint totals

- **Documented Laravel endpoints:** ~110 (auth 11 + search 4 + catalog 10 + practices 13 +
  professionals 8 + availability 3 + pricing 4 + appointments 8 + groups 9 + events 4 + packs 8 +
  wallet 1 + favorites/reviews 9 + profile 16 + location 2 + contact 5 + intake 4).
- **NAPS direct-gateway endpoints:** 2.
- **Legacy — do not copy:** `AuthenticateOrRegisterUserAndCreateAppointment`, `purchasePack`,
  `getServerSideUser`, `src/helpers/socket.js`, `src/helpers/Cookies.js`, hooks `/forgot-password` +
  `/reset-password` variants, Next-internal `/api/set-session`, `/api/logout`, `/api/check-auth`.

---

## C. Risk classification

| Classification | Definition | Endpoints in category (count) |
|---|---|---|
| **SAFE_READ** | Public GET, no side effects; safe to use in SSR/SSG from Vercel; may be demo'd in booking flows | search(4), public-catalog GETs(9), practices GETs(13), professionals GETs(8), availability(3), pricing(4), groups GETs(5), events(4), packs GETs(4), reviews GETs(4), location(2), `getSourceParrainage`(1), `forms/{id}`(1). ≈ 62 |
| **AUTH_READ** | Requires a patient session cookie; read-only | appointments list/detail(3), group-by-customer(3), `checkIfUserHasValidPack`(1), packs-by-customer(1), wallet history(1), favorites GET(2), profile GET(2 incl. `getProfile`), invitation check/accept(2). ≈ 15 |
| **WRITE_LOW_RISK** | Reversible / message-only mutations; no money, no staff scheduling, no account destruction | `waiting-lists` POST(1), `getShowPhoneNumber`(1), `checkFirstUse`(1), favorites POST already-2 counted above, `createReview`(1), `contact-us`(1), `new-feedback`(1), `forms/{id}/submit`(1). ≈ 8 |
| **WRITE_PRODUCTION_SIDE_EFFECT** | Creates/cancels real appointments, classes, orders, outbound mail, or edits profile data | `createPendingAppointment`(1), `cancelCustomerAppointmentById`(1), `payCustomerAppointmentByWallet`(1), `joinPatientToGroupAppointment`(1), `createOrGetCustomerPackOrder`(1), `createOrGetCustomerGroupOrder`(1), profile mutations(14), `sendProEmail`(1), `sendBusinessEmail`(1). ≈ 22 |
| **AUTH_SENSITIVE** | Credentials / session lifecycle / account destruction | auth lifecycle(11) + `deleteUserAccount`(1). ≈ 12 |
| **PAYMENT_SENSITIVE** | Gateway credentials or money flow; must be server-side | NAPS(2). |
| **NEEDS_BACKEND_CONFIRMATION** | Doc is silent on response shape / filter semantics | `homePageSearch`, `getAllPublicCares`, `getCareBySlug`, `getAllPublicTroubles`, `getTroubleBySlug`, `getAllPublicMedia`, `public/articles/{slug}` locale shape, all professionals GETs, group GETs listing shape, `getSourceParrainage`, `EventFilter` verb. (flagged individually in §B) |

**Working rule: never call a `WRITE_*` / `AUTH_SENSITIVE` / `PAYMENT_SENSITIVE` endpoint from
this audit, and never from the browser directly in the target design.**

---

## D. Auth architecture analysis

### D.1 What the backend mandates (doc §3–4)

- Sanctum **SPA cookie** mode. No JWT/Bearer. `withCredentials: true`; `withXSRFToken: true`.
- **CSRF contract:** `GET /sanctum/csrf-cookie` before the first state-changing request of a
  session (login, register, ANY POST/PUT/DELETE). Interceptor rescues HTTP **419** by
  re-seeding then retrying once.
- Auth endpoints are **NOT under `{v}`**: `/customer/login`, `/customer/logout`,
  `/user/register`, `/customer/forgot-password`, `/customer/reset-password`, verification flows.
- **`company` header** `localStorage.selectedCompany || 1` on every request (multi-tenant selector;
  only meaningfully set on the AI-chat page in the old app — the rest send `1`).
- Backend CORS must allow the frontend origin **with credentials**.
- **No SSR data fetching in old app** (`withSessionSSR` only seeds `req.session.user`); every data
  request is client-side SWR+axios. **This repo is the opposite** (SSR/SSG-first), so a direct port
  is not possible — data fetches must move to server components/routes with a fetch layer.

### D.2 Legacy patterns to NOT copy

| Legacy artifact | Why it must not be copied |
|---|---|
| `NEXT_PUBLIC_SECRET_COOKIE_PASSWORD` (public env!) | The iron-session encryption key was exposed as a client env var in `wenaya-front`. Never replicate — server-only secret. |
| `iron-session` session mirror (`/api/set-session`, `/api/logout`, `/api/check-auth`) | Redundant double session (Laravel cookie + iron cookie). The new frontend should trust the Laravel session cookie only; a thin server "who-am-I" cache is optional. |
| `NEXT_PUBLIC_NAPS_*` + `NEXT_PUBLIC_MAPBOX_API` + `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` client-side (legacy doc) | NAPS is a **payment gateway** — its credentials MUST stay server-side (see §H). Mapbox/GMaps keys in a public client bundle are insecure (domain-lock them or proxy). None of these exist in this repo today (verified); the note is a do-not-repeat for integration. |
| `localStorage` `isAuth` cookie hack + client `isAuth` react-cookie | DRY / trust issue — a cheap client flag is acceptable as a hydration hint, but the source of truth must be the server (either the balanced SSG path or a `fetch /api/v1/customer`). |

### D.3 Recommended target architecture (BFF / server-side)

1. **Server fetch layer** (`src/lib/api/` — NEW, only if extracted shared client). Server
   components call it directly (SSR/ISR); browser-facing mutations go through small Next route
   handlers (`/api/<domain>/…`) that (a) forward cookies, (b) seed/refresh CSRF, (c) relay errors.
2. **Cookies pass-through:** Route handlers proxy the browser's cookie header to the backend, and
   copy `Set-Cookie` from Laravel responses back (with lane-safe attributes). This keeps the
   Sanctum session cookie in the same origin as the site.
3. **CSRF strategy** (two consistent options, confirm choice with Jamal — see §J):
   - **Option 1 (recommended): cookie-forwarding proxy.** The Next route handler reads the
     `XSRF-TOKEN` cookie the browser already holds and sets `X-XSRF-TOKEN` on each mutation; only
     needs `GET /sanctum/csrf-cookie` on session start or a 419.
   - **Option 2: server-side CSRF keeper.** The user's `XSRF-TOKEN` is read server-side on every
     proxied mutation (browser never touches it). Slightly simpler client, slightly higher
     implementation cost.
4. **Session UX:** `/login` (patient space) remains presentation-only until a real patient-auth
   backend signalling decision; its submit is intentionally disabled. When enabled, it will call
   the proxied `/customer/login` flow. Register, forgot/reset, verification OTP — new routes,
   OTP only for verification (never login).
5. **Multi-tenant `company` header:** send `company: 1` on all initial integrations (matches old
   default). Only surface a company selector later if the backend supports it beyond the AI chat.

### D.4 What this repo already has

- `src/lib/api-http.ts` — admin-only Bearer fetch. **Keep isolated.** It is unrelated to the
  public Sanctum path and must NOT be reused as the public client.
- `src/lib/admin-auth.ts` — `ADMIN_SECRET`-guarded token helpers, server-only.
- `src/app/api/*` Next route handlers pattern (`/api/pratiques` proxy) — reuse this shape for the
  public BFF proxies.

---

## E. Per-domain adapter plan

Guiding rule: **reuse the `src/lib/{domain}.ts` convention already established.** Create a
`src/lib/api/` shared client only for the HTTP/cookie/CSRF plumbing (§D.3). Each adapter keeps a
local fallback so the site stays up when the backend is unreachable (the practices pattern).

### E.1 Proposed new area map

```
src/lib/api/
  client.ts        server fetch client → NEXT_PUBLIC_BACKEND_URL/PRACTICES_API_URL family env
  csrf.ts          /sanctum/csrf-cookie + 419 retry + cookie pass-through
  session.ts       login/logout/register/OTP orchestration (server routes)
  types.ts         shared Laravel envelopes: { error, message, data }
src/lib/adapters/   (OPTIONAL — only if a domain needs >1 file; practices does not)
src/app/api/<domain>/…    BFF route handlers for mutations that the browser must call
```

### E.2 Practices / specialities (**DONE — the template**)

- Status: `practices-api.ts` + `practice-adapter.ts` + `/api/pratiques` + `next.config.ts` image
  allow-listing + ISR revalidate 3600 + `local-fallback`. Verified live (19 records, 2 pages).
- Remaining (informational, from practices-contract): adopt the recommended rails — `is_visible`
  hard gate, id→slug map remains sole canonical slug source, never render unsanitized `details`.
- Lift to api/ when the shared client lands (SSR `fetchSpecialitiesPage` today works standalone).

### E.3 Professionals (`/professional/*`) — priority #2 adapter

- Source: mock `specialistes.ts` + Redis admin CRUD today.
- Candidates: `getAllSpecialities…` (no listing bootstrap endpoint is documented — the old listing
  page 404s on live!); per-pro `getProfessionalDetailsBySlug` + services/prices + availability +
  `getAvailableTimeByProfessionalId` + reviews + practice professionals.
- **Design decision (needs Jamal):** there is NO documented "list all professionals" GET. Live
  resolve: `/professional` listing is net-new already. For live data, decide the listing source —
  either (a) all practices × practice professionals union, or (b) new backend list endpoint to add.
  Until then the mock+Redis listing stays and is the correct behavior.
- Map availability: replace synthesized `availability.ts` slots with
  `getUnavailableDatesForProfessional` + `getAvailableTimeByProfessionalId` day reads.
  Keep the local `buildMonthAvailability` for un-dated display only.

### E.4 Group sessions (`/seance-de-groupe/*`)

- Source: i18n `coursAteliers` bundle (6 sessions). Booking = `/contact-us?service=&type=group-session`.
- Candidates: `getAllAppointmentsGroup` / `WithPagination` (listing), `getAppointmentsGroupBySlug`
  (detail), `getAppointmentGroupFilterAttributes` (filters), `getAppointmentGroupByPracticeSlug`/
  `ByProfessionalSlug?date=` (day schedule), `joinPatientToGroupAppointment` +
  `checkIfUserHasValidPack` (booking, auth+write).
- **Response shape undocumented** → confirm before coding. Prices for sessions likely come from
  `getPricesByPractices…` — do not invent a price field.

### E.5 Cares / troubles / pathologies / journeys

- Today: `care-journeys.ts` (live-verbatim, 7 journeys), `pathologies.ts` (7 topics), local indexes.
- Candidates: `getAllPublicCares`/`getCareBySlug`, `getAllPublicTroubles`/`getTroubleBySlug`.
- **Semantic mapping must be confirmed:** the live site's `/parcours-de-soins` journeys and the
  clinic "Maux & Troubles" pathologies are different families; map only after Jamal confirms which
  backend resources back which (cares ≠ troubles ≠ parccours-de-soins). Do NOT assume.

### E.6 Blog (articles)

- Today: MDX files + `gray-matter` + `/api/blog/posts` (3 posts), SSR listing/detail.
- Candidates: `GET {v}/public/articles?page=` / `GET {v}/public/articles/{slug}`.
- The earlier missing-pages audit found **18 orphaned articles** in the live `/api/v1/public/articles`
  with zero public URLs — these become live immediately on integration. **Locale confirmation
  required** (public/articles field set — FR/EN/AR?). Until Jamal confirms, EN articles stay local
  mirror; match one existing article family so the handoff keeps SSR.

### E.7 Products / shop

- There is **NO DOCUMENTED PRODUCT/CATALOG API** in the doc. `/produits` + `/produits/[slug]` +
  cart/checkout/panier are demo data (`produits.ts`, `product-adapter.ts`, local `CartContext`).
- **Verdict: keep the local demo shop untouched by the API integration.** Do not infer products
  from packages/cares/media. (State clearly — a product API would be a NEW backend contract.)
- `checkFirstUse`, `createOrGetCustomer*Order` are health-service packs, not this shop.

### E.8 Booking state machine (§G covers detail)

- Replace the message-only `/contact-us?type=booking` path with the real pending-appointment
  flow once auth + NAPS BFF exist. **Keep the contact-form booking as a grace fallback** for
  guests who haven't registered.

### E.9 Contact / corporate / recruitment

- Today: local `/api/contact` (identity validated, no forwarding) + corporate quote form +
  Recruitment modal.
- Candidates: `POST {v}/contact-us`, `POST {v}/sendBusinessEmail` (corporate quote),
  `POST {v}/sendProEmail` (recruitment). **These are the four live-ish replacements**, each
  WRITE_* — wire through a BFF route with server-side validation; never direct from browser.
- Keep `first,last,email` validation identical to today's contract so both the backend-forwarding
  and the fallback stay compatible.

### E.10 Homecare / faq / legal / sitemap — NO API involvement

- All static by design; do not add API calls.

---

## F. Demo environment design

### F.1 Option A — read-only PRODUCTION API (recommended baseline; what practices already does)

- `https://api.wenaya.com` — same host the site already talks to for `/pratiques`. Zero writes.
- **SAFE_READ endpoints only.** No auth; no cookies; no CSRF; no NAPS. Vercel Preview works today
  (practices prove it).
- Cloudflare budget: 1000 req/hr client-routed in old app; our SSR ISR revalidation (1h) uses
  negligible share. Mind the page-walk guard `MAX_FETCH_PAGES=50`.

### F.2 Option B — DEV API (`https://dev-api.wenaya.com/`)

- The doc's `NEXT_PUBLIC_BACKEND_URL` example. Needed for: WRITE and AUTH flows (real users,
  pending appointments, group join, profile, pack orders, NAPS sandbox callback).
- **Requires Jamal:** is `dev-api.wenaya.com` currently running, is it a full mirror of prod tables,
  are its writes isolated/restorable, does it accept Vercel Preview origins in CORS
  (`ALLOWED_ORIGIN`…), are test patient/practitioner/practice/date fixtures available, and is the
  NAPS gateway on `gwapi.naps.ma:8085` sandbox-ready with test creds?
- Recommend: **dev-api only after Option A is fully validated** (i.e. all read adapters green on
  prod-read) — this matches the 5-phase order (§I).

### F.3 CORS/CSRF for new frontend

- New frontend runs on Vercel Preview + Production domains. The old app's middleware injected
  `ALLOWED_ORIGIN`/`ALLOWED_METHODS`/`ALLOWED_HEADERS`/`EXPOSED_HEADERS`/`MAX_AGE`/`CREDENTIALS`
  from env at the Next layer — we must confirm whether the **backend** CORS config already allows
  the new origins (likely only localhost:3004/3005 today). → **Jamal gate.** For cookie
  flows (`withCredentials`), CORS-with-credentials must explicitly include the new origin.

---

## G. Booking state machine

Target flow (patient, authenticated) — derived from endpoints + NAPS doc, states NOT invented.

```
[free state]
   │ user picks professional/practice + service + slot
   ▼
SELECTED  (UI state: pro, practice?, service, price, final_price, duration,
           booking_date, booking_time, specialty, at: home|practice, destination?)
   │ POST {v}/createPendingAppointment  (patient=<userId>)
   ▼
PENDING (backend appointment status)
   │ response data.data.{id, orderId}
   │   → orderid = "rdv<appointmentId>"
   │   → NAPS linkpayment (BFF, server-side creds) → redirect data.url
   ├── successURL → /payment/success      → [PAID/CONFIRMED]
   ├── failURL    → /payment/Failed       → [PENDING <error>] (retry or wallet)
   └── callbackURL → /naps/callback        (server-side verify)
   │
   └── alternative: PUT {v}/payCustomerAppointmentByWallet { appointment:<id> }
        → [PAID]           (errors: balance_not_available, this_appointment_already_paid)
   │
   ▼
   PUT {v}/cancelCustomerAppointmentById { id, reason: 2 }  ← [CANCELLED] (any pre-date time)
```

- **Waiting list (guest-compatible):** `POST api/v1/waiting-lists` — capture name/email/phone/
  user_id?, notes, date/time, status "pending". This is the only booking-adjacent mutation a guest
  may trigger; it stays behind the BFF and is labeled a *request*, not a reservation.
- **Group classes:** `checkIfUserHasValidPack` (cover check) → `joinPatientToGroupAppointment`
  (with pack `participants[]`, `type:"online"`, `from:"client"`) or
  `createOrGetCustomerGroupOrder` (order → NAPS) — both AUTH + WRITE; never guest.
- **Transition rules not in the doc** (confirm in §J): whether PENDING expires, what happens on
  pay-over-other-session, NAPS callback reconciling orderid→appointment, wallet fallback only for
  `payCustomerAppointmentByWallet`.

---

## H. Security findings

| Finding | Severity | Status in this repo | Action |
|---|---|---|---|
| **NAPS credentials were public** in old app (`NEXT_PUBLIC_NAPS_MERCHANT_ID/_WEBSTIE_ID/_USER_ID/_USER_PASS`) | **CRITICAL** | Zero references in this repo (verified) | Do NOT replicate. NAPS call + creds live behind a server BFF route; the browser only receives a redirect URL from `linkpayment`. |
| `NEXT_PUBLIC_SECRET_COOKIE_PASSWORD` (iron-session key exposed client-side) | CRITICAL | Zero references | Iron-session is not used here; if a local mirror is ever added, store the secret server-only. |
| `NEXT_PUBLIC_MAPBOX_API` + `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in public bundle (legacy doc) | HIGH (legacy only) | **Zero Mapbox/Google keys in this repo** (verified). The only map is `MapViewInner` → OpenStreetMap TileLayer via react-leaflet — keyless. Old `NEXT_PUBLIC_MAPBOX_API`/`GOOGLE_MAPS_API_KEY` are a documented past anti-pattern, not present here. | If a tokenized map provider is ever adopted, domain-restrict or proxy; never ship a public key. |
| `company` header defaulting to `1` silently | MEDIUM | n/a | Keep default `1` until multi-tenant UI exists; revisit when company selector appears. |
| `deleteUserAccount` (account destruction) | HIGH | Not implemented | Requires explicit destructive confirm (typed email+password) + irreversible-account banner; never behind a single click. |
| CSRF omission on mutations | HIGH | No mutations exist yet | Enforce seed `GET /sanctum/csrf-cookie` + `X-XSRF-TOKEN` before any write (doc §8.1). |
| CORS-with-credentials must list Vercel origins | HIGH | n/a yet | Jamal must whitelist new origins before cookie flows go live (Option F.3). |
| `getShowPhoneNumber` reveals practitioner phone | MEDIUM | Not used | Keep POST body minimal and require an auth session; log calls. |
| 419 auto-retry loop | LOW | n/a | Implement exactly the doc rule (re-seed CSRF + retry ONCE; bail on repeated 419). |
| Legacy `isAuth` client cookie | LOW | Not used | If re-introduced as a hydration hint, never use it for authorization decisions. |

---

## I. Migration order (5 phases)

Ordered so each phase yields a working, safer site and reads come before writes, prod-read comes
before dev-api, and everything is reversible.

- **Phase 1 — Shared read plumbing (prod-read, ZERO writes).** Extract `src/lib/api/client.ts` +
  `csrf.ts` (server). Port practices onto it (keep fallback). Validate on prod-read
  `https://api.wenaya.com` from a Vercel Preview + localhost.
- **Phase 2 — Public read adapters (SAFE_READ only).** In dependency order:
  1. Professionals (E.3) — listing decision first (needs Jamal §J), then detail/services/prices/
     availability/reviews.
  2. Group sessions (E.4) — listing/detail/filter/day-schedule reads.
  3. Articles (E.6) — after locale-field confirmation.
  4. Cares/troubles (E.5) — after semantic mapping confirmation.
  No auth, no writes, ISR-cacheable; every adapter keeps a local fallback.
- **Phase 3 — Auth + session.** Dev-api (Jamal gate §J). Proxied login/logout/register/
  forgot/reset; CSRF per write; cookie pass-through; `/login` becomes functional (replaces the
  disabled submit). Register/verify-phone flows reuse the OTP endpoints (verification only).
- **Phase 4 — Reversible writes (WRITE_LOW_RISK) + read-your-own (AUTH_READ).**
  Contact forward (`{v}/contact-us`), waiting lists, favorites toggles, `createReview`,
  appointments lists + detail, pack eligibility check, wallet history, profile reads.
- **Phase 5 — Production writes + payments.** Booking state machine (§G) with
  `createPendingAppointment` + NAPS BFF; wallet-pay; cancel; group join+orders; pack orders;
  profile mutations; `deleteUserAccount` with destructive UX. **Only after dev-api option E2 is
  signed off and CSRF/CORS validated end-to-end.**

Each phase ends with: `npx tsc --noEmit`, `npx eslint .`, `npm run build` (static-page count
checks), and a CDP smoke of the changed pages. Current baseline: build 270/278 pages, eslint 0E/12W.

---

## J. Jamal validation gate

These MUST be answered by the backend owner before the corresponding phase:

1. **prod-read as authoritative for practice listing is fine to keep** — practices already live.
2. **Professionals listing** (E.3): is there (or will there be) a backend list endpoint? Today the
   old app has none and `/professional` listing is net-new. If none: proceed with per-practice
   union or keep mock+Redis listing until a contract exists.
3. **Endpoints current/supported:** are §B endpoints (esp. `createPendingAppointment`,
   `joinPatientToGroupAppointment`, NAPS `linkpayment`, `getAvailableTimeByProfessionalId`,
   `waiting-lists`) still the live contract, or are there newer versions not in the doc?
4. **`public/articles` locale shape:** fields (FR/EN/AR? description/slug semantics)? The
   live-list has 18 orphaned articles — can they be published, and will detail pages render?
5. **Cares vs Troubles vs Parcours-de-soins semantics** (E.5): which backend resources back the
   `/parcours-de-soins` journeys and the "Maux & Troubles" pathologies? Do we map
   `getAllPublicCares`/`getTroubleBySlug` 1:1 to our local families or keep local content?
6. **Dev API** (F.2): `dev-api.wenaya.com` status, data mirror parity, write isolation/reset
   policy, test fixtures (patient account, practitioner account, practice, date, service/prices),
   CORS origins allow-listed (Vercel Preview + prod), `ADMIN_SECRET`-style backend tokens if any.
7. **NAPS sandbox:** `gwapi.naps.ma:8085` live for dev? test merchant/system/user creds and
   sandbox callback URLs; is currency `504` (MAD) the only supported one; wallet min-top-up 100 MAD.
8. **CSRF semantics on proxied writes:** confirm X-XSRF-TOKEN derived-from-cookie works behind our
   BFF (Option D.3-2) without forcing a backend change.
9. **`company` header behavior scale-up:** any plan to extend multi-tenancy beyond AI chat?
10. **Envelope + error conventions:** everywhere `{error, message, data}`? Pagination always
    Laravel-style? Any endpoints returning bare arrays (e.g. `getAllPublicMedia`,
    `getSourceParrainage`, location lists)? Field naming case conventions (`booking_date`,
    `pageType:"upcomming"` typo preserved).

---

## K. First step safe to begin WITHOUT Jamal

1. **Extract `src/lib/api/client.ts` (server fetch) and `csrf.ts`**, and fold the existing
   practices client into it with the local fallback intact. Purely internal refactor; zero
   behavior change; safe on prod-read.
2. **Professional read adapter** (E.3 read portion) built against documented endpoints with
   graceful fallback to `specialistes.ts` — nothing calls it in UI yet, so it is inert.
3. **Group-session + articles read adapters** — same inert pattern, ready for Phase 2.
4. **Security hardening inventory** (§H rows 1–4) — verify every NAPS/iron-session/Mapbox key is
   server-side/env-gated in this repo (grep-verified already clean for NAPS/iron-session).
5. **Unit "contract snapshot" tests** for the already-integrated practices endpoint (pinning the
   verified envelope/pagination/is_visible behavior) so later refactors can't silently regress it.

## L. First step REQUIRING Jamal

1. **Dev API access** (F.2 / J.6) — no auth flow, no writes, no NAPS sandbox, no cookie/CORS
   validation can move forward without it.
2. **Professionals listing decision** (J.2) — gates the biggest read-adapter surface.
3. **Cares/Troubles/Parccours mapping** (J.5) — gates E.5.
4. **Articles locale contract** (J.4) — gates E.6.
5. **NAPS sandbox + creds** (J.7) — gates Phase 5 payments entirely.

---

## M. Final report (A–M) — one-line verdicts

- **A. Frontend sources:** 18 route families mapped; practices is the only live-integrated domain;
  everything else is local content / demo / mock / message-only. No `src/lib/api/` exists yet.
- **B. Backend catalog:** ~110 documented endpoints captured verbatim + 2 NAPS gateway endpoints;
  4 legacy/dead entries flagged "do not copy"; 16 endpoints awaiting response-shape confirmation.
- **C. Risk:** ~62 SAFE_READ / 15 AUTH_READ / 8 WRITE_LOW_RISK / 22 WRITE_PRODUCTION_SIDE_EFFECT
  / 12 AUTH_SENSITIVE / 2 PAYMENT_SENSITIVE / subset NEEDS_BACKEND_CONFIRMATION.
- **D. Auth:** Sanctum SPA cookie, CSRF-first, no JWT, no OTP-at-login; iron-session & all
  `NEXT_PUBLIC_*` secrets are legacy anti-patterns; new design = server BFF with cookie
  pass-through + server-side NAPS.
- **E. Adapters:** one-per-domain `src/lib/{domain}.ts`, fallback-always; practices is the template.
- **F. Demo env:** Option A (read-only prod `api.wenaya.com`) is live and safe NOW; Option B
  (dev-api `dev-api.wenaya.com`) is the required write/auth sandbox but needs Jamal sign-off.
- **G. Booking machine:** single state machine defined end-to-end (select → pending → paid/cancelled),
  with the guest waiting-list as the only unauthenticated write.
- **H. Security:** 1 CRITICAL (old public NAPS creds — zero occurrences here), 2 HIGH
  (iron-session key, destructive delete), CORS/CSRF gated on Jamal.
- **I. Migration order:** 5 phases — plumbing → public reads → auth/session → reversible writes →
  payments; each phase is build-green + smoke-tested.
- **J. Jamal gate:** 10 questions; Phases 3–5 are blocked on it; Phases 1–2 are not.
- **K. Safe-first step:** server fetch/csrf extraction + inert read adapters + security inventory
  + practices contract snapshot tests (zero backend dependency).
- **L. Jamal-first step:** dev-api access, professionals-listing decision, cares/troubles mapping,
  articles locale, NAPS sandbox.
- **M. Overall:** the repository is far closer than the doc implied (one domain already live on
  the real API); the entire write/payment/auth surface is greenfield by design and must land only
  behind the BFF + CSRF + dev-api rails above. **No code changed by this audit; nothing committed.**
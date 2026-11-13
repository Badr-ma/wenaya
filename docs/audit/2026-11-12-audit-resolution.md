# Wenaya launch audit: implementation and remaining approvals

Source: the November 12, 2026 management audit supplied in this chat. This is a local implementation report, not launch approval. No production deployment or backend data mutation was performed. The shop remains outside scope.

## November 13 — owner decision on API content

The owner explicitly confirmed that API-provided content has been reviewed and is approved as authoritative. This supersedes the earlier requests to validate or correct API prices, practitioner names, specialties, ratings, addresses and content. No backend data is changed. The frontend price-based exclusion has been removed, so the 1 MAD service is displayed like other API services. Historical observations remain evidence, not current content blockers. API transport errors, rendering issues and booking delivery tests remain technical issues. Static copy and CNDP notices are outside this approval.

## November 13 — corrected clinic hours

The owner corrected the clinic schedule to Monday–Saturday, 9:00–19:00, superseding the earlier 8:00–20:00 instruction. `CLINIC_OPENING_HOURS` is now the shared source for static localized hours, contact/FAQ copy and clinic structured data in FR/EN. API practitioner schedules are unchanged. This supersedes the earlier opening-hours hold; separate address/phone/GBP checks are not implied by the schedule approval.

## November 13 — G-05 appointment-request clarity

Static FR/EN assessment CTAs now say “Demander un bilan Wenaya” / “Request a Wenaya assessment”. The existing request-form URL preserves assessment intent: its category is preselected and its message is prefilled, without modifying backend records or endpoints. Generic request pages say “Demander un rendez-vous” / “Request an appointment” and explain the confirmation step. Navigation retains its compact visible labels and existing styles, with explicit accessible request labels. Six local page checks passed (including SSR category/message prefill); TypeScript and scoped ESLint passed. No request was submitted. Live GA delivery and controlled downstream acknowledgments remain separate technical acceptance tasks.

## November 13 — CO-04 Corporate CTA consistency

The hero’s resources anchor is now labeled “Voir nos ressources” / “Browse our resources”, matching its actual destination rather than promising an immediate catalogue download. Stale free-consultation widget translations now use the same 30-minute conversation terminology as the active Corporate CTAs; no consultation widget is currently mounted. The mobile sticky-button comment now describes its existing behavior accurately. Styles, layout, links and API data are unchanged.

## November 13 — final frontend verification

Remaining reproducible website defects were corrected while preserving layouts and approved API content:

- Reviews now request the canonical public profile slug. Live comparison: `amine-bennani` returns HTTP 200; the previously used raw username returns HTTP 400. Availability still uses its required raw username. Prices and aggregate ratings are unchanged.
- Closed booking panels and mobile menus are inert and hidden from accessibility APIs. Open dialogs provide names, initial focus, Tab/Shift+Tab wrapping, Escape handling and focus restoration. Corporate FAQ regions are labeled and hidden while collapsed.
- English calendar month names are localized; duplicate punctuation in compact dates is removed.
- Remaining static contact references use the shared business record. Values are retained; approved hours remain Monday–Saturday, 09:00–19:00.
- Clinic breadcrumbs no longer link to nonexistent grouping pages. Specialist breadcrumbs link directly to the real directory.
- Consent tests cover rejected tracking, omission of profile/query/form data and harmless analytics-client failure.
- Mocked booking tests cover invalid input, explicit backend failure, accepted pending requests and network failure without contacting an upstream service.

Final gates: **166 tests passed**, scoped ESLint passed, production TypeScript/build passed using Webpack. The final production crawl checked **239 non-shop sitemap pages**, **117 internal destinations**, **20 historical URLs** and **19 discoverable practices**, with **zero issues**. Evidence: `2026-11-13-final-verification.json`. Rerun with `node scripts/verify-launch-audit.mjs` while localhost is running.

Browser checks: booking focuses Close; Shift+Tab wraps to Terms, Tab wraps back to Close, Escape closes and returns focus to Book. The hidden panel is inert. The mobile menu focuses Home, wraps backwards to the account link, closes with Escape and returns focus to Menu. Homepage mobile overflow check passed at 390 × 844. No real booking was submitted.

### External release requirements

- **G-02:** CNDP references remain unpublished as previously deferred. Approved notice/decision scope is required before populating the shared notice.
- **GA4:** no local measurement ID is configured. Event code is tested; real-property receipt needs configuration and DebugView verification.
- **Delivery:** a designated test tenant and notification sinks are required for actual email/SMS, practitioner confirmation and cancellation tests.
- **Historical completeness:** all 20 publicly exposed old paths pass; GSC/full historical exports are needed for broader coverage.
- **Source-owner review:** static clinical/legal drafts and reinstated testimonials/logos need the relevant owners’ approval. API facts are owner-approved and are not reopened for review.
- **Performance:** responsive checks are recorded; a new Lighthouse/field-performance score is not claimed. Timing APIs were unavailable through browser inspection; run the full mobile performance gate in staging.

No external deployment, backend data mutation, real appointment or recurring automation was performed.

## Working constraints

- Preserve the visual system, existing section layouts, imagery, spacing classes, animation behavior and public canonical slugs. Content corrections can change text wrapping. Unapproved client marks are withheld until permission is recorded.
- Keep API records authoritative. Do not invent practitioner identities, qualifications, service inclusions, prices, reviews, opening hours or availability.
- Do not create patient appointments or send notifications to real people for testing.
- Editorial changes need medical/marketing review; privacy wording needs legal review. Frontend implementation does not establish clinical or legal approval.

## Resolution by original audit ID

| ID | Local implementation / disposition | Remaining acceptance work |
| --- | --- | --- |
| G-01 | Existing migration mappings retained; permanent configured redirects now explicitly return 301. Canonical slugs unchanged. | Obtain complete production crawl + GSC URL export; verify every useful old URL, equivalence and single-hop destinations. The public production sitemap index and six children were retrieved: 20 unique historical URLs were checked. Five children exposed no entries, so GSC/crawl exports are still required for completeness. |
| G-02 | Shared `DataProtectionNotice` used by both footer variants, profile pages, professional/group booking and contact forms. Shared approved-notice configuration is empty by default. | Review original decisions D 342/2020 and D 343/2020, entity and processing purposes. Populate `APPROVED_CNDP_NOTICE` only with approved wording. References are deliberately not presented as a certification. Footer variants retain their existing designs. |
| G-03 | `business-info.ts` centralizes the shared identity, phone, existing address, social destinations and the opening-hours response. Static opening hours and schema now share the owner-approved Monday–Saturday, 09:00–19:00 schedule. Practitioner addresses remain API-owned. | API practitioner records are owner-approved. Hours are owner-approved. Confirm only the separately maintained static business address/phone and GBP identity; existing shared postcode 20930 is retained. |
| G-04 | Unsupported static totals, recommendation/satisfaction percentages and absenteeism claims replaced with factual process descriptions. Fabricated root aggregate-rating schema removed. Unverified static testimonials replaced with editorial process content using the existing layouts. Corporate client marks withheld. | Marketing must archive evidence/consents and approve any future reintroduction. API-provided claims and profile ratings are owner-approved; no frontend content blocker. |
| G-05 | Assessment CTA leads to the completed contact request flow; needs card leads to the existing needs directory instead of the configurator placeholder. Clinic selection CTAs describe choosing a specialist. Consent-gated contact, calendar, download, booking-open and successful-request events added without form contents or health slugs. | Verify event receipt in the actual GA property, external calendar, PDFs, email delivery and mobile journeys. |
| H-01 | Unsupported homepage totals removed; static opening hours now use the owner-approved Monday–Saturday, 09:00–19:00 schedule. | Confirm any future displayed figures against a dated source. |
| H-02 | “Comprendre · Agir · Progresser” preserved. Existing completed request/directory flows connected; no new assessment product invented. | End-to-end acknowledgment/delivery tests in a controlled environment. |
| H-03 | Unverified named static testimonials and stars removed from publication; card geometry retained with process information. | Authenticity, consent and publication rights needed before restoring testimonials. |
| CL-01 | Hero supporting copy explicitly explains assessments, professionals, pathways and follow-up; “Vivez votre santé !” retained in the message. | Clinical/editorial sign-off. |
| CL-02 | “En 2 clics” removed; CTA now describes specialist selection. | Confirm the desired operational booking journey. |
| CL-03 | “Symptômes & besoins” typo corrected; session text clamp removed. API condition/practice associations preserved. | Backend associations are owner-approved; visual rendering of variable API copy remains a frontend check. |
| PR-01 | Display taxonomy uses the proposed six families; coaching moved out of Nutrition; speech therapy and psychomotor therapy grouped under Child development. Backend IDs and public slugs unchanged. | Approve final taxonomy; new API-only categories remain backend-owned. |
| PR-02 | Adapter decodes nested HTML entities without substituting backend content; invalid numeric entities cannot crash rendering. Local cupping article is neutral and avoids guaranteed benefits. Unsupported broad cancer contraindication removed from local physiotherapy copy. | Backend descriptions are owner-approved. Remaining local editorial articles still need their own review; the frontend does not replace API text. |
| PR-03 | “Show more” is now a real next-page anchor with progressive enhancement; `?page=2` server-renders the remaining API practices. Pagination has self-referencing metadata. Existing live-data sitemap retained. | Verify all current visible records through pagination + sitemap; catalogue count is dynamic, not hardcoded to 19. |
| NP-01 | Specific Casablanca assessment metadata; local FR/EN article reorganized around audience, consultation, process, professionals and preparation. API title/summary retained. | Medical sign-off; approve any change to the API introduction/title on the backend. |
| NP-02 | Explicit relevant recommendations use only available live speech therapy, psychomotor therapy, psychology and psychotherapy records. Other practices recommend records in the same display category. | Confirm clinically preferred ordering and learning-pathway relationships. |
| AN-01 | Existing adapters already use all backend specialties for filtering and profile links. Directory cards no longer cut specialty tags to two entries. | API specialties and qualifications are owner-approved. Retain multi-specialty display/filtering without inventing assignments. |
| AN-02 | No historical profile slug or public name silently changed. Static therapist total removed. | API profiles and public names are owner-approved. Preserve published slugs; any future rename requires an explicit redirect inventory. |
| AN-03 | Existing profile-card journey retained with an explicit accessible profile label. Booking-open event added at the actual profile action. | Practitioner-specific direct booking from cards is optional; no misleading secondary action introduced. |
| AM-01 | Owner-approved API content: retain profile appointment text and structured service prices unchanged. | Closed as a frontend content blocker under the November 13 owner decision. Do not infer or invent package inclusions. |
| AM-02 | Owner-approved API services: removed the frontend 1 MAD price exclusion. Names, amounts and durations come from the API. | Closed as a frontend content blocker under the November 13 owner decision. |
| AM-03 | Booking cannot display a success state when no backend configuration exists. Request tracking occurs only after a successful response. Live availability loads. | BLOCKER: controlled dummy-account request, therapist confirmation, email/SMS and cancellation test. The frontend reviews-slug error is resolved; API aggregate 5/100 and postcode 20250 are owner-approved. |
| HC-01 | Daily assistance separated from qualified nursing acts; technical care described according to qualifications/prescriptions. Unsupported blanket 24/7 wording removed; coordination explicitly distinguished from emergency care. | Operational/clinical approval of actual scope and availability. No emergency number guessed. |
| HC-02 | Outcome guarantees replaced with continuity-of-care and transition-home objectives. | Clinical/editorial approval. |
| HC-03 | Existing WhatsApp and telephone journeys retained; no unnecessary collection of health information added. Consent-gated click tracking added. | Operations must verify lead receipt, consent handling and follow-up. Optional assessment form not added. |
| CO-01 | Unsupported numerical proof and ROI citations removed from displayed static copy. Testimonials repurposed as process guidance; client marks withheld via an empty approval registry. | Written logo/testimonial permissions and documented sources before publication. |
| CO-02 | Security cards/FAQ now explain confidentiality rather than claiming end-to-end encryption, Moroccan hosting, independent audits or blanket certification. Privacy-policy destination corrected. | Legal/security owners must reconcile the actual privacy policy and processing documentation. CNDP wording remains gated. |
| CO-03 | Both offer summaries and package lists describe Discovery / Annual Program / Transformation consistently; annual support includes initial assessments, individual/group support and follow-up. Unapproved fixed frequencies removed. | Sales/operations must approve scope, annual duration, frequency and quotation terms. |
| CO-04 | “Free audit” CTA changed to a 30-minute conversation; quote form handles network failures and requires fields the backend actually requires. Existing page layout/order retained per explicit user instruction. | External calendar/PDF tests and delivery testing remain. The suggested five-section redesign was intentionally not performed. |
| CO-05 | Corporate/social URLs share global identity configuration; unverified X destination removed. Shared legal notice used with the existing Corporate footer styling. | Owner must verify the official social accounts and CNDP notice. |

## API technical follow-up (content decisions superseded November 13)

1. **Prices:** accepted as supplied by the API per the owner; no amount or service inclusion is rewritten.
2. **1 MAD Educational meeting:** accepted as an API-provided service per the owner; the frontend exclusion has been removed.
3. **Reviews — resolved:** the frontend now requests public slug `amine-bennani`, verified HTTP 200. Approved aggregate fields remain unchanged.
4. **Identity/contact:** API profile names, specialties and addresses are owner-approved. Preserve historical slugs; shared static business information remains a separate source.
5. **Specialties:** preserve the approved values from each API endpoint; the frontend already supports multiple specialties.
6. **Content:** accept API text as authoritative. Encoding/rendering fixes may improve readability without replacing facts or relationships.
7. **Booking:** provide a named staging/test tenant and test email/SMS sinks, a disposable practitioner slot and a supported cancellation path. A waiting-list request is not a confirmed appointment.

## Evidence and approval register

| Material | Current publication treatment | Required owner/evidence |
| --- | --- | --- |
| 35/35+ therapists, 2000 patients/employees, 99%, 96%, −40%, +25%, seven years | Static assertions removed/replaced | Marketing + operations: definition, population, period, source, owner |
| 4.7 / 148 / 200 review aggregates | Static assertions/schema removed | Dated source, review platform and permission; profile API aggregates are owner-approved |
| Static patient/HR testimonials | Withheld/replaced by process information | Original wording, authenticity and publication consent |
| Corporate client logos | Withheld | Named written permission; add approved names to `APPROVED_CORPORATE_PARTNERS` |
| CNDP D 342/2020 and D 343/2020 | Not published as verified approvals | Original decisions, entity, purposes and legally approved FR/EN notice; populate `APPROVED_CNDP_NOTICE` |
| Hours / postcode / GBP | Hours approved November 13: Monday–Saturday, 09:00–19:00; existing static address retained | Only separate static address/phone/GBP confirmation remains; API records are owner-approved |
| Clinical articles / associations / home-care scope | Safer draft copy; API associations preserved | Medical/operational sign-off |

## Release procedure

1. Staging: set `WENAYA_INDEXABLE=false`; use access control where required. Root metadata emits noindex and robots disallows crawling when disabled. Do not treat robots as access control. Use the correct production `NEXT_PUBLIC_SITE_URL` only on production.
2. Verify configured API environment and test data; never point controlled booking tests at real patient workflows.
3. Run TypeScript, changed-file ESLint, automated tests, production build, route checks and browser review. This workspace requires `npm run build -- --webpack`: the default Turbopack build fails on the existing external `node_modules` symlink.
4. Import the historical URL inventory, check every old URL and destination, then crawl all sitemap entries. Verify canonicals, FR/EN alternates, one H1, internal links and no soft 404s. Do not delete historical routes based on a partial list.
5. Use synthetic submissions against mocks for automated QA; use a designated test tenant for actual acknowledgments, SMS/email and cancellation acceptance. No real submission was sent during this work.
6. Configure GA4 enhanced measurement to avoid automatic collection of sensitive URLs/form fields. Code intentionally avoids sending health slugs, query strings or form contents. Confirm events in DebugView only after consent; rejection must load no analytics.
7. Before deploy, record the currently deployed artifact/commit and rollback procedure. Deploy only after P0 source-data and approval blockers are closed.
8. After launch: crawl, collect 404s, watch backend failures, and review GSC at weeks 2, 4 and 8. Assign an owner; no automatic recurring tasks were created.

## Validation evidence

Machine-readable route results are recorded alongside this report. Development cold-compilation timeouts are not evidence of production route failure. Final validation:

- Production build: passed with Webpack; Next TypeScript gate passed. Default Turbopack fails on the pre-existing external dependency symlink.
- Automated tests: 158 passed, 0 failed, including three new regression cases for backend entity decoding and relevant live recommendations.
- ESLint: changed files passed; diff whitespace check passed.
- Final sitemap crawl: 239 non-shop URLs, all HTTP 200, exactly one H1, canonical present, no noindex. The two missing article H1s found in the first crawl were fixed without changing their classes.
- Practice discovery: FR page 1 has 12 live links and a real page-2 anchor; page 2 has seven links, with its own canonical and no next-page link. Hydrated mobile page 2 retains the seven records. Sitemap exposes 38 practice detail URLs across FR/EN.
- Legacy inventory: all 20 unique published old paths finish with HTTP 200 in at most one redirect, with redirects returning 301. Equivalence of removed event content still needs editorial confirmation; unavailable historical sitemap entries and GSC history cannot be reconstructed from this inventory.
- Corporate calendar: public schedule responds HTTP 200. Both PDF URLs respond HTTP 200 with application/pdf after their existing host redirect. A reachable schedule is not proof of a completed calendar booking.
- Mobile browser: homepage, Corporate and practice page 2 show no horizontal overflow at 390 × 844. Corporate also passes the overflow/H1 checks at 1440 × 900. Corporate video contrast corrected with a navy scrim while retaining the same video, typography and layout. Cookie preferences reopen and rejection loads no analytics script.
- GA4 is not configured in the local environment; delivery to a real property remains unverified. Configure the approved measurement ID and check DebugView after consent.
- Contact and professional-booking endpoints reject empty payloads with HTTP 400 (no downstream submission). Mobile booking opens, loads live November 13 availability, enables Continue only after slot/service selection, reaches the information step, preserves selection on Back and closes without submission. No real contact request, appointment, payment, email/SMS notification or cancellation was submitted. Test-tenant end-to-end acceptance and clinical/legal sign-off remain release blockers.

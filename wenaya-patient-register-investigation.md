# Patient registration — flow investigation (FR + EN)

Date: 2026-10-13 · Branch: `main` · Status: **read-only investigation — no code changed, NOT committed/pushed**

## A. Objective

Map and verify what actually happens on the patient signup flow
(`/signup` + `/en/signup`) across six scenarios, distinguishing **verified**
backend behaviour from assumptions, and flagging any user-facing message that is
wrong for its scenario.

## B. Constraints (as directed)

- READ-ONLY: no files, translations, or API behaviour were modified.
- NO account-creating requests were issued (no registration test calls).
- No real user data, credentials, or sensitive response payloads are reproduced
  here.
- Verified backend behaviour is separated from assumptions throughout.

## C. Method & evidence

- Static read of the full client → BFF → transport → response path (files listed
  in §I).
- Evidence report (DEV probe, 2026-09-20):
  `C:\Users\hp\AppData\Local\Temp\opencode\pre-github-backup\wenaya-patient-auth-register-report.md`
  (not present in the repo; referenced by code comments).
- Raw DEV probe harness:
  `C:\Users\hp\AppData\Local\Temp\opencode\register-probe.mjs` /
  `raw-register-cookies.js` (BASE `https://dev-api.wenaya.com`).
- `.env.local`: `PATIENT_AUTH_ENABLED=true`, `PATIENT_REGISTER_ENABLED=true`,
  `WENAYA_API_URL=https://dev-api.wenaya.com` (value not otherwise read).
- No live requests were re-issued during this investigation.

## D. Request flow

```
SignupClient (form)
  └─ registerPatient()                       src/lib/patient-auth-client.ts:91
       └─ POST /api/auth/register            src/app/api/auth/register/route.ts:35
            ├─ PATIENT_REGISTER_ENABLED ?    (route.ts:36 → not-enabled 403)
            ├─ size / JSON / object guards   (route.ts:41-56 → invalid-payload)
            ├─ buildRegisterBody()           src/lib/patient-auth/register.ts
            │    (presence + length checks → validation-error 400)
            ├─ submitPatientRegister()       src/lib/patient-auth/transport.ts
            │    POST {WENAYA_API_URL}/user/register
            │    (bare POST → 419 → reseed /sanctum/csrf-cookie → retry once)
            └─ mapRegisterOutcome()          src/lib/patient-auth/response.ts
  on success → GET /api/auth/me (name) → success card
  on success + returnTo → router.replace(returnTo) (resume interrupted flow)
```

BFF always injects `role: "patient"`; applies probe-verified defaults
`countryCode="MA"`, `timezone="Africa/Casablanca"`, `currency="MAD"`
(`src/lib/patient-auth/register.ts`, `config.ts:75-77`).

## E. Verified backend contract (DEV)

| Fact | Value | Source |
|------|-------|--------|
| Success | `2xx { error:false }`, echoes payload, auto-authenticates | report + code |
| CSRF | bare POST → `419`; reseed `/sanctum/csrf-cookie` (204 + `we_session`) then retry → 200 | report |
| Duplicate email | **`200 error:false` — creates a SECOND account** (no uniqueness on DEV) | report §I.1 |
| Login failure | `HTTP 200 { error:true, message }` | report |
| Field errors | `400/422/409` → normalized `validation-error` with `errors` map | code |

## F. Scenario table

| # | Scenario | Effective client validation | Request sent | Result (verified ✓ / assumed ~) | User message | Verdict |
|---|----------|----------------------------|--------------|---------------------------------|--------------|---------|
| 1 | Valid unused email | **None** (`noValidate`, SignupClient.tsx:181; no JS checks) | full body | ✓ DEV: 200 `error:false` → BFF success → auto-login | success card (`signup.successHeading`/`successBody`) | ✅ Correct |
| 2 | Email already registered | None | full body | ✓ DEV: 200 `error:false`, **2nd account** → mapped success (response.ts:135-139) | success card | ❌ Wrong — silently accepts duplicate |
| 3 | Invalid email format | None (browser check disabled) | invalid email | ✓ BFF `EMAIL_RE` fails (register.ts:50,87-91) → 400 `validation-error` `fields.email` | localized `signup.errors.email` (inline, role=alert) | ✅ Correct |
| 4 | Missing required field(s) | None | `""` | ✓ `buildRegisterBody` → 400 `validation-error` per missing field | localized per-field copy (firstName/lastName/email/password/phone) | ✅ Correct |
| 5 | Weak / invalid password | `maxLength=1024` only | weak pw forwarded | ~ Laravel rule **unverified**; BFF has no rule (register.ts:93-95) | if rejected → `signup.errors.password` = "Un mot de passe est requis." | ⚠️ Wrong copy + no client rule |
| 6 | Network / unexpected error | None | full body | ✓ fetch throw → `backend-error`; 502/504/419-after-retry → generic | `signup.errors.generic` | ✅ Correct |

## G. Findings

1. **Duplicate email is silently accepted.** DEV `/user/register` has no
   uniqueness enforcement: a duplicate returns `200 error:false` and creates a
   second account; the BFF maps it to success (the 409 → "unauthenticated"
   branch at `response.ts:135-139` exists but never fires on DEV). If PROD *does*
   enforce uniqueness, the duplicate would surface as `validation-error` →
   `signup.errors.email` = *"A valid email address is required."* — **misleading
   copy** for "already registered". Backend issue + copy issue.

2. **Silent no-op on field-less `validation-error`.** When the backend sends a
   flat `message` with no `errors` map, `mapRegisterOutcome` returns
   `validation-error` with `fields: undefined`; `SignupClient` then sets no
   per-field error **and no general error** (SignupClient.tsx:115-118) → the form
   shows **nothing** on submit. User gets no feedback.

3. **Stale comment: "Client-side validation is native."** The form carries
   `noValidate` (SignupClient.tsx:181), so the `required` / `type="email"`
   attributes are inert and there is no JS validation. All validation is
   effectively server-side (BFF). The header comment is inaccurate.

4. **Weak-password copy is wrong.** `signup.errors.password` reads *"Un mot de
   passe est requis."* / *"A password is required."* — correct only for an empty
   field, wrong for a rejected-too-weak password. Also no client-side minimum
   length/strength rule exists.

5. **Dead code (harmless).** `transport.postWithCsrfRetry`'s final
   "both attempts were 419" third fetch is unreachable — attempt 1 returns inside
   the loop (`response.ts`/`transport.ts` path).

6. `PATIENT_REGISTER_ENABLED=true` and the DEV base URL are set in `.env.local`;
   the route guard is active off that flag (route.ts:36-39).

## H. Unknowns (need backend confirmation; not verifiable without account-creating calls)

1. PROD `/user/register` uniqueness enforcement + exact status/shape
   (409 vs 422 vs `200 error:true`). DEV proven NOT enforced.
2. Laravel password policy (min length / rules) and the exact status +
   `errors.password` message on rejection. (Report §D's "≥8" is **stale**: the
   code contains no such rule.)
3. Whether conflict / weak rejections arrive as an `errors{}` map (field-mappable)
   or a flat `message` (→ silent no-op, Finding 2).
4. Rate-limiting / throttling (429) behaviour.

## I. Files inspected

- `src/components/login/SignupClient.tsx` — form (`noValidate` @181), `FIELD_COPY`
  / `fieldError` (37-64), submit/error branches (66-127), success card.
- `src/app/api/auth/register/route.ts` — BFF POST, guards, envelope relay.
- `src/lib/patient-auth-client.ts` — `registerPatient` / `getCurrentPatient`;
  `patientFetch` (network → `backend-error`).
- `src/lib/patient-auth/register.ts` — `buildRegisterBody`, `EMAIL_RE`,
  presence/length checks, `role` + default injection.
- `src/lib/patient-auth/response.ts` — `buildResponse` / `mapRegisterOutcome`,
  `validationErrorResponse` / `notEnabledResponse` / `invalidPayloadResponse`.
- `src/lib/patient-auth/transport.ts` — Laravel forwarding, CSRF 419 self-heal,
  timeout.
- `src/lib/patient-auth/config.ts` — endpoint paths, defaults, flags,
  `PATIENT_BODY_MAX_CHARS = 8000`.
- `src/lib/patient-auth/csrf.ts`, `cookies.ts` — XSRF read, cookie passthrough.
- `src/i18n/fr.ts` (`signup` @1542) / `src/i18n/en.ts` (`signup` @1545) — copy +
  per-field / generic error keys.
- Evidence: `…\pre-github-backup\wenaya-patient-auth-register-report.md`,
  `%TEMP%\opencode\register-probe.mjs`, `raw-register-cookies.js`.

## J. Recommended follow-ups (not applied — require leaving read-only)

1. Fix Finding 2: render `signup.errors.generic` when a `validation-error`
   arrives with no resolvable field keys.
2. Fix Finding 4: add a client min-length/strength rule and distinct
   weak-password copy; do not reuse the "required" string.
3. Fix Finding 3 comment to reflect that validation is server-side (BFF).
4. Raise Findings 1 + H.1–H.3 with the backend (Jamal) before relying on
   duplicate/weak-password handling in production.

# Patient bookings in the account page

The FR and EN account pages now include a read-only bookings section after the
profile summary. It mounts only in the signed-in profile view.

## Backend contract

The contracts were checked against `API_DOCUMENTATION (1).md` and the public
legacy frontend's `/appointments` and `/appointments-group` bundles:

- `GET /api/v1/getAppointmentsByCustomer?page=&pageType=`: `pageType` uses
  `today`, `past`, or the backend spelling `upcomming`. The response contains
  paginators under `data.today`, `data.past`, and `data.upcoming`.
- `GET /api/v1/getAppointmentsGroupByCustomer?page=`: paginator under `data`.
  Group rows use `title`, `event_date`, `event_time`, `event_status`,
  `professional` and `company`. There is no verified upcoming/past group filter,
  so the BFF reads all pages (up to 100, failing rather than returning partial
  results), filters by Casablanca date/time, sorts upcoming sessions first and
  paginates the filtered list in groups of 10. Past dates and earlier start times
  today are excluded. Today's sessions without a supplied time remain visible;
  sessions without a valid date are excluded.

Individual rows display their professional, `booking_date`, `booking_time`,
`booking_status`, and practice business name when supplied. A treatment name is
not invented when the verified listing contract does not supply it. Group event
status is explicitly separate from the patient's booking/payment status.

Both dev endpoints responded 401 to unauthenticated probes. Their current
authenticated response bodies still need a signed-in staging acceptance test.

## Session and privacy

The browser calls only `GET /api/account/bookings?kind=appointments|groups&bucket=today|upcoming|past&page=1`.
The server verifies the current patient session, forwards its cookies to the
appropriate fixed backend path, and relays allowed session cookies. No patient
ID is accepted from the browser. Both upstream reads and BFF responses are
uncached (`private, no-store` response, `Vary: Cookie`). The response projects
only display fields, never raw patient objects, payments or clinical notes.

Unavailable endpoints and invalid response shapes display errors, not an empty
booking history. Filter changes cancel previous browser requests. An expired
session prompts sign-in. No cancellation, rescheduling, payment or booking writes
are introduced.

## Acceptance checks

Unit tests cover both response shapes, empty and malformed data, selected buckets,
privacy projection, session isolation, expired sessions, errors and query spelling.
Local visual QA uses synthetic records in a temporary API, never real bookings.
After deployment, sign in with a staging test patient and compare their individual
and group records with the backend, including today/past/upcoming, pagination,
status labels, logout, and session expiry. A contact/waiting-list submission will
not appear unless the backend creates a booking returned by these endpoints.

# Adding practices through the backend

New visible practices returned by the public specialties feed are accepted without
adding an entry to `practice-content.ts` or rebuilding the frontend.

- Existing backend IDs keep their established canonical practice URLs and local
  editorial articles/translations.
- New IDs use a readable, normalized backend slug/name followed by their numeric
  ID (for example `/pratiques/acupuncture-42`). The same route exists under `/en`.
  The ID prevents duplicate names from colliding. If no usable slug/name exists,
  the route is `/pratiques/practice-42`.
- New practices use API titles, description, details, category and image fields.
  Backend details render as escaped text paragraphs, never executable HTML.
  English uses `en_name` when available, otherwise the French name; the API's
  shared description/details are displayed as supplied, without invented translations.
- Listings, search, existing category filters, related practices, professional
  practice links and the sitemap use the live dataset. Unrecognized categories
  remain discoverable in All and search; this change does not create new filter tabs.
- A professional matches a new practice by its French specialty label, consistent
  with the existing professionals API (which supplies labels rather than IDs).
- `is_visible: false` records are excluded. Detail routes return 404 only after a
  successful feed lookup confirms absence. API failures propagate instead of
  being cached as missing records or empty heroes.

Backend additions appear after the existing one-hour data/page cache revalidation,
which is request-driven; there is no publication webhook in this repository.
Images must be reachable and hosted on a configured Next.js image host. Internal
`http://api:8000/...` references and missing storage files are not repaired here.

Validation: the regression suite tests previously unknown IDs, both locales,
existing URL/editorial preservation, duplicate names, later feed pages, search,
category filters, professional relationships and upstream failures. Production
runtime verification uses a temporary local API to serve a practice absent from
the build and confirms FR/EN pages plus an actual missing-slug 404.

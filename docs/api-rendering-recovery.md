# API content rendering and recovery

## Confirmed code defects

`getLivePratiques` and `getLivePracticeImageMap` previously converted production
runtime failures into successful empty arrays/maps. This allowed a transient
failure, including a failure on page two, to replace usable cached content.
Both now propagate production failures. Legitimate successful empty feeds remain
empty, and development/build callers retain their existing tolerance policy.

Homepage professionals and quick-access images previously could be rendered
during Docker builds, where runtime API configuration/connectivity might not
exist. Both homepages now call `connection()` before loading data. The clinic
practice component also waits for a real request. These routes render at runtime;
their explicitly cached API reads retain existing revalidation intervals.

Care-journey detail pages now use on-demand ISR, as practice detail pages already
do, avoiding build-time empty recommended-practice images. Runtime failures can
retain an existing successful ISR page. The first request during an outage may
fail; it is not silently published as an empty success. Request-rendered homepage
errors are private/no-store, and subsequent healthy requests can recover.

## Verification

- 138 unit/regression tests pass, including production outages, page-two failure,
  and successful empty responses.
- Targeted ESLint and production webpack build (including TypeScript) pass.
- Production runtime against a temporary local API: cold homepage API outage
  returns 500 with non-public caching; after restoring the API, the next request
  renders the professional and image content. Both locales render healthy data.

## Not established or changed

The original staging incident's trigger remains unconfirmed without build and
runtime logs. Internal `http://api:8000/storage/...` image references, missing
storage files, and backend records without pictures are separate issues and are
unchanged. No backend URL is hardcoded as a configuration fallback.

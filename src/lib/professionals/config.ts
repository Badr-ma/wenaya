/**
 * Single source of truth for the Professional API base URL. Server-only —
 * this module is consumed by the SSR/ISR data layer, never by the browser.
 *
 * Day-1 contract: the site keeps talking to the DEV/DEMO Professional API
 * (`dev-api.wenaya.com`) exactly as today. `PROFESSIONALS_API_URL` exists so
 * the future real Professional API (or any environment target) can be
 * selected by changing this ONE variable — the default below is intentionally
 * the dev base and must never silently point at a production host.
 *
 * Consumers (which used to hardcode the identical URL):
 *   - `../professionals-api.ts`        (listing)
 *   - `../professionals-detail-api.ts` (detail / cares + packs)
 */
const DEV_PROFESSIONALS_API_URL = "https://dev-api.wenaya.com";

/** Trailing-slash-stripped, environment-overridable Professional API base. */
export const PROFESSIONALS_API_BASE: string =
  process.env.PROFESSIONALS_API_URL?.replace(/\/+$/, "") || DEV_PROFESSIONALS_API_URL;
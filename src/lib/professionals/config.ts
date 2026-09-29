/**
 * Single source of truth for the Professional API base URL. Server-only —
 * this module is consumed by the SSR/ISR data layer, never by the browser.
 *
 * The base URL comes from the ONE shared environment variable
 * (`WENAYA_API_URL`, see `.env.example`) via `@/lib/api-base` — never
 * hardcoded. Consumers:
 *
 *   - `../professionals-api.ts`        (listing)
 *   - `../professionals-detail-api.ts` (detail / cares + packs)
 */
import { getApiBaseUrl } from "../api-base";

/** Professional API base — lazily resolved (safe for client-bundle imports). */
export function getProfessionalsApiBase(): string {
  return getApiBaseUrl();
}
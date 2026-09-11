/**
 * Generic shared response types for the Wenaya public API.
 *
 * Kept deliberately minimal — domain-specific payloads (practices, specialists,
 * etc.) stay in their own domain modules. See `client.ts` for the fetch layer.
 *
 * Laravel envelope: every public endpoint responds with
 * `{ error: boolean, message: string | null, data: T }`.
 * `error === false` means the request succeeded; `message` may carry a detail.
 */
export interface LaravelEnvelope<T> {
  error: boolean;
  message: string | null;
  data: T;
}
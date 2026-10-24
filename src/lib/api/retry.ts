/**
 * Bounded transient-error retry for server-side API transports.
 *
 * Scope: ONE retry (2 attempts total) of genuinely-transient failures —
 * network resets, gateway 5xx, timeouts — so a single blip during an ISR
 * revalidation does not wipe a previously-good cached page. Permanent
 * failures (4xx, payload shape mismatches, JSON parse errors) fail fast:
 * retrying them only doubles latency and masks real bugs.
 *
 * `shouldPropagateApiFailure` encodes the ISR-empty-render policy from
 * `wenaya-staging-data-render-audit.md` §Tier 2:
 *   - `next build` (NEXT_PHASE=phase-production-build): swallow → `[]`
 *     (missing data must never crash a production build).
 *   - `next dev`: swallow → `[]` (developer sees the empty state, not a
 *     red error page, on a flaky backend).
 *   - `next start` production runtime: RETHROW — the ISR route must fail
 *     the revalidation so the previously-good cached page is retained
 *     (Next.js keeps the stale page on throw; a returned empty list would
 *     be COMMITTED as the new page, exactly the bug we are fixing).
 *
 * Read dynamically at call time (never build-inlined): NEXT_PHASE is only
 * set while `next build` is the active process; `next start` workers have
 * it unset, and NEXT_ENV is never set.
 */

/** Backoff between the first and second attempt (ms). */
export const RETRY_DELAY_MS = 1_000;

/** Options for {@link withTransientRetry}. */
export interface TransientRetryOptions {
  /** Total attempts (minimum 1). Default 2 = one retry. */
  attempts?: number;
  /** Backoff between attempts in ms. Default {@link RETRY_DELAY_MS}. */
  delayMs?: number;
}

/**
 * Decide whether an error is a transient transport failure worth one retry.
 *
 * Retried: fetch network errors (`TypeError`), aborts/timeouts
 * (`AbortError`/`TimeoutError`, or null-status errors whose message mentions
 * abort/timeout), and HTTP 5xx (`WenayaApiError.status >= 500`).
 *
 * NOT retried: HTTP 4xx (including 429 — the backend asked us to slow down,
 * hammering it again is counterproductive), payload shape validation
 * failures, JSON `SyntaxError`, and path-validation errors.
 */
export function isTransientApiError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  // Abort / timeout — fetch DOMException in browsers, Node undici variants.
  if (error.name === "AbortError" || error.name === "TimeoutError") return true;

  // fetch() network-level failures surface as TypeError
  // ("fetch failed", "terminated", ECONNRESET…).
  if (error instanceof TypeError) return true;

  // HTTP-level failures: `status` carries the response code.
  const status = (error as { status?: unknown }).status;
  if (typeof status === "number") return status >= 500;

  // Transport errors wrapped without a status (e.g. our own abort wrapper)
  // — sniff the message for abort/timeout semantics. Matches "timeout",
  // "timed out" (undici's wording), and "aborted".
  if (status === null || status === undefined) {
    return /\baborted\b|\btimed?\s*out\b/i.test(error.message);
  }

  // Any other typed status (string, NaN…) is not transient.
  return false;
}

/**
 * Whether a caught error must be rethrown to the Next.js runtime (so an ISR
 * revalidation fails and the stale cached page is retained) or swallowed
 * into the caller's empty-list fallback.
 *
 * True during `next start` production runtime; false during `next build`
 * and `next dev`. See module doc for the full policy rationale.
 */
export function shouldPropagateApiFailure(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PHASE !== "phase-production-build"
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

/**
 * Run `fn`, retrying once on a transient failure (see
 * {@link isTransientApiError}). Non-transient errors and the final transient
 * failure propagate unchanged — the caller decides whether to swallow them
 * (via {@link shouldPropagateApiFailure}) or let them surface.
 *
 * Each invocation of `fn` must create its OWN AbortController/timeout: this
 * helper only schedules retries, it does not manage per-attempt resources.
 */
export async function withTransientRetry<T>(
  fn: () => Promise<T>,
  options: TransientRetryOptions = {}
): Promise<T> {
  const attempts = Math.max(1, options.attempts ?? 2);
  const delayMs = options.delayMs ?? RETRY_DELAY_MS;

  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const isLast = attempt >= attempts;
      if (isLast || !isTransientApiError(error)) throw error;
      await sleep(delayMs);
    }
  }
  // Unreachable: the loop either returns or throws on every iteration.
  throw lastError;
}

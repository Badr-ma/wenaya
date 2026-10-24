/**
 * Unit tests for the shared transient-retry helpers (src/lib/api/retry.ts).
 * Pure logic — uses delayMs: 0 so the suite stays fast. The REAL 1s backoff
 * of the API transports is covered in tests/api-transports.test.mjs.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  isTransientApiError,
  shouldPropagateApiFailure,
  withTransientRetry,
  RETRY_DELAY_MS,
} from "@/lib/api/retry";
import { WenayaApiError } from "@/lib/api/client";

function errorWith(props) {
  const e = new Error(props.message ?? "boom");
  if (props.name) e.name = props.name;
  if ("status" in props) e.status = props.status;
  return e;
}

// ---------------------------------------------------------------------------
// RETRY_DELAY_MS contract
// ---------------------------------------------------------------------------

test("RETRY_DELAY_MS is the shared 1s backoff", () => {
  assert.equal(RETRY_DELAY_MS, 1_000);
});

// ---------------------------------------------------------------------------
// isTransientApiError — classification matrix
// ---------------------------------------------------------------------------

test("isTransientApiError: AbortError → transient", () => {
  assert.equal(
    isTransientApiError(errorWith({ name: "AbortError", message: "aborted" })),
    true
  );
});

test("isTransientApiError: TimeoutError → transient", () => {
  assert.equal(
    isTransientApiError(errorWith({ name: "TimeoutError", message: "timed out" })),
    true
  );
});

test("isTransientApiError: fetch network TypeError → transient", () => {
  assert.equal(
    isTransientApiError(new TypeError("fetch failed")),
    true
  );
});

test("isTransientApiError: WenayaApiError 500 → transient", () => {
  assert.equal(isTransientApiError(new WenayaApiError("HTTP 500", 500)), true);
});

test("isTransientApiError: WenayaApiError 503 → transient", () => {
  assert.equal(isTransientApiError(new WenayaApiError("HTTP 503", 503)), true);
});

test("isTransientApiError: WenayaApiError 404 → NOT transient", () => {
  assert.equal(isTransientApiError(new WenayaApiError("HTTP 404", 404)), false);
});

test("isTransientApiError: WenayaApiError 429 → NOT transient (backend asked us to slow down)", () => {
  assert.equal(isTransientApiError(new WenayaApiError("HTTP 429", 429)), false);
});

test("isTransientApiError: shape-validation plain Error → NOT transient", () => {
  assert.equal(
    isTransientApiError(new Error("Unexpected professionals API payload shape")),
    false
  );
});

test("isTransientApiError: JSON SyntaxError → NOT transient", () => {
  const e = new SyntaxError("Unexpected token < in JSON");
  e.status = undefined;
  assert.equal(isTransientApiError(e), false);
});

test("isTransientApiError: null-status error with 'timeout' message → transient", () => {
  assert.equal(
    isTransientApiError(errorWith({ message: "Request timed out", status: null })),
    true
  );
});

test("isTransientApiError: null-status error with 'aborted' message → transient", () => {
  assert.equal(
    isTransientApiError(errorWith({ message: "Wenaya API request aborted", status: null })),
    true
  );
});

test("isTransientApiError: null-status error with unrelated message → NOT transient", () => {
  assert.equal(
    isTransientApiError(errorWith({ message: "bad contract", status: null })),
    false
  );
});

test("isTransientApiError: non-Error values → false", () => {
  assert.equal(isTransientApiError(null), false);
  assert.equal(isTransientApiError(undefined), false);
  assert.equal(isTransientApiError("boom"), false);
  assert.equal(isTransientApiError({ status: 500 }), false);
});

// ---------------------------------------------------------------------------
// withTransientRetry — attempt counting / propagation (delayMs: 0)
// ---------------------------------------------------------------------------

test("withTransientRetry: success on first attempt → 1 call", async () => {
  let calls = 0;
  const result = await withTransientRetry(async () => {
    calls += 1;
    return "ok";
  }, { delayMs: 0 });
  assert.equal(result, "ok");
  assert.equal(calls, 1);
});

test("withTransientRetry: transient failure once then success → 2 calls, result returned", async () => {
  let calls = 0;
  const result = await withTransientRetry(async () => {
    calls += 1;
    if (calls === 1) throw new WenayaApiError("HTTP 500", 500);
    return "recovered";
  }, { delayMs: 0 });
  assert.equal(result, "recovered");
  assert.equal(calls, 2);
});

test("withTransientRetry: permanent failure (4xx) → 1 call only, error propagates", async () => {
  let calls = 0;
  await assert.rejects(
    withTransientRetry(async () => {
      calls += 1;
      throw new WenayaApiError("HTTP 404", 404);
    }, { delayMs: 0 }),
    /HTTP 404/
  );
  assert.equal(calls, 1);
});

test("withTransientRetry: shape error → 1 call only, not retried", async () => {
  let calls = 0;
  await assert.rejects(
    withTransientRetry(async () => {
      calls += 1;
      throw new Error("Unexpected professionals API payload shape");
    }, { delayMs: 0 }),
    /payload shape/
  );
  assert.equal(calls, 1);
});

test("withTransientRetry: persistent transient failure → exactly 2 attempts, last error propagates", async () => {
  let calls = 0;
  await assert.rejects(
    withTransientRetry(async () => {
      calls += 1;
      throw new WenayaApiError(`HTTP 500 attempt ${calls}`, 500);
    }, { delayMs: 0 }),
    /attempt 2/
  );
  assert.equal(calls, 2);
});

test("withTransientRetry: attempts=1 disables retry", async () => {
  let calls = 0;
  await assert.rejects(
    withTransientRetry(
      async () => {
        calls += 1;
        throw new WenayaApiError("HTTP 500", 500);
      },
      { attempts: 1, delayMs: 0 }
    ),
    /HTTP 500/
  );
  assert.equal(calls, 1);
});

test("withTransientRetry: attempts=3 retries twice on persistent transient failure", async () => {
  let calls = 0;
  await assert.rejects(
    withTransientRetry(
      async () => {
        calls += 1;
        throw new TypeError("fetch failed");
      },
      { attempts: 3, delayMs: 0 }
    ),
    /fetch failed/
  );
  assert.equal(calls, 3);
});

test("withTransientRetry: attempts=0 clamps to a minimum of 1 attempt", async () => {
  let calls = 0;
  await assert.rejects(
    withTransientRetry(
      async () => {
        calls += 1;
        throw new WenayaApiError("HTTP 500", 500);
      },
      { attempts: 0, delayMs: 0 }
    ),
    /HTTP 500/
  );
  assert.equal(calls, 1);
});

test("withTransientRetry: default is 2 attempts", async () => {
  let calls = 0;
  await assert.rejects(
    withTransientRetry(async () => {
      calls += 1;
      throw new TypeError("fetch failed");
    }, { delayMs: 0 }),
    /fetch failed/
  );
  assert.equal(calls, 2);
});

test("withTransientRetry: non-transient error mid-stream is not swallowed", async () => {
  const sentinel = new RangeError("index out of bounds");
  await assert.rejects(
    withTransientRetry(async () => {
      throw sentinel;
    }, { delayMs: 0 }),
    (err) => err === sentinel
  );
});

// ---------------------------------------------------------------------------
// shouldPropagateApiFailure — env matrix (each check sets/restores env)
// ---------------------------------------------------------------------------

function withEnv(overrides, fn) {
  const saved = {};
  for (const [key, value] of Object.entries(overrides)) {
    saved[key] = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return fn();
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

test("shouldPropagateApiFailure: production runtime (NEXT_PHASE unset) → true", () => {
  withEnv({ NODE_ENV: "production", NEXT_PHASE: undefined }, () => {
    assert.equal(shouldPropagateApiFailure(), true);
  });
});

test("shouldPropagateApiFailure: production build (phase-production-build) → false", () => {
  withEnv(
    { NODE_ENV: "production", NEXT_PHASE: "phase-production-build" },
    () => {
      assert.equal(shouldPropagateApiFailure(), false);
    }
  );
});

test("shouldPropagateApiFailure: development → false", () => {
  withEnv({ NODE_ENV: "development", NEXT_PHASE: undefined }, () => {
    assert.equal(shouldPropagateApiFailure(), false);
  });
});

test("shouldPropagateApiFailure: any other NEXT_PHASE in production → true", () => {
  withEnv({ NODE_ENV: "production", NEXT_PHASE: "phase-development-server" }, () => {
    assert.equal(shouldPropagateApiFailure(), true);
  });
});

test("shouldPropagateApiFailure: NODE_ENV unset → false", () => {
  withEnv({ NODE_ENV: undefined, NEXT_PHASE: undefined }, () => {
    assert.equal(shouldPropagateApiFailure(), false);
  });
});

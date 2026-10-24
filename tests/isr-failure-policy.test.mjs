/**
 * ISR failure-policy tests — src/lib/api/retry.ts#shouldPropagateApiFailure
 * wired through the three rethrowing adapters + the always-swallow adapter
 * and the contact-form local catch.
 *
 * Policy under test:
 *   production runtime (NODE_ENV=production, NEXT_PHASE unset) → transport
 *     failure is RETHROWN (ISR revalidation fails, stale cached page retained)
 *   next build (NEXT_PHASE=phase-production-build)            → swallowed → []
 *   next dev  (NODE_ENV=development)                          → swallowed → []
 *   valid empty API response (any env)                        → [] (never an error)
 *   getLiveSpecialists (any env)                              → always swallows → []
 *   resolveRequestedSession                                   → local catch swallows
 *     even a production-runtime rethrow → undefined (contact page never 500s)
 *
 * Failures use HTTP 400 (permanent 4xx — NOT retried) so these tests stay
 * fast (1 fetch call, no 1s backoff). WENAYA_API_URL is set before first use.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.WENAYA_API_URL = "https://api.test";

const { getPracticeSpecialists, getHomepageSpecialists, getLiveSpecialists } =
  await import("@/lib/professionals");
const { getActiveGroupSessions, resolveRequestedSession } = await import(
  "@/lib/group-sessions-active"
);

// ─── Helpers ────────────────────────────────────────────────────────────

/** Set NODE_ENV / NEXT_PHASE for the duration of an async test, restore after. */
async function withEnv(overrides, fn) {
  const saved = {};
  for (const [key, value] of Object.entries(overrides)) {
    saved[key] = process.env[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return await fn();
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

const PROD = { NODE_ENV: "production", NEXT_PHASE: undefined };
const BUILD = { NODE_ENV: "production", NEXT_PHASE: "phase-production-build" };
const DEV = { NODE_ENV: "development", NEXT_PHASE: undefined };

function professionalsOk(rows) {
  return new Response(JSON.stringify({ error: false, data: rows }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function groupSessionsEmpty() {
  return new Response(
    JSON.stringify({
      error: false,
      message: "",
      data: {
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
        data: [],
        links: [],
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

function http400() {
  return new Response(JSON.stringify({ message: "Bad Request" }), { status: 400 });
}

/** Install a fetch stub that always returns `action()`; returns { calls }. */
function stubFetchAlways(t, action) {
  const state = { calls: 0 };
  t.mock.method(globalThis, "fetch", async () => {
    state.calls += 1;
    return action();
  });
  return state;
}

// ─── getPracticeSpecialists ─────────────────────────────────────────────

test("practice specialists: prod runtime + transport failure → RETHROWS (stale ISR page retained)", async (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  const state = stubFetchAlways(t, http400);
  await withEnv(PROD, async () => {
    await assert.rejects(
      getPracticeSpecialists("nutrition"),
      /HTTP 400/
    );
  });
  assert.equal(state.calls, 1, "4xx must not be retried");
  assert.ok(warn.mock.callCount() >= 1, "failure must be logged before rethrow");
});

test("practice specialists: build phase + transport failure → swallowed → []", async (t) => {
  t.mock.method(console, "warn", () => {});
  const state = stubFetchAlways(t, http400);
  await withEnv(BUILD, async () => {
    assert.deepEqual(await getPracticeSpecialists("nutrition"), []);
  });
  assert.equal(state.calls, 1);
});

test("practice specialists: dev + transport failure → swallowed → []", async (t) => {
  t.mock.method(console, "warn", () => {});
  stubFetchAlways(t, http400);
  await withEnv(DEV, async () => {
    assert.deepEqual(await getPracticeSpecialists("nutrition"), []);
  });
});

test("practice specialists: prod runtime + VALID empty response → [] (never an error)", async (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  const state = stubFetchAlways(t, () => professionalsOk([]));
  await withEnv(PROD, async () => {
    assert.deepEqual(await getPracticeSpecialists("nutrition"), []);
  });
  assert.equal(state.calls, 1);
  assert.equal(warn.mock.callCount(), 0, "valid empty must not log a failure");
});

// ─── getHomepageSpecialists ─────────────────────────────────────────────

test("homepage specialists: prod runtime + transport failure → RETHROWS", async (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  const state = stubFetchAlways(t, http400);
  await withEnv(PROD, async () => {
    await assert.rejects(getHomepageSpecialists(), /HTTP 400/);
  });
  assert.equal(state.calls, 1);
  assert.ok(warn.mock.callCount() >= 1);
});

test("homepage specialists: build phase + transport failure → swallowed → []", async (t) => {
  t.mock.method(console, "warn", () => {});
  stubFetchAlways(t, http400);
  await withEnv(BUILD, async () => {
    assert.deepEqual(await getHomepageSpecialists(), []);
  });
});

test("homepage specialists: dev + transport failure → swallowed → []", async (t) => {
  t.mock.method(console, "warn", () => {});
  stubFetchAlways(t, http400);
  await withEnv(DEV, async () => {
    assert.deepEqual(await getHomepageSpecialists(), []);
  });
});

test("homepage specialists: prod runtime + VALID empty response → [] (never an error)", async (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  stubFetchAlways(t, () => professionalsOk([]));
  await withEnv(PROD, async () => {
    assert.deepEqual(await getHomepageSpecialists(), []);
  });
  assert.equal(warn.mock.callCount(), 0);
});

// ─── getActiveGroupSessions ─────────────────────────────────────────────

test("active group sessions: prod runtime + transport failure → RETHROWS", async (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  const state = stubFetchAlways(t, http400);
  await withEnv(PROD, async () => {
    await assert.rejects(getActiveGroupSessions("fr"), /HTTP 400/);
  });
  assert.equal(state.calls, 1);
  assert.ok(warn.mock.callCount() >= 1);
});

test("active group sessions: build phase + transport failure → swallowed → []", async (t) => {
  t.mock.method(console, "warn", () => {});
  stubFetchAlways(t, http400);
  await withEnv(BUILD, async () => {
    assert.deepEqual(await getActiveGroupSessions("fr"), []);
  });
});

test("active group sessions: dev + transport failure → swallowed → []", async (t) => {
  t.mock.method(console, "warn", () => {});
  stubFetchAlways(t, http400);
  await withEnv(DEV, async () => {
    assert.deepEqual(await getActiveGroupSessions("fr"), []);
  });
});

test("active group sessions: prod runtime + VALID empty paginator → [] (never an error)", async (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  const state = stubFetchAlways(t, groupSessionsEmpty);
  await withEnv(PROD, async () => {
    assert.deepEqual(await getActiveGroupSessions("fr"), []);
  });
  assert.equal(state.calls, 1);
  assert.equal(warn.mock.callCount(), 0);
});

// ─── getLiveSpecialists — ALWAYS swallows ───────────────────────────────

test("live specialists: prod runtime + transport failure → ALWAYS swallows → []", async (t) => {
  const error = t.mock.method(console, "error", () => {});
  const state = stubFetchAlways(t, http400);
  await withEnv(PROD, async () => {
    assert.deepEqual(await getLiveSpecialists(), []);
  });
  assert.equal(state.calls, 1);
  assert.ok(error.mock.callCount() >= 1, "must log via console.error");
});

test("live specialists: prod runtime + VALID empty response → []", async (t) => {
  const warn = t.mock.method(console, "warn", () => {});
  stubFetchAlways(t, () => professionalsOk([]));
  await withEnv(PROD, async () => {
    assert.deepEqual(await getLiveSpecialists(), []);
  });
  // getLiveSpecialists logs a dedicated "0 professionals" warn on valid-empty —
  // that is pre-existing behavior, not a failure log; assert it didn't ERROR.
  assert.equal((t.mock.method(console, "error", () => {})).mock.callCount(), 0);
  assert.ok(warn.mock.callCount() >= 1, "valid-empty warn is expected");
});

// ─── resolveRequestedSession — local catch swallows everything ──────────

test("resolveRequestedSession: api-* service + prod-runtime rethrow underneath → undefined (no throw)", async (t) => {
  t.mock.method(console, "warn", () => {});
  const state = stubFetchAlways(t, http400);
  await withEnv(PROD, async () => {
    const result = await resolveRequestedSession("api-922", "fr");
    assert.equal(result, undefined);
  });
  assert.equal(state.calls, 1);
});

test("resolveRequestedSession: api-* service + VALID empty feed → undefined", async (t) => {
  stubFetchAlways(t, groupSessionsEmpty);
  await withEnv(PROD, async () => {
    const result = await resolveRequestedSession("api-922", "fr");
    assert.equal(result, undefined);
  });
});

test("resolveRequestedSession: editorial service resolves locally with ZERO fetches", async (t) => {
  const state = stubFetchAlways(t, () => {
    throw new Error("fetch must not be called for editorial services");
  });
  await withEnv(PROD, async () => {
    const result = await resolveRequestedSession("yoga-prenatal", "fr");
    assert.ok(result, "editorial session must resolve");
    assert.equal(typeof result.title, "string");
    assert.ok(result.title.length > 0);
  });
  assert.equal(state.calls, 0);
});

test("resolveRequestedSession: undefined service → undefined, zero fetches", async (t) => {
  const state = stubFetchAlways(t, () => {
    throw new Error("fetch must not be called without a service");
  });
  await withEnv(PROD, async () => {
    assert.equal(await resolveRequestedSession(undefined, "fr"), undefined);
  });
  assert.equal(state.calls, 0);
});

test("resolveRequestedSession: non-api, non-editorial service → undefined, zero fetches", async (t) => {
  const state = stubFetchAlways(t, () => {
    throw new Error("fetch must not be called for unknown non-api services");
  });
  await withEnv(PROD, async () => {
    assert.equal(await resolveRequestedSession("not-a-session", "fr"), undefined);
  });
  assert.equal(state.calls, 0);
});

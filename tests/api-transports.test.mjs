/**
 * Transport-level tests for the bounded-retry wiring in
 * src/lib/professionals-api.ts and src/lib/group-sessions-api.ts.
 *
 * These exercise the REAL hardcoded 1s backoff (delayMs: RETRY_DELAY_MS inside
 * the transports) — they are intentionally slow (~1s per retry). Stub
 * globalThis.fetch per test; WENAYA_API_URL is set before first use so
 * getApiBaseUrl() memoizes the test base.
 *
 * Fixtures mirror the verified backend contracts:
 *   professionals:      { error: false, data: Professional[] }
 *   group-sessions:     { error: false, data: { current_page, last_page,
                         per_page, total, data: Program[], links } }
 */
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.WENAYA_API_URL = "https://api.test";

const { fetchProfessionals } = await import("@/lib/professionals-api");
const { fetchGroupProgramsPage } = await import("@/lib/group-sessions-api");
const { RETRY_DELAY_MS } = await import("@/lib/api/retry");

assert.equal(RETRY_DELAY_MS, 1_000);

const PROFESSIONAL_ROW = {
  id: 1,
  first_name: "Test",
  last_name: "Practitioner",
  avatar: "",
  username: "test-practitioner",
  slug: "test-practitioner",
  speciality_names: ["Physiotherapy"],
  formattedCreatedAt: "2026-01-01",
  currency: null,
};

function professionalsOk(rows) {
  return new Response(JSON.stringify({ error: false, data: rows }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function groupSessionsOk(programs) {
  return new Response(
    JSON.stringify({
      error: false,
      message: "",
      data: {
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: programs.length,
        data: programs,
        links: [],
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

function http(status) {
  return new Response(JSON.stringify({ message: "error" }), { status });
}

/** Install a scripted fetch stub; returns { calls, urls } filled as the test runs. */
function stubFetch(t, script) {
  const state = { calls: 0, urls: [] };
  const impl = async (url) => {
    state.calls += 1;
    state.urls.push(String(url));
    const action = script[state.calls - 1];
    if (!action) throw new Error(`fetch stub exhausted at call ${state.calls}`);
    return action();
  };
  t.mock.method(globalThis, "fetch", impl);
  return state;
}

// ---------------------------------------------------------------------------
// professionals-api — fetchProfessionals
// ---------------------------------------------------------------------------

test("professionals: transient 500 then 200 → 2 fetch calls, result parsed, ~1s backoff", async (t) => {
  const state = stubFetch(t, [() => http(500), () => professionalsOk([PROFESSIONAL_ROW])]);
  const started = Date.now();
  const rows = await fetchProfessionals();
  const elapsed = Date.now() - started;
  assert.equal(state.calls, 2);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].slug, "test-practitioner");
  assert.ok(state.urls[0].includes("/api/v1/getProfessionals/1"));
  assert.ok(
    elapsed >= RETRY_DELAY_MS - 100,
    `expected >=~${RETRY_DELAY_MS}ms backoff, got ${elapsed}ms`
  );
});

test("professionals: persistent 500 → exactly 2 attempts, HTTP error propagates", async (t) => {
  const state = stubFetch(t, [() => http(500), () => http(500)]);
  const started = Date.now();
  await assert.rejects(fetchProfessionals(), /Professionals API HTTP 500/);
  const elapsed = Date.now() - started;
  assert.equal(state.calls, 2);
  assert.ok(elapsed >= RETRY_DELAY_MS - 100, `expected ~1s backoff, got ${elapsed}ms`);
});

test("professionals: network TypeError then 200 → retried, succeeds", async (t) => {
  const state = stubFetch(t, [
    () => {
      throw new TypeError("fetch failed");
    },
    () => professionalsOk([]),
  ]);
  const rows = await fetchProfessionals();
  assert.equal(state.calls, 2);
  assert.deepEqual(rows, []);
});

test("professionals: valid empty envelope {data:[]} → [] with 1 call (NOT an error)", async (t) => {
  const state = stubFetch(t, [() => professionalsOk([])]);
  const rows = await fetchProfessionals();
  assert.deepEqual(rows, []);
  assert.equal(state.calls, 1);
});

test("professionals: shape-invalid payload → 1 call only (no retry), error propagates", async (t) => {
  // error:false but data is not an array — contract change, fail fast.
  const state = stubFetch(t, [
    () =>
      new Response(JSON.stringify({ error: false, data: { not: "an array" } }), {
        status: 200,
      }),
  ]);
  await assert.rejects(fetchProfessionals(), /Unexpected professionals API payload shape/);
  assert.equal(state.calls, 1);
});

test("professionals: 404 → 1 call only (4xx not retried)", async (t) => {
  const state = stubFetch(t, [() => http(404)]);
  await assert.rejects(fetchProfessionals(), /Professionals API HTTP 404/);
  assert.equal(state.calls, 1);
});

// ---------------------------------------------------------------------------
// group-sessions-api — fetchGroupProgramsPage
// ---------------------------------------------------------------------------

test("group-sessions: transient 500 then 200 → 2 fetch calls, paginator parsed, ~1s backoff", async (t) => {
  const program = {
    id: 922,
    title: "Group Training",
    description: null,
    logo: null,
    parent: null,
    nbr_of_participants: 0,
    capacity: 12,
    event_key: "WE-GROUP-922",
    event_slug: "group-training-922",
    event_date: "2026-10-22",
    event_time: "18:00",
    event_status: "active",
    price: "200",
    firstUseprice: "150",
    duration: "60",
    professional: null,
    company: null,
    children: [],
  };
  const state = stubFetch(t, [() => http(500), () => groupSessionsOk([program])]);
  const started = Date.now();
  const res = await fetchGroupProgramsPage(1);
  const elapsed = Date.now() - started;
  assert.equal(state.calls, 2);
  assert.equal(res.data.data.length, 1);
  assert.equal(res.data.data[0].id, 922);
  assert.ok(state.urls[0].includes("/api/v1/getAppointmentsGroupsWithPagination"));
  assert.ok(state.urls[0].includes("page=1"));
  assert.ok(
    elapsed >= RETRY_DELAY_MS - 100,
    `expected >=~${RETRY_DELAY_MS}ms backoff, got ${elapsed}ms`
  );
});

test("group-sessions: persistent 500 → exactly 2 attempts, HTTP error propagates", async (t) => {
  const state = stubFetch(t, [() => http(500), () => http(500)]);
  const started = Date.now();
  await assert.rejects(fetchGroupProgramsPage(1), /Wenaya API HTTP 500/);
  const elapsed = Date.now() - started;
  assert.equal(state.calls, 2);
  assert.ok(elapsed >= RETRY_DELAY_MS - 100, `expected ~1s backoff, got ${elapsed}ms`);
});

test("group-sessions: network TypeError then 200 → retried, succeeds", async (t) => {
  const state = stubFetch(t, [
    () => {
      throw new TypeError("fetch failed");
    },
    () => groupSessionsOk([]),
  ]);
  const res = await fetchGroupProgramsPage(1);
  assert.equal(state.calls, 2);
  assert.deepEqual(res.data.data, []);
});

test("group-sessions: valid empty paginator → 1 call, data.data === [] (NOT an error)", async (t) => {
  const state = stubFetch(t, [() => groupSessionsOk([])]);
  const res = await fetchGroupProgramsPage(1);
  assert.deepEqual(res.data.data, []);
  assert.equal(res.data.total, 0);
  assert.equal(state.calls, 1);
});

test("group-sessions: envelope shape-invalid (missing paginator) → 1 call only (no retry)", async (t) => {
  // error:false but data lacks the paginator fields — contract change, fail fast.
  const state = stubFetch(t, [
    () => new Response(JSON.stringify({ error: false, data: [] }), { status: 200 }),
  ]);
  await assert.rejects(
    fetchGroupProgramsPage(1),
    /Unexpected Wenaya group-sessions API payload/
  );
  assert.equal(state.calls, 1);
});

test("group-sessions: 404 → 1 call only (4xx not retried)", async (t) => {
  const state = stubFetch(t, [() => http(404)]);
  await assert.rejects(fetchGroupProgramsPage(1), /Wenaya API HTTP 404/);
  assert.equal(state.calls, 1);
});

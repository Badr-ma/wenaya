import { test } from "node:test";
import assert from "node:assert/strict";

process.env.WENAYA_API_URL = "https://api.test";
const { getClinicTroubleCards, getTroublesHub } = await import("@/lib/troubles-hub");
const { getActiveGroupSessionsResult } = await import("@/lib/group-sessions-active");

async function withEnv(overrides, fn) {
  const previous = Object.fromEntries(Object.keys(overrides).map((key) => [key, process.env[key]]));
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  try {
    return await fn();
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
}

function emptyPaginator() {
  return Response.json({
    error: false,
    message: "",
    data: { current_page: 1, last_page: 1, per_page: 12, total: 0, data: [], links: [] },
  });
}

test("troubles hub: valid empty response stays empty; runtime failure propagates", async (t) => {
  let apiResponse = emptyPaginator();
  t.mock.method(globalThis, "fetch", async () => apiResponse);
  const empty = await withEnv({ NODE_ENV: "production", NEXT_PHASE: undefined }, () => getTroublesHub());
  assert.deepEqual(empty, { status: "empty", items: [] });

  apiResponse = new Response("unavailable", { status: 503 });
  t.mock.method(console, "error", () => {});
  await withEnv({ NODE_ENV: "production", NEXT_PHASE: undefined }, () =>
    assert.rejects(getTroublesHub(), /HTTP 503/)
  );
});

test("troubles hub: build failure is an explicit error state, not valid empty", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  t.mock.method(console, "error", () => {});
  const result = await withEnv(
    { NODE_ENV: "production", NEXT_PHASE: "phase-production-build" },
    () => getTroublesHub()
  );
  assert.deepEqual(result, { status: "error", items: [] });
});

test("clinic trouble cards: valid empty remains empty and runtime failures propagate", async (t) => {
  let apiResponse = emptyPaginator();
  t.mock.method(globalThis, "fetch", async () => apiResponse);
  const empty = await withEnv(
    { NODE_ENV: "production", NEXT_PHASE: undefined },
    () => getClinicTroubleCards("fr")
  );
  assert.deepEqual(empty, { status: "empty", items: [] });

  apiResponse = new Response("unavailable", { status: 503 });
  t.mock.method(console, "error", () => {});
  await withEnv({ NODE_ENV: "production", NEXT_PHASE: undefined }, () =>
    assert.rejects(getClinicTroubleCards("fr"), /HTTP 503/)
  );
});

test("clinic trouble cards: build failure keeps its explicit error status", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  t.mock.method(console, "error", () => {});
  const result = await withEnv(
    { NODE_ENV: "production", NEXT_PHASE: "phase-production-build" },
    () => getClinicTroubleCards("en")
  );
  assert.deepEqual(result, { status: "error", items: [] });
});

test("group sessions: valid empty feed is distinct from a build-time failure", async (t) => {
  let apiResponse = emptyPaginator();
  t.mock.method(globalThis, "fetch", async () => apiResponse);
  const empty = await withEnv(
    { NODE_ENV: "production", NEXT_PHASE: undefined },
    () => getActiveGroupSessionsResult("fr")
  );
  assert.deepEqual(empty, { sessions: [], loadError: false });

  apiResponse = new Response("unavailable", { status: 503 });
  t.mock.method(console, "warn", () => {});
  const failed = await withEnv(
    { NODE_ENV: "production", NEXT_PHASE: "phase-production-build" },
    () => getActiveGroupSessionsResult("fr")
  );
  assert.deepEqual(failed, { sessions: [], loadError: true });
});

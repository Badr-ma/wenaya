import { test } from "node:test";
import assert from "node:assert/strict";

process.env.WENAYA_API_URL = "https://api.test";
const { getPracticesPageAsync } = await import("@/lib/pratiques");

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

function emptyPracticesResponse() {
  return new Response(JSON.stringify({
    error: false,
    data: { current_page: 1, last_page: 1, per_page: 12, total: 0, data: [] },
  }), { status: 200, headers: { "Content-Type": "application/json" } });
}

test("practices: a successful empty API result is not tagged as a loading failure", async (t) => {
  t.mock.method(globalThis, "fetch", async () => emptyPracticesResponse());
  const result = await withEnv({ NODE_ENV: "production", NEXT_PHASE: undefined }, () =>
    getPracticesPageAsync({ page: 1 })
  );
  assert.deepEqual(result.items, []);
  assert.equal(result.loadError, false);
});

test("practices: failed initial build fetch is flagged for client recovery", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  t.mock.method(console, "warn", () => {});
  const result = await withEnv(
    { NODE_ENV: "production", NEXT_PHASE: "phase-production-build" },
    () => getPracticesPageAsync({ page: 1 })
  );
  assert.deepEqual(result.items, []);
  assert.equal(result.loadError, true);
});

test("practices: production ISR failure propagates instead of replacing cached output", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  t.mock.method(console, "warn", () => {});
  await withEnv({ NODE_ENV: "production", NEXT_PHASE: undefined }, () =>
    assert.rejects(getPracticesPageAsync({ page: 1 }), /HTTP 503/)
  );
});

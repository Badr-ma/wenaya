/** Regression coverage for 404 versus unavailable detail API responses. */
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.WENAYA_API_URL = "https://api.test";

const { getTroubleDetail } = await import("@/lib/troubles-hub");
const { getLiveProfessionalBySlug } = await import("@/lib/professionals-detail");

function response(status, body = "") {
  return new Response(body, { status, headers: { "Content-Type": "application/json" } });
}

function stubFetch(t, result) {
  const fetchStub = async () => {
    if (result instanceof Error) throw result;
    return result;
  };
  t.mock.method(globalThis, "fetch", fetchStub);
}

test("trouble detail: explicit upstream 404 remains not found", async (t) => {
  stubFetch(t, response(404, JSON.stringify({ message: "not found" })));
  assert.equal(await getTroubleDetail("fr", "missing-trouble"), null);
});

test("trouble detail: 5xx propagates instead of becoming not found", async (t) => {
  stubFetch(t, response(503, JSON.stringify({ message: "private upstream detail" })));
  await assert.rejects(getTroubleDetail("en", "some-trouble"), /HTTP 503/);
});

test("trouble detail: network, malformed JSON, and malformed payload propagate", async (t) => {
  stubFetch(t, new TypeError("network failure"));
  await assert.rejects(getTroubleDetail("fr", "some-trouble"), /network failure/);

  stubFetch(t, response(200, "{"));
  await assert.rejects(getTroubleDetail("fr", "some-trouble"), /non-JSON/);

  stubFetch(t, response(200, JSON.stringify({ error: false, data: { id: "bad" } })));
  await assert.rejects(getTroubleDetail("fr", "some-trouble"), /Unexpected Wenaya trouble detail payload/);
});

test("professional detail: explicit upstream 404 remains not found", async (t) => {
  stubFetch(t, response(404, JSON.stringify({ message: "not found" })));
  assert.equal(await getLiveProfessionalBySlug("missing-professional", "fr"), undefined);
});

test("professional detail: 5xx, network, malformed JSON, and malformed payload propagate", async (t) => {
  stubFetch(t, response(503, JSON.stringify({ message: "private upstream detail" })));
  await assert.rejects(getLiveProfessionalBySlug("some-professional", "en"), /request failed/);

  stubFetch(t, new TypeError("network failure"));
  await assert.rejects(getLiveProfessionalBySlug("some-professional", "en"), /network failure/);

  stubFetch(t, response(200, "{"));
  await assert.rejects(getLiveProfessionalBySlug("some-professional", "en"));

  stubFetch(t, response(200, JSON.stringify({ error: false, data: {} })));
  await assert.rejects(getLiveProfessionalBySlug("some-professional", "en"), /Unexpected professional detail payload shape/);
});

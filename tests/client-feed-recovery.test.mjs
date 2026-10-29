import { test } from "node:test";
import assert from "node:assert/strict";

const { fetchClientFeedPayload, isPaginatedPracticesPayload, shouldRecoverInitialFeed } = await import(
  "@/lib/client-feed-recovery"
);

function isSessionsPayload(value) {
  return !!value && typeof value === "object" && Array.isArray(value.sessions);
}

function isPracticesPayload(value) {
  return isPaginatedPracticesPayload(value);
}

test("empty SSR group feed qualifies for recovery and the fetch helper returns sessions", async (t) => {
  const session = { id: "api-922", title: "Group training", path: "/seance-de-groupe/group-training" };
  let calls = 0;
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls += 1;
    assert.equal(url, "/api/seance-de-groupe?locale=fr");
    assert.equal(options.cache, "no-store");
    return Response.json({ sessions: [session] });
  });

  assert.equal(shouldRecoverInitialFeed(0, false), true);
  const initialSessions = [];
  const payload = await fetchClientFeedPayload(
    "/api/seance-de-groupe?locale=fr",
    isSessionsPayload,
  );
  const recoveredSessions = payload.sessions;

  assert.deepEqual(initialSessions, []);
  assert.deepEqual(recoveredSessions, [session]);
  assert.equal(calls, 1);
});

test("a valid empty API response stays empty and is not treated as a failure", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async () => {
    calls += 1;
    return Response.json({
      items: [], total: 0, page: 1, pageSize: 12, totalPages: 0,
      hasMore: false, dataSource: "api", loadError: false,
    });
  });

  const result = await fetchClientFeedPayload("/api/pratiques?locale=en&page=1", isPracticesPayload);

  assert.deepEqual(result.items, []);
  assert.equal(result.total, 0);
  assert.equal(shouldRecoverInitialFeed(result.items.length, false), true);
  assert.equal(calls, 1);
});

test("empty practices SSR batches fetch populated FR and EN proxy responses", async (t) => {
  const urls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    urls.push(url);
    const locale = url.includes("locale=en") ? "en" : "fr";
    return Response.json({
      items: [{ slug: `${locale}-practice` }],
      total: 1,
      page: 1,
      pageSize: 12,
      totalPages: 1,
      hasMore: false,
      dataSource: "api",
      loadError: false,
    });
  });

  for (const locale of ["fr", "en"]) {
    let renderedItems = [];
    assert.equal(shouldRecoverInitialFeed(renderedItems.length, false), true);
    const payload = await fetchClientFeedPayload(
      `/api/pratiques?locale=${locale}&page=1&pageSize=12`,
      isPracticesPayload,
    );
    renderedItems = payload.items;
    assert.equal(renderedItems.length, 1);
    assert.equal(renderedItems[0].slug, `${locale}-practice`);
  }

  assert.deepEqual(urls, [
    "/api/pratiques?locale=fr&page=1&pageSize=12",
    "/api/pratiques?locale=en&page=1&pageSize=12",
  ]);
});

test("a failed client request remains an error instead of becoming an empty success", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    new Response("unavailable", { status: 503 }),
  );

  await assert.rejects(
    fetchClientFeedPayload("/api/seance-de-groupe?locale=en", isSessionsPayload),
    /Feed request failed \(503\)/,
  );
});

test("network, malformed JSON, and invalid payload failures are rejected", async (t) => {
  let fetchResponse = async () => { throw new TypeError("network unavailable"); };
  t.mock.method(globalThis, "fetch", (...args) => fetchResponse(...args));
  await assert.rejects(
    fetchClientFeedPayload("/api/seance-de-groupe?locale=fr", isSessionsPayload),
    /network unavailable/,
  );

  fetchResponse = async () => new Response("{bad json", { status: 200 });
  await assert.rejects(
    fetchClientFeedPayload("/api/seance-de-groupe?locale=fr", isSessionsPayload),
    SyntaxError,
  );

  fetchResponse = async () => Response.json({ sessions: "not-an-array" });
  await assert.rejects(
    fetchClientFeedPayload("/api/seance-de-groupe?locale=fr", isSessionsPayload),
    /unexpected shape/,
  );

  const incompletePractices = {
    items: [], total: 0, page: 1, pageSize: 12, hasMore: false,
  };
  assert.equal(isPaginatedPracticesPayload(incompletePractices), false);
  assert.equal(isPaginatedPracticesPayload({
    ...incompletePractices, totalPages: 0, dataSource: "api", loadError: false,
  }), true);

  fetchResponse = async () => Response.json(incompletePractices);
  await assert.rejects(
    fetchClientFeedPayload("/api/pratiques?locale=fr&page=1", isPracticesPayload),
    /unexpected shape/,
  );
});

test("successful recovery works with both localized API routes", async (t) => {
  const urls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    urls.push(url);
    return Response.json({ sessions: [{ id: `session-${urls.length}` }] });
  });

  const recovered = [];
  for (const locale of ["fr", "en"]) {
    assert.equal(shouldRecoverInitialFeed(0, false), true);
    const payload = await fetchClientFeedPayload(
      `/api/seance-de-groupe?locale=${locale}`,
      isSessionsPayload,
    );
    recovered.push(...payload.sessions);
  }

  assert.deepEqual(urls, [
    "/api/seance-de-groupe?locale=fr",
    "/api/seance-de-groupe?locale=en",
  ]);
  assert.equal(recovered.length, 2);
  assert.equal(shouldRecoverInitialFeed(recovered.length, false), false);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import { getLivePratiques } from "@/lib/pratiques";
import { getLivePracticeImageMap, getQuickAccessImages } from "@/lib/practice-images";
import { practicesContent } from "@/lib/practice-content";

process.env.WENAYA_API_URL = "https://api.example.test";

async function production(fn) {
  const saved = { NODE_ENV: process.env.NODE_ENV, NEXT_PHASE: process.env.NEXT_PHASE };
  process.env.NODE_ENV = "production";
  delete process.env.NEXT_PHASE;
  try { await fn(); } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
}

test("production failures propagate through live practices, image maps and quick access", async (t) => {
  t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));
  await production(async () => {
    for (const read of [getLivePratiques, getLivePracticeImageMap, getQuickAccessImages]) {
      await assert.rejects(read("fr"), /HTTP 503/);
    }
  });
});

test("failure on page two is not published as a successful empty image map", async (t) => {
  t.mock.method(console, "warn", () => {});
  t.mock.method(globalThis, "fetch", async (url) => {
    if (new URL(url).searchParams.get("page") === "2") return new Response("unavailable", { status: 503 });
    return Response.json({ error: false, data: { current_page: 1, last_page: 2, total: 2,
      data: [{ id: practicesContent.kinesitherapie.liveId, image_web: "https://images.example.test/hero.jpg" }] } });
  });
  await production(() => assert.rejects(getLivePracticeImageMap("en"), /HTTP 503/));
});

test("healthy empty feeds remain empty without being mistaken for failures", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ error: false,
    data: { current_page: 1, last_page: 1, total: 0, data: [] } }));
  await production(async () => {
    assert.deepEqual(await getLivePratiques(), []);
    assert.deepEqual(await getLivePracticeImageMap(), {});
    assert.deepEqual(await getQuickAccessImages(), [null, null, null]);
  });
});

#!/usr/bin/env node
/**
 * Contract verification for the shared Wenaya API read client + the Practices
 * adapter (Phase 1 — shared API plumbing). Runs with the built-in Node test
 * runner (`node:test`) — NO third-party test framework, consistent with a repo
 * that has none.
 *
 * What it does:
 *   1. Compiles the practices lib closure (api/client, api/types, practices-api,
 *      practice-adapter, pratiques, practice-content, en-translations) to a
 *      throwaway CommonJS dir under node_modules/.cache with `tsc`.
 *   2. Starts a mock Laravel backend (paginator contract from the live endpoint:
 *      12/page hardcoded, 1-based page clamping, out-of-range → empty data,
 *      `{ error, message, data }` envelope).
 *   3. Asserts parsing, pagination walking, error handling, adapter mapping,
 *      FR-API / EN-local strategy, and the local fallback.
 *
 * Uses only relative imports in the compiled closure — never starts Next, never
 * calls the real api.wenaya.com. Run:  `npm run verify:api`  (or node scripts/verify-practices-api.mjs)
 *
 * Ordering note: the shared client reads the base URL from `process.env` at
 * module load, and ESM caches modules by URL — so the harness (a) sets the env
 * BEFORE importing any module, and (b) busts the module cache with a unique
 * query-string when it needs a fresh module instance for the fallback test.
 */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { test, before, after } from "node:test";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fs from "node:fs";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SRC_LIB = join(ROOT, "src", "lib");
const CACHE_DIR = join(ROOT, "node_modules", ".cache", "wenaya-api-verify");
const OUT_DIR = join(CACHE_DIR, "out");
const TSCONFIG = join(CACHE_DIR, "tsconfig.json");

const SOURCE_FILES = [
  join(SRC_LIB, "api", "types.ts"),
  join(SRC_LIB, "api", "client.ts"),
  join(SRC_LIB, "practices-api.ts"),
  join(SRC_LIB, "practice-adapter.ts"),
  join(SRC_LIB, "pratiques.ts"),
  join(SRC_LIB, "practice-content.ts"),
  join(SRC_LIB, "en-translations.ts"),
];

// ─── Build step: compile the closure, then load it ─────────────
function compile() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.writeFileSync(
    TSCONFIG,
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          module: "commonjs",
          moduleResolution: "node",
          esModuleInterop: true,
          skipLibCheck: true,
          strict: true,
          noEmitOnError: true,
          rootDir: SRC_LIB,
          outDir: OUT_DIR,
        },
        files: SOURCE_FILES,
      },
      null,
      2
    )
  );

  const tscJs = join(ROOT, "node_modules", "typescript", "bin", "tsc");
  const result = spawnSync(process.execPath, [tscJs, "-p", TSCONFIG], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    throw new Error(`tsc verify compile failed:\n${result.stdout}\n${result.stderr}`);
  }
}

/** The 19 live practice ids (12+7 over two pages), matching SLUG_BY_LIVE_ID. */
const LIVE_IDS = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 16, 18, 22, 23, 24, 25, 26];

function makeSpeciality(id, { shortDesc = false } = {}) {
  const frNames = {
    2: "Psychomotricité",
    3: "Orthophonie",
    4: "Kinésithérapie",
    5: "Nutrition",
    6: "Naturopathie",
    7: "Neuropsychologie",
    8: "Sexologie",
    9: "Cupping Therapy Hijama",
    11: "Psychologie",
    12: "Yoga",
    13: "Méditation",
    14: "Psychothérapie",
    16: "Massothérapie",
    18: "Art Martial Thérapie",
    22: "Ostéopathie",
    23: "Sonothérapie",
    24: "Coaching Sportif",
    25: "Sophrologie",
    26: "Infirmerie",
  };
  return {
    id,
    ar_name: null,
    en_name: `en-name-${id}`,
    fr_name: frNames[id] ?? `Praticien ${id}`,
    ar_slug: null,
    en_slug: `en-slug-${id}`,
    fr_slug: `fr-slug-${id}`,
    search_count: 10,
    ar_displayed_name: null,
    fr_displayed_name: frNames[id] ?? `Praticien ${id}`,
    en_displayed_name: null,
    created_at: "2026-01-01T00:00:00.000000Z",
    updated_at: "2026-01-01T00:00:00.000000Z",
    category: "manualTherapies",
    description: shortDesc
      ? "Courte."
      : `<p>Description complète de la spécialité n\u00b0${id} pour le test de l\u2019adaptateur : elle doit dépasser la longueur minimum.</p>`,
    details: null,
    image_web: `https://api.wenaya.com/storage/uploads/${id}-web.png`,
    image_mobile: `https://api.wenaya.com/storage/uploads/${id}-mobile.png`,
    icon: null,
    is_visible: true,
    color: null,
    company_id: 1,
    locked: false,
    company_priority: id,
  };
}

function paginator(page, perPage, items, total) {
  const lastPage = Math.ceil(total / perPage) || 1;
  return {
    current_page: page,
    data: items,
    first_page_url: "http://127.0.0.1/api/v1/getAllPublicSpecialitiesWithPaginate?page=1",
    from: items.length ? (page - 1) * perPage + 1 : null,
    last_page: lastPage,
    last_page_url: `http://127.0.0.1/api/v1/getAllPublicSpecialitiesWithPaginate?page=${lastPage}`,
    links: [
      { url: null, label: "&laquo; Précédent", active: false },
      ...Array.from({ length: lastPage }, (_, i) => ({
        url: `http://127.0.0.1/api/v1/getAllPublicSpecialitiesWithPaginate?page=${i + 1}`,
        label: String(i + 1),
        active: page === i + 1,
      })),
      { url: null, label: "Suivant &raquo;", active: false },
    ],
    next_page_url:
      page < lastPage
        ? `http://127.0.0.1/api/v1/getAllPublicSpecialitiesWithPaginate?page=${page + 1}`
        : null,
    path: "http://127.0.0.1/api/v1/getAllPublicSpecialitiesWithPaginate",
    per_page: perPage,
    prev_page_url: page > 1 ? `http://127.0.0.1/api/v1/getAllPublicSpecialitiesWithPaginate?page=${page - 1}` : null,
    to: items.length ? (page - 1) * perPage + items.length : null,
    total,
  };
}

let server;
let baseUrl;
// Live modules (base = mock server) — loaded AFTER env is wired, in `before()`.
let client;
let practicesApi;
let adapter;
let pratiques;
let content;

// Child-process source for the fallback test. Cannot be a top-level template
// (OUT_DIR is derived at runtime) — built inside `before()`.
let FALLBACK_CHILD_SRC = "";

before(async () => {
  compile();

  server = createServer((req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    res.setHeader("X-Powered-By", "Yolo");

    const json = (status, body) => {
      res.statusCode = status;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(body));
    };

    if (url.pathname === "/api/v1/getAllPublicSpecialitiesWithPaginate") {
      const pageParam = Number.parseInt(url.searchParams.get("page") || "1", 10);
      const page = Math.max(1, Number.isFinite(pageParam) ? pageParam : 1);
      if (page === 4) return json(200, { error: true, message: "boom", data: null }); // error envelope
      if (page === 3) return json(200, { error: false, message: null, data: paginator(3, 12, [], 19) }); // out of range
      const isPage2 = page === 2;
      const items = LIVE_IDS.slice(isPage2 ? 12 : 0, isPage2 ? 19 : 12).map((id) =>
        makeSpeciality(id, { shortDesc: id === 26 })
      );
      return json(200, { error: false, message: null, data: paginator(page, 12, items, 19) });
    }

    if (url.pathname === "/api/v1/probe") {
      // Echo the request headers so the suite can assert Accept / no Authorization.
      json(200, {
        error: false,
        message: null,
        data: {
          accept: req.headers["accept"] ?? null,
          authorization: req.headers["authorization"] ?? null,
          cookie: req.headers["cookie"] ?? null,
        },
      });
      return;
    }

    if (url.pathname === "/api/v1/boom500") return json(500, { error: true, message: "kaboom", data: null });
    if (url.pathname === "/api/v1/badjson") {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end("this is <not>: json!");
      return;
    }
    if (url.pathname === "/api/v1/slow") {
      // Never respond — the client must abort via its timeout.
      return;
    }

    json(404, { error: true, message: "Not Found", data: null });
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  process.env.PRACTICES_API_URL = baseUrl;

  // Fresh module instances (cache-busted via query) reading the mock base.
  const stamp = `?live=${Date.now()}`;
  client = await import(pathToFileURL(join(OUT_DIR, "api", "client.js")).href + stamp);
  practicesApi = await import(pathToFileURL(join(OUT_DIR, "practices-api.js")).href + stamp);
  adapter = await import(pathToFileURL(join(OUT_DIR, "practice-adapter.js")).href + stamp);
  pratiques = await import(pathToFileURL(join(OUT_DIR, "pratiques.js")).href + stamp);
  content = await import(pathToFileURL(join(OUT_DIR, "practice-content.js")).href + stamp);

  const pratiquesJsPath = JSON.stringify(join(OUT_DIR, "pratiques.js"));
  FALLBACK_CHILD_SRC = `
    const pratiques = require(${pratiquesJsPath});
    (async () => {
      const p1 = await pratiques.getPracticesPageAsync({ page: 1 });
      const p2 = await pratiques.getPracticesPageAsync({ page: 2 });
      const filtered = await pratiques.getPracticesPageAsync({ category: "manualTherapies", page: 1 });
      process.stdout.write(JSON.stringify({ p1, p2, filtered }));
    })().catch((err) => {
      process.stderr.write(String(err && err.stack || err));
      process.exit(1);
    });
  `;
});

after(async () => {
  delete process.env.PRACTICES_API_URL;
  if (server) await new Promise((resolve) => server.close(resolve));
});

// ─── Shared client ─────────────────────────────────────────────

test("shared client: WENAYA_API_BASE reflects the env override", () => {
  assert.equal(client.WENAYA_API_BASE, baseUrl, "must read PRACTICES_API_URL");
  assert.equal(client.WENAYA_API_VERSION_PREFIX, "/api/v1");
});

test("shared client: rejects paths without the /api/v1 prefix", async () => {
  await assert.rejects(
    () => client.wenayaApiGet("nope"),
    (err) => err instanceof client.WenayaApiError && err.message.includes("/api/v1")
  );
  await assert.rejects(
    () => client.wenayaApiGet("/"),
    (err) => err instanceof client.WenayaApiError
  );
});

test("shared client: sends Accept JSON, no Authorization, no cookies", async () => {
  const res = await client.wenayaApiGet("/api/v1/probe");
  assert.equal(res.data.accept, "application/json");
  assert.equal(res.data.authorization, null);
  assert.equal(res.data.cookie, null);
});

test("shared client: 404/500 surface as typed WenayaApiError with status", async () => {
  await assert.rejects(
    () => client.wenayaApiGet("/api/v1/boom500"),
    (err) => err instanceof client.WenayaApiError && err.status === 500
  );
  await assert.rejects(
    () => client.wenayaApiGet("/api/v1/missing"),
    (err) => err instanceof client.WenayaApiError && err.status === 404
  );
});

test("shared client: non-JSON upstream is a WenayaApiError", async () => {
  await assert.rejects(
    () => client.wenayaApiGet("/api/v1/badjson"),
    (err) => err instanceof client.WenayaApiError && err.message.includes("non-JSON")
  );
});

test("shared client: timeout aborts a hung request", async () => {
  await assert.rejects(
    () => client.wenayaApiGet("/api/v1/slow", { timeoutMs: 120 }),
    (err) => err instanceof client.WenayaApiError && err.message.includes("aborted")
  );
});

// ─── Practices API layer ───────────────────────────────────────

test("practices-api: page 1 → 12 items, page 2 → 7, envelope typed", async () => {
  const p1 = await practicesApi.fetchSpecialitiesPage(1);
  assert.equal(p1.error, false);
  assert.equal(p1.data.total, 19);
  assert.equal(p1.data.current_page, 1);
  assert.equal(p1.data.last_page, 2);
  assert.equal(p1.data.per_page, 12);
  assert.equal(p1.data.data.length, 12);
  assert.equal(typeof p1.data.next_page_url, "string");

  const p2 = await practicesApi.fetchSpecialitiesPage(2);
  assert.equal(p2.data.current_page, 2);
  assert.equal(p2.data.data.length, 7);
  assert.equal(p2.data.next_page_url, null);
  assert.deepEqual(
    p1.data.data.map((s) => s.id),
    LIVE_IDS.slice(0, 12)
  );
  assert.deepEqual(
    p2.data.data.map((s) => s.id),
    LIVE_IDS.slice(12)
  );
});

test("practices-api: page clamps 0 and NaN to 1", async () => {
  const p0 = await practicesApi.fetchSpecialitiesPage(0);
  const pNeg = await practicesApi.fetchSpecialitiesPage(-3);
  const pNaN = await practicesApi.fetchSpecialitiesPage(Number.NaN);
  for (const res of [p0, pNeg, pNaN]) {
    assert.equal(res.data.current_page, 1);
    assert.equal(res.data.data.length, 12);
  }
});

test("practices-api: out-of-range page returns an empty data array gracefully", async () => {
  const p3 = await practicesApi.fetchSpecialitiesPage(3);
  assert.equal(p3.data.current_page, 3);
  assert.deepEqual(p3.data.data, []);
});

test("practices-api: error envelope is rejected by shape validation", async () => {
  await assert.rejects(
    () => practicesApi.fetchSpecialitiesPage(4),
    /Unexpected Wenaya practices API payload/
  );
});

test("practices-api: fetchAllSpecialities walks both pages, 19 unique items", async () => {
  const all = await practicesApi.fetchAllSpecialities();
  assert.equal(all.length, 19);
  assert.equal(new Set(all.map((s) => s.id)).size, 19);
});

// ─── Practice adapter ──────────────────────────────────────────

test("adapter: every live id maps to a canonical slug in SLUG_ORDER", async () => {
  const all = await practicesApi.fetchAllSpecialities();
  const slugs = all.map((raw) => adapter.normalizeApiSpeciality(raw, "fr")).filter(Boolean);
  const canonical = new Set(pratiques.getAllPratiqueSlugs());
  for (const p of slugs) assert.ok(canonical.has(p.slug), `unexpected slug ${p.slug}`);
  assert.equal(new Set(slugs.map((p) => p.slug)).size, 19, "slugs must be unique");
});

test("adapter: FR takes title/description from the API, EN stays local", async () => {
  const kine = LIVE_IDS.indexOf(4);
  const raw = (await practicesApi.fetchSpecialitiesPage(1)).data.data[kine];
  const fr = adapter.normalizeApiSpeciality(raw, "fr");
  assert.equal(fr.slug, "kinesitherapie");
  assert.equal(fr.title, "Kinésithérapie", "FR title comes from api.fr_name");
  assert.ok(fr.description.length >= 24, "FR description from api.description when long enough");
  assert.equal(fr.image, `https://api.wenaya.com/storage/uploads/4-web.png`, "image_web preferred");

  const en = adapter.normalizeApiSpeciality(raw, "en");
  const localEn = content.practicesContent.kinesitherapie.titles.en;
  assert.equal(en.title, localEn, "EN title stays local (never the French en_name)");
});

test("adapter: thin API description falls back to local summary", async () => {
  const raw = (await practicesApi.fetchSpecialitiesPage(2)).data.data.find((s) => s.id === 26);
  const fr = adapter.normalizeApiSpeciality(raw, "fr");
  assert.equal(fr.slug, "infirmerie");
  assert.equal(fr.description, content.practicesContent.infirmerie.summaries.fr);
});

test("adapter: unknown id is skipped (never mapped to a 404 route)", async () => {
  const unknown = {
    ...makeSpeciality(999),
    fr_name: "Spécialité inconnue",
  };
  assert.equal(adapter.normalizeApiSpeciality(unknown, "fr"), null);
});

// ─── Pratiques page layer (live + fallback) ────────────────────

test("pratiques: default listing page 1/2 via getPracticesPageAsync (api source)", async () => {
  const p1 = await pratiques.getPracticesPageAsync({ page: 1 });
  assert.equal(p1.dataSource, "api");
  assert.equal(p1.total, 19);
  assert.equal(p1.items.length, 12);
  assert.equal(p1.totalPages, 2);
  assert.equal(p1.hasMore, true);

  const p2 = await pratiques.getPracticesPageAsync({ page: 2 });
  assert.equal(p2.items.length, 7);
  assert.equal(p2.hasMore, false);
});

test("pratiques: category filter runs over the FULL dataset (api source)", async () => {
  const filtered = await pratiques.getPracticesPageAsync({ category: "mentalHealth", page: 1, pageSize: 50 });
  assert.equal(filtered.dataSource, "api");
  // mentalHealth categories exist in the local content map, not from raw API category,
  // so a filter over every mapped item should be stable regardless of mock category.
  assert.ok(filtered.items.length >= 1);
});

test("fallback: backend down → local fallback, same query answered", async () => {
  // Run in a CLEAN child process: the compiled CommonJS require cache would
  // otherwise keep the live base URL bound to the already-loaded modules, so a
  // re-import in this process is not enough to "point" the client at dead host.
  const child = spawnSync(
    process.execPath,
    ["-e", FALLBACK_CHILD_SRC],
    {
      cwd: ROOT,
      env: { ...process.env, PRACTICES_API_URL: "http://127.0.0.1:9" },
      encoding: "utf8",
    }
  );
  assert.equal(child.status, 0, `fallback child failed:\n${child.stdout}\n${child.stderr}`);
  const result = JSON.parse(child.stdout);
  assert.equal(result.p1.dataSource, "local-fallback");
  assert.equal(result.p1.total, 19);
  assert.equal(result.p1.items.length, 12);
  assert.equal(result.p1.hasMore, true);
  assert.equal(result.p2.dataSource, "local-fallback");
  assert.equal(result.p2.items.length, 7);
  assert.equal(result.filtered.dataSource, "local-fallback");
  assert.ok(result.filtered.items.length >= 1);
});
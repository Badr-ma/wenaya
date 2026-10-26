/**
 * Regression tests for the live group-session adapter
 * (`src/lib/group-sessions-active.ts` + `src/lib/group-sessions-api.ts`).
 *
 * These cover four confirmed defects only:
 *   1. Malformed / impossible `event_date` values were treated as
 *      today-or-future (lexicographic compare on a free-form string).
 *   2. `minPriceString` looked at EVERY child, including inactive/past slots,
 *      so an expired cheap slot could set the displayed price.
 *   3. A program row without a usable numeric id was coerced to `0`, producing
 *      the colliding identity `api-0`; children had the same problem.
 *   4. A malformed numeric HTML entity (`&#x110000;`, surrogate, etc.) made
 *      `String.fromCodePoint` throw and killed the whole mapping.
 *
 * The adapter swallows backend failures into `[]` outside production, so every
 * assertion inspects resolved session CONTENT — a thrown error would otherwise
 * masquerade as an empty (passing-looking) result.
 *
 * `WENAYA_API_URL` must be set before the first import: the API base URL is
 * memoized at module load.
 */
import { test } from "node:test";
import assert from "node:assert/strict";

process.env.WENAYA_API_URL = "https://api.test";

const { getActiveGroupSessions } = await import("@/lib/group-sessions-active");

// ─── Date helpers (durable across calendar dates) ───────────────────────

function isoOffset(days) {
  const now = new Date();
  const utc = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + days)
  );
  return utc.toISOString().slice(0, 10);
}

const FUTURE = isoOffset(30);
const PAST = isoOffset(-30);

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** A future year that is NOT a leap year -> `YYYY-02-29` is an invalid date. */
function futureNonLeapDate() {
  let year = new Date().getUTCFullYear() + 1;
  while (isLeapYear(year)) year += 1;
  return `${year}-02-29`;
}

// ─── Fixtures ───────────────────────────────────────────────────────────

function child(overrides = {}) {
  return {
    id: 1,
    title: "Slot",
    description: null,
    logo: null,
    parent: 269,
    nbr_of_participants: 0,
    capacity: 12,
    event_key: "WE-GROUP",
    event_slug: "slot",
    event_date: FUTURE,
    event_time: "18:00:00",
    event_status: "active",
    price: "200",
    firstUseprice: "0",
    duration: "60",
    ...overrides,
  };
}

function program(overrides = {}) {
  return {
    id: 269,
    title: "Jiu Jitsu Kids",
    description: null,
    logo: null,
    parent: null,
    nbr_of_participants: 0,
    capacity: 12,
    event_key: "WE-GROUP",
    event_slug: "parent",
    event_date: FUTURE,
    event_time: "18:00:00",
    event_status: "active",
    price: "100",
    firstUseprice: "0",
    duration: "60",
    professional: null,
    company: null,
    children: [],
    ...overrides,
  };
}

function paginator(programs) {
  return {
    error: false,
    message: "",
    data: {
      current_page: 1,
      last_page: 1,
      per_page: 50,
      total: programs.length,
      data: programs,
      links: [],
    },
  };
}

/** Install a single-page, always-200 fetch stub for the duration of a test. */
function stubFetch(t, payload) {
  t.mock.method(globalThis, "fetch", async () => {
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
}

// ─── 1. Invalid dates must not count as upcoming ────────────────────────

test("excludes impossible event_date values, keeps genuinely future slots", async (t) => {
  const nextYear = new Date().getUTCFullYear() + 1;
  stubFetch(
    t,
    paginator([
      program({
        id: 269,
        children: [
          child({ id: 1, event_date: "not-a-date" }),
          child({ id: 2, event_date: `${nextYear}-13-01` }),
          child({ id: 3, event_date: futureNonLeapDate() }),
          child({ id: 4, event_date: FUTURE, price: "200" }),
        ],
      }),
    ])
  );

  const sessions = await getActiveGroupSessions("fr");

  assert.equal(sessions.length, 1, "program with one valid slot must survive");
  const session = sessions[0];
  assert.deepEqual(
    session.live.slots.map((slot) => slot.id),
    [4],
    "only the valid future child is a bookable slot"
  );
  assert.equal(session.live.nextDate, FUTURE);
  assert.equal(session.live.price, "200");
});

// ─── 2. Price must only consider active, upcoming children ──────────────

test("min price ignores expired and inactive cheap slots", async (t) => {
  stubFetch(
    t,
    paginator([
      program({
        id: 269,
        price: "100",
        children: [
          child({ id: 1, event_status: "completed", price: "50" }),
          child({ id: 2, event_date: PAST, price: "40" }),
          child({ id: 3, event_date: FUTURE, price: "300" }),
        ],
      }),
    ])
  );

  const [session] = await getActiveGroupSessions("fr");

  assert.ok(session, "program must resolve");
  assert.equal(
    session.live.price,
    "300",
    "only the active future slot's price counts (old bug picked the past '40')"
  );
});

test("falls back to the parent price when no active child carries one", async (t) => {
  stubFetch(
    t,
    paginator([
      program({
        id: 269,
        price: "100",
        children: [child({ id: 1, price: "" })],
      }),
    ])
  );

  const [session] = await getActiveGroupSessions("fr");

  assert.ok(session, "program must resolve");
  assert.equal(session.live.price, "100");
});

// ─── 3. Malformed ids must be dropped, not coerced to 0 ─────────────────

test("drops a program row whose id is not numeric", async (t) => {
  stubFetch(
    t,
    paginator([
      program({ id: "abc", children: [child({ id: 1 })] }),
      program({ id: 922, title: "Group Training", children: [child({ id: 2 })] }),
    ])
  );

  const sessions = await getActiveGroupSessions("fr");

  assert.equal(sessions.length, 1, "invalid-id row must not become api-0");
  assert.equal(sessions[0].id, "api-922");
});

test("accepts a numeric string program id", async (t) => {
  stubFetch(
    t,
    paginator([
      program({ id: "922", title: "Group Training", children: [child({ id: 2 })] }),
    ])
  );

  const sessions = await getActiveGroupSessions("fr");

  assert.equal(sessions.length, 1);
  assert.equal(sessions[0].id, "api-922");
});

test("drops a child whose id is not numeric but keeps valid siblings", async (t) => {
  stubFetch(
    t,
    paginator([
      program({
        id: 269,
        children: [child({ id: "xyz" }), child({ id: 5, price: "200" })],
      }),
    ])
  );

  const [session] = await getActiveGroupSessions("fr");

  assert.ok(session, "program must resolve");
  assert.deepEqual(
    session.live.slots.map((slot) => slot.id),
    [5]
  );
});

// ─── 4. Malformed entities must not crash the mapping ───────────────────

test("malformed numeric entities are left literal instead of throwing", async (t) => {
  stubFetch(
    t,
    paginator([
      program({
        id: 269,
        // FR locale so the decoded backend body is used (EN swaps to the
        // approved one-liner and would hide the decode path).
        description:
          "<p>Valid &#233; and bad &#x110000; and &#99999999; and &#xD800;</p>",
        children: [child({ id: 1 })],
      }),
    ])
  );

  const sessions = await getActiveGroupSessions("fr");

  assert.equal(sessions.length, 1, "mapping must complete despite bad entities");
  const { description } = sessions[0];
  assert.ok(description.includes("Valid é"), "in-range entity still decodes");
  assert.ok(
    description.includes("&#x110000;"),
    "out-of-range code point preserved literally"
  );
  assert.ok(
    description.includes("&#99999999;"),
    "out-of-range decimal preserved literally"
  );
  assert.ok(
    description.includes("&#xD800;"),
    "surrogate code point preserved literally"
  );
});

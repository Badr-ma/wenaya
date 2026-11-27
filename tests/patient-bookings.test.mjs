import { mockHttp } from "./helpers/mock-http.mjs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizePatientBookings, upcomingGroupBookings } from "@/lib/patient-bookings";
import { readPatientBookings } from "@/lib/patient-bookings-server";

process.env.WENAYA_API_URL = "https://api.example.test";

test("upcoming groups use Casablanca time, exclude history and sort by start", () => {
  const items = [
    { id: "1", date: "2026-11-01", time: "23:00" },
    { id: "2", date: "2026-11-03", time: "10:00" },
    { id: "3", date: "2026-11-02", time: "10:00" },
    { id: "4", date: "2026-11-02", time: "12:00" },
    { id: "5", date: "", time: "" },
  ];
  assert.deepEqual(upcomingGroupBookings(items, new Date("2026-11-02T10:30:00Z")).map(x => x.id), ["4", "2"]);
});

test("upcoming groups scan later backend pages before filtering and paginating", async (t) => {
  const seen = [];
  mockHttp(t, async (url) => {
    seen.push(url);
    if (url.endsWith("/customer")) return Response.json({ data: { id: 7 } });
    const number = Number(new URL(url).searchParams.get("page"));
    return Response.json({ data: { current_page: number, last_page: 2, total: 2,
      data: [{ id: number, event_date: number === 1 ? "2000-01-01" : "2099-01-01", event_time: "10:00" }] } });
  });
  const result = await readPatientBookings("we_session=qa", "groups", 1, "upcoming");
  assert.equal(result.status, 200);
  assert.deepEqual(result.body.items.map(x => x.id), ["2"]);
  assert.equal(result.body.total, 1);
  assert.equal(result.body.totalPages, 1);
  assert.equal(seen.length, 3);
});
const row = { id: 8, booking_date: "2026-11-04", booking_time: "10:30:00", booking_status: "pending",
  professional: { first_name: "QA", last_name: "Professional", email: "private@example.test" },
  practice: { business: "QA clinic" }, patient: { email: "private@example.test" }, payment: { token: "secret" } };
const page = (rows) => ({ current_page: 1, last_page: 2, per_page: 10, total: 11, data: rows });
const appointmentResponse = (rows) => ({ error: false, data: { upcoming: page(rows), today: page([]), past: page([]) } });

test("individual appointments use the selected bucket and project only display fields", () => {
  const result = normalizePatientBookings(appointmentResponse([row]), "appointments", "upcoming");
  assert.equal(result.items[0].time, "10:30");
  assert.equal(result.items[0].professional, "QA Professional");
  assert.equal(result.items[0].location, "QA clinic");
  assert.equal(result.items[0].status, "pending");
  assert.ok(!JSON.stringify(result).includes("private@example.test"));
  assert.ok(!JSON.stringify(result).includes("secret"));
  assert.deepEqual(normalizePatientBookings(appointmentResponse([row]), "appointments", "past").items, []);
});

test("group registrations normalize their actual title, event date and event status", () => {
  const result = normalizePatientBookings({ error: false, data: page([{
    id: 4, title: "Group yoga", event_date: "2026-11-05", event_time: "17:00",
    event_status: "active", company: { name: "QA centre" }, professional: { first_name: "QA", last_name: "Coach" },
  }]) }, "groups", "upcoming");
  assert.equal(result.items[0].title, "Group yoga");
  assert.equal(result.items[0].date, "2026-11-05");
  assert.equal(result.items[0].status, "active");
});

test("invalid schemas fail rather than pretending there are no bookings", () => {
  assert.throws(() => normalizePatientBookings({ data: [] }, "appointments", "upcoming"));
  assert.throws(() => normalizePatientBookings({ data: page([{ id: "invalid" }]) }, "groups", "upcoming"));
});

test("a valid empty paginator is an empty success, while impossible dates are not displayed", () => {
  const empty = { current_page: 1, last_page: 1, total: 0, data: [] };
  assert.deepEqual(normalizePatientBookings({ data: empty }, "groups", "past").items, []);
  const result = normalizePatientBookings(appointmentResponse([{ ...row, booking_date: "2026-02-31", booking_time: "99:00" }]), "appointments", "upcoming");
  assert.equal(result.items[0].date, "");
  assert.equal(result.items[0].time, "");
});

test("an expired session is rejected before any booking list is requested", async (t) => {
  let calls = 0;
  mockHttp(t, async () => { calls++; return Response.json({}, { status: 401 }); });
  const result = await readPatientBookings("we_session=expired", "appointments", 1, "upcoming");
  assert.equal(result.status, 401);
  assert.equal(result.body.type, "unauthenticated");
  assert.equal(calls, 1);
});

test("authenticated reads forward the session without caching and use the backend spelling", async (t) => {
  const seen = [];
  mockHttp(t, async (url, init) => {
    seen.push({ url, init });
    return Response.json(seen.length === 1 ? { data: { id: 7 } } : appointmentResponse([row]));
  });
  const result = await readPatientBookings("we_session=qa", "appointments", 3, "upcoming");
  assert.equal(result.status, 200);
  assert.equal(result.body.items.length, 1);
  assert.ok(seen[1].url.endsWith("getAppointmentsByCustomer?page=3&pageType=upcomming"));
  for (const { init } of seen) {
    assert.equal(init.cache, "no-store");
    assert.equal(init.headers.get("Cookie"), "we_session=qa");
    assert.equal(init.method, "GET");
  }
});

test("an upstream group failure is an error, not an empty list", async (t) => {
  let calls = 0;
  mockHttp(t, async () => ++calls === 1
    ? Response.json({ data: { id: 7 } }) : Response.json({}, { status: 503 }));
  const result = await readPatientBookings("we_session=qa", "groups", 1, "upcoming");
  assert.equal(result.status, 502);
  assert.equal(result.body.type, "backend-error");
  assert.ok(!("items" in result.body));
});

test("responses stay scoped to the current session across consecutive requests", async (t) => {
  mockHttp(t, async (url, init) => {
    const id = init.headers.get("Cookie").includes("second") ? 22 : 11;
    return Response.json(url.endsWith("/customer") ? { data: { id } }
      : appointmentResponse([{ ...row, id }]));
  });
  const first = await readPatientBookings("we_session=first", "appointments", 1, "upcoming");
  const second = await readPatientBookings("we_session=second", "appointments", 1, "upcoming");
  assert.equal(first.body.items[0].id, "11");
  assert.equal(second.body.items[0].id, "22");
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { httpRequest } from "@/lib/http-request";

test("Axios preserves Next revalidation and native response status", async t => {
  t.mock.method(globalThis, "fetch", async (request, options) => {
    assert.equal(request.url, "https://wenaya.test/content");
    assert.equal(request.method, "GET");
    assert.deepEqual(options.next, { revalidate: 60 });
    return Response.json({ error: true }, { status: 422 });
  });

  const response = await httpRequest("https://wenaya.test/content", { next: { revalidate: 60 } });
  assert.equal(response.status, 422);
  assert.deepEqual(await response.json(), { error: true });
});

test("Axios preserves multipart boundaries, redirect policy and separate cookies", async t => {
  const first = "we_session=test; Path=/; HttpOnly";
  const second = "XSRF-TOKEN=test; Path=/";
  t.mock.method(globalThis, "fetch", async request => {
    assert.match(request.headers.get("content-type"), /^multipart\/form-data; boundary=/);
    assert.equal((await request.formData()).get("name"), "Example");
    assert.equal(request.redirect, "error");
    assert.equal(request.credentials, "same-origin");
    return new Response("ok", { headers: [["Set-Cookie", first], ["Set-Cookie", second]] });
  });

  const body = new FormData();
  body.set("name", "Example");
  const response = await httpRequest("https://wenaya.test/form", {
    method: "POST", body, redirect: "error", signal: new AbortController().signal,
  });
  assert.deepEqual(response.headers.getSetCookie(), [first, second]);
  assert.equal(await response.text(), "ok");
});

test("Axios forwards cancellation and preserves the abort reason", async t => {
  const controller = new AbortController();
  t.mock.method(globalThis, "fetch", async request => {
    controller.abort();
    assert.equal(request.signal.aborted, true);
    throw request.signal.reason;
  });

  await assert.rejects(
    httpRequest("https://wenaya.test/content", { signal: controller.signal }),
    { name: "AbortError" },
  );
});

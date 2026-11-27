import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import * as cookies from "@/lib/patient-auth/cookies";
import * as csrf from "@/lib/patient-auth/csrf";
import * as proxy from "@/lib/patient-profile-proxy";
import { mockHttp } from "./helpers/mock-http.mjs";

process.env.WENAYA_API_URL = "https://profiles.example.test";
const require = createRequire(import.meta.url);
const ts = require("typescript");
const { NextRequest, NextResponse } = require("next/server");
const source = readFileSync(new URL("../src/app/api/patient/profiles/route.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const modules = {
  "next/server": { NextResponse },
  "@/lib/patient-auth/cookies": cookies,
  "@/lib/patient-auth/csrf": csrf,
  "@/lib/patient-profile-proxy": proxy,
};
const context = { exports: {}, require: name => modules[name] };
runInNewContext(compiled, context);
const { POST } = context.exports;
const profile = {
  first_name: "Example", last_name: "Patient", birth_date: "2016-01-20",
  email: "example@example.test", phone_number: "600000000", country_code: "212",
  address: {}, legal_guardian_id: null, has_legal_guardian: true,
  parent_first_name: "Example Guardian",
};
const request = body => new NextRequest("http://localhost/api/patient/profiles", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

test("create profile preserves Jamal’s JSON shape for self and child profiles", async t => {
  const sent = [];
  mockHttp(t, async (url, init) => {
    assert.equal(url, "https://profiles.example.test/api/v1/createProfile");
    assert.equal(init.headers.get("content-type"), "application/json");
    assert.equal(init.headers.get("company"), "1");
    sent.push(JSON.parse(init.body));
    return Response.json({ error: false, message: "Saved" });
  });
  for (const profile_type of ["self", "child"]) {
    const response = await POST(request({ ...profile, profile_type }));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { success: true, message: "Saved" });
  }
  assert.deepEqual(sent[0], { ...profile, profile_type: "self" });
  const child = { ...profile };
  for (const field of ["email", "phone_number", "country_code"]) delete child[field];
  assert.deepEqual(sent[1], { ...child, profile_type: "child" });
});

test("create profile returns both Laravel validation and legacy field errors", async t => {
  const fields = { first_name: ["Required"] };
  const replies = [
    Response.json({ errors: fields }, { status: 422 }),
    Response.json({ error: true, message: fields }),
    new Response("unexpected HTML"),
  ];
  mockHttp(t, async () => replies.shift());
  const self = () => request({ ...profile, profile_type: "self" });
  for (const status of [422, 502]) {
    const response = await POST(self());
    assert.equal(response.status, status);
    assert.deepEqual((await response.json()).fields, fields);
  }
  const malformed = await POST(self());
  assert.equal(malformed.status, 502);
  assert.equal((await malformed.json()).success, false);
});

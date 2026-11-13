import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const { NextResponse } = require('next/server');
const source = fs.readFileSync(new URL('../src/app/api/professionals/waiting-list/route.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function route(upstream) {
  const context = { exports: {}, AbortSignal, setTimeout, clearTimeout, fetch: upstream,
    require(name) {
      if (name === 'next/server') return { NextResponse };
      if (name === '@/lib/professionals/config') return { getProfessionalsApiBase: () => 'https://booking.example.test' };
      throw new Error('Unexpected test dependency: ' + name);
    },
  };
  vm.runInNewContext(compiled, context);
  return context.exports.POST;
}
const payload = { customer_name: 'Synthetic Test', customer_email: 'synthetic@example.test', customer_phone: '+212600000000', user_id: 42, booking_date: '2026-11-20', booking_time: '09:00', notes: 'Local mocked test; never transmitted.' };
const request = body => new Request('http://localhost/api/professionals/waiting-list', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('invalid appointment requests never reach the upstream API', async () => {
  let calls = 0;
  const post = route(async () => { calls++; return Response.json({ error: false }); });
  const response = await post(request({}));
  assert.equal(response.status, 400);
  assert.equal(calls, 0);
});

test('HTTP 200 with an explicit backend failure cannot acknowledge a booking request', async () => {
  for (const result of [{ error: true }, { success: false }]) {
    const response = await route(async () => Response.json(result))(request(payload));
    assert.equal(response.status, 502);
    assert.equal((await response.json()).success, false);
  }
});

test('an accepted request stays pending and preserves the backend contract', async () => {
  let sent;
  const response = await route(async (_url, init) => {
    sent = JSON.parse(init.body);
    assert.equal(init.headers.company, '1');
    return Response.json({ error: false });
  })(request(payload));
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(sent.status, 'pending');
  assert.equal(sent.user_id, payload.user_id);
  assert.equal(sent.booking_date, payload.booking_date);
  assert.equal(sent.booking_time, payload.booking_time);
});

test('network failure is returned as a retryable error rather than success', async () => {
  const response = await route(async () => { throw new TypeError('Synthetic network failure'); })(request(payload));
  assert.equal(response.status, 502);
  assert.equal((await response.json()).success, false);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trackConversion } from '@/lib/analytics';

function browser(t, consent, gtag) {
  const values = {
    window: { gtag },
    localStorage: { getItem: () => consent },
    location: { origin: 'https://wenaya.example.test', pathname: '/professional/private-example', search: '?email=private@example.test' },
  };
  for (const [key, value] of Object.entries(values)) {
    const previous = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
    t.after(() => previous ? Object.defineProperty(globalThis, key, previous) : delete globalThis[key]);
  }
}

test('conversion events are suppressed without explicit analytics consent', (t) => {
  const events = [];
  browser(t, 'declined', (...args) => events.push(args));
  trackConversion('booking_request_received');
  assert.deepEqual(events, []);
});

test('approved conversion events do not include profile paths, query strings or form contents', (t) => {
  const events = [];
  browser(t, 'accepted', (...args) => events.push(args));
  trackConversion('quote_request_received');
  assert.equal(events.length, 1);
  assert.equal(events[0][0], 'event');
  assert.equal(events[0][1], 'quote_request_received');
  assert.equal(events[0][2].page_location, 'https://wenaya.example.test');
  assert.doesNotMatch(JSON.stringify(events), /private-example|private@example|\?email/);
});

test('an unavailable analytics client cannot break a successful request journey', (t) => {
  browser(t, 'accepted', () => { throw new Error('analytics unavailable'); });
  assert.doesNotThrow(() => trackConversion('booking_request_received'));
});

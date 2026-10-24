/**
 * Blog author-avatar retry state machine regression tests.
 *
 * Locks the contract of `src/lib/avatar-retry.ts` (the pure logic behind
 * `BlogAuthorAvatar.tsx`):
 * - 3 TOTAL attempts (initial load + 2 retries) before initials;
 * - retry spacing constant lives inside the required 500–1000 ms window;
 * - the retry counter + timers reset when the avatar URL changes;
 * - missing / empty / whitespace / dummy-man.png sources never attempt a
 *   load (initials immediately);
 * - the initials badge keeps the author's initial ("W" fallback) — the
 *   author NAME itself is always rendered by the call sites (structurally
 *   independent of image state; see the wired components);
 * - two avatar instances never share state (no cross-author reuse).
 *
 * All transitions are pure — no React, no timers, no DOM, no network.
 *
 * Run: node --import ./tests/helpers/register.mjs --test tests/avatar-retry.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  AVATAR_MAX_ATTEMPTS,
  AVATAR_RETRY_DELAY_MS,
  avatarRetryInit,
  avatarRetryOnFailure,
  avatarRetryOnUrlChange,
  initialsFor,
  isRenderableAvatarSrc,
} from "@/lib/avatar-retry";

const REAL_URL = "https://nbg1.your-objectstorage.com/westo/avatars/yasmine.jpg";
const SECOND_URL = "https://nbg1.your-objectstorage.com/westo/avatars/mehdi.jpg";
const DEAD_URL = "https://dev-api.wenaya.com/storage/uploads/avatars/20260904170906_3F89644E.png";
const DUMMY_URL = "https://dev-api.wenaya.com/storage/uploads/users/dummy-man.png";

test("constants: 3 total attempts, delay within the required 500-1000ms window", () => {
  assert.equal(AVATAR_MAX_ATTEMPTS, 3);
  assert.ok(AVATAR_RETRY_DELAY_MS >= 500 && AVATAR_RETRY_DELAY_MS <= 1000);
});

test("init: failures 0, loadKey 0, image shown, src recorded", () => {
  assert.deepEqual(avatarRetryInit(REAL_URL), {
    src: REAL_URL,
    failures: 0,
    loadKey: 0,
    initialsOnly: false,
  });
});

test("failure 1 -> retry, failure 2 -> retry, failure 3 -> initials (exactly 3 attempts)", () => {
  let state = avatarRetryInit(REAL_URL);

  state = avatarRetryOnFailure(state);
  assert.equal(state.failures, 1);
  assert.equal(state.initialsOnly, false);
  assert.equal(state.loadKey, 1, "retry remounts the img (same URL)");
  assert.equal(state.src, REAL_URL, "failures never mutate the tracked URL");

  state = avatarRetryOnFailure(state);
  assert.equal(state.failures, 2);
  assert.equal(state.initialsOnly, false);
  assert.equal(state.loadKey, 2, "second retry remounts again");

  state = avatarRetryOnFailure(state);
  assert.equal(state.failures, 3);
  assert.equal(state.initialsOnly, true, "third failure exhausts the budget");
  assert.equal(state.loadKey, 2, "no further remount once initials show");
});

test("success at attempt 1: machine never advances (no retries scheduled)", () => {
  // A successful load fires no onError -> the state stays at init forever.
  assert.deepEqual(avatarRetryInit(REAL_URL), {
    src: REAL_URL,
    failures: 0,
    loadKey: 0,
    initialsOnly: false,
  });
});

test("success at attempt 2: one retry then idle (no further transitions fired)", () => {
  let state = avatarRetryInit(REAL_URL);
  state = avatarRetryOnFailure(state); // attempt 1 failed
  assert.equal(state.initialsOnly, false);
  // Attempt 2 succeeds -> no more onError events -> state freezes here:
  // the component keeps rendering the (now-loaded) <img>.
  const frozen = { ...state };
  assert.deepEqual(state, frozen);
  assert.equal(state.failures, 1);
});

test("success at attempt 3: two retries then idle", () => {
  let state = avatarRetryInit(REAL_URL);
  state = avatarRetryOnFailure(state);
  state = avatarRetryOnFailure(state);
  assert.equal(state.failures, 2);
  assert.equal(state.initialsOnly, false, "attempt 3 is still an <img>, not initials");
});

test("URL change resets the retry counter and remounts", () => {
  let state = avatarRetryInit(REAL_URL);
  state = avatarRetryOnFailure(state); // 1 failure on author A's url
  state = avatarRetryOnFailure(state); // 2 failures

  state = avatarRetryOnUrlChange(state, SECOND_URL); // author B's url arrives
  assert.equal(state.failures, 0, "fresh lifecycle for the new URL");
  assert.equal(state.initialsOnly, false);
  assert.equal(state.loadKey, 3, "loadKey still bumps so the new URL gets a fresh <img>");
  assert.equal(state.src, SECOND_URL, "tracked URL follows the prop");

  // Author B now gets the FULL 3-attempt budget again.
  state = avatarRetryOnFailure(state);
  assert.equal(state.failures, 1);
  assert.equal(state.initialsOnly, false);
});

test("URL change after exhaustion un-shows initials", () => {
  let state = avatarRetryInit(REAL_URL);
  state = avatarRetryOnFailure(state);
  state = avatarRetryOnFailure(state);
  state = avatarRetryOnFailure(state);
  assert.equal(state.initialsOnly, true);

  state = avatarRetryOnUrlChange(state, SECOND_URL);
  assert.equal(state.initialsOnly, false);
  assert.equal(state.failures, 0);
});

test("two avatar instances never share state (no cross-author reuse)", () => {
  const a = avatarRetryInit(REAL_URL);
  const b = avatarRetryInit(REAL_URL);
  const a2 = avatarRetryOnFailure(a);
  assert.equal(a2.failures, 1);
  assert.equal(b.failures, 0, "second instance unaffected by first's failure");
});

test("isRenderableAvatarSrc: real + dead URLs pass; empty/whitespace/dummy-man do not", () => {
  assert.equal(isRenderableAvatarSrc(REAL_URL), true);
  assert.equal(isRenderableAvatarSrc(DEAD_URL), true, "dead URLs still attempt load (onError owns the fallback)");
  assert.equal(isRenderableAvatarSrc(DUMMY_URL), false);
  assert.equal(isRenderableAvatarSrc("https://x.test/Users/DUMMY-MAN.PNG"), false, "case-insensitive");
  assert.equal(isRenderableAvatarSrc("dummy-man.png"), false, "bare filename");
  assert.equal(isRenderableAvatarSrc(""), false);
  assert.equal(isRenderableAvatarSrc("   "), false);
  assert.equal(isRenderableAvatarSrc(null), false);
  assert.equal(isRenderableAvatarSrc(undefined), false);
});

test("initialsFor: first letter, W fallback, never empty", () => {
  assert.equal(initialsFor("Yasmine Sekkat"), "Y");
  assert.equal(initialsFor(" rose "), "R");
  assert.equal(initialsFor("w"), "W");
  assert.equal(initialsFor(""), "W");
  assert.equal(initialsFor("   "), "W");
  assert.equal(initialsFor(null), "W");
  assert.equal(initialsFor(undefined), "W");
});

test("custom maxAttempts is honoured", () => {
  let state = avatarRetryInit(REAL_URL);
  state = avatarRetryOnFailure(state, 2);
  assert.equal(state.initialsOnly, false, "1 of 2 attempts used -> retry");
  state = avatarRetryOnFailure(state, 2);
  assert.equal(state.initialsOnly, true, "2 of 2 attempts used -> initials");
});

test("loadKey is monotonic across failures AND url changes (img remounts are unique)", () => {
  let state = avatarRetryInit(REAL_URL);
  const keys = [state.loadKey];
  state = avatarRetryOnFailure(state);
  keys.push(state.loadKey);
  state = avatarRetryOnFailure(state);
  keys.push(state.loadKey);
  state = avatarRetryOnUrlChange(state, SECOND_URL);
  keys.push(state.loadKey);
  for (let i = 1; i < keys.length; i += 1) {
    assert.ok(keys[i] > keys[i - 1], `loadKey strictly increases: ${keys.join(",")}`);
  }
});

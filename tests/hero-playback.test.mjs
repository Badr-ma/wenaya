import { test } from "node:test";
import assert from "node:assert/strict";
import { isRecoverableHeroPlaybackError, prepareHeroVideo, playHeroVideo } from "@/lib/hero-playback";

function video() {
  return {
    src: null, muted: false, defaultMuted: false, playsInline: false,
    paused: true, ended: false, currentTime: 8, loads: 0, plays: 0,
    getAttribute(name) { return this[name]; },
    load() { this.loads++; },
    play() { this.plays++; return Promise.resolve(); },
  };
}

test("autoplay policy and interrupted play promises do not blacklist healthy clips", () => {
  assert.equal(isRecoverableHeroPlaybackError(new DOMException("blocked", "NotAllowedError")), true);
  assert.equal(isRecoverableHeroPlaybackError(new DOMException("paused", "AbortError")), true);
  assert.equal(isRecoverableHeroPlaybackError(new DOMException("codec", "NotSupportedError")), false);
});

test("source is attached only when prepared, with iPhone inline/muted flags set", () => {
  const v = video();
  assert.equal(v.src, null);
  prepareHeroVideo(v, "/hero.mp4");
  assert.equal(v.src, "/hero.mp4");
  assert.equal(v.loads, 1);
  assert.equal(v.muted && v.defaultMuted && v.playsInline, true);
});

test("buffering an already prepared next clip does not repeatedly reload it", () => {
  const v = video();
  for (let i = 0; i < 5; i++) prepareHeroVideo(v, "/hero.mp4");
  assert.equal(v.loads, 1);
});

test("a rejected autoplay can be retried on a later user gesture", async () => {
  const v = video();
  v.play = function () {
    this.plays++;
    return this.plays === 1
      ? Promise.reject(new DOMException("blocked", "NotAllowedError"))
      : Promise.resolve();
  };
  await assert.rejects(playHeroVideo(v, "/hero.mp4"), { name: "NotAllowedError" });
  await playHeroVideo(v, "/hero.mp4");
  assert.equal(v.plays, 2);
  assert.equal(v.loads, 1);
});

test("an ended last playable clip restarts instead of remaining frozen", async () => {
  const v = video();
  v.ended = true;
  await playHeroVideo(v, "/hero.mp4");
  assert.equal(v.currentTime, 0);
  assert.equal(v.plays, 1);
});

test("gesture/visibility retries do not interrupt a video already playing", async () => {
  const v = video();
  v.paused = false;
  await playHeroVideo(v, "/hero.mp4");
  assert.equal(v.plays, 0);
});

test("a synchronous browser play rejection follows the same recovery path", async () => {
  const v = video();
  v.play = () => { throw new DOMException("blocked", "NotAllowedError"); };
  await assert.rejects(playHeroVideo(v, "/hero.mp4"), { name: "NotAllowedError" });
});

/**
 * Blog author-avatar sanitization regression tests (FR + EN renderers).
 *
 * Locks the contract of `normalizeAvatar` inside `toAuthor()`
 * (src/lib/blog-mappers.ts):
 * - real objectstorage avatar URLs pass through unchanged;
 * - the backend's "no real avatar" placeholder (…/users/dummy-man.png,
 *   case-insensitive) maps to "" so renderers show initials, never a
 *   generic stock face;
 * - empty / whitespace-only / null avatar map to "";
 * - creator null → author undefined;
 * - author name/id always preserved when avatar is stripped;
 * - toDetailPost applies the same sanitization as toFeedPost;
 * - toClientPost (listing contract) attaches no author at all.
 *
 * Run: node --import ./tests/helpers/register.mjs --test tests/blog-mappers-avatar.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { toFeedPost, toDetailPost, toClientPost } from "@/lib/blog-mappers";

/** Backend fixtures — mirrors verified API data (2026-09-23 audit). */
const REAL_AVATAR = "https://nbg1.your-objectstorage.com/westo/business_logos/2026/02/16/699336f14c21a.jpg";
const DEAD_AVATAR = "https://dev-api.wenaya.com/storage/uploads/avatars/20260904170906_3F89644E.png";
const DUMMY_AVATAR = "https://dev-api.wenaya.com/storage/uploads/users/dummy-man.png";

function makeCreator(overrides = {}) {
  return {
    id: 42,
    firstName: "Yasmine",
    lastName: "Sekkat",
    avatar: REAL_AVATAR,
    slug: "yasmine-sekkat",
    ...overrides,
  };
}

function makeSummary(overrides = {}) {
  return {
    id: 1,
    slug: "test-article",
    title: "Article de test",
    description: "Extrait de test",
    image: "https://example.com/image.jpg",
    thumbnail: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: null,
    locked: false,
    creator: makeCreator(),
    ...overrides,
  };
}

test("real objectstorage avatar passes through unchanged", () => {
  const post = toFeedPost(makeSummary());
  assert.equal(post.author.avatar, REAL_AVATAR);
  assert.equal(post.author.name, "Yasmine Sekkat");
});

test("dummy-man.png sentinel maps to empty avatar (case-insensitive)", () => {
  const lower = toFeedPost(makeSummary({ creator: makeCreator({ avatar: DUMMY_AVATAR }) }));
  assert.equal(lower.author.avatar, "");
  assert.equal(lower.author.name, "Yasmine Sekkat");

  const upper = toFeedPost(
    makeSummary({ creator: makeCreator({ avatar: "https://X.test/AVATARS/DUMMY-MAN.PNG?v=1" }) })
  );
  assert.equal(upper.author.avatar, "");
});

test("empty, whitespace-only, and null avatars map to empty string", () => {
  assert.equal(toFeedPost(makeSummary({ creator: makeCreator({ avatar: "" }) })).author.avatar, "");
  assert.equal(toFeedPost(makeSummary({ creator: makeCreator({ avatar: "   " }) })).author.avatar, "");
  assert.equal(toFeedPost(makeSummary({ creator: makeCreator({ avatar: null }) })).author.avatar, "");
});

test("dead-but-real avatar URL passes through (renderers catch via onError)", () => {
  const post = toFeedPost(
    makeSummary({ creator: makeCreator({ avatar: DEAD_AVATAR, firstName: "Wenaya", lastName: "Clinic" }) })
  );
  assert.equal(post.author.avatar, DEAD_AVATAR);
  assert.equal(post.author.name, "Wenaya Clinic");
});

test("creator null → author undefined, authorId empty", () => {
  const post = toFeedPost(makeSummary({ creator: null }));
  assert.equal(post.author, undefined);
  assert.equal(post.authorId, "");
});

test("author name and id preserved when avatar is stripped", () => {
  const post = toFeedPost(
    makeSummary({ creator: makeCreator({ avatar: DUMMY_AVATAR, firstName: "Rose", lastName: "Mavoungou", id: 159 }) })
  );
  assert.equal(post.author.name, "Rose Mavoungou");
  assert.equal(post.author.id, "159");
  assert.equal(post.author.avatar, "");
});

test("toDetailPost applies the same sanitization", () => {
  const detail = makeSummary({ creator: makeCreator({ avatar: DUMMY_AVATAR }), details: "<p>Body</p>" });
  const post = toDetailPost(detail);
  assert.equal(post.author.avatar, "");
  assert.equal(post.author.name, "Yasmine Sekkat");
  assert.equal(post.content, "<p>Body</p>");
});

test("toClientPost (listing) attaches no author — contract unchanged", () => {
  const post = toClientPost(makeSummary());
  assert.equal(post.author, undefined);
});

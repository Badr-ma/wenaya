import { test } from "node:test";
import assert from "node:assert/strict";

const {
  fetchBlogPosts,
  homepageBlogFeedReducer,
  initialHomepageBlogFeedState,
} = await import("@/lib/homepage-blog-feed");

test("homepage blog: initial failure enters error state and retry can load posts", async () => {
  let state = initialHomepageBlogFeedState;
  state = homepageBlogFeedReducer(state, { type: "start", requestId: 1 });

  await assert.rejects(
    fetchBlogPosts("fr", "home", async () => new Response("unavailable", { status: 503 })),
    /unavailable/
  );
  state = homepageBlogFeedReducer(state, { type: "failure", requestId: 1 });
  assert.equal(state.status, "error");

  state = homepageBlogFeedReducer(state, { type: "start", requestId: 2 });
  const posts = [{ slug: "live-article", title: "Live article" }];
  const retriedPosts = await fetchBlogPosts(
    "fr",
    "home",
    async (_input, init) => {
      assert.equal(init.cache, "no-store");
      return Response.json({ data: posts });
    }
  );
  state = homepageBlogFeedReducer(state, { type: "success", requestId: 2, posts: retriedPosts });
  assert.equal(state.status, "ready");
  assert.deepEqual(state.posts, posts);
});

test("homepage blog: valid empty feed is ready, not an error", async () => {
  const posts = await fetchBlogPosts("en", "home", async () => Response.json({ data: [] }));
  const state = homepageBlogFeedReducer(initialHomepageBlogFeedState, {
    type: "success",
    requestId: 1,
    posts,
  });
  assert.equal(state.status, "ready");
  assert.deepEqual(state.posts, []);
});

test("article listing retry requests the complete listing view", async () => {
  let requestedUrl = "";
  const posts = await fetchBlogPosts("en", "listing", async (url) => {
    requestedUrl = String(url);
    return Response.json({ data: [] });
  });
  assert.match(requestedUrl, /view=listing/);
  assert.deepEqual(posts, []);
});

test("homepage blog: an older overlapping response cannot replace newer state", () => {
  const newer = homepageBlogFeedReducer(initialHomepageBlogFeedState, {
    type: "success",
    requestId: 2,
    posts: [{ slug: "newer", title: "Newer" }],
  });
  const afterOldResponse = homepageBlogFeedReducer(newer, {
    type: "success",
    requestId: 1,
    posts: [{ slug: "older", title: "Older" }],
  });
  assert.equal(afterOldResponse, newer);
});

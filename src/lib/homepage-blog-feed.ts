import type { PostWithAuthor } from "./blog-utils";

export type HomepageBlogFeedState = {
  status: "loading" | "ready" | "error";
  posts: PostWithAuthor[];
  requestId: number;
};

export type HomepageBlogFeedAction =
  | { type: "start"; requestId: number }
  | { type: "success"; requestId: number; posts: PostWithAuthor[] }
  | { type: "failure"; requestId: number };

export const initialHomepageBlogFeedState: HomepageBlogFeedState = {
  status: "loading",
  posts: [],
  requestId: 0,
};

/** Ignore late responses from an earlier locale request or retry. */
export function homepageBlogFeedReducer(
  state: HomepageBlogFeedState,
  action: HomepageBlogFeedAction
): HomepageBlogFeedState {
  if (action.requestId < state.requestId) return state;

  if (action.type === "start") {
    return { status: "loading", posts: [], requestId: action.requestId };
  }
  if (action.type === "success") {
    return { status: "ready", posts: action.posts, requestId: action.requestId };
  }
  return { status: "error", posts: [], requestId: action.requestId };
}

/** Fetch the homepage feed through its same-origin route; failures stay errors. */
export async function fetchBlogPosts(
  locale: string,
  view: "home" | "listing" = "home",
  fetcher: typeof fetch = fetch
): Promise<PostWithAuthor[]> {
  const query = new URLSearchParams({ locale });
  if (view === "listing") query.set("view", "listing");
  const response = await fetcher(`/api/blog/posts?${query.toString()}`, {
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Homepage blog feed unavailable");

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== "object" || !Array.isArray((payload as { data?: unknown }).data)) {
    throw new Error("Unexpected homepage blog feed response");
  }
  return (payload as { data: PostWithAuthor[] }).data;
}

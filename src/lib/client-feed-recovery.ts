import type { PaginatedPratiques } from "@/lib/pratiques";

/** Decide whether an empty server-rendered feed needs one client refresh. */
export function shouldRecoverInitialFeed(itemCount: number, initialLoadError: boolean): boolean {
  return initialLoadError || itemCount === 0;
}

/** Validate the exact paginated response returned by `/api/pratiques`. */
export function isPaginatedPracticesPayload(value: unknown): value is PaginatedPratiques {
  if (!value || typeof value !== "object") return false;
  const payload = value as Record<string, unknown>;
  return (
    Array.isArray(payload.items) &&
    typeof payload.total === "number" &&
    typeof payload.page === "number" &&
    typeof payload.pageSize === "number" &&
    typeof payload.totalPages === "number" &&
    typeof payload.hasMore === "boolean" &&
    payload.dataSource === "api" &&
    typeof payload.loadError === "boolean"
  );
}

/** Fetch and validate a same-origin JSON payload without allowing a malformed or
 * failed response to masquerade as a successful empty feed. */
export async function fetchClientFeedPayload<T>(
  url: string,
  isPayload: (value: unknown) => value is T,
): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Feed request failed (${response.status})`);

  const payload: unknown = await response.json();
  if (!isPayload(payload)) throw new Error("Feed response has an unexpected shape");
  return payload;
}

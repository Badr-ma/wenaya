/**
 * Shared admin API fetch — authenticated requests against the admin API with a
 * Bearer token. Byte-identical original implementations lived in
 * `app/(fr)/admin/page.tsx` and `components/admin/HomepageEditor.tsx`.
 */
export async function apiFetch(url: string, token: string, init?: RequestInit) {
  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
}
import { httpRequest } from "@/lib/http-request";
/**
 * Shared admin API fetch — authenticated requests against the admin API with a
 * Bearer token. Byte-identical original implementations lived in
 * `app/(fr)/admin/page.tsx` and `components/admin/HomepageEditor.tsx`.
 */
export async function apiFetch(url: string, token: string, init?: RequestInit) {
  return httpRequest(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "User-Agent": "wenaya-website/1.0 (+https://www.wenaya.com)",
      ...init?.headers,
    },
  });
}
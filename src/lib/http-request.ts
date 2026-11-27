import axios, { AxiosHeaders } from "axios";

type RequestOptions = RequestInit & { next?: { revalidate?: number | false; tags?: string[] } };

// Resolve the platform transport when sending so Next.js can apply its data
// cache on the server. Rebuilding a Response from the Axios stream preserves
// cookie headers and callers' existing HTTP status and body handling.
const transport = (input: RequestInfo | URL, options?: RequestInit) =>
  globalThis.fetch(input, options);

function createClient() {
  return axios.create({
    adapter: "fetch",
    env: { fetch: transport },
    responseType: "stream",
    validateStatus: () => true,
    transformRequest: [(body: unknown) => body],
    transformResponse: [(response: unknown) => response],
    withXSRFToken: false,
  });
}

const browserClient = createClient();
const serverClient = createClient();

export async function httpRequest(input: string | URL, options: RequestOptions = {}): Promise<Response> {
  const { body, headers, method, signal, credentials, ...fetchOptions } = options;
  const requestHeaders = new AxiosHeaders();
  new Headers(headers).forEach((value, key) => requestHeaders.set(key, value));
  // The original requests rely on native content-type detection for FormData.
  if (!requestHeaders.has("Content-Type")) requestHeaders.set("Content-Type", false);
  if (!requestHeaders.has("Accept")) requestHeaders.set("Accept", false);

  const browser = typeof window !== "undefined";
  const url = globalThis.location ? new URL(input, globalThis.location.href).href : String(input);
  try {
    const result = await (browser ? browserClient : serverClient).request<ReadableStream<Uint8Array> | null>({
      url,
      data: body ?? undefined,
      headers: requestHeaders,
      method: method ?? "GET",
      signal: signal ?? undefined,
      // The fetch adapter also accepts Fetch credential modes at runtime.
      withCredentials: (credentials ?? "same-origin") as unknown as boolean,
      fetchOptions,
    });
    const responseHeaders = new Headers();
    for (const [name, value] of Object.entries(result.headers)) {
      for (const entry of Array.isArray(value) ? value : [value]) {
        if (entry != null && entry !== false) responseHeaders.append(name, String(entry));
      }
    }
    return new Response(result.data, {
      status: result.status,
      statusText: result.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    // Preserve the error classes that existing retry and timeout logic uses.
    if (signal?.aborted) throw signal.reason;
    if (axios.isAxiosError(error) && error.cause instanceof Error) throw error.cause;
    throw error;
  }
}

/** Mock the platform transport underneath Axios while asserting the outbound request. */
export function mockHttp(t, handler) {
  t.mock.method(globalThis, "fetch", async (request, options) => {
    const url = new URL(request.url);
    const input = url.origin === "http://localhost" ? url.pathname + url.search : url.href;
    return handler(input, {
      ...options,
      method: request.method,
      headers: request.headers,
      cache: request.cache,
      signal: request.signal,
      body: request.body ? await request.text() : undefined,
    });
  });
}

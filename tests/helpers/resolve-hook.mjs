// Custom ESM resolution hook for running node:test against the Next.js
// TypeScript source tree without a build step:
//
//   1. Maps the tsconfig `@/*` alias (`@/lib/x` → `src/lib/x`) onto file: URLs.
//   2. Probes extensionless relative imports (`./api/client`) with `.ts` and
//      `/index.ts` — Node's stock ESM resolver requires exact specifiers.
//
// Type-only imports (`import type …`) never reach resolution (amaro strips
// them during the load phase), so value-graph-only probing is sufficient.
// Node 24 strips erasable TS syntax natively, so returned `.ts` URLs load.
import { existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

/** `src/` root — this file lives at `tests/helpers/`, two levels down. */
const SRC_ROOT = new URL("../../src/", import.meta.url);

/** Tries `base`, `base.ts`, `base/index.ts`; returns the first real file URL. */
function probe(baseURL) {
  const candidates = [
    baseURL,
    new URL(baseURL.href + ".ts", baseURL),
    new URL(baseURL.href + "/index.ts", baseURL),
  ];
  for (const candidate of candidates) {
    let path;
    try {
      path = fileURLToPath(candidate);
    } catch {
      continue;
    }
    try {
      if (existsSync(path) && statSync(path).isFile()) return candidate.href;
    } catch {
      // unreadable candidate — keep probing
    }
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const url = probe(new URL(specifier.slice(2), SRC_ROOT));
    if (url) return { url, shortCircuit: true };
    return nextResolve(specifier, context);
  }

  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL) {
    try {
      return await nextResolve(specifier, context);
    } catch {
      const url = probe(new URL(specifier, context.parentURL));
      if (url) return { url, shortCircuit: true };
      throw new Error(
        `resolve-hook: cannot resolve "${specifier}" from ${context.parentURL}`
      );
    }
  }

  return nextResolve(specifier, context);
}

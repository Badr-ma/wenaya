# Wenaya

French-first (FR/EN) wellness clinic website — Next.js App Router, TypeScript, Tailwind CSS.

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
```

## Scripts

- `npm run dev` — start the development server
- `npm run build` — production build (static pre-render where possible)
- `npm run start` — serve the production build (`next start`)
- `npm run lint` — ESLint (`eslint`)

## Routing

- `/` — homepage (French), `/en` — English mirror
- `/pratiques[/slug]` — practices catalogue + detail pages
- `/seance-de-groupe[/slug]` — group sessions + detail pages
- `/professional[/slug]` — specialists + detail pages
- `/produits[/slug]`, `/panier`, `/checkout` — product (shop) pages
- `/about`, `/corporate`, `/blog`, `/articles` + their `/en` mirrors
- `/admin` — internal content management interface

## Environment variables

Names only — see `src/app/api`, `src/lib/*` and `.env.example` expectations for usage.

Required for production:

- `ADMIN_SECRET` — HMAC secret used to sign/verify the admin auth token. **Required**; admin auth fails loudly when missing (no fallback value).

Required for CMS/admin data persistence (`getRedis`):

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

Optional:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL (defaults to `https://www.wenaya.com`)
- `PRACTICES_API_URL` — backend overrides the default practices API host
- `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GSC_VERIFICATION`, `NEXT_PUBLIC_BING_VERIFICATION` — analytics/search-console hooks
- `ADMIN_SEED_USERNAME`, `ADMIN_SEED_PASSWORD`, `ADMIN_SEED_NAME` — used by the `src/scripts/seed-admin.ts` user-seeding script

## Data sources

- **Practices** — sourced from the live Wenaya backend API (`GET /api/v1/getAllPublicSpecialitiesWithPaginate`), with a local fallback dataset when the API is unreachable. Detail slugs remain canonical ASCII.
- **Blog** — filesystem-backed MDX content (`src/lib/blog`).
- **Specialists** — local/demo dataset (`src/lib/specialistes.ts`); booking is frontdoor-only for now.
- **Contact forms** — stub endpoint (`/api/contact`) with no backend transport yet.
- **Patient sign-in** (`/login`) — presentation-only; submit is disabled by design until a real patient-auth backend exists.

## Product status

- **Content management (CMS)** — FUTURE product workstream. The homepage currently renders through the active CMS pipeline (`getHomepagePublished` → `HomepageRenderer`); `/admin` exposes an internal editor. Re-architecting/removing this wiring is tracked separately.
- **Shop (`/produits`, `/panier`, `/checkout`)** — FUTURE product workstream. Product data is a local adapter; checkout is a placement page awaiting real payment integration. Presentation can be refined, but shop architecture changes are tracked separately.
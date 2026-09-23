/**
 * Compte (FR) — patient account page. Thin server page rendering the shared
 * CompteClient (compte.* i18n, same BFF seam as login). noindex/noFollow from
 * the co-located layout.tsx.
 *
 * devFallback (DEV/QUALITY ONLY): whether the account UI may render the
 * clearly-labelled DEV mock PatientProfile when `/api/account/profile` answers
 * `unauthenticated` because the upstream DEV session is blocked. Armed by
 * `PROFILE_DEV_FALLBACK=true` AND `NODE_ENV !== "production"` — the flag is
 * compile-time inlined, so a production build always passes false and the mock
 * module is never imported in production.
 */
import CompteClient from "@/components/compte/CompteClient";
import { PROFILE_DEV_FALLBACK_ENABLED } from "@/lib/patient-auth/profile-dev-fallback";

export const dynamic = "force-static";

export default function ComptePage() {
  return <CompteClient devFallback={PROFILE_DEV_FALLBACK_ENABLED} />;
}

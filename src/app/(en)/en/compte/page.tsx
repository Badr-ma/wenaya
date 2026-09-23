/**
 * Compte (EN) — patient account page (English route /en/compte).
 * Thin server shell rendering the shared CompteClient (i18n-driven, same
 * seam as login). Metadata is provided by the co-located layout.tsx.
 *
 * devFallback is DEV/QUALITY ONLY (see the FR page doc) — production builds
 * always pass false, so the mock is never importable at runtime in prod.
 */
import CompteClient from "@/components/compte/CompteClient";
import { PROFILE_DEV_FALLBACK_ENABLED } from "@/lib/patient-auth/profile-dev-fallback";

export const dynamic = "force-static";

export default function ComptePage() {
  return <CompteClient devFallback={PROFILE_DEV_FALLBACK_ENABLED} />;
}

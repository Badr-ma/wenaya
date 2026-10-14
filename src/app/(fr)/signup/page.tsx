/**
 * Signup Page — patient account creation. Renders the shared SignupClient
 * component (i18n-driven). Metadata is provided by the co-located layout.tsx.
 *
 * `?returnTo=` resumes an interrupted flow (e.g. the group-session booking panel
 * carries the chosen slot in the query); `SignupClient` validates it and only
 * navigates to same-origin internal paths. Rendering the search params makes this
 * route dynamic by design.
 */
import SignupClient from "@/components/login/SignupClient";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SignupRoute({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = sp.returnTo;
  return <SignupClient returnTo={Array.isArray(raw) ? raw[0] : raw} />;
}

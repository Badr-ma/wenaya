/**
 * English Login Page — patient sign-in (EN locale).
 * Renders the shared LoginClient component (i18n-driven).
 * Metadata is provided by the co-located layout.tsx.
 *
 * `?returnTo=` resumes an interrupted flow (e.g. the group-session booking panel
 * carries the chosen slot in the query); `LoginClient` validates it and only
 * navigates to same-origin internal paths. Rendering the search params makes this
 * route dynamic by design.
 */
import LoginClient from "@/components/login/LoginClient";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EnglishLoginRoute({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = sp.returnTo;
  return <LoginClient returnTo={Array.isArray(raw) ? raw[0] : raw} />;
}

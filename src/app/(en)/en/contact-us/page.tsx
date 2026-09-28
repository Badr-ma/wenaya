/**
 * English Contact Page — renders the shared ContactPage component (i18n-driven).
 * Metadata is provided by the co-located layout.tsx.
 * When the URL carries `type=booking` (the nav Réserver CTA target), the page
 * renders in booking mode: booking-specific header, category select, details
 * field and submit/success copy.
 * When the URL carries `service` (a group-session CTA target), the session is
 * resolved server-side — editorial slug OR `api-{id}` live program — and the
 * title forwarded so the form can recognise the session.
 */
import ContactPage from "@/components/contact/ContactPage";
import { resolveRequestedSession } from "@/lib/group-sessions-active";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EnglishContactRoute({ searchParams }: Props) {
  const sp = await searchParams;
  const type = Array.isArray(sp.type) ? sp.type[0] : sp.type;
  const service = Array.isArray(sp.service) ? sp.service[0] : sp.service;
  const requestedSession = await resolveRequestedSession(service, "en");
  return <ContactPage isBooking={type === "booking"} requestedSession={requestedSession} />;
}
/**
 * English Contact Page — renders the shared ContactPage component (i18n-driven).
 * Metadata is provided by the co-located layout.tsx.
 * When the URL carries `type=booking` (the nav Réserver CTA target), the page
 * renders in booking mode: booking-specific header, category select, details
 * field and submit/success copy.
 */
import ContactPage from "@/components/contact/ContactPage";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EnglishContactRoute({ searchParams }: Props) {
  const sp = await searchParams;
  const type = Array.isArray(sp.type) ? sp.type[0] : sp.type;
  return <ContactPage isBooking={type === "booking"} />;
}
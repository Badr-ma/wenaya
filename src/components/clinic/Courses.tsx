/**
 * Clinic Courses — group session discovery section for the Clinic/B2C page.
 *
 * Server component: fetches the real session data, collapses each description
 * to a single-line teaser, resolves locale-aware detail paths, and passes a
 * serializable list to the `SessionsExplorer` client interaction layer.
 *
 * The section header + global "all sessions" CTA remain server-rendered;
 * session names and their links are present in the initial HTML (SEO intact).
 */
import Link from "next/link";
import { getActiveGroupSessions } from "@/lib/group-sessions-active";
import { type GroupSessionLocale } from "@/lib/group-sessions";
import { groupSessionsHref, type HrefLocale } from "@/lib/href";
import { getTranslations } from "@/i18n";
import SessionsExplorer, { type SessionItem } from "./SessionsExplorer";

/** Collapse a session description to a single concise sentence. */
function explorerTeaser(desc: string): string {
  if (!desc) return desc;
  const trimmed = desc.trim().replace(/\s+/g, " ");
  const match = trimmed.match(/^(.*?[.!?])(\s|$)/);
  let one = (match ? match[1] : trimmed).trim();
  if (one.length > 120) one = one.slice(0, 120).trim().replace(/[.,;:]+$/, "") + "…";
  return one;
}

export default async function ClinicCourses({
  locale,
  lang,
}: {
  locale: HrefLocale;
  lang: string;
}): Promise<React.JSX.Element> {
  const { t } = getTranslations(lang);
  const all = await getActiveGroupSessions(locale as GroupSessionLocale);

  const items: SessionItem[] = all.map((s) => {
    // Live programmes render the interactive booking panel (`id="booking"`) on
    // their detail page, so "Book Now" deep-links straight to it. Editorial
    // sessions have no panel: "Book Now" opens the detail page itself, whose
    // hero / CTA hand off to the session-preserving booking flow.
    const hasBookingPanel = Boolean(s.live && s.live.slots.length > 0);
    return {
      slug: s.slug,
      title: s.title,
      type: s.typeLabel,
      summary: explorerTeaser(s.description),
      location: s.location.title,
      image: s.image,
      href: s.path,
      bookingHref: hasBookingPanel ? `${s.path}#booking` : s.path,
    };
  });

  return (
    <section className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 sm:pb-12 lg:pb-16">
          <div>
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              {t("clinic.courses.badge")}
            </span>
            <h2
              className="heading-serif text-[#0B1220] leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 3.6vw, 3rem)" }}
            >
              {t("clinic.courses.heading1")}
              <br />
              {t("clinic.courses.heading2")}
            </h2>
          </div>
          <Link
            href={groupSessionsHref(locale)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] group whitespace-nowrap"
          >
            <span className="underline underline-offset-8 decoration-[#B88A5A]/40 group-hover:decoration-[#B88A5A] transition-colors">
              {t("clinic.courses.cta")}
            </span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#B88A5A]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="py-12 sm:py-14">
            <p className="max-w-xl text-sm sm:text-[15px] leading-relaxed text-[#2B2F36]/60">
              {t("clinic.courses.empty")}
            </p>
          </div>
        ) : (
          <SessionsExplorer
            sessions={items}
            ctaDetail={t("clinic.courses.ctaDetail")}
            bookNow={t("clinic.courses.bookNow")}
            bookNowAria={t("clinic.courses.bookNowAria")}
            exploreAria={t("clinic.courses.exploreAria")}
            galleryLabel={t("clinic.courses.galleryLabel")}
            prevLabel={t("clinic.courses.prev")}
            nextLabel={t("clinic.courses.next")}
          />
        )}
      </div>
    </section>
  );
}
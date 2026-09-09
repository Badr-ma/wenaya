/**
 * "Continuer à explorer" — two related care-journey cards before the footer.
 * Editorial portrait cards (image on top, label + teaser, arrow link). Only
 * real journeys are ever shown (resolved by the parent from related-slug
 * config); links go straight to the journey detail pages via the canonical
 * locale-aware helper. Presentation only.
 */
import Image from "next/image";

export interface RelatedJourney {
  slug: string;
  title: string;
  teaser: string;
  href: string;
  heroImage: string;
}

export default function RelatedJourneys({
  continueExploring,
  heading,
  exploreLabel,
  items,
}: {
  continueExploring: string;
  heading: string;
  exploreLabel: string;
  items: RelatedJourney[];
}) {
  if (items.length === 0) return null;

  return (
    <section data-section-bg="light" className="bg-[#FAF8F4] py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-10">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B88A5A]">
          {continueExploring}
        </span>
        <h2 className="heading-serif text-[#0B1220] leading-tight mt-4 text-[clamp(1.8rem,3vw,2.75rem)]">
          {heading}
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {items.map((j) => (
            <a
              key={j.slug}
              href={j.href}
              className="group block rounded-[24px] bg-white ring-1 ring-[#0B1220]/[0.06] transition-all duration-300 hover:-translate-y-1 hover:ring-[#B88A5A]/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B88A5A]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-[24px] bg-[#0B1220]">
                <Image
                  src={j.heroImage}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  loading="lazy"
                />
              </div>
              <div className="p-6 sm:p-7">
                <h3 className="heading-serif text-[#0B1220] text-xl sm:text-2xl leading-snug">
                  {j.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-[#0B1220]/60">
                  {j.teaser}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#B88A5A] underline decoration-[#B88A5A]/40 underline-offset-4 transition-colors group-hover:decoration-[#B88A5A]">
                  {exploreLabel}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
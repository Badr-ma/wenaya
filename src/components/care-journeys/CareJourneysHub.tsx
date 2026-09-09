/**
 * Care Journeys hub — /parcours-de-soins (+ /en/parcours-de-soins).
 * Editorial grid of the 7 care pathways, driven by the care-journeys data module.
 * Copy mirrors the live hub verbatim (incl. the EN page, which serves the same
 * French copy under EN chrome).
 */
import Link from "next/link";
import { getCareJourneysForHub, PARCOURS_DE_SOINS_HUB } from "@/lib/care-journeys";

interface Props {
  locale: "fr" | "en";
}

export default function CareJourneysHub({ locale }: Props) {
  const journeys = getCareJourneysForHub(locale);

  return (
    <section data-section-bg="light" className="bg-[#F2EFE9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <header className="max-w-3xl">
          <h1 className="heading-serif text-[clamp(2.4rem,5vw,4.2rem)] text-[#0B1220] leading-[1.04] tracking-[-0.015em]">
            {PARCOURS_DE_SOINS_HUB.heading}
          </h1>
          <p className="mt-5 text-lg text-[#0B1220]/70 leading-relaxed max-w-2xl">
            {PARCOURS_DE_SOINS_HUB.supporting}
          </p>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 lg:mt-14">
          {journeys.map((j) => (
            <Link
              key={j.slug}
              href={j.href}
              className="group flex flex-col bg-[#FAF8F4] border border-[#0B1220]/[0.06] rounded-[20px] p-7 transition-colors duration-300 hover:border-[#B88A5A]/50"
            >
              <span className="text-[11px] uppercase tracking-[0.14em] text-[#B88A5A]">
                {j.hubLabel}
              </span>
              <h2 className="heading-serif text-[#0B1220] text-xl sm:text-2xl leading-tight mt-3 line-clamp-2 transition-colors duration-300 group-hover:text-[#B88A5A]">
                {j.title}
              </h2>
              <p className="mt-3 text-sm text-[#0B1220]/60 leading-relaxed line-clamp-3 flex-1">
                {j.hubTeaser}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#0B1220] transition-colors duration-300 group-hover:text-[#B88A5A]">
                Lire la suite
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
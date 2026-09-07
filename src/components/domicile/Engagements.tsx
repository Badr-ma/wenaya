/**
 * Homecare Engagements — "Nos engagements envers les familles"
 * Server component. Exact 4 check items presented as a calm editorial grid.
 */
import HomecareSectionHeading from "./HomecareSectionHeading";

const items = [
  "Professionnalisme et certifications des intervenants",
  "Communication claire avec les aidants",
  "Respect, dignité et confidentialité",
  "Évaluation et ajustement continu des soins",
];

export default function HomecareEngagements(): React.JSX.Element {
  return (
    <section className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="max-w-3xl">
          <HomecareSectionHeading eyebrow="Nos promesses" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.9rem)" }}>
            Nos engagements envers les familles
          </HomecareSectionHeading>
        </div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8 border-t border-[#0B1220]/10 pt-10">
          {items.map((i) => (
            <div key={i} className="flex items-start gap-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#B88A5A]/12">
                <svg
                  className="w-4 h-4 text-[#B88A5A]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-[#0B1220]/75 text-base lg:text-lg leading-relaxed">
                {i}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

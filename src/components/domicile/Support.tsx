/**
 * Homecare Support — "Support professionnel disponible 24h/24 à Casablanca"
 * Server component. Navy band. Exact intro + 3 check items.
 */
import HomecareSectionHeading from "./HomecareSectionHeading";

const items = [
  "une ligne de contact dédiée 24h/24",
  "une coordination continue entre intervenants",
  "une adaptation rapide selon l'évolution du patient",
];

export default function HomecareSupport(): React.JSX.Element {
  return (
    <section
      data-section-bg="dark"
      className="relative bg-[#0B1220] px-6 sm:px-10"
    >
      <div className="max-w-7xl mx-auto py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-6">
            <HomecareSectionHeading variant="dark" eyebrow="Disponibilité" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.9rem)" }}>
              Support professionnel disponible 24h/24 à Casablanca
            </HomecareSectionHeading>
            <p className="mt-5 text-white/70 text-base lg:text-lg leading-relaxed">
              Nos équipes assurent&nbsp;:
            </p>
          </div>
          <ul className="lg:col-span-5 lg:col-start-8 space-y-5">
            {items.map((i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#B88A5A]/15">
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
                <span className="text-white/80 text-base lg:text-lg leading-relaxed">
                  {i}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

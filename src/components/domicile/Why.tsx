/**
 * Homecare Why — "Pourquoi travailler avec Wenaya Homecare Services ?"
 * Server component. Exact 5 checkmark items from the live page, presented as
 * a calm editorial two-column checklist (navy heading, bronze checks). No cards.
 */
import HomecareSectionHeading from "./HomecareSectionHeading";

const items = [
  "Stabilité de l'état de santé du patient",
  "Réduction des complications post-hospitalières",
  "Suivi structuré, coordonné et continu",
  "Sérénité et soutien pour les familles",
  "Accès à des professionnels expérimentés et supervisés",
];

export default function HomecareWhy(): React.JSX.Element {
  return (
    <section className="relative bg-[#FAF8F4] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <HomecareSectionHeading eyebrow="Nos atouts" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.8rem)" }}>
              Pourquoi travailler avec Wenaya Homecare Services&nbsp;?
            </HomecareSectionHeading>
          </div>
          <ul className="lg:col-span-7 space-y-5">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-4">
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
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

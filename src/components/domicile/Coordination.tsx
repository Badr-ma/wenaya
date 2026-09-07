/**
 * Homecare Coordination — "Coordination avec Wenaya Clinic"
 * Server component. Ivory section, editorial, exact paragraph + CTA to /about.
 */
import Link from "next/link";
import HomecareSectionHeading from "./HomecareSectionHeading";

export default function HomecareCoordination(): React.JSX.Element {
  return (
    <section className="relative bg-[#FAF8F4] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <HomecareSectionHeading eyebrow="En lien avec la clinique" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.9rem)" }}>
              Coordination avec Wenaya Clinic
            </HomecareSectionHeading>
            <p className="mt-5 text-[#0B1220]/70 text-base lg:text-lg leading-relaxed max-w-2xl">
              Notre lien avec Wenaya Clinic garantit une cohérence entre les
              soins à domicile et les suivis cliniques spécialisés. Cela permet
              une prise en charge globale et mieux structurée.
            </p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] group whitespace-nowrap"
            >
              <span className="underline underline-offset-8 decoration-[#B88A5A]/40 group-hover:decoration-[#B88A5A] transition-colors">
                Découvrir Wenaya Clinic
              </span>
              <svg
                className="w-4 h-4 text-[#B88A5A] transition-transform group-hover:translate-x-1"
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
        </div>
      </div>
    </section>
  );
}

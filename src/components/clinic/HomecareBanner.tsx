/**
 * Clinic Homecare Banner — promotional entry point for Soins à domicile on /about.
 *
 * A single, tasteful editorial band (not duplicating the Homecare page): it
 * introduces Wenaya Homecare Services using exact copy from the live
 * /soins-a-domicile source, and links to the full page. FR only (the EN about is
 * not extended — the source homecare page is FR-only). Placement: after the
 * care/services/health-needs section and before Recruitment.
 */
import Link from "next/link";
import Image from "next/image";

export default function ClinicHomecareBanner(): React.JSX.Element {
  return (
    <section className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-t-[24px]">
              <Image
                src="/domicile/Infirmerie.jpg"
                alt="Soins à domicile Wenaya"
                width={1600}
                height={900}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.24em] uppercase block mb-6">
              Garde malade &amp; infirmier à domicile
            </span>
            <h2
              className="heading-serif text-[#0B1220] leading-[1.08]"
              style={{ fontSize: "clamp(1.7rem, 3vw, 2.6rem)" }}
            >
              Une prise en charge coordonnée, humaine et sécurisée pour vos
              proches
            </h2>
            <p className="mt-5 text-[#0B1220]/70 text-base lg:text-lg leading-relaxed max-w-xl">
              Chez Wenaya Homecare Services, nous accompagnons les familles à
              Casablanca en proposant des services de garde malade et de soins
              infirmiers à domicile adaptés à chaque situation médicale et
              familiale.
            </p>
            <div className="mt-8">
              <Link
                href="/soins-a-domicile"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B1220] group whitespace-nowrap"
              >
                <span className="underline underline-offset-8 decoration-[#B88A5A]/40 group-hover:decoration-[#B88A5A] transition-colors">
                  Découvrir les soins à domicile
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
      </div>
    </section>
  );
}

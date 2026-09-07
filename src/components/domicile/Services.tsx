/**
 * Homecare Services — "Nos services de soins et d'accompagnement à domicile"
 * Server component. Exact 6 service names + descriptions from the live page,
 * presented as a calm editorial two-column atlas. The lead line is preserved.
 */
import Image from "next/image";
import HomecareSectionHeading from "./HomecareSectionHeading";

const services = [
  {
    name: "Garde malade à domicile",
    desc: "Présence continue et assuré de soins",
  },
  {
    name: "Soins infirmiers à domicile",
    desc: "Suivi médical complet",
  },
  {
    name: "Garde post-hospitalisation",
    desc: "Continuité des soins après une hospitalisation",
  },
  {
    name: "Surveillance de nuit",
    desc: "Prévention des incidents nocturnes",
  },
  {
    name: "Accompagnement des personnes âgées",
    desc: "Assistance et maintien de l'autonomie",
  },
  {
    name: "Suivi patients chroniques",
    desc: "Surveillance périodique adaptée",
  },
];

export default function HomecareServices(): React.JSX.Element {
  return (
    <section className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="max-w-3xl">
          <HomecareSectionHeading eyebrow="Nos services" style={{ fontSize: "clamp(1.9rem, 3.4vw, 3rem)" }}>
            Nos services de soins et d&apos;accompagnement à domicile à Casablanca
          </HomecareSectionHeading>
          <p className="mt-5 text-[#0B1220]/70 text-base lg:text-lg leading-relaxed">
            Nous proposons des prises en charge personnalisées incluant&nbsp;:
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 border-t border-[#0B1220]/10 pt-10">
          {services.map((s) => (
            <div key={s.name} className="border-l-2 border-[#B88A5A]/40 pl-6">
              <h3
                className="heading-serif text-[#0B1220] leading-tight"
                style={{ fontSize: "clamp(1.25rem, 1.8vw, 1.75rem)" }}
              >
                {s.name}
              </h3>
              <p className="mt-2 text-[#0B1220]/65 text-base leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 lg:mt-16">
          <div className="relative overflow-hidden rounded-t-[24px]">
            <Image
              src="/domicile/Soins-Infirmiers-min.jpeg"
              alt="Infirmiers à domicile"
              width={1600}
              height={1067}
              sizes="(max-width: 1024px) 100vw, 100vw"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

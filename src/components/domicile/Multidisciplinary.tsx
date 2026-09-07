/**
 * Homecare Multidisciplinary — "Prise en charge pluridisciplinaire à domicile"
 * Server component. Exact intro + 4 disciplines. Editorial: heading + image,
 * disciplines as a paired list. No cards.
 */
import Image from "next/image";
import HomecareSectionHeading from "./HomecareSectionHeading";

const disciplines = [
  { name: "Kinésithérapeutes à domicile", desc: "rééducation fonctionnelle" },
  { name: "Orthophonistes", desc: "troubles du langage et de la déglutition" },
  { name: "Psychologues", desc: "soutien cognitif et émotionnel" },
  { name: "Médecins", desc: "consultations et suivi médical" },
];

export default function HomecareMultidisciplinary(): React.JSX.Element {
  return (
    <section className="relative bg-[#FAF8F4] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <HomecareSectionHeading eyebrow="Une équipe complète" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.9rem)" }}>
              Prise en charge pluridisciplinaire à domicile
            </HomecareSectionHeading>
            <p className="mt-5 text-[#0B1220]/70 text-base lg:text-lg leading-relaxed">
              Selon les besoins cliniques identifiés, nous organisons des visites
              à domicile avec&nbsp;:
            </p>
            <div className="mt-8 relative overflow-hidden rounded-t-[24px]">
              <Image
                src="/domicile/pluridisciplinaire-min.jpeg"
                alt="Prise en charge pluridisciplinaire à domicile"
                width={1600}
                height={900}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="space-y-8 border-t border-[#0B1220]/10 pt-8">
              {disciplines.map((d) => (
                <li key={d.name} className="border-l-2 border-[#B88A5A]/40 pl-6">
                  <h3
                    className="heading-serif text-[#0B1220] leading-tight"
                    style={{ fontSize: "clamp(1.2rem, 1.7vw, 1.6rem)" }}
                  >
                    {d.name}
                  </h3>
                  <p className="mt-2 text-[#0B1220]/65 text-base leading-relaxed">
                    {d.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Homecare Material — "Matériel médical et consommables proposés à Casablanca"
 * Server component. Exact intro + 4 bullet items + closing sentence. Editorial
 * checklist beside the material image. No cards.
 */
import Image from "next/image";
import HomecareSectionHeading from "./HomecareSectionHeading";

const items = [
  "Lits médicalisés ajustables",
  "Aides à la mobilité (fauteuils roulants, déambulateurs)",
  "Dispositifs de surveillance (tensiomètres, oxymètres)",
  "Pansements stériles, gants, désinfectants, seringues et protections jetables",
];

export default function HomecareMaterial(): React.JSX.Element {
  return (
    <section className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-6">
            <HomecareSectionHeading eyebrow="Équipement" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.9rem)" }}>
              Matériel médical et consommables proposés à Casablanca
            </HomecareSectionHeading>
            <p className="mt-5 text-[#0B1220]/70 text-base lg:text-lg leading-relaxed">
              Nous proposons, sur demande et après évaluation, des équipements
              médicaux et des consommables adaptés à l&apos;hospitalisation à
              domicile, tels que&nbsp;:
            </p>
            <ul className="mt-6 space-y-3">
              {items.map((i) => (
                <li key={i} className="flex items-start gap-3 text-[#0B1220]/75 text-base lg:text-lg leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B88A5A]"
                  />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[#0B1220]/55 text-sm sm:text-base leading-relaxed">
              La sélection se fait via la visite d&apos;évaluation pour garantir
              un matériel adapté à la situation du patient.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <div className="relative overflow-hidden rounded-t-[24px]">
              <Image
                src="/domicile/materiel-medical-a-domicile-min.jpg"
                alt="Matériel médical à domicile"
                width={1408}
                height={768}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

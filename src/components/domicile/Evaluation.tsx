/**
 * Homecare Evaluation — "Évaluation initiale à domicile – clé de notre prise en charge"
 * Server component. Exact intro + 4 bullets, presented as a single distinctive
 * assessment callout (bronze rule, calm list). No cards.
 */
import HomecareSectionHeading from "./HomecareSectionHeading";

const points = [
  "constater l'état de santé réel",
  "déterminer le type d'infirmier ou d'équipe nécessaire",
  "préconiser d'autres professionnels si besoin",
  "adapter la prise en charge au fil du temps",
];

export default function HomecareEvaluation(): React.JSX.Element {
  return (
    <section className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-6">
            <HomecareSectionHeading eyebrow="Notre méthode" style={{ fontSize: "clamp(1.8rem, 3.2vw, 2.9rem)" }}>
              Évaluation initiale à domicile – clé de notre prise en charge
            </HomecareSectionHeading>
          </div>
          <div className="lg:col-span-6">
            <p className="text-[#0B1220]/70 text-base lg:text-lg leading-relaxed">
              Toute intervention débute par une visite d&apos;évaluation à
              domicile réalisée par notre chef d&apos;équipe infirmier. Cette
              visite permet de&nbsp;:
            </p>
            <ul className="mt-6 space-y-3 border-l-2 border-[#B88A5A] pl-6">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[#0B1220]/75 text-base lg:text-lg leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#B88A5A]"
                  />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

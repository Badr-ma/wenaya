/**
 * Homecare Nursing Levels — "Nos infirmiers à domicile : deux niveaux d'expertise"
 * Server component. Navy statement band. Exact 2 items + descriptions.
 */
import HomecareSectionHeading from "./HomecareSectionHeading";

const levels = [
  {
    name: "Accompagnement du quotidien",
    desc: "Les gardes-malades accompagnent les gestes de la vie quotidienne et le confort. Les actes infirmiers relèvent de professionnels qualifiés, selon leurs compétences et les prescriptions applicables.",
  },
  {
    name: "Soins infirmiers à domicile",
    desc: "Les soins techniques sont organisés après évaluation du besoin, avec un infirmier disposant des qualifications adaptées. Les actes et modalités sont précisés avant toute intervention.",
  },
];

export default function HomecareNursingLevels(): React.JSX.Element {
  return (
    <section
      data-section-bg="dark"
      className="relative bg-[#0B1220] px-6 sm:px-10"
    >
      <div className="max-w-7xl mx-auto py-16 lg:py-24">
        <div className="max-w-3xl">
          <HomecareSectionHeading variant="dark" eyebrow="Nos infirmiers" style={{ fontSize: "clamp(1.9rem, 3.4vw, 3rem)" }}>
            À domicile&nbsp;: des rôles complémentaires
          </HomecareSectionHeading>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10 gap-y-12">
          {levels.map((l) => (
            <div key={l.name} className="border-t border-white/12 pt-6">
              <h3
                className="heading-serif text-white leading-tight"
                style={{ fontSize: "clamp(1.25rem, 1.8vw, 1.7rem)" }}
              >
                {l.name}
              </h3>
              <p className="mt-3 text-white/70 text-base lg:text-lg leading-relaxed">
                {l.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

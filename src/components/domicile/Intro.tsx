/**
 * Homecare Intro — calm editorial welcome for /soins-a-domicile.
 * Server component. Exact live copy, no interaction.
 */
import HomecareSectionHeading from "./HomecareSectionHeading";

export default function HomecareIntro(): React.JSX.Element {
  return (
    <section className="relative bg-[#F2EFE9] px-6 sm:px-10">
      <div className="max-w-7xl mx-auto py-14 lg:py-20">
        <div className="max-w-3xl">
          <HomecareSectionHeading eyebrow="Wenaya Homecare Services" style={{ fontSize: "clamp(1.9rem, 3.4vw, 3rem)" }}>
            Une prise en charge structurée pour le bien-être de vos proches
          </HomecareSectionHeading>
          <p className="mt-6 text-[#0B1220]/70 text-base lg:text-lg leading-relaxed max-w-2xl">
            Chez Wenaya Homecare Services, nous accompagnons les familles à
            Casablanca en proposant des services de garde malade et de soins
            infirmiers à domicile adaptés à chaque situation médicale et familiale.
          </p>
        </div>
      </div>
    </section>
  );
}

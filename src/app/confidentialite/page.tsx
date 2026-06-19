import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Wenaya",
  description: "Politique de confidentialité de Wenaya — comment nous collectons, utilisons et protégeons vos données personnelles.",
  alternates: { canonical: "https://www.wenaya.com/confidentialite" },
};

export default function ConfidentialitePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-[#F2EFE9] pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">Légal</span>
          </div>

          <h1 className="text-[#0B1220] font-heading text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.06] tracking-tight mb-10">
            Politique de Confidentialité
          </h1>

          <div className="space-y-8 text-[#2B2F36]/70 text-sm leading-relaxed">
            <Section title="1. Introduction">
              Wenaya attache une grande importance à la protection de vos données personnelles.
              La présente politique vous informe de la manière dont nous collectons, utilisons et protégeons vos informations
              lorsque vous utilisez notre site web et nos services.
            </Section>

            <Section title="2. Données collectées">
              Nous collectons les données suivantes : nom, prénom, adresse email, numéro de téléphone,
              informations de santé que vous nous communiquez volontairement lors de la prise de rendez-vous
              ou de l&apos;utilisation de nos services, ainsi que des données de navigation (cookies, pages visitées).
            </Section>

            <Section title="3. Finalités du traitement">
              Vos données sont utilisées pour : la gestion des rendez-vous, le suivi de votre parcours de soins,
              la communication de informations pertinentes sur nos services, l&apos;amélioration de notre plateforme,
              et le respect de nos obligations légales et réglementaires.
            </Section>

            <Section title="4. Base légale">
              Le traitement de vos données repose sur votre consentement explicite, l&apos;exécution d&apos;un contrat
              (prise de rendez-vous, prestation de soins), et le respect d&apos;obligations légales (conservation des
              dossiers médicaux).
            </Section>

            <Section title="5. Partage des données">
              Vos données sont strictement confidentielles. Elles ne sont partagées qu&apos;avec les professionnels
              de santé de Wenaya impliqués dans votre parcours de soins, et avec les autorités compétentes
              lorsque la loi l&apos;exige. Nous ne vendons jamais vos données à des tiers.
            </Section>

            <Section title="6. Sécurité">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger
              vos données contre tout accès non autorisé, modification, divulgation ou destruction.
            </Section>

            <Section title="7. Durée de conservation">
              Vos données sont conservées pendant la durée nécessaire à la réalisation des finalités pour
              lesquelles elles ont été collectées, conformément aux obligations légales en vigueur au Maroc.
            </Section>

            <Section title="8. Vos droits">
              Conformément à la loi 09-08 relative à la protection des personnes physiques à l&apos;égard du
              traitement des données à caractère personnel, vous disposez d&apos;un droit d&apos;accès, de
              rectification, d&apos;opposition et de suppression de vos données. Pour exercer ces droits,
              contactez-nous à : contact@wenaya.com.
            </Section>

            <Section title="9. Cookies">
              Notre site utilise des cookies essentiels au fonctionnement et des cookies analytiques
              pour améliorer votre expérience. Vous pouvez configurer vos préférences à tout moment
              depuis les paramètres de votre navigateur.
            </Section>

            <Section title="10. Contact">
              Pour toute question relative à cette politique, vous pouvez nous contacter :
              <br />Email : contact@wenaya.com
              <br />Téléphone : +212 6 66 12 40 35
              <br />Adresse : 88 Rue De Jabal Azourki, Casablanca 20930
            </Section>

            <p className="text-[#2B2F36]/40 text-xs pt-4 border-t border-[#0B1220]/[0.06]">
              Dernière mise à jour : Juin 2026
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[#0B1220] font-heading font-semibold text-base mb-3">{title}</h2>
      <p>{children}</p>
    </div>
  );
}

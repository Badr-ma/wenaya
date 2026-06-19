import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation | Wenaya",
  description: "Conditions générales d'utilisation du site et des services Wenaya — plateforme de santé intégrée à Casablanca, Maroc.",
  alternates: { canonical: "https://www.wenaya.com/conditions" },
};

export default function ConditionsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-[#F2EFE9] pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2.5 mb-8">
            <div className="w-1 h-1 rounded-full bg-[#B88A5A]" />
            <span className="text-[#B88A5A] text-[11px] font-semibold tracking-[0.22em] uppercase">Légal</span>
          </div>

          <h1 className="text-[#0B1220] font-heading text-[clamp(2rem,4vw,3.2rem)] font-bold leading-[1.06] tracking-tight mb-10">
            Conditions Générales d&apos;Utilisation
          </h1>

          <div className="space-y-8 text-[#2B2F36]/70 text-sm leading-relaxed">
            <Section title="1. Présentation">
              Wenaya (ci-après &laquo; la Plateforme &raquo;) est une plateforme de santé intégrée opérée par
              Wenaya Clinic, située au 88 Rue De Jabal Azourki, Casablanca 20930, Maroc.
              Les présentes conditions générales régissent l&apos;utilisation de notre site web et de nos services.
            </Section>

            <Section title="2. Acceptation des conditions">
              En accédant et en utilisant la Plateforme, vous acceptez sans réserve les présentes conditions
              générales. Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser nos services.
            </Section>

            <Section title="3. Services proposés">
              Wenaya propose des services de kinésithérapie, ostéopathie, psychologie clinique, nutrition
              fonctionnelle, orthophonie, psychomotricité, bilans de prévention et programmes bien-être
              entreprise. Les prestations sont réalisées par des professionnels de santé diplômés et
              conventionnés.
            </Section>

            <Section title="4. Prise de rendez-vous">
              Les rendez-vous peuvent être pris en ligne, par téléphone ou sur place. Un rendez-vous
              est confirmé après validation par l&apos;équipe Wenaya. En cas d&apos;annulation, nous vous
              remercions de nous prévenir au moins 24 heures à l&apos;avance.
            </Section>

            <Section title="5. Tarifs et paiement">
              Les tarifs applicables sont ceux affichés au moment de la réservation. Les paiements
              sont effectués directement au cabinet. Certains actes peuvent être pris en charge par
              les organismes d&apos;assurance maladie et mutuelles selon la réglementation en vigueur.
            </Section>

            <Section title="6. Responsabilité médicale">
              Chaque professionnel de santé exerçant au sein de Wenaya est responsable de ses actes
              médicaux dans le cadre de sa déontologie professionnelle. Wenaya ne se substitue en
              aucun cas à une consultation médicale d&apos;urgence.
            </Section>

            <Section title="7. Propriété intellectuelle">
              L&apos;ensemble du contenu de la Plateforme (textes, images, logos, vidéos) est la propriété
              exclusive de Wenaya ou de ses partenaires. Toute reproduction ou utilisation sans
              autorisation est interdite.
            </Section>

            <Section title="8. Données personnelles">
              L&apos;utilisation de vos données personnelles est régie par notre Politique de Confidentialité
              disponible sur cette même plateforme.
            </Section>

            <Section title="9. Modification des conditions">
              Wenaya se réserve le droit de modifier les présentes conditions à tout moment.
              Les utilisateurs seront informés de toute modification substantielle.
            </Section>

            <Section title="10. Droit applicable">
              Les présentes conditions sont régies par le droit marocain. Tout litige relève
              de la compétence des tribunaux de Casablanca.
            </Section>

            <Section title="11. Contact">
              Pour toute question, contactez-nous :
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

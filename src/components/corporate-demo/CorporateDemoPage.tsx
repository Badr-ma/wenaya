"use client";

import DemoHero from "./Hero";
import DemoTrustBand from "./TrustBand";
import DemoChallenges from "./Challenges";
import DemoEcosystem from "./Ecosystem";
import DemoSolutions from "./Solutions";
import DemoPrograms from "./Programs";
import DemoWhyWenaya from "./WhyWenaya";
import DemoProcess from "./Process";
import DemoImpact from "./Impact";
import DemoTestimonials from "./Testimonials";
import DemoCustomCTA from "./CustomCTA";
import DemoFAQ from "./FAQ";
import DemoConsultation from "./Consultation";

export default function CorporateDemoPage() {
  return (
    <main className="bg-white min-h-screen overflow-hidden">
      <DemoHero />
      <DemoTrustBand />
      <DemoChallenges />
      <DemoEcosystem />
      <DemoSolutions />
      <DemoPrograms />
      <DemoWhyWenaya />
      <DemoProcess />
      <DemoImpact />
      <DemoTestimonials />
      <DemoCustomCTA />
      <DemoFAQ />
      <DemoConsultation />
    </main>
  );
}

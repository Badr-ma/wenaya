/**
 * Group Sessions Page — simple listing for the /seance-de-groupe page.
 * Hero + the 6 real group sessions + footer. No booking/FAQ/benefits extras.
 */
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import GroupSessionsHero from "./GroupSessionsHero";
import GroupSessionsList from "./GroupSessionsList";

export default function GroupSessionsPage(): React.JSX.Element {
  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumbs />
      <main>
        <GroupSessionsHero />
        <GroupSessionsList />
      </main>
      <Footer />
    </div>
  );
}

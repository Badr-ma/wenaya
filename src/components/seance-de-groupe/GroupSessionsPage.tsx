/**
 * Group Sessions Page — listing for the /seance-de-groupe page.
 * Hero + the currently-active group sessions + footer.
 * Sessions are resolved server-side (live backend feed) and passed down.
 */
import Breadcrumbs from "@/components/Breadcrumbs";
import Footer from "@/components/Footer";
import GroupSessionsHero from "./GroupSessionsHero";
import GroupSessionsList from "./GroupSessionsList";
import type { GroupSession } from "@/lib/group-sessions";

export default function GroupSessionsPage({ sessions }: { sessions: GroupSession[] }): React.JSX.Element {
  return (
    <div className="flex flex-col min-h-screen">
      <Breadcrumbs />
      <main>
        <GroupSessionsHero />
        <GroupSessionsList sessions={sessions} />
      </main>
      <Footer />
    </div>
  );
}

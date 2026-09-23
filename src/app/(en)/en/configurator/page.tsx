/**
 * Configurator Coming Soon Page (EN).
 * Renders the premium editorial placeholder on /en/configurator. No configurator
 * logic — the real experience is in preparation. noindex via the co-located
 * layout; this page is not added to the sitemap.
 */
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import ConfiguratorComingSoon from "@/components/configurateur/ConfiguratorComingSoon";

export default function ConfiguratorPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main>
          <ConfiguratorComingSoon locale="en" />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
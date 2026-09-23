/**
 * Configurateur Coming Soon Page (FR).
 * Renders the premium editorial placeholder on /configurateur. No configurator
 * logic — the real experience is in preparation. noindex via the co-located
 * layout; this page is not added to the sitemap.
 */
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Footer from "@/components/Footer";
import ConfiguratorComingSoon from "@/components/configurateur/ConfiguratorComingSoon";

export default function ConfigurateurPage() {
  return (
    <ErrorBoundary>
      <div className="flex flex-col min-h-screen">
        <main>
          <ConfiguratorComingSoon locale="fr" />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
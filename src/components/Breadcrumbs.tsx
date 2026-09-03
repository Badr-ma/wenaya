/**
 * Breadcrumbs — renders a JSON-LD BreadcrumbList structured data schema for SEO.
 * Visually hidden (sr-only) — only the JSON-LD schema is visible to search engines.
 * Generates breadcrumb trail based on the current URL pathname.
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/site-config";

interface BreadcrumbItem {
  label: string;
  href: string;
}

const routeLabels: Record<string, Record<string, string>> = {
  fr: {
    about: "Cliniques",
    blog: "Blog",
    produits: "Boutique",
    pratiques: "Pratiques",
    faq: "FAQ",
    contact: "Contact",
    conditions: "Conditions Générales",
    confidentialite: "Politique de Confidentialité",
    login: "Connexion",
    specialistes: "Spécialistes",
    solutions: "Solutions",
    entreprises: "Entreprises",
    programmes: "Programmes",
    "seance-de-groupe": "Séances de groupe",
  },
  en: {
    about: "Clinics",
    blog: "Blog",
    produits: "Products",
    pratiques: "Practices",
    faq: "FAQ",
    contact: "Contact",
    conditions: "Terms & Conditions",
    confidentialite: "Privacy Policy",
    login: "Login",
    specialistes: "Specialists",
    solutions: "Solutions",
    entreprises: "Enterprise",
    programmes: "Programs",
    "group-sessions": "Group Sessions",
  },
};

export default function Breadcrumbs({ labels }: { labels?: Record<string, string> }): React.JSX.Element | null {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "fr";

  if (pathname === "/" || pathname === "/en") return null;

  const segments = pathname.split("/").filter(Boolean);
  const homeHref = locale === "en" ? "/en" : "/";
  const items: BreadcrumbItem[] = [];
  let path = locale === "en" ? "/en" : "";

  for (const segment of segments) {
    if (segment === "en" && path === "/en") continue;
    path += `/${segment}`;
    const label = labels?.[segment] || routeLabels[locale]?.[segment] || segment;
    items.push({ label, href: path });
  }

  if (items.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        className="sr-only"
      >
        <ol className="flex items-center gap-1.5 text-xs text-[#0B1220]/40">
          <li>
            <Link
              href={homeHref}
              className="hover:text-[#B88A5A] transition-colors"
            >
              {locale === "en" ? "Home" : "Accueil"}
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1.5">
              <svg
                className="w-3 h-3 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {i === items.length - 1 ? (
                <span className="text-[#0B1220]/70 font-medium">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-[#B88A5A] transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

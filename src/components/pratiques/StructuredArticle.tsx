/**
 * Structured Article — renders the typed, structured practice article
 * (sections → heading / body / list). Server component: content is internal
 * typed data (from `src/lib/practice-content.ts` after an HTML→blocks migration),
 * so no client-side HTML sanitization is required.
 *
 * Typography reuses the `.pratique-article` editorial rhythm (.pratique-article
 * h2 / h3 / p / ul / li are defined in globals.css).
 */
import type { PracticeSection } from "@/lib/practice-content";

export default function StructuredArticle({ sections }: { sections: PracticeSection[] }): React.JSX.Element {
  const isEmpty = (s: PracticeSection): boolean =>
    !s.heading && (!s.body || s.body.length === 0) && (!s.list || s.list.length === 0);

  return (
    <div className="pratique-article">
      {sections.map((section, i) => {
        if (isEmpty(section)) return null;
        return (
          <section key={i}>
            {section.heading && <h2>{section.heading}</h2>}
            {(section.body ?? []).map((paragraph, j) => (
              <p key={j}>{cleanParagraph(paragraph)}</p>
            ))}
            {section.list && section.list.length > 0 && (
              <ul>
                {section.list.map((item, k) => (
                  <li key={k}>{cleanParagraph(item)}</li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}

/** Normalize leftover spacing artifacts from the legacy editor (double spaces, NBSP). */
function cleanParagraph(text: string): string {
  return text.replace(/\u00A0/g, " ").replace(/[ \t]+/g, " ").trim();
}
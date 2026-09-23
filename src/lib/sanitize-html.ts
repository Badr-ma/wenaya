/**
 * Safe HTML sanitizer for professional bio / appointment content.
 *
 * Preserves ONLY presentation-safe semantic tags:
 *   p, ul, ol, li, strong, em, br
 *
 * Strips everything else (scripts, styles, iframes, unsafe attributes,
 * unsafe tags) while keeping their inner text content.
 *
 * Input may be HTML-entity-encoded (`&lt;p&gt;…&lt;/p&gt;`) or raw HTML.
 * Entities are decoded BEFORE tag processing so both forms work.
 */

// ─── Entity decoder (same coverage as professionals-detail.ts) ───────────

const NAMED_ENTITIES: Record<string, string> = {
  amp: "\u0026", lt: "\u003C", gt: "\u003E", quot: '"', apos: "'",
  nbsp: "\u00A0", iexcl: "\u00A1", cent: "\u00A2", pound: "\u00A3",
  curren: "\u00A4", yen: "\u00A5", brvbar: "\u00A6", sect: "\u00A7",
  uml: "\u00A8", copy: "\u00A9", ordf: "\u00AA", laquo: "\u00AB",
  not: "\u00AC", shy: "\u00AD", reg: "\u00AE", macr: "\u00AF",
  deg: "\u00B0", plusmn: "\u00B1", sup2: "\u00B2", sup3: "\u00B3",
  acute: "\u00B4", micro: "\u00B5", para: "\u00B6", middot: "\u00B7",
  cedil: "\u00B8", sup1: "\u00B9", ordm: "\u00BA", raquo: "\u00BB",
  frac14: "\u00BC", frac12: "\u00BD", frac34: "\u00BE", iquest: "\u00BF",
  Agrave: "\u00C0", Aacute: "\u00C1", Acirc: "\u00C2", Atilde: "\u00C3",
  Auml: "\u00C4", Aring: "\u00C5", AElig: "\u00C6", Ccedil: "\u00C7",
  Egrave: "\u00C8", Eacute: "\u00C9", Ecirc: "\u00CA", Euml: "\u00CB",
  Igrave: "\u00CC", Iacute: "\u00CD", Icirc: "\u00CE", Iuml: "\u00CF",
  ETH: "\u00D0", Ntilde: "\u00D1", Ograve: "\u00D2", Oacute: "\u00D3",
  Ocirc: "\u00D4", Otilde: "\u00D5", Ouml: "\u00D6", times: "\u00D7",
  Oslash: "\u00D8", Ugrave: "\u00D9", Uacute: "\u00DA", Ucirc: "\u00DB",
  Uuml: "\u00DC", Yacute: "\u00DD", THORN: "\u00DE", szlig: "\u00DF",
  agrave: "\u00E0", aacute: "\u00E1", acirc: "\u00E2", atilde: "\u00E3",
  auml: "\u00E4", aring: "\u00E5", aelig: "\u00E6", ccedil: "\u00E7",
  egrave: "\u00E8", eacute: "\u00E9", ecirc: "\u00EA", euml: "\u00EB",
  igrave: "\u00EC", iacute: "\u00ED", icirc: "\u00EE", iuml: "\u00EF",
  eth: "\u00F0", ntilde: "\u00F1", ograve: "\u00F2", oacute: "\u00F3",
  ocirc: "\u00F4", otilde: "\u00F5", ouml: "\u00F6", divide: "\u00F7",
  oslash: "\u00F8", ugrave: "\u00F9", uacute: "\u00FA", ucirc: "\u00FB",
  uuml: "\u00FC", yacute: "\u00FD", thorn: "\u00FE", yuml: "\u00FF",
  OElig: "\u0152", oelig: "\u0153", Scaron: "\u0160", scaron: "\u0161",
  Yuml: "\u0178", lsquo: "\u2018", rsquo: "\u2019", sbquo: "\u201A",
  ldquo: "\u201C", rdquo: "\u201D", bdquo: "\u201E", dagger: "\u2020",
  Dagger: "\u2021", bull: "\u2022", hellip: "\u2026", permil: "\u2030",
  lsaquo: "\u2039", rsaquo: "\u203A", euro: "\u20AC", ensp: "\u2002",
  emsp: "\u2003", ndash: "\u2013", mdash: "\u2014",
};

function decodeEntities(input: string): string {
  return input.replace(
    /&(?:#x[\da-f]+|#\d+|[\w]{1,8});/gi,
    (match) => {
      const body = match.slice(1, -1);
      if (body[0] === "#") {
        if (body[1]?.toLowerCase() === "x") {
          const cp = parseInt(body.slice(2), 16);
          return Number.isNaN(cp) ? match : String.fromCodePoint(cp);
        }
        const cp = parseInt(body.slice(1), 10);
        return Number.isNaN(cp) ? match : String.fromCodePoint(cp);
      }
      const decoded = NAMED_ENTITIES[body];
      if (decoded === undefined) return match;
      return decoded === "\u00A0" ? " " : decoded;
    }
  );
}

// ─── Safe tag whitelist ──────────────────────────────────────────────────

const SAFE_TAGS = new Set(["p", "ul", "ol", "li", "strong", "em", "br"]);
const SAFE_LOWER = new Set([...SAFE_TAGS]);

// ─── Main sanitizer ─────────────────────────────────────────────────────

/**
 * Sanitize an HTML blob (raw or entity-encoded) to contain ONLY safe
 * presentation tags. All attributes stripped. Unsafe tags converted to
 * plain text. Consecutive `<li>` items auto-wrapped in `<ul>`.
 *
 * Returns a clean HTML string safe for `dangerouslySetInnerHTML`.
 * Empty/whitespace-only input returns `""`.
 */
export function sanitizeSafeHtml(input: string | null | undefined): string {
  if (!input) return "";

  // 1. Decode entities → real HTML
  const decoded = decodeEntities(input);

  // 2. Remove scripts, styles, iframes entirely (content + tags)
  let clean = decoded
    .replace(/<\s*script[\s\S]*?<\/\s*script\s*>/gi, "")
    .replace(/<\s*style[\s\S]*?<\/\s*style\s*>/gi, "")
    .replace(/<\s*iframe[\s\S]*?<\/\s*iframe\s*>/gi, "")
    .replace(/<\s*script[^>]*\/?\s*>/gi, "");

  // 3. Remove event-handler attributes (on*) and dangerous attrs from ALL tags
  clean = clean.replace(/<(\w+)([^>]*)>/gi, (_match, tag, attrs) => {
    if (typeof attrs !== "string") return `<${tag}>`;
    const safe = attrs
      .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/\bstyle\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/\bclass\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      .replace(/\bid\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    return `<${tag}${safe}>`;
  });

  // 4. Process allowed tags, strip everything else
  const TAG_RE = /<\s*\/?(\w+)([^>]*)>/g;
  let result = "";
  let lastIdx = 0;
  let match;

  while ((match = TAG_RE.exec(clean)) !== null) {
    // Append text before this tag (plain text content)
    result += escapeHtml(clean.slice(lastIdx, match.index));

    const tagName = match[1].toLowerCase();
    const isClosing = match[0].startsWith("</");

    if (SAFE_LOWER.has(tagName)) {
      if (isClosing) {
        result += `</${tagName}>`;
      } else if (tagName === "br") {
        result += "<br>";
      } else {
        result += `<${tagName}>`;
      }
    }
    // else: strip the tag, keep the text content (already captured above)

    lastIdx = TAG_RE.lastIndex;
  }

  // Trailing text after last tag
  result += escapeHtml(clean.slice(lastIdx));

  // 5. Collapse empty <p><br></p> → nothing (common API artifact)
  result = result.replace(/<p>\s*(<br>)?\s*<\/p>/gi, "");

  // 6. Auto-wrap orphan consecutive <li> in <ul>
  result = wrapConsecutiveLi(result);

  // 7. Collapse consecutive <p> into single paragraphs
  result = collapseConsecutiveParagraphs(result);

  return result.trim();
}

// ─── Plain-text (summaries / excerpts) ───────────────────────────────────

/**
 * Convert an HTML blob (raw or entity-encoded) to a SINGLE plain-text line
 * safe for summaries/excerpts (article headers, listing & related cards).
 * Entities are decoded (punctuation + accents preserved), tags stripped,
 * and all whitespace runs collapsed to single spaces. Block / list / br
 * boundaries become space separators; inline tags (strong/em/...) vanish
 * without leaving stray spaces before punctuation. Returns "" for
 * empty/whitespace-only input.
 *
 * NOTE: this is intentionally NOT `dangerouslySetInnerHTML`-safe output —
 * callers render the result as a plain text node.
 */
export function htmlToText(input: string | null | undefined): string {
  if (!input) return "";
  const decoded = decodeEntities(input);
  return (
    decoded
      .replace(/<\s*(?:br|p|ul|ol|li|div|section|article|header|footer)\b[^>]*>/gi, " ")
      .replace(/<\/\s*(?:br|p|ul|ol|li|div|section|article|header|footer)\s*>/gi, " ")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .replace(/\s+([.,;:!?’”])/g, "$1")
      .replace(/^\s+|\s+$/g, "")
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────

/** Escape text content to prevent XSS from raw HTML in text nodes. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Wrap orphan `<li>` runs in `<ul>` when they are not already inside a
 * `<ul>`/`<ol>`. Stack-based single pass — tracks open list depth so a
 * properly-wrapped API list is never double-wrapped. Any `<ul>`/`<ol>` left
 * open at the end (e.g. an orphan run) is closed with `</ul>`.
 */
function wrapConsecutiveLi(html: string): string {
  const out: string[] = [];
  const stack: string[] = [];
  let idx = 0;
  const SCAN = /<(?:ul|ol|li|\/ul|\/ol|\/li)>/g;
  let m;

  const popTo = (want: string): boolean => {
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i] === want) {
        stack.length = i;
        return true;
      }
    }
    return false;
  };

  while ((m = SCAN.exec(html)) !== null) {
    out.push(html.slice(idx, m.index));
    idx = SCAN.lastIndex;
    const tag = m[0].replace(/^<[/]?/, "").replace(/>$/, "");
    const isClose = m[0].startsWith("</");

    if (tag === "ul" || tag === "ol") {
      if (isClose) {
        const top = stack[stack.length - 1];
        if (top === "ul" || top === "ol") {
          out.push(`</${top}>`);
          stack.pop();
        }
      } else {
        stack.push(tag);
        out.push(`<${tag}>`);
      }
    } else if (tag === "li") {
      if (isClose) {
        popTo("li");
        out.push("</li>");
      } else {
        const top = stack[stack.length - 1];
        if (top !== "ul" && top !== "ol") {
          stack.push("ul"); // synthetic wrapper
          out.push("<ul>");
        }
        stack.push("li");
        out.push("<li>");
      }
    } else {
      out.push(m[0]); // shouldn't reach here (SCAN is exclusive)
    }
  }

  out.push(html.slice(idx));

  let tail = out.join("");
  const openLists = stack.filter((t) => t === "ul" || t === "ol").length;
  for (let i = 0; i < openLists; i++) tail += "</ul>";

  return tail;
}

/**
 * Collapse runs of adjacent `<p>` tags into a single `<p>` with their
 * text content joined by double-newlines (visual paragraph breaks).
 * Handles `<p>` tags that contain only text or inline elements.
 */
function collapseConsecutiveParagraphs(html: string): string {
  return html.replace(
    /(<p>(?:[\s\S]*?)<\/p>\s*){2,}/g,
    (run) => {
      const texts: string[] = [];
      const P_RE = /<p>([\s\S]*?)<\/p>/g;
      let pm;
      while ((pm = P_RE.exec(run)) !== null) {
        const inner = pm[1].trim();
        if (inner) texts.push(inner);
      }
      if (texts.length === 0) return "";
      // Wrap combined content in a single <p>
      return `<p>${texts.join("</p><p>")}</p>`;
    }
  );
}

// ─── Legacy compatibility: still produce string[] for existing pages ─────

/**
 * Convert sanitized HTML back to plain-text paragraphs (for legacy
 * components that consume `bioParagraphs: string[]`). Used as fallback
 * when `bioHtml` is not available (local legacy specialists).
 */
export function htmlToParagraphs(input: string | null | undefined): string[] {
  if (!input) return [];
  const decoded = decodeEntities(input);
  const text = decoded
    .replace(/<\s*\/\s*p\s*>/gi, "\n")
    .replace(/<\s*p[^>]*>/gi, "")
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const paragraphs = text
    .split("\n")
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 0);
  if (paragraphs.length === 0 && text.length > 0) return [text];
  return paragraphs;
}

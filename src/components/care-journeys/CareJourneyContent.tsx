/**
 * Shared block renderer for care-journey article content.
 *
 * Renders the structured `JourneyBlock[]` (paragraphs, h3 sub-headings, and
 * nested lists) with theme-aware typography so the SAME content can be shown
 * on sand/ivory ("light") or navy ("dark") backgrounds without changing a
 * single word. All content is server-rendered (SEO intact). The tree builder
 * (flat depth-tagged items → true nested `<ul>`/`<ol>`) is shared with the
 * old renderer so no list item is lost.
 */
import type {
  JourneyBlock,
  JourneyListItem,
} from "@/lib/care-journeys";

/** Tree model derived from the flat, depth-tagged list items. */
interface ListNode extends JourneyListItem {
  children: ListNode[];
}

/**
 * Rebuild a nested tree from the flat depth-tagged items so nested
 * `<ul>`/`<ol>` can be rendered as true nested lists.
 */
function toTree(items: JourneyListItem[]): ListNode[] {
  const result: ListNode[] = [];
  const helper = (depth: number, acc: ListNode[]) => {
    while (items.length && items[0].depth === depth) {
      const it = items.shift()!;
      const node: ListNode = { ...it, children: [] };
      helper(depth + 1, node.children);
      acc.push(node);
    }
  };
  helper(0, result);
  return result;
}

interface ListTheme {
  text: string;
  marker: string;
  strong: string;
}

const LIGHT_LIST: ListTheme = {
  text: "text-[#0B1220]/80",
  marker: "marker:text-[#B88A5A]",
  strong: "text-[#0B1220]",
};

const DARK_LIST: ListTheme = {
  text: "text-white/80",
  marker: "marker:text-[#C99B68]",
  strong: "text-white",
};

function JourneyListItemView({ node, theme }: { node: ListNode; theme: ListTheme }) {
  return (
    <li>
      {node.lead ? (
        <>
          <strong className={theme.strong}>{node.lead}</strong>
          {node.text ? ` ${node.text}` : null}
        </>
      ) : (
        node.text
      )}
      {node.children.length > 0 && <JourneyList nodes={node.children} theme={theme} />}
    </li>
  );
}

function JourneyList({ nodes, theme }: { nodes: ListNode[]; theme: ListTheme }) {
  if (nodes.length === 0) return null;
  const ordered = nodes[0].ordered || false;
  const Tag = ordered ? "ol" : "ul";
  const bullet = ordered ? "list-decimal" : "list-disc";
  return (
    <Tag
      className={`${bullet} ${theme.marker} ${theme.text} pl-6 space-y-2.5 leading-[1.8] mb-5`}
    >
      {nodes.map((node, idx) => (
        <JourneyListItemView key={idx} node={node} theme={theme} />
      ))}
    </Tag>
  );
}

interface JourneyContentProps {
  blocks: JourneyBlock[];
  /** "light" → sand/ivory article; "dark" → navy break. */
  variant?: "light" | "dark";
}

/** Render a section's blocks with theme-aware typography (server-safe). */
export function JourneyContent({ blocks, variant = "light" }: JourneyContentProps) {
  const dark = variant === "dark";
  const listTheme = dark ? DARK_LIST : LIGHT_LIST;
  const pClass = dark
    ? "text-white/75 leading-[1.9] mb-4"
    : "text-[#0B1220]/75 leading-[1.9] mb-4";
  const h3Class = dark
    ? "heading-serif text-white text-lg sm:text-xl font-semibold leading-snug mt-8 mb-3"
    : "heading-serif text-[#0B1220] text-lg sm:text-xl font-semibold leading-snug mt-8 mb-3";

  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === "h3") {
          return (
            <h3 key={i} className={h3Class}>
              {block.text}
            </h3>
          );
        }
        if (block.type === "list") {
          return <JourneyList key={i} nodes={toTree([...block.items])} theme={listTheme} />;
        }
        return (
          <p key={i} className={pClass}>
            {block.text}
          </p>
        );
      })}
    </>
  );
}

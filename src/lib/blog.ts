/**
 * Blog data layer — reads MDX blog posts from the filesystem,
 * parses frontmatter with gray-matter, and exports typed data models.
 * Used by the homepage, blog listing page, blog post pages, and sitemap.
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";

/** Author model — represents a blog post author with avatar and bio */
export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
}

/** Category model — groups blog posts into topics (longevity, biomarkers, etc.) */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

/** Post model — represents a single blog post with all metadata from MDX frontmatter */
export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  authorId: string;
  categoryId: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  status: "draft" | "published";
  publishedAt: string;
  readingTime: number;
}

/** Static author data — hardcoded list of blog authors */
export const authors: Author[] = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&h=120&fit=crop&crop=face",
    role: "Chief Medical Officer",
    bio: "Dr. Mitchell leads our clinical research with over 15 years of experience in preventive medicine and longevity science.",
  },
  {
    id: "2",
    name: "Marcus Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
    role: "Head of AI Research",
    bio: "Marcus specializes in applying machine learning to biomarker analysis and predictive health modeling.",
  },
  {
    id: "3",
    name: "Elena Voss",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&crop=face",
    role: "Senior Nutrition Scientist",
    bio: "Elena translates cutting-edge nutritional science into actionable personalized protocols.",
  },
];

/** Static category data — predefined blog categories with slugs for URL routing */
export const categories: Category[] = [
  { id: "1", name: "Longevity", slug: "longevity", description: "The science of extending healthy lifespan." },
  { id: "2", name: "Biomarkers", slug: "biomarkers", description: "Understanding the data behind your health." },
  { id: "3", name: "Nutrition", slug: "nutrition", description: "Evidence-based nutritional guidance." },
  { id: "4", name: "AI & Health", slug: "ai-health", description: "How artificial intelligence is transforming healthcare." },
  { id: "5", name: "Prevention", slug: "prevention", description: "Proactive strategies for optimal health." },
];

/** Directory path to the MDX blog content files */
const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

/** Parses a single MDX file — extracts frontmatter and body content into a Post object */
function parseMdxFile(filePath: string): Post | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const slug = data.slug || path.basename(filePath, ".mdx");

  return {
    slug,
    title: data.title || "",
    excerpt: data.excerpt || "",
    content,
    featuredImage: data.featuredImage || "",
    authorId: data.authorId || "",
    categoryId: data.categoryId || "",
    tags: data.tags || [],
    metaTitle: data.metaTitle || data.title || "",
    metaDescription: data.metaDescription || "",
    ogImage: data.ogImage || data.featuredImage || "",
    status: data.status || "draft",
    publishedAt: data.publishedAt || "",
    readingTime: data.readingTime || Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
  };
}

/** Returns all blog posts (drafts + published), sorted by published date descending */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((f) => parseMdxFile(path.join(CONTENT_DIR, f)))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

/** Returns only published blog posts — used for public-facing blog pages and sitemap */
export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((p) => p.status === "published");
}

/** Finds a single blog post by its URL slug — returns undefined if not found */
export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

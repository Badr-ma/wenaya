import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

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

export const categories: Category[] = [
  { id: "1", name: "Longevity", slug: "longevity", description: "The science of extending healthy lifespan." },
  { id: "2", name: "Biomarkers", slug: "biomarkers", description: "Understanding the data behind your health." },
  { id: "3", name: "Nutrition", slug: "nutrition", description: "Evidence-based nutritional guidance." },
  { id: "4", name: "AI & Health", slug: "ai-health", description: "How artificial intelligence is transforming healthcare." },
  { id: "5", name: "Prevention", slug: "prevention", description: "Proactive strategies for optimal health." },
];

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

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

export function getAllPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  return files
    .map((f) => parseMdxFile(path.join(CONTENT_DIR, f)))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getPublishedPosts(): Post[] {
  return getAllPosts().filter((p) => p.status === "published");
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

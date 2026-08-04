import { getRedis } from "./redis";
import type { HomepageConfig, HomepageSection } from "./homepage-types";
import { DEFAULT_SECTIONS } from "./homepage-types";

const DRAFT_KEY = "admin:homepage:draft";
const PUBLISHED_KEY = "admin:homepage:published";

function defaultConfig(): HomepageConfig {
  return { sections: DEFAULT_SECTIONS.map((s) => ({ ...s })) };
}

export async function getHomepageDraft(): Promise<HomepageConfig> {
  const redis = getRedis();
  if (!redis) return defaultConfig();
  try {
    const data = await redis.get<HomepageConfig>(DRAFT_KEY);
    if (data && Array.isArray(data.sections)) return data;
    return defaultConfig();
  } catch {
    return defaultConfig();
  }
}

export async function getHomepagePublished(): Promise<HomepageConfig> {
  const redis = getRedis();
  if (!redis) return defaultConfig();
  try {
    const data = await redis.get<HomepageConfig>(PUBLISHED_KEY);
    if (data && Array.isArray(data.sections)) return data;
    const draft = await getHomepageDraft();
    return draft;
  } catch {
    return defaultConfig();
  }
}

export async function saveHomepageDraft(config: HomepageConfig): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  await redis.set(DRAFT_KEY, config);
}

export async function publishHomepage(): Promise<HomepageConfig> {
  const redis = getRedis();
  if (!redis) throw new Error("Redis not configured");
  const draft = await getHomepageDraft();
  await redis.set(PUBLISHED_KEY, draft);
  return draft;
}

export async function addSection(type: HomepageSection["type"]): Promise<HomepageConfig> {
  const draft = await getHomepageDraft();
  const maxOrder = draft.sections.reduce((max, s) => Math.max(max, s.order), -1);
  const newSection: HomepageSection = {
    id: `sct_${type}_${Date.now()}`,
    type,
    order: maxOrder + 1,
    enabled: true,
    content: {},
  };
  draft.sections.push(newSection);
  await saveHomepageDraft(draft);
  return draft;
}

export async function removeSection(id: string): Promise<HomepageConfig> {
  const draft = await getHomepageDraft();
  draft.sections = draft.sections.filter((s) => s.id !== id);
  await saveHomepageDraft(draft);
  return draft;
}

export async function updateSection(id: string, updates: Partial<HomepageSection>): Promise<HomepageConfig | null> {
  const draft = await getHomepageDraft();
  const idx = draft.sections.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  draft.sections[idx] = { ...draft.sections[idx], ...updates } as HomepageSection;
  await saveHomepageDraft(draft);
  return draft;
}

export async function reorderSections(ids: string[]): Promise<HomepageConfig> {
  const draft = await getHomepageDraft();
  const map = new Map(draft.sections.map((s) => [s.id, s]));
  const reordered: HomepageSection[] = [];
  for (const id of ids) {
    const section = map.get(id);
    if (section) {
      section.order = reordered.length;
      reordered.push(section);
    }
  }
  const remaining = draft.sections.filter((s) => !ids.includes(s.id));
  for (const s of remaining) {
    s.order = reordered.length;
    reordered.push(s);
  }
  draft.sections = reordered;
  await saveHomepageDraft(draft);
  return draft;
}

export async function resetHomepageDraft(): Promise<HomepageConfig> {
  const redis = getRedis();
  if (!redis) return defaultConfig();
  await redis.del(DRAFT_KEY);
  return getHomepageDraft();
}

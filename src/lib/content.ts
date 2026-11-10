import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';

export type Area = CollectionEntry<'areas'>;
export type ProjectMeta = CollectionEntry<'projects'>;
export type ProjectText = CollectionEntry<'projectTexts'>['data'];
export interface Project { slug: string; meta: ProjectMeta['data']; text: ProjectText }

export async function getAreas(): Promise<Area[]> {
  return (await getCollection('areas')).sort((a, b) => a.data.number - b.data.number);
}

/** Projects that have text in the given language. */
export async function getProjects(locale: Locale): Promise<Project[]> {
  const metas = await getCollection('projects');
  const texts = await getCollection('projectTexts');
  const byId = new Map(texts.map((t) => [t.id, t.data]));
  return metas
    .filter((m) => byId.has(`${m.id}/${locale}`))
    .map((m) => ({ slug: m.id, meta: m.data, text: byId.get(`${m.id}/${locale}`)! }));
}

export function projectsInArea(projects: Project[], area: string): Project[] {
  return projects.filter((p) => p.meta.area === area).sort((a, b) => a.meta.order - b.meta.order);
}

/** All Works order: most recent first; projects without a date go last. */
export function chronological(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const x = a.meta.sort, y = b.meta.sort;
    if (x === y) return a.text.title.localeCompare(b.text.title);
    if (!x) return 1;
    if (!y) return -1;
    return y.localeCompare(x);
  });
}

// Lookups via getCollection: a missing English file is expected, not a warning.
export async function hasProjectText(slug: string, locale: Locale) {
  return (await getCollection('projectTexts')).some((e) => e.id === `${slug}/${locale}`);
}

export async function getPage<T = Record<string, any>>(page: string, locale: Locale): Promise<T | undefined> {
  return (await getCollection('pages')).find((e) => e.id === `${page}/${locale}`)?.data as T | undefined;
}

/** Text still to be supplied by the owner. */
export const isPlaceholder = (s?: string | null) => !s || /^\[DA FORNIRE/.test(s);

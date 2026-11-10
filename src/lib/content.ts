import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from './i18n';

export type Area = CollectionEntry<'areas'>;
export type ProjectMeta = CollectionEntry<'projects'>;
export type ProjectText = CollectionEntry<'projectTexts'>['data'];
export interface Project { slug: string; meta: Omit<ProjectMeta['data'], 'company'> & { company?: string }; text: ProjectText }

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
    .map((m) => {
      // company can be one name, or { it, en } when it differs by language
      const c = m.data.company;
      const company = typeof c === 'object' ? (c[locale] ?? c.it) : c;
      return { slug: m.id, meta: { ...m.data, company }, text: byId.get(`${m.id}/${locale}`)! };
    });
}

/** Projects whose canonical page is in this area (used for previous / next). */
export function projectsInArea(projects: Project[], area: string): Project[] {
  return projects.filter((p) => p.meta.area === area).sort((a, b) => a.meta.order - b.meta.order);
}

/** Area index: canonical projects first, then projects also listed here (alsoIn). */
export function listedInArea(projects: Project[], area: string): Project[] {
  const also = projects.filter((p) => p.meta.alsoIn.includes(area as any));
  return [...projectsInArea(projects, area), ...also];
}

/** All Works order: most recent first; projects without a date go last. */
export function chronological(projects: Project[]): Project[] {
  const key = (s: string | null) => (s === 'present' ? '9999' : s);
  return [...projects].sort((a, b) => {
    const x = key(a.meta.sort), y = key(b.meta.sort);
    if (x === y) {
      // an experience page comes before the projects that belong to it
      if (a.meta.parent === b.slug) return 1;
      if (b.meta.parent === a.slug) return -1;
      return a.meta.order - b.meta.order;
    }
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

/** Areas shown as a case list (name, sector, service) with the case page structure. */
export const caseAreas: string[] = ['events-and-brand-activations', 'communication-and-editorial'];

/** Text still to be supplied by the owner. */
export const isPlaceholder = (s?: string | null) => !s || /^\[DA FORNIRE/.test(s);

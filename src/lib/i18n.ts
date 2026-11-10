export const locales = ['it', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'it';

/** getStaticPaths helper for `src/pages/[...locale]/...` routes. */
export function localeParams() {
  return locales.map((l) => ({ params: { locale: l === defaultLocale ? undefined : l } }));
}

export function toLocale(param: string | undefined): Locale {
  return param === 'en' ? 'en' : 'it';
}

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Build a URL: localizedPath('en', 'projects', 'events-and-brand-activations') -> /en/projects/events-and-brand-activations/ */
export function localizedPath(locale: Locale, ...segments: string[]): string {
  const parts = [locale === defaultLocale ? '' : locale, ...segments].filter(Boolean);
  return `${base}/${parts.join('/')}${parts.length ? '/' : ''}`;
}

/** Path segments of the current URL without base and language prefix. */
export function routeSegments(pathname: string): string[] {
  const parts = pathname.slice(base.length).split('/').filter(Boolean);
  if (parts[0] && (locales as readonly string[]).includes(parts[0])) parts.shift();
  return parts;
}

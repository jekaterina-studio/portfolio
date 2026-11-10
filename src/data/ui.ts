import type { Locale } from '../lib/i18n';

/**
 * Interface labels. Website copy (texts, projects) lives in src/content/.
 * Italian labels marked PROPOSAL are pending owner approval.
 */
export const nav = [
  { key: 'home', segments: [] as string[], label: { it: 'home', en: 'home' } },
  { key: 'profile', segments: ['profile'], label: { it: 'profilo', en: 'profile' } }, // PROPOSAL (it)
  { key: 'projects', segments: ['projects'], label: { it: 'progetti', en: 'projects' } }, // PROPOSAL (it)
  { key: 'practice', segments: ['practice'], label: { it: 'pratica', en: 'practice' } }, // PROPOSAL (it)
  { key: 'all-works', segments: ['all-works'], label: { it: 'tutti i lavori', en: 'all works' } }, // PROPOSAL (it)
] as const;

export type SectionKey = (typeof nav)[number]['key'];

const strings = {
  skipToContent: { it: 'Vai al contenuto', en: 'Skip to content' },
  mainNav: { it: 'Navigazione principale', en: 'Main navigation' },
  languageNav: { it: 'Lingua', en: 'Language' },
  contacts: { it: 'Contatti', en: 'Contacts' },
  cvIt: { it: 'Scarica CV in italiano', en: 'Download CV in Italian' }, // en: PROPOSAL
  cvEn: { it: 'Download CV in English', en: 'Download CV in English' },
  cvPending: { it: 'in preparazione', en: 'coming soon' },
  vat: { it: 'P. IVA', en: 'VAT number' },
  imageHint: { it: 'Attiva per vedere i colori originali', en: 'Activate to see the original colours' },
  slideshow: { it: 'Sequenza di immagini', en: 'Image sequence' },
  previous: { it: 'precedente', en: 'previous' },
  next: { it: 'successiva', en: 'next' },
  breadcrumb: { it: 'Percorso', en: 'Breadcrumb' },
  // project detail rows
  description: { it: 'descrizione', en: 'description' },
  role: { it: 'ruolo', en: 'role' },
  activities: { it: 'attività', en: 'activities' },
  documentation: { it: 'documentazione', en: 'documentation' },
  results: { it: 'risultati', en: 'results' },
  images: { it: 'immagini', en: 'images' },
  openPdf: { it: 'apri', en: 'open' },
  downloadPdf: { it: 'scarica PDF', en: 'download PDF' },
  externalLink: { it: 'link esterno', en: 'external link' },
  previousProject: { it: 'progetto precedente', en: 'previous project' },
  nextProject: { it: 'progetto successivo', en: 'next project' },
  projectNav: { it: 'Navigazione tra i progetti', en: 'Project navigation' },
  periodTbc: { it: 'periodo da confermare', en: 'period to be confirmed' },
  partOf: { it: 'parte di', en: 'part of' },
  noProjects: { it: 'Nessun progetto pubblicato in questa lingua.', en: 'No projects published in this language yet.' },
  // profile / practice headings - PROPOSALS (it)
  education: { it: 'formazione', en: 'education' },
  process: { it: 'processo', en: 'process' },
  tools: { it: 'strumenti e software', en: 'tools and software' },
  workDocuments: { it: 'documenti di lavoro', en: 'working documents' },
  examples: { it: 'esempi', en: 'examples' }, // owner request
  linkPending: { it: 'link in arrivo', en: 'link coming soon' },
  biography: { it: 'biografia', en: 'biography' },
} as const;

export function t(key: keyof typeof strings, locale: Locale): string {
  return strings[key][locale];
}

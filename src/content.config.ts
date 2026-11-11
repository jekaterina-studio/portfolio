import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const areaSlugs = [
  'communication-and-editorial',
  'cultural-and-creative-projects',
  'events-and-brand-activations',
  'independent-practice',
] as const;

const i18nText = z.object({ it: z.string(), en: z.string().optional() });

/** The four professional areas (src/content/areas.yaml). */
const areas = defineCollection({
  loader: file('src/content/areas.yaml'),
  schema: z.object({
    number: z.number(),
    title: i18nText,
    description: z.object({ it: z.string().optional(), en: z.string().optional() }).optional(),
    /** introductory text shown on the area page only */
    intro: z.object({ it: z.string().optional(), en: z.string().optional() }).optional(),
  }),
});

/** Language-neutral project data: src/content/projects/<slug>/meta.yaml */
const projects = defineCollection({
  loader: glob({
    pattern: '*/meta.yaml',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z.object({
      area: z.enum(areaSlugs),
      /** position inside its area (1, 2, 3 ...) - used for previous / next */
      order: z.number(),
      /** sort key for All Works, newest first: 'YYYY' or 'YYYY-MM' (end of the project). null = not known yet */
      sort: z.union([z.literal('present'), z.string().regex(/^\d{4}(-\d{2})?$/)]).nullable(),
      /** slug of the professional experience page this project belongs to (e.g. onda-studio) */
      parent: z.string().optional(),
      /** true: page exists (linked from its parent and All Works) but is not listed in its area */
      hidden: z.boolean().default(false),
      /** also list this project in other area indexes (it keeps one canonical page) */
      alsoIn: z.array(z.enum(areaSlugs)).default([]),
      /** place shown under the title, e.g. "GPone Milano, Darsena, Milano" */
      place: z.string().optional(),
      /** cover image for the card on the category page (brand activations) */
      cover: z.object({ file: image(), alt: z.object({ it: z.string(), en: z.string().optional() }) }).optional(),
      /** period as displayed next to the title */
      period: z.object({ it: z.string(), en: z.string().optional() }).nullable(),
      /** company or organisation, where applicable */
      company: z.union([z.string(), z.object({ it: z.string(), en: z.string().optional() })]).optional(),
      /** groups projects belonging to the same professional experience (e.g. 'onda-studio') */
      experience: z.string().optional(),
      media: z
        .array(
          z.object({
            layout: z.enum(['single', 'series', 'slideshow']),
            format: z.enum(['square', 'horizontal', 'vertical', 'portrait']), // portrait = 4:5
            images: z.array(
              z.object({
                file: image(),
                alt: z.object({ it: z.string(), en: z.string().optional() }),
              }),
            ),
          }),
        )
        .default([]),
      /** small reference images shown next to the linked items of a section, in order (e.g. song thumbnails) */
      thumbnails: z.array(z.object({ file: image(), alt: z.object({ it: z.string(), en: z.string().optional() }) })).default([]),
      documents: z
        .array(
          z.object({
            label: z.object({ it: z.string(), en: z.string().optional() }),
            /** a PDF in /public/documents/projects/<slug>/ e.g. '/documents/projects/varese-in-luce/candidatura.pdf' */
            file: z.string().startsWith('/documents/').optional(),
            /** or an external link */
            url: z.string().url().optional(),
            /** open: opens the PDF in the browser; download: downloads it */
            action: z.enum(['open', 'download']).default('open'),
          }).refine((d) => d.file || d.url, 'A document needs either `file` or `url`.'),
        )
        .default([]),
    }),
});

/** Project text per language: src/content/projects/<slug>/it.yaml and en.yaml */
const projectTexts = defineCollection({
  loader: glob({
    pattern: '*/{it,en}.yaml',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.replace(/\.yaml$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    category: z.string().optional(),
    description: z.string().optional(),
    role: z.string().optional(),
    /** optional custom heading for the role row (e.g. 'attività svolte') */
    roleLabel: z.string().optional(),
    activities: z.array(z.string()).optional(),
    results: z
      .union([
        z.string(),
        z.object({ intro: z.string().optional(), items: z.array(z.string()), note: z.string().optional() }),
      ])
      .optional(),
    /** brand activations list: sector and service keywords (owner to supply) */
    sector: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    /** "occasioni": short texts shown in full on the page, after useful links */
    occasions: z.array(z.object({ title: z.string(), text: z.string() })).default([]),
    /** useful external links (sites, articles, official pages) */
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    /** extra two-column rows, e.g. "vegetherial" or the cantautorato songs */
    sections: z
      .array(
        z.object({
          label: z.string(),
          text: z.string().optional(),
          /** true: show the project's image gallery inside this section */
          gallery: z.boolean().optional(),
          /** subtitle under the section label (left column), bold red; url optional */
          subtitle: z.object({ title: z.string(), url: z.string().url().optional(), italic: z.boolean().optional() }).optional(),
          items: z
            .array(z.object({ title: z.string(), url: z.string().optional(), project: z.string().optional(), highlight: z.boolean().optional() }))
            .optional(),
        }),
      )
      .default([]),
  }),
});

/** Profile and Practice page texts: src/content/pages/<page>/<lang>.yaml */
const pages = defineCollection({
  loader: glob({
    pattern: '*/{it,en}.yaml',
    base: './src/content/pages',
    generateId: ({ entry }) => entry.replace(/\.yaml$/, ''),
  }),
  schema: z.object({}).passthrough(),
});

export const collections = { areas, projects, projectTexts, pages };

/**
 * Site-wide data: single source of truth for contacts and CV files.
 * Used by the footer AND the profile page - edit only here.
 *
 * A value of `null` means "not supplied yet": the site shows the item
 * as plain text, never as a link that goes nowhere.
 */
export const site = {
  name: 'Jekaterina Kanevskaja',
  contact: {
    email: 'digitalcuratorship@gmail.com',
    phoneDisplay: '+39 348 270 1207',
    phoneHref: '+393482701207',
    city: { it: 'Milano, Italia', en: 'Milan, Italy' },
    // TODO(owner): confirm. An Italian partita IVA has 11 digits; this value looks like a placeholder.
    vat: '0123456789',
    linkedin: 'https://www.linkedin.com/in/jekaterinakanevskaja/' as string | null,
    instagram: 'https://www.instagram.com/sauletekis_____/' as string | null,
  },
  /**
   * CV files. Put the PDFs in /public/documents/cv/ and write the path here,
   * e.g. '/documents/cv/cv-jekaterina-kanevskaja-it.pdf'.
   */
  cv: {
    it: null as string | null,
    en: null as string | null,
  },
} as const;

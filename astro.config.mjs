// @ts-check
import { defineConfig } from 'astro/config';

// Language routing is handled in src/lib/i18n.ts:
// Italian (default) has no prefix, English lives under /en/.
// URL slugs are identical in both languages.
export default defineConfig({
  // Replace with the free subdomain once hosting is set up (e.g. https://<name>.pages.dev).
  site: 'https://example.invalid',
  trailingSlash: 'always',
  build: { format: 'directory' },
  devToolbar: { enabled: false },
});

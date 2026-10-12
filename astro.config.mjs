import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import liveDesignPreview from './palate-preview/integration.mjs';

export default defineConfig({
  site: 'https://pelvy.app',
  output: 'static',
  integrations: [liveDesignPreview(), sitemap()],
  devToolbar: { enabled: false },
});

import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  includeDotfiles: true,
  site: "https://artoftrueadvantage.com/",

  vite: {
    server: {
      allowedHosts: true,
    },
  },

  integrations: [sitemap()],
});
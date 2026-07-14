import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  includeDotfiles: true,
  site: "https://artoftrueadvantage.com/",

  vite: {
    server: {
      allowedHosts: true,
    },
  },

  integrations: [sitemap()],
});
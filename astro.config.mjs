import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  site: 'https://artoftrueadvantage.com/',
  vite: {
    server: {
      allowedHosts: true,
    },
  },
});

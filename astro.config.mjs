import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  includeDotfiles: true,
  site: "https://artoftrueadvantage.com/",
  vite: {
    server: {
      allowedHosts: true,
    },
  },
});

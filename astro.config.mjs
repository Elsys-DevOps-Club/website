import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://devops.elsys.club",
  integrations: [sitemap({ filter: (page) => !page.endsWith("/404/") })],
  markdown: { processor: satteri({ smartPunctuation: false }) },
});

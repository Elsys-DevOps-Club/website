import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://devops.elsys.club",
  integrations: [sitemap({ filter: (page) => !page.endsWith("/404/") })],
  // Без smartypants: иначе българските кавички в тялото на срещите се
  // заменят с английски типографски кавички. Markdown тяло има само при
  // срещите, така че друго не се променя.
  markdown: { smartypants: false },
});

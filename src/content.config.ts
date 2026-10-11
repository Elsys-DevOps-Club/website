import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const link = z.object({
  label: z.string(),
  href: z.string(),
  dir: z.string(),
});

const home = defineCollection({
  loader: glob({ base: "./src/content", pattern: "home.md" }),
  schema: z.object({
    title: z.string(),
    siteName: z.string(),
    description: z.string(),
    discordUrl: z.url(),
    nav: z.object({
      label: z.string(),
      menuLabel: z.string(),
      discord: z.string(),
      links: z.array(link).length(3),
    }),
    hero: z.object({
      prompt: z.string(),
      quote: z.string(),
      cta: z.string(),
      more: z.object({ label: z.string(), href: z.string() }),
    }),
    events: z.object({
      label: z.string(),
      command: z.string(),
      columns: z.array(z.string()).length(3),
      soon: z.string(),
      pending: z.string(),
      pendingText: z.string(),
      completed: z.string(),
      all: z.string(),
      allHref: z.string(),
    }),
    routes: z.object({
      label: z.string(),
      items: z
        .array(
          z.object({
            cmd: z.string(),
            href: z.string(),
            title: z.string(),
            text: z.string(),
          }),
        )
        .min(1),
      discord: z.object({
        cmd: z.string(),
        title: z.string(),
        text: z.string(),
      }),
    }),
    footer: z.object({
      email: z.email(),
      contact: z.string(),
      discord: z.string(),
      links: z.array(
        z.object({
          key: z.enum(["source", "network"]),
          label: z.string(),
          href: z.url(),
        }),
      ),
    }),
    notFound: z.object({
      title: z.string(),
      text: z.string(),
      back: z.string(),
    }),
  }),
});

const pageHead = {
  title: z.string(),
  description: z.string(),
  prompt: z.string(),
};

const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "*.md" }),
  schema: z.discriminatedUnion("kind", [
    z.object({
      kind: z.literal("about"),
      ...pageHead,
      tocLabel: z.string(),
      whatis: z.object({
        heading: z.string(),
        paragraphs: z.array(z.string()).min(1),
      }),
      club: z.object({
        heading: z.string(),
        paragraphs: z.array(z.string()).min(1),
      }),
      faq: z.object({
        heading: z.string(),
        items: z
          .array(z.object({ question: z.string(), answer: z.string() }))
          .min(1),
      }),
    }),
    z.object({
      kind: z.literal("meetings"),
      ...pageHead,
      // Етикетът в [скоби] става линк към Discord в meetings.astro.
      // Без схемата линкът изчезва безшумно при редакция на съдържанието.
      lead: z
        .string()
        .regex(
          /\[[^\]]+\]/,
          "lead трябва да съдържа [етикет] за линка към Discord",
        ),
      upcoming: z.string(),
      past: z.string(),
      plannedStatus: z.string(),
      upcomingCommand: z.string(),
      upcomingEmpty: z.string(),
      discordCta: z.string(),
      roomLabel: z.string(),
      listCommand: z.string(),
      columns: z.array(z.string()).length(2),
      describeCommand: z.string(),
      fields: z.object({
        time: z.string(),
        room: z.string(),
        speaker: z.string(),
        materials: z.string(),
      }),
      materialsPrefix: z.string(),
    }),
  ]),
});

const meetings = defineCollection({
  loader: glob({ base: "./src/content/meetings", pattern: "**/*.md" }),
  schema: ({ image }) =>
    z.object({
      date: z.coerce.date(),
      time: z.string().optional(),
      title: z.string(),
      speaker: z.string(),
      room: z.string().optional(),
      status: z.enum(["past", "planned"]),
      materials: z.url().optional(),
      image: image().optional(),
      imageCaption: z.string().optional(),
    }),
});

export const collections = { home, pages, meetings };

import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { fromClubTime } from "./lib/time";

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
    skipLink: z.string(),
    ogImageAlt: z.string(),
    // Родителската организация в структурираните данни на `/`. `shortName` е
    // за места, където пълното име е твърде дълго (мястото в `/meetings.json`).
    school: z.object({ name: z.string(), shortName: z.string(), url: z.url() }),
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
      // Показва се на мястото на залата, когато срещата няма `room`.
      onlineRoom: z.string(),
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

/** Малки латински букви, цифри и тирета между тях. Без точки и без тире в края. */
const SLUG = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

/**
 * Името на файла е публична котва (`meetingHref` в `src/lib/meetings.ts`),
 * затова се проверява като всяко друго поле. Проверката е тук, а не в схемата:
 * Astro подава на Zod само frontmatter-а, но `generateId` вижда пътя и се
 * изпълнява при същия sync, тоест грешката излиза от `bun run typecheck`.
 */
const meetingId = ({ entry }: { entry: string }) => {
  const slug = entry.replace(/\.md$/, "");
  if (!SLUG.test(slug)) {
    throw new Error(
      `src/content/meetings/${entry}: името на файла става публичен адрес, затова е тематичен slug — само малки латински букви, цифри и тирета между тях (без точки, без дата, без тире в началото или края). Например docker-basics.md.`,
    );
  }
  return slug;
};

/**
 * По стенния часовник в София, без зона: `2026-11-05T16:10`. Зоната се
 * добавя тук, затова нататък `start` и `end` са точни моменти (`Date`).
 */
const clubTime = z.iso
  .datetime({
    local: true,
    error: "дата и час по софийско време, без зона: 2026-11-05T16:10",
  })
  .transform(fromClubTime);

const meetings = defineCollection({
  loader: glob({
    base: "./src/content/meetings",
    pattern: "**/*.md",
    generateId: meetingId,
  }),
  schema: ({ image }) =>
    z
      .object({
        start: clubTime,
        end: clubTime,
        title: z.string(),
        speaker: z.string(),
        // Без `room` срещата е онлайн, в Discord.
        room: z.string().optional(),
        status: z.enum(["past", "planned"]),
        materials: z.url().optional(),
        // Съотношението на кадъра (16:9) се проверява в `src/lib/meetings.ts`,
        // не тук: при glob loader `image()` е още път към файла, а размерите се
        // знаят едва когато Astro обработи кадъра.
        image: image().optional(),
        imageCaption: z.string().optional(),
      })
      .refine((meeting) => meeting.end > meeting.start, {
        message: "end трябва да е след start",
        path: ["end"],
        // Само ако полетата са минали: иначе грешният start дава и тази грешка.
        when: ({ issues }) => issues.length === 0,
      }),
});

export const collections = { home, pages, meetings };

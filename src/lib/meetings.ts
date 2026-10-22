import { type CollectionEntry, getCollection } from "astro:content";
import { TIME_ZONE } from "./time";

export type Meeting = CollectionEntry<"meetings">;

const byDate = (a: Meeting, b: Meeting) =>
  a.data.start.getTime() - b.data.start.getTime();

const RATIO = 16 / 9;
/** Допускът поема закръгляването при предишно преоразмеряване: 1280×721 минава. */
const RATIO_TOLERANCE = 0.01;

/**
 * Рамката на кадъра е 16:9 (`MeetingAccordion` го иска 800×450) и друго
 * съотношение се изрязва накриво — тихо, защото билдът остава зелен.
 * Проверката е тук, а не в схемата: Zod вижда само frontmatter-а, където
 * `image` е още път към файла. Размерите се знаят едва когато Astro обработи
 * кадъра, тоест на `bun run build`.
 */
function checkRatio(meeting: Meeting) {
  const { image } = meeting.data;
  if (!image) return;
  if (Math.abs(image.width / image.height - RATIO) > RATIO_TOLERANCE) {
    throw new Error(
      `src/content/meetings/${meeting.id}.md: кадърът е ${image.width}×${image.height}, а рамката е 16:9 — изрежи го, преди да го качиш.`,
    );
  }
}

/** `planned` по дата нагоре, `past` по дата надолу. */
export async function getMeetings() {
  const all = await getCollection("meetings");
  for (const meeting of all) checkRatio(meeting);

  const planned = all.filter((m) => m.data.status === "planned").sort(byDate);
  const past = all
    .filter((m) => m.data.status === "past")
    .sort(byDate)
    .reverse();
  return { planned, past };
}

/** Колко минали лекции показва блокът на `/`. */
const HOME_PAST_LIMIT = 2;

/**
 * Извадката за `/`: най-близката `planned` и най-скорошните `past`.
 * Лимитът е тук, не в CSS; `hasMore` е истина, когато има скрити лекции.
 */
export async function getHomeMeetings() {
  const { planned, past } = await getMeetings();
  return {
    next: planned[0],
    past: past.slice(0, HOME_PAST_LIMIT),
    hasMore: past.length > HOME_PAST_LIMIT,
  };
}

const dayFormat = new Intl.DateTimeFormat("en", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** 27.05.2026 в София, сглобено от частите. Intl с bg-BG би добавил « г.». */
export function formatDate(date: Date) {
  const parts = dayFormat.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value;
  return `${part("day")}.${part("month")}.${part("year")}`;
}

const clockFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** 16:10–17:30 в София. */
export const formatTime = ({ data }: Meeting) =>
  `${clockFormat.format(data.start)}–${clockFormat.format(data.end)}`;

/** `[repo]/pilot-docker-deep-dive/`: последният сегмент на адреса на материалите. */
export function materialsLabel(url: string, prefix: string) {
  const segment = new URL(url).pathname.split("/").filter(Boolean).pop();
  return `${prefix}/${segment}/`;
}

/** `/meetings#<id>`: котвата е id-то на записа, не се пише във frontmatter. */
export const meetingHref = (meeting: Meeting) => `/meetings#${meeting.id}`;

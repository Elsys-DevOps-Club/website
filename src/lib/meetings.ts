import { type CollectionEntry, getCollection } from "astro:content";

export type Meeting = CollectionEntry<"meetings">;

const byDate = (a: Meeting, b: Meeting) =>
  a.data.date.getTime() - b.data.date.getTime();

/** `planned` по дата нагоре, `past` по дата надолу. */
export async function getMeetings() {
  const all = await getCollection("meetings");

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

/** 27.05.2026, сглобено от ISO низ. Intl с bg-BG би добавил « г.». */
export function formatDate(date: Date) {
  const [year, month, day] = date.toISOString().slice(0, 10).split("-");
  return `${day}.${month}.${year}`;
}

/** `[repo]/pilot-docker-deep-dive/`: последният сегмент на адреса на материалите. */
export function materialsLabel(url: string, prefix: string) {
  const segment = new URL(url).pathname.split("/").filter(Boolean).pop();
  return `${prefix}/${segment}/`;
}

/** `/meetings#<id>`: котвата е id-то на записа, не се пише във frontmatter. */
export const meetingHref = (meeting: Meeting) => `/meetings#${meeting.id}`;

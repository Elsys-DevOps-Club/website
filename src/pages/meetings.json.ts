import type { APIRoute } from "astro";
import { getHome, getMeetingsPage } from "../lib/content";
import { getMeetings, type Meeting, meetingHref } from "../lib/meetings";

/** Твърдите пренасяния в Markdown са за редактора; извън сайта са шум. */
const reflow = (body = "") =>
  body
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s*\n\s*/g, " "))
    .join("\n\n") || null;

/**
 * Срещите от същата колекция като `/meetings`, в машинен вид.
 * Какво не влиза тук и защо е в `AGENTS.md`.
 */
export const GET: APIRoute = async ({ site }) => {
  const { school } = await getHome();
  const { roomLabel } = await getMeetingsPage();
  const { planned, past } = await getMeetings();

  const toJson = (meeting: Meeting) => {
    const { title, speaker, room, status, start, end } = meeting.data;
    return {
      id: meeting.id,
      url: new URL(meetingHref(meeting), site).href,
      status,
      title,
      speaker,
      start,
      end,
      // Без зала срещата е онлайн.
      location: room ? `${school.shortName}, ${roomLabel} ${room}` : null,
      description: reflow(meeting.body),
    };
  };

  return Response.json({ meetings: [...planned, ...past].map(toJson) });
};

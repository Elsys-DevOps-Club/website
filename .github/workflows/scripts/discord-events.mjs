/**
 * Всяка planned среща от /meetings.json е събитие в Discord сървъра на клуба:
 * липсващите се създават, променените се обновяват, а тези на бота, чиято
 * среща вече не е planned, се трият. Чужди събития не се пипат.
 *
 * Пуска се от discord-events.yml: след всеки деплой на main и веднъж на ден,
 * за да върне събитие, изтрито на ръка. Две пускания наведнъж биха създали
 * едно събитие два пъти, затова workflow-ът е с concurrency.
 *
 * Без зависимости: Node от runner-а и вграденият `fetch`.
 */
import { setTimeout as sleep } from "node:timers/promises";

const env = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`Липсва ${name} в средата.`);
  return value;
};
const token = env("DISCORD_BOT_TOKEN");
const guild = env("DISCORD_GUILD_ID");
const stageChannel = env("DISCORD_STAGE_CHANNEL_ID");
// Само продукцията: preview-тата са на pages.dev и не бива да се четат.
const site = env("SITE");

const API = "https://discord.com/api/v10";
const EVENTS = `/guilds/${guild}/scheduled-events`;

// https://discord.com/developers/docs/resources/guild-scheduled-event
const STAGE_INSTANCE = 1;
const EXTERNAL = 3;
const GUILD_ONLY = 2;
const SCHEDULED = 1;
const MAX_DESCRIPTION = 1000;

async function discord(method, path, body) {
  for (;;) {
    const response = await fetch(`${API}${path}`, {
      method,
      headers: {
        Authorization: `Bot ${token}`,
        "Content-Type": "application/json",
        "User-Agent": `DiscordBot (${site}, 1)`,
      },
      body: body && JSON.stringify(body),
    });
    if (response.status === 429) {
      const { retry_after } = await response.json();
      await sleep(retry_after * 1000);
      continue;
    }
    if (!response.ok) {
      throw new Error(
        `${method} ${path}: ${response.status} ${await response.text()}`,
      );
    }
    return response.status === 204 ? null : response.json();
  }
}

/**
 * Линкът към срещата е последният ред на описанието и е ключът: събитието
 * няма поле за собствено ID. Затова линкът не се трие на ръка в Discord.
 */
const key = (event) => event.description?.split("\n").at(-1);

/** Discord приема до 1000 знака: реже се текстът, линкът остава. */
function describe({ speaker, description, url }) {
  const room = MAX_DESCRIPTION - speaker.length - url.length - 4;
  const text =
    description?.length > room
      ? `${description.slice(0, room - 1)}…`
      : description;
  return [speaker, text, url].filter(Boolean).join("\n\n");
}

/** Без стая срещата е онлайн, в stage канала на клуба. */
function toEvent(meeting) {
  const event = {
    name: meeting.title,
    description: describe(meeting),
    scheduled_start_time: meeting.start,
    scheduled_end_time: meeting.end,
    privacy_level: GUILD_ONLY,
  };
  return meeting.location
    ? {
        ...event,
        entity_type: EXTERNAL,
        entity_metadata: { location: meeting.location },
        channel_id: null,
      }
    : {
        ...event,
        entity_type: STAGE_INSTANCE,
        channel_id: stageChannel,
        entity_metadata: null,
      };
}

/** Discord връща часа като `+00:00`, ние пращаме `Z`: сравняват се моментите. */
const comparable = (event) =>
  JSON.stringify([
    event.name,
    event.description,
    event.entity_type,
    event.channel_id ?? null,
    event.entity_metadata?.location ?? null,
    Date.parse(event.scheduled_start_time),
    Date.parse(event.scheduled_end_time),
  ]);

/** Discord иска корицата вътре в заявката, като data URI. */
async function cover(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  const type = response.headers.get("content-type");
  const data = Buffer.from(await response.arrayBuffer()).toString("base64");
  return `data:${type};base64,${data}`;
}

/** При създаване празните полета се пропускат; при обновяване `null` ги чисти. */
const withoutNulls = (event) =>
  Object.fromEntries(Object.entries(event).filter(([, v]) => v !== null));

const response = await fetch(`${site}/meetings.json`);
if (!response.ok) throw new Error(`${site}/meetings.json: ${response.status}`);
const { meetings } = await response.json();
const planned = meetings.filter((meeting) => meeting.status === "planned");

const me = await discord("GET", "/users/@me");
const current = (await discord("GET", EVENTS)).filter(
  (event) => event.creator_id === me.id,
);

for (const meeting of planned) {
  // Discord отказва час в миналото, затова започнала среща не се пипа.
  if (Date.parse(meeting.start) <= Date.now()) continue;
  const wanted = toEvent(meeting);
  const event = current.find((e) => key(e) === meeting.url);
  if (!event) {
    const image = meeting.image && (await cover(meeting.image));
    await discord("POST", EVENTS, withoutNulls({ ...wanted, image }));
    console.log(`Създадено: ${wanted.name}`);
    continue;
  }
  // Discord връща само хеш на корицата, затова смяна на картинката се вижда
  // само ако се е появила или изчезнала. Нова картинка на мястото на стара
  // се качва при следващата промяна по срещата.
  const imageChanged = Boolean(meeting.image) !== Boolean(event.image);
  if (
    event.status === SCHEDULED &&
    (imageChanged || comparable(event) !== comparable(wanted))
  ) {
    const image = meeting.image ? await cover(meeting.image) : null;
    await discord("PATCH", `${EVENTS}/${event.id}`, { ...wanted, image });
    console.log(`Обновено: ${wanted.name}`);
  }
}

for (const event of current) {
  if (event.status !== SCHEDULED) continue;
  if (planned.some((meeting) => meeting.url === key(event))) continue;
  await discord("DELETE", `${EVENTS}/${event.id}`);
  console.log(`Изтрито: ${event.name}`);
}

/**
 * Часовете на срещите се пишат по стенния часовник в София, без зона.
 * Зоната е име, не отместване: правилото знае кога е +02:00 и кога +03:00.
 */
export const TIME_ZONE = "Europe/Sofia";

const offsetFormat = new Intl.DateTimeFormat("en", {
  timeZone: TIME_ZONE,
  timeZoneName: "longOffset",
});

/**
 * `2026-11-05T16:10` по софийско време → точният момент.
 * Отместването се взима за самия ден, затова лятното часово време се спазва.
 * Сгрешено е само в часа на смяната (03:00–04:00 в неделя), а среща тогава няма.
 * С `Temporal` това е `PlainDateTime.from(local).toZonedDateTime(TIME_ZONE)`,
 * но Node, с който върви `astro build`, още го няма.
 */
export function fromClubTime(local: string) {
  const offset = offsetFormat
    .formatToParts(new Date(`${local}Z`))
    .find((part) => part.type === "timeZoneName")
    ?.value.replace("GMT", "");
  return new Date(`${local}${offset}`);
}

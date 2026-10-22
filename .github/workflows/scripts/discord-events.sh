#!/usr/bin/env bash
# Всяка planned среща от /meetings.json е събитие в Discord сървъра на клуба:
# липсващите се създават, променените се обновяват, а тези на бота, чиято
# среща вече не е planned, се трият. Чужди събития не се пипат.
#
# Пуска се от discord-events.yml: след всеки деплой на main и веднъж на ден,
# за да върне събитие, изтрито на ръка. Две пускания наведнъж биха създали
# едно събитие два пъти, затова workflow-ът е с concurrency.
#
# Среда: DISCORD_BOT_TOKEN, DISCORD_GUILD_ID, DISCORD_STAGE_CHANNEL_ID и SITE –
# само продукцията, защото preview-тата са на pages.dev и не бива да се четат.
set -euo pipefail

api=https://discord.com/api/v10
events="$api/guilds/$DISCORD_GUILD_ID/scheduled-events"

discord() {
  curl --fail-with-body --silent --show-error --retry 3 \
    -H "Authorization: Bot $DISCORD_BOT_TOKEN" \
    -H "Content-Type: application/json" \
    -A "DiscordBot ($SITE, 1)" "$@"
}

meetings=$(curl --fail --silent --show-error "$SITE/meetings.json")
me=$(discord "$api/users/@me" | jq -r .id)
current=$(discord "$events" | jq --arg me "$me" 'map(select(.creator_id == $me))')

# Линкът към срещата е последният ред на описанието и е ключът: събитието
# няма поле за собствено ID. Затова линкът не се трие на ръка в Discord.
plan=$(jq -n -c --argjson meetings "$meetings" --argjson current "$current" \
  --arg stage "$DISCORD_STAGE_CHANNEL_ID" '
  def instant: sub("\\.\\d+"; "") | sub("\\+00:00$"; "Z") | fromdateiso8601;
  def key: .description // "" | split("\n") | last;
  # Discord приема до 1000 знака; реже се текстът, линкът остава.
  def describe:
    (1000 - (.speaker + .url | length) - 4) as $room
    | (.description // "") as $text
    | [.speaker,
       (if ($text | length) > $room then $text[:$room - 1] + "…" else $text end),
       .url]
    | map(select(. != "")) | join("\n\n");
  def same($a; $b):
    [$a, $b] | map({name, description, entity_type,
      channel_id: (.channel_id // null),
      location: (.entity_metadata.location // null),
      start: (.scheduled_start_time | instant),
      end: (.scheduled_end_time | instant)})
    | .[0] == .[1];

  [$meetings.meetings[] | select(.status == "planned") | {
    url,
    future: ((.start | instant) > now),
    event: ({
      name: .title,
      description: describe,
      scheduled_start_time: .start,
      scheduled_end_time: .end,
      privacy_level: 2
    } + if .location
      then {entity_type: 3, entity_metadata: {location: .location}, channel_id: null}
      else {entity_type: 1, channel_id: $stage, entity_metadata: null} end)
  }] as $wanted

  # Discord отказва час в миналото, затова започнала среща не се пипа.
  | [$wanted[] | select(.future) | . as $w
      | ($current | map(select(key == $w.url)) | first) as $e
      | if $e == null then
          {method: "POST", path: "", name: .event.name,
           body: (.event | with_entries(select(.value != null)))}
        elif $e.status == 1 and (same($e; $w.event) | not) then
          {method: "PATCH", path: "/\($e.id)", name: .event.name, body: .event}
        else empty end]
  + [$current[] | select(.status == 1) | key as $k
      | select($wanted | any(.url == $k) | not)
      | {method: "DELETE", path: "/\(.id)", name}]
  | .[]')

while read -r action; do
  [ -n "$action" ] || continue
  method=$(jq -r .method <<<"$action")
  body=$(jq -c '.body // empty' <<<"$action")
  discord -X "$method" "$events$(jq -r .path <<<"$action")" \
    ${body:+--data "$body"} >/dev/null
  echo "$method $(jq -r .name <<<"$action")"
done <<<"$plan"

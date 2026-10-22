# Инфраструктура

## Хостинг и деплой

Cloudflare Pages. Деплой при push в `main`, preview на всеки PR, през `.github/workflows/deploy.yml`. Нула ръчни стъпки между push и продукция.

Pages проектът е Direct Upload, вързан за Cloudflare акаунта, а не за GitHub репото.

DNS: в `elsys-club-dns` стои CNAME `devops` → `devops-club-site.pages.dev`, `proxied: true`.

## Събития в Discord

Всяка среща със `status: planned` е събитие в Discord сървъра на клуба. Прави го `.github/workflows/discord-events.yml`, който чете `/meetings.json` от продукцията. Пуска се след всеки деплой на `main` и веднъж на ден по cron; ръчно – от Actions → Discord events → Run workflow.

Discord няма OIDC, затова токенът на бота е статичен. Пази го environment `discord` (Settings → Environments) с правило за деплой само от `main`. В него стоят:

- secret `DISCORD_BOT_TOKEN` – токенът на бота;
- variable `DISCORD_GUILD_ID` – ID на сървъра;
- variable `DISCORD_STAGE_CHANNEL_ID` – ID на stage канала, където са онлайн срещите.

На ниво сървър ботът има View Channels, Create Events и Manage Events. Manage Channel, Mute Members и Move Members има само в stage канала. При изтичане токенът се сменя с Reset Token в Developer Portal.

## Размер на страницата

Препоръка, не лимит: HTML + CSS под ~50 KB gzipped, без шрифтовете. Запасът е седморен — най-голямата страница (`/meetings`) е 6,8 KB gzipped заедно с целия CSS, мерено с `gzip -9` — затова няма CI проверка. Числото е ориентир, който държи оформлението просто; ако някога се доближи, въпросът е какво е добавено, не как да се вмести.

## Материали

Материалите от срещите живеят в отделно репо (`tues-devops-materials`), не тук. Сайтът носи само линк към тях през полето `materials`.

## Стак

Astro със статичен изход и нула клиентски JavaScript — няма рънтайм зависимости и няма заявки към трети страни. Какво е забранено и защо (без framework, без Tailwind, без клиентски JS) е в [`AGENTS.md`](../AGENTS.md); тук не се преповтаря.

## Без трети страни

Нула заявки към чужди домейни: шрифтовете са в репото, не от Google Fonts; без аналитика, трекъри, cookies и localStorage. Интересът се мери през отделни Discord покани за всеки канал (сайт / имейл / QR) и статистиката в Server Settings → Invites, не през скрипт на страницата.

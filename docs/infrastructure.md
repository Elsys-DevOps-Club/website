# Инфраструктура

## Хостинг и деплой

Cloudflare Pages. Деплой при push в `main`, preview на всеки PR, през `.github/workflows/deploy.yml`. Нула ръчни стъпки между push и продукция.

Pages проектът е Direct Upload, вързан за Cloudflare акаунта, а не за GitHub репото.

DNS: в `elsys-club-dns` стои CNAME `devops` → `<project>.pages.dev`, `proxied: true`.

## Материали

Материалите от срещите живеят в отделно репо (`tues-devops-materials`), не тук. Сайтът носи само линк към тях през полето `materials`.

## Стак

Astro със статичен изход и нула клиентски JavaScript — няма рънтайм зависимости и няма заявки към трети страни. Какво е забранено и защо (без framework, без Tailwind, без клиентски JS) е в [`AGENTS.md`](../AGENTS.md); тук не се преповтаря.

## Без трети страни

Нула заявки към чужди домейни: шрифтовете са в репото, не от Google Fonts; без аналитика, трекъри, cookies и localStorage. Интересът се мери през отделни Discord покани за всеки канал (сайт / имейл / QR) и статистиката в Server Settings → Invites, не през скрипт на страницата.

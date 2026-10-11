# devops-club-site

Сайтът на DevOps клуба в ТУЕС: **[devops.elsys.club](https://devops.elsys.club)**

Astro без UI framework, Bun, Biome и ръчен CSS. Сайтът не изпраща JavaScript —
единственото изключение е малък inline скрипт на 404 страницата.

Спецификацията е в [`docs/spec.md`](docs/spec.md), а как се добавя среща и как
се прави PR — в [`CONTRIBUTING.md`](CONTRIBUTING.md).

## Локална разработка

Нужен е [Bun](https://bun.sh); версията е в `.bun-version`.

```bash
bun install
bun run dev        # http://localhost:4321
bun run build      # статичен изход в dist/
bun run preview    # преглед на dist/
bun run check      # Biome: lint и формат
bun run format     # Biome: поправя форматирането
bun run typecheck  # astro check: типове и frontmatter срещу схемите
```

## Страници

- `/` — hero с бутон за Discord, таблица `kubectl get events` (генерирана от срещите), връзки към подстраниците.
- `/meetings` — предстоящи срещи и архив с материалите.
- `/about` — какво е DevOps, какво правим в клуба, въпроси.
- `404` — страница за непознат адрес. Показва грешния сегмент в командата `kubectl get page` и в съобщението за грешка.

Пътищата са на английски, текстовете са на български.

## Как се добавя среща

Нов файл в `src/content/meetings/` и pull request. Не се пипа нищо друго.
Името на файла е публична котва (`/meetings#<име на файла>`), затова е
тематичен slug с малки латински букви — не дата. Подробностите, включително
къде отива кадърът, са в [`CONTRIBUTING.md`](CONTRIBUTING.md).

```yaml
---
date: 2026-10-15
time: 16:10–17:30        # по избор
title: Заглавие на лекцията
speaker: Име Фамилия
room: "8.3.1"            # по избор
status: planned          # planned | past
materials: https://...   # по избор, за минали срещи
image: ../../assets/meetings/docker-basics.jpg   # по избор, кадър 16:9
imageCaption: Подпис към кадъра                  # по избор
---

По избор: един до три абзаца обикновен текст. Показват се под блока
`kubectl describe`. Всеки е до три реда на десктоп (T3).
```

- `planned` се показва в «Предстоящи», по дата нагоре. Ако няма нито една, се показва терминалният блок `kubectl get meetings --field-selector status=Pending`.
- `past` се показва в «Досега», по дата надолу.
- Най-близката `planned` и последните две `past` влизат в таблицата на `/`.
- Без `materials` няма ред `Materials`. Без `image` няма кадър и място за него.

## Къде са текстовете

- `src/content/home.md` — Discord поканата, навигацията, футърът (имейлът е една стойност: `footer.email`), текстовете на `/` и на 404.
- `src/content/pages/about.md` — `/about`: какво е DevOps, какво правим в клуба, FAQ.
- `src/content/pages/meetings.md` — заглавията и етикетите на `/meetings`.

Нито един шаблон не държи видим текст. Схемите в `src/content.config.ts`
валидират всеки файл, затова `bun run typecheck` хваща грешка във frontmatter.

Терминалният блок на 404 е в шаблона (`src/pages/404.astro`), не в
съдържанието: редовете му са свързани със скрипта.

## JavaScript

Сайтът не изпраща JavaScript, с едно изключение: inline скрипт в 404, който
показва грешния адрес в терминалния блок. Без JS блокът остава с `page`.
Всичко останало работи без JS, включително менюто (`details`) и акордеоните.

## Бранд и тема

`public/brand/colors.css` е непроменен от бранд кита и се зарежда с `<link>`.
Токените в `src/styles/global.css` само ги именуват по роля. Шрифтът
(JetBrains Mono) в `public/fonts/` е със своя OFL лиценз.

Тъмната тема е по подразбиране. Светлата се включва от
`prefers-color-scheme: light`, без превключвател и без JavaScript. И двете
групи токени са в началото на `src/styles/global.css`. Логата се сменят с
`<picture>`, не с `filter`. Единственото изключение е размазването на
страницата зад отвореното меню на тесен екран.

## Деплой

Push към `main` публикува в Cloudflare Pages, а всеки pull request получава
preview. Виж [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## Лиценз

Репото е под два лиценза, защото кодът и текстовете не се преизползват
по един и същ начин:

| Какво | Лиценз |
|---|---|
| Кодът (шаблони, стилове, конфигурация) | MIT — [`LICENSE`](LICENSE) |
| Текстовете (`src/content/**`, `docs/**`) | CC BY 4.0 — [`LICENSE-CONTENT`](LICENSE-CONTENT) |
| Брандът (`public/brand/**`) | **изваден от двата**, всички права запазени — [`public/brand/COPYRIGHT.txt`](public/brand/COPYRIGHT.txt) |
| Шрифтът (`public/fonts/**`) | SIL OFL — [`OFL-JetBrainsMono.txt`](public/fonts/OFL-JetBrainsMono.txt) |

CC BY работи само ако атрибуцията е указана. За текстовете тя е:
`TUES DevOps клуб — devops.elsys.club`.

Брандът е изваден, защото MIT дава разрешение по авторско право, а логото е
по-близо до марка: под чист MIT някой законно би сложил надписа „TUES DevOps“
на своя сайт. **Форкни сайта, смени бранда — кодът е твой.**

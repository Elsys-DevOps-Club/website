# devops-club-site

Сайтът на DevOps клуба в ТУЕС: **[devops.elsys.club](https://devops.elsys.club)**

Astro без UI framework, Bun, Biome и ръчен CSS. Сайтът не изпраща JavaScript —
единственото изключение е малък inline скрипт на 404 страницата.

Какво прави сайтът и какво съзнателно не прави е в
[`docs/scope.md`](docs/scope.md); останалата референция е индексирана в
[`docs/`](docs/README.md). Как се добавя среща и как се прави PR — в
[`CONTRIBUTING.md`](.github/CONTRIBUTING.md).

## Локална разработка

Нужен е [Bun](https://bun.sh); версията е в `.bun-version`. Командите са в
[`package.json`](package.json), стъпките — в
[`CONTRIBUTING.md`](.github/CONTRIBUTING.md).

## Страници

Маршрутите са файловете в [`src/pages/`](src/pages/). Пътищата са на
английски, текстовете са на български.

## Как се добавя среща

Нов файл в `src/content/meetings/` и pull request. Не се пипа нищо друго.
Името на файла е публична котва (`/meetings#<име на файла>`), затова е
тематичен slug с малки латински букви — не дата. Полетата, кадърът и
проверките са в [`CONTRIBUTING.md`](.github/CONTRIBUTING.md).

## Къде са текстовете

Всеки видим низ е в `src/content/**` и се валидира от схемите в
`src/content.config.ts` — затова `bun run typecheck` хваща грешка във
frontmatter. Нито един шаблон не държи видим текст.

Терминалният блок на 404 е в шаблона (`src/pages/404.astro`), не в
съдържанието: редовете му са свързани със скрипта.

## Бранд и тема

`public/brand/colors.css` е непроменен от бранд кита и се зарежда с `<link>`;
правилото стои в [`COPYRIGHT.txt`](public/brand/COPYRIGHT.txt) до него.
Токените в `src/styles/global.css` само ги именуват по роля. Темата,
контрастът и шрифтът са в [`docs/brand.md`](docs/brand.md).

## Деплой

Cloudflare Pages, без ръчна стъпка между push и продукция. Виж
[`docs/infrastructure.md`](docs/infrastructure.md).

## Лиценз

Репото е под два лиценза, защото кодът и текстовете не се преизползват
по един и същ начин:

| Какво | Лиценз |
|---|---|
| Кодът (шаблони, стилове, конфигурация) | MIT — [`LICENSE`](LICENSE) |
| Текстовете (`src/content/**`, `docs/**` без `docs/brand/**`) | CC BY 4.0 — [`LICENSE-CONTENT`](LICENSE-CONTENT) |
| Брандът (`public/brand/**`, `docs/brand/**`) | **изваден от двата**, всички права запазени — [`public/brand/COPYRIGHT.txt`](public/brand/COPYRIGHT.txt) |
| Шрифтът (`public/fonts/**`) | SIL OFL — [`OFL-JetBrainsMono.txt`](public/fonts/OFL-JetBrainsMono.txt) |

CC BY работи само ако атрибуцията е указана. За текстовете тя е:
`TUES DevOps клуб — devops.elsys.club`.

Брандът е изваден, защото MIT дава разрешение по авторско право, а логото е
по-близо до марка: под чист MIT някой законно би сложил надписа „TUES DevOps“
на своя сайт. **Форкни сайта, смени бранда — кодът е твой.**

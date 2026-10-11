# devops-club-site

Сайтът на DevOps клуба в ТУЕС: [devops.elsys.club](https://devops.elsys.club). Спецификацията е в [`docs/spec.md`](docs/spec.md).

Astro без UI framework, Bun, Biome и ръчен CSS. Единственият JavaScript е малък скрипт на 404 страницата.

## Локална разработка

Нужен е [Bun](https://bun.sh).

```bash
bun install
bun run dev      # http://localhost:4321
bun run build    # статичен изход в dist/
bun run preview  # преглед на dist/
bun run check    # Biome: lint и формат
bun run format   # Biome: поправя форматирането
```

## Страници

- `/` — hero с бутон за Discord, таблица `kubectl get events` (генерирана от срещите), връзки към подстраниците.
- `/meetings` — предстоящи срещи и архив с материалите.
- `/about` — за кого е клубът, теми, изнеси лекция, въпроси.
- `404` — страница за непознат адрес. Показва грешния адрес в командата `kubectl get page` и в съобщението за грешка.

Пътищата са на английски, текстовете са на български.

## Как се добавя среща

Нов файл в `src/content/meetings/` и pull request. Не се пипа нищо друго.

```yaml
---
date: 2026-10-15
time: 16:10–17:30        # по избор
title: Заглавие на лекцията
speaker: Име Фамилия
room: "8.3.1"            # по избор
status: planned          # planned | past
materials: https://...   # по избор, за минали срещи
image: ../../assets/meetings/2026-10-15.jpg   # по избор, кадър 16:9
imageCaption: Подпис към кадъра                # по избор
---

По избор: един до три абзаца обикновен текст. Показват се под блока
`kubectl describe`. Всеки е до три реда на десктоп (T3).
```

- `planned` се показва в «Предстоящи», по дата нагоре. Ако няма нито една, се показва терминалният блок `kubectl get meetings --field-selector status=Pending`.
- `past` се показва в «Досега», по дата надолу.
- Най-близката `planned` и последните две `past` влизат в таблицата на `/`.
- Без `materials` няма ред `Materials`. Без `image` няма кадър и място за него.
- Връзката към срещата е `/meetings#<име на файла>`.

## Къде са текстовете

- `src/content/home.md` — Discord поканата, навигацията, футърът (имейлът е една стойност: `footer.email`), текстовете на `/` и на 404.
- `src/content/pages/about.md` — `/about`: какво е DevOps, какво правим в клуба, изнеси лекция, FAQ.
- `src/content/pages/meetings.md` — заглавията и етикетите на `/meetings`.

Терминалният блок на 404 е в шаблона (`src/pages/404.astro`), не в съдържанието: редовете му са свързани със скрипта.

## JavaScript

Сайтът не изпраща JavaScript, с едно изключение: inline скрипт в 404, който показва грешния адрес в терминалния блок. Без JS блокът остава с `page`. Всичко останало работи без JS, включително менюто (`details`) и акордеоните.

## Бранд и тема

`public/brand/colors.css` е непроменен от бранд кита и се зарежда с `<link>`. Токените в `src/styles/global.css` само ги именуват по роля. Шрифтът (JetBrains Mono) в `public/fonts/` е със своя OFL лиценз.

Тъмната тема е по подразбиране. Светлата се включва от `prefers-color-scheme: light`, без превключвател и без JavaScript. И двете групи токени са в началото на `src/styles/global.css`, със стойности от бранд токените. Логата се сменят с `<picture>`, не с `filter`. Единственото изключение е размазването на страницата зад отвореното меню на тесен екран.

## Деплой

Push към `main` публикува в Cloudflare Pages, а всеки pull request получава preview. Виж `.github/workflows/deploy.yml`.

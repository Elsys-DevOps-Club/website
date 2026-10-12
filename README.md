<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/brand/wordmark-on-dark.svg">
  <img src="public/brand/wordmark-on-light.svg" alt="TUES DevOps" width="320">
</picture>

---

![Astro](https://img.shields.io/badge/Astro-0B1220?style=flat&logo=astro&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-0B1220?style=flat&logo=bun&logoColor=white)
![Biome](https://img.shields.io/badge/Biome-0B1220?style=flat&logo=biome&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-0B1220?style=flat&logo=cloudflarepages&logoColor=white)
![код: MIT](https://img.shields.io/badge/%D0%BA%D0%BE%D0%B4-MIT-326CE5?style=flat&labelColor=0B1220)
![текст: CC BY 4.0](https://img.shields.io/badge/%D1%82%D0%B5%D0%BA%D1%81%D1%82-CC_BY_4.0-326CE5?style=flat&labelColor=0B1220)

Изходният код на [сайта на DevOps клуба](https://devops.elsys.club).

Написан е на статичен Astro без UI framework с ръчно писан CSS и **почти никакъв client-side JavaScript**. Всеки видим текст е Markdown в `src/content/**`, валидиран от Zod схема за лесна поддържка. 

## Локално пускане

```bash
bun install
bun run dev     # http://localhost:4321
```

Останалите команди са в [`package.json`](package.json), а стъпките – в [`CONTRIBUTING.md`](.github/CONTRIBUTING.md).

## Архитектура

| Къде | За какво |
|---|---|
| [`docs/scope.md`](docs/scope.md) | какво прави сайтът и какво съзнателно не прави |
| [`docs/infrastructure.md`](docs/infrastructure.md) | хостинг, деплой |
| [`docs/brand.md`](docs/brand.md) | тема, контраст, типография |
| [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) | как се допринася, локално пускане, PR |
| [`AGENTS.md`](AGENTS.md) | инварианти |
| [`src/content.config.ts`](src/content.config.ts) | схемата на съдържанието в сайта |
| [`src/pages/`](src/pages/) | страниците на сайта |

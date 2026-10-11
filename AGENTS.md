# AGENTS.md

All prose, content and code comments in this repository are in **Bulgarian**.
Only English artifacts are commit subjects, identifier names and this file.

This file lists invariants — things that are already decided and that a change
should not quietly undo. For how to run and contribute, read
[`CONTRIBUTING.md`](CONTRIBUTING.md); for what the site must do, read
[`docs/spec.md`](docs/spec.md).

## Invariants

- **Zero client-side JavaScript.** Astro ships none by default and that is the
  point (N2). A `client:*` directive is a bug, not an optimisation. The single
  exception is the inline script on the 404 page, and it stays inline.
- **No text in `.astro` files.** Every visible string lives in
  `src/content/**` and is validated by a Zod schema in `src/content.config.ts`.
  Adding a string to a template is the one refactor that breaks the handover
  promise: the next maintainer edits Markdown, not templates.
- **`public/brand/colors.css` is byte-for-byte from the brand kit.** Do not
  edit it or reformat it. `src/styles/global.css` only names those tokens by
  role. Biome is configured to skip the folder for this reason.
- **No Tailwind, no UI framework.** Refused deliberately: at this size it adds
  configuration without benefit. Hand-written CSS with custom properties.
- **Biome owns formatting.** Do not hand-format; run `bun run format`. Do not
  add Prettier or ESLint.
- **Never an `assets` pattern in `.gitignore`.** A pattern without a leading
  slash matches at every depth, so it also hides `src/assets/`, where meeting
  photos live. This was a real bug; do not reintroduce it.
- **Two measured constants are explained only in the comment next to them** —
  the footer logo width in `Footer.astro` and the hero terminal offset in
  `Hero.astro`. Do not copy those explanations into prose files; a copy drifts.
  Changing the font invalidates both and they must be measured again.
- **Commit style lives in [`.gitmessage`](.gitmessage).** Read it before
  committing. No commit bodies, no trailers.

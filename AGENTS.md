# AGENTS.md

All prose, content and code comments in this repository are in **Bulgarian**.
Only English artifacts are commit subjects, identifier names and this file.

This file lists invariants — things that are already decided and that a change
should not quietly undo. For how to run and contribute, read
[`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md); for what the site is for
and what it deliberately refuses, read [`docs/scope.md`](docs/scope.md). The
rest of the reference is indexed in [`docs/README.md`](docs/README.md).

Ground truth is the code, and the schema in `src/content.config.ts`. This file
records decisions and will age; where the two disagree, believe the code.

## Verify before you claim

Before you say a change is done, run

```bash
bun run check && bun run typecheck && bun run build
```

and confirm zero errors. A failing `check` is fixed with `bun run format`, not
by hand.

## Invariants

- **Zero client-side JavaScript.** Astro ships none by default and that is the
  point. A `client:*` directive is a bug, not an optimisation. The single
  exception is the inline script on the 404 page, and it stays inline.
- **No text in `.astro` files.** Every visible string lives in
  `src/content/**` and is validated by a Zod schema in `src/content.config.ts`.
  Adding a string to a template is the one refactor that breaks the handover
  promise: the next maintainer edits Markdown, not templates.
- **`public/brand/colors.css` is vendored verbatim.** The rule and its reason
  sit next to the file, in
  [`public/brand/COPYRIGHT.txt`](public/brand/COPYRIGHT.txt).
- **No Tailwind, no UI framework.** Refused deliberately: at this size it adds
  configuration without benefit. Hand-written CSS with custom properties.
- **Biome owns formatting.** Do not hand-format; run `bun run format`. Do not
  add Prettier or ESLint.
- **Never an `assets` pattern in `.gitignore`.** The reason is the comment at
  [`.gitignore:14-15`](.gitignore#L14-L15), next to the rule it guards.
- **Two measured constants are explained only in the comment next to them** —
  the footer logo width in `Footer.astro` and the hero terminal offset in
  `Hero.astro`. Do not copy those explanations into prose files; a copy drifts.
  Changing the font invalidates both and they must be measured again.
- **Commit style lives in [`.gitmessage`](.gitmessage).** Read it before
  committing. No commit bodies, no trailers.

## Do not

- Edit `bun.lock` by hand. It changes through `bun install` / `bun add` only.
- Add a dependency without justifying it. There are six today — three runtime,
  three dev — and the list in `package.json` is meant to be read at a glance.
- Touch `dist/`, `.astro/` or `node_modules/`. All three are generated.
- Edit the vendored files in `public/brand/**` or `public/fonts/**`.
- Commit `.claude/`. It is ignored on purpose; the reason is in `.gitignore`.
- Rename or delete a file in `src/content/meetings/`. The filename is a public
  anchor; CI fails the pull request that does it.
- Write a commit body or a trailer, `Co-Authored-By` included.
- Change the contact email in one place only. It lives in three:
  `src/content/home.md`, `.github/CONTRIBUTING.md` and
  `.github/CODE_OF_CONDUCT.md`.

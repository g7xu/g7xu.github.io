# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An **Astro** static site at [g7xu.github.io](https://g7xu.github.io). File layout, install, and the command list live in `README.md`; this file holds only what the code does not say for itself.

## Commands

Scripts are listed in `package.json` and `README.md`. Two things they don't say:

- The deploy workflow runs `format:check`, `lint`, and `check` before `build`, so run all three before pushing.
- `dev` and `build` first run `copy:wiki-images`, which copies `obs_notes/attachments/` into the gitignored `public/wiki-images/`.

A husky pre-commit hook runs `lint-staged` on staged files.

## Architecture Notes

Content is data-driven (`src/data/*.ts`, `src/content/blog/`) and separated from presentation. Non-obvious points:

- **`obs_notes/` is not inert.** `learning-wiki.astro` reads every `.md` under `obs_notes/public/` at build time and renders it at `/learning-wiki/`. Everything else in the vault is private and untracked (see `.gitignore`).
- **`BlogCard.astro` renders a typographic row**, not a card, despite the name.
- **`src/utils/lang.ts` must stay DOM-free**: both build-time templates and the client script `bilingual.ts` import it.
- `BaseLayout.astro` is the HTML shell (head, Navbar, Footer, JSON-LD) and takes a `theme` prop (see Themes). `bilingual.ts` is loaded globally from it.

## Design System

The site follows a **warm, typographic, content-first developer's workshop** aesthetic. When making styling changes, preserve these rules.

### Tokens (`src/styles/global.css`)

Values live in the stylesheet; these are the roles.

- `--bg` / `--bg-surface` — page background and a subtle elevated tint (slate-50 / slate-100)
- `--fg` / `--fg-muted` — body text and secondary text (dates, colophon)
- `--border` — hairlines
- `--link` matches body text and is underlined; `--link-hover` lightens it
- `--accent` — warm rust, used sparingly (current-page nav indicator)
- `--text-base`, `--leading`, `--measure` — layout-load-bearing; don't retune casually

### Themes

`BaseLayout` takes a `theme` prop (default `'workshop'`) and stamps it as `data-theme` on `<body>`. A theme block in `global.css` overrides the `--nav-*` token group so the navbar adopts the page's palette. `travel.astro` uses `theme="coffee"`, a cream/espresso palette whose `--nav-bg` gradient mirrors the map background. Adding a theme = one block in `global.css` + `theme="…"` on the page.

### Typography

- Body & headings: **Manrope** (Google Fonts, variable), loaded via `<link>` in `BaseLayout.astro`.
- Body 400 weight with `font-feature-settings: 'liga', 'calt'` and `font-optical-sizing: auto`.
- Heading weights: h1 = 700, h2 = 600, h3 = 500, slight negative letter-spacing.
- Mono: `ui-monospace, 'JetBrains Mono', 'Fira Code', monospace`

### Anti-patterns (do not introduce)

- No card components anywhere except the project sections on the homepage (`index.astro` + `ProjectCard.astro` deliberately use a bordered/shadowed grid of image-led cards). Other lists stay typographic.
- No drop shadows or gradients on content surfaces. Intentional exceptions: the coffee theme's nav/page gradient, and the travel map's polaroids/pins.
- No SaaS-blue (#007acc, indigo, #3b82f6 etc.)
- No `Inter` as a font choice
- No hero photo on the homepage
- No card thumbnails on blog/project lists; use typographic rows with prominent dates

### Layout patterns

- Lists of content render as typographic rows (see `.blog-list__item` in `blog.css`): `<time>` left, title + description right, hairline `border-bottom`.
- Footer follows the two-row pattern (social row + colophon row) — see `Footer.astro`.

## Branch Strategy

- `master` is production and auto-deploys to GitHub Pages on push (`.github/workflows/deploy.yml`).
- Everything else happens on short-lived `feature/*` and `fix/*` branches.
- Workflow actions are pinned to full commit SHAs with a `# vX.Y.Z` comment. Don't switch them back to floating tags; Dependabot (`.github/dependabot.yml`) proposes the bumps.
- **Never commit, push, or open a PR without Jason's explicit permission.** Leave changes in the working tree, summarize them, and ask. Permission granted for one change does not carry over to the next.

## Adding Content

**New blog post:** create a `.md` file in `src/content/blog/`. The schema (with field docs) is `src/content.config.ts`; a typical header:

```yaml
---
title: 'Post Title'
titleAlt: '文章标题' # optional — makes the heading a bilingual toggle
excerpt: 'Short description'
format: essay # essay (default) | note
date: '2026-01-15'
category: 'Tools'
---
```

`essay` is long-form and can use an `excerpt`. A `note` renders its Markdown body directly in the listing, for a sentence or short thought.

**New bilingual text:** any text can be a click-to-switch en/zh pair; both variants are hand-written, never machine-translated. In `.astro` files use `<Bi en="…" zh="…" initial="zh" />`; in Markdown write `<span class="bilingual" data-alt="中文">Chinese</span>`, where the visible text is the default language. Constraints the mechanism imposes (details at the top of `src/scripts/bilingual.ts`):

- Both variants must be plain text — the swap replaces `textContent`, so nested markup is lost.
- Keep phrases short enough for one line; the span is `inline-block` so it cannot break across lines.
- Avoid `$` inside wiki-note spans; the wiki's math extractor claims it.

**New project:** add an entry to `allProjects` in `src/data/projects.ts` (shape documented there). Images go in `public/images/`.

**New quote:** edit `src/data/quotes.ts`. **Always ask Jason for the `weight` (1–5) before adding the entry — never pick one silently.** Weight is the only knob on a quote; its semantics are documented on the `Quote` interface.

**New coffee shop:** add an entry to `src/data/coffeeShops.ts`; photo workflow in `src/assets/travel/README.md`.

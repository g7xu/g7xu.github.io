# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An **Astro** static site. Deployed automatically to GitHub Pages at [g7xu.github.io](https://g7xu.github.io) via GitHub Actions from the `master` branch.

## Commands

```bash
# Install dependencies
npm install

# Start local dev server (with hot reload)
npm run dev
# Visit http://localhost:4321

# Production build (output in ./dist/)
npm run build

# Preview production build locally
npm run preview

# Clean build artifacts
npm run clean

# CI gates — deploy runs ALL THREE before build, so run them before pushing:
npm run format:check   # prettier
npm run lint           # eslint
npm run check          # astro check (types)

# Clean + build + print build stats (does not deploy; push to master for that)
bash scripts/deploy.sh
```

A husky pre-commit hook runs `lint-staged` (eslint + prettier on staged files). `dev` and `build` first run `copy:wiki-images`, which copies `obs_notes/attachments/` into `public/wiki-images/` (gitignored).

## Architecture

### Content Management

Content is data-driven and separated from presentation:

- **`src/data/author.ts`** — Author constants (name, location, email, avatar, favicon, links, site title/description)
- **`src/data/projects.ts`** — One `allProjects: Project[]` array. Each entry: `title`, `description`, `tags`, `categories`, `githubUrl`, optional `websiteUrl` / `imageUrl`. Categories are `spotlight`, `building-the-wheel`, `full-stack-applications`, `data-science`; pages group via `getProjectsByCategory()` / `getAllTags()`.
- **`src/data/coffeeShops.ts`** — Coffee shops plotted on the `/travel/` map; photos live in `src/assets/travel/` (see its README).
- **`src/data/quotes.ts`** — Quotes for the `/quotes/` cloud; `weight` semantics documented on the `Quote` interface.
- **`src/content/blog/`** — Blog posts as Markdown files with Zod-validated frontmatter.
- **`src/content.config.ts`** — Astro content collection schema for blog posts.

### Pages

All site pages live in `src/pages/`. Key pages:

- `src/pages/index.astro` — Homepage: author sidebar + a two-paragraph hero lead (no lists, no photo)
- `src/pages/projects.astro` — Category-grouped project card grid (`/projects/`)
- `src/pages/blog/index.astro` — Blog listing, typographic rows with a category sidebar (`/blog/`)
- `src/pages/blog/[...slug].astro` — Dynamic blog post pages
- `src/pages/learning-wiki.astro` — Wiki knowledge graph (`/learning-wiki/`)
- `src/pages/quotes.astro` — Zoomable typographic quote cloud (`/quotes/`)
- `src/pages/travel.astro` — Interactive coffee map; the largest page in the repo (`/travel/`)
- `src/pages/beyond-tech/` — Unlinked from the nav; mostly "coming soon" placeholders. `/travel/` superseded `beyond-tech/coffee-shops` — don't build that twice.

### Client Scripts (`src/scripts/`)

- `bilingual.ts` — Click-to-switch en/zh text spans; loaded globally from `BaseLayout`
- `quote-cloud.ts` — Quote cloud packing, zoom/pan, entrance animation
- `learning-wiki.ts` — d3 force graph, note rendering, search
- `wiki-callouts.ts`, `wiki-multi-column.ts` — Obsidian-syntax renderers used by `learning-wiki.ts`

### Styling

Custom styles live in `src/styles/`. Each file corresponds to a concern:

- `global.css` — Design tokens, per-page theme blocks, resets, typography, shared heading/email utilities
- `sidebar.css` — Author sidebar
- `navbar.css` — Top navigation bar
- `projects.css` — Project card grid + tag filter
- `blog.css` — Blog listing and post styles
- `learning-wiki.css` — Wiki 3-panel shell + graph (the largest stylesheet)
- `travel.css` — Coffee map
- `quote-cloud.css` — Quote cloud
- `beyond-tech.css` — Beyond-Tech placeholder pages

### Components

Reusable Astro components in `src/components/`:

- `Navbar.astro` — Sticky top navbar
- `Sidebar.astro` — Author bio sidebar (used on homepage)
- `Footer.astro` — Site footer
- `ProjectCard.astro` — Project card
- `BlogCard.astro` — Blog listing row (typographic, despite the name), `BlogSidebar.astro` — category filter
- `StructuredData.astro` — JSON-LD SEO schema
- `Bi.astro` — Bilingual en/zh toggle span (see Adding Content)

### Utils (`src/utils/`)

- `lang.ts` — Han-script detection and `lang` tagging; DOM-free so both build-time templates and `bilingual.ts` can import it

### Layouts

- `BaseLayout.astro` — HTML shell: `<head>`, Navbar, Footer, structured data. Takes a `theme` prop (see Themes).
- `SidebarLayout.astro` — Two-column: author sidebar + main content (homepage only)
- `BlogPostLayout.astro` — Individual blog post layout

### Public Assets

Static files served as-is from `public/`:

- `public/images/` — All site images (bio photo, project covers, etc.)
- `public/files/` — PDF files (resume, CV)
- `public/wiki-images/` — Generated on every dev/build from `obs_notes/attachments/`; gitignored

### Obsidian Notes (`obs_notes/`)

An Obsidian vault, but **not inert**: `learning-wiki.astro` reads every `.md` under `obs_notes/public/` at build time and renders it at `/learning-wiki/`, and `obs_notes/attachments/` is copied into `public/wiki-images/`. Everything else in the vault is private and untracked (see `.gitignore`).

## Design System

The site follows a **warm, typographic, content-first developer's workshop** aesthetic. When making styling changes, preserve these rules.

### Color tokens (`src/styles/global.css`)

- `--bg: #F8FAFC` — page background (slate-50)
- `--bg-surface: #F1F5F9` — subtle elevated tint (slate-100)
- `--fg: #0F172A` — body text (slate-900)
- `--fg-muted: #64748B` — secondary text, dates, colophon (slate-500)
- `--border: #E2E8F0` — hairlines (slate-200)
- `--link: #0F172A` — links match body text, underlined
- `--link-hover: #475569`
- `--accent: #C2410C` — warm rust, used sparingly (current-page nav indicator)
- `--text-base: 17px`, `--leading: 1.55`, `--measure: 62ch` — layout-load-bearing
- `--primary-color` etc. are legacy aliases consumed only by `learning-wiki.css` — don't add new consumers

### Themes

`BaseLayout` takes a `theme` prop (default `'workshop'`) and stamps it as `data-theme` on `<body>`. A theme block in `global.css` overrides the `--nav-*` token group so the navbar adopts the page's palette. `travel.astro` uses `theme="coffee"`, which swaps in a cream/espresso palette whose `--nav-bg` gradient mirrors the map page background. Adding a theme = one block in `global.css` + `theme="…"` on the page.

### Typography

- Body & headings: **Manrope** (Google Fonts, variable). Loaded via `<link>` in `BaseLayout.astro`.
- Body: 17px / 1.55 / weight 400, with `font-feature-settings: 'liga', 'calt'` and `font-optical-sizing: auto`
- Heading weights: h1 = 700, h2 = 600, h3 = 500. Slight negative letter-spacing (-0.01em).
- Mono: `ui-monospace, 'JetBrains Mono', 'Fira Code', monospace`

### Anti-patterns (do not introduce)

- No card components anywhere except the projects page (`src/pages/projects.astro` + `ProjectCard.astro` deliberately use a bordered/shadowed grid of image-led cards). Other lists stay typographic.
- No drop shadows or gradients on content surfaces. Intentional exceptions: the coffee theme's nav/page gradient, and the travel map's polaroids/pins.
- No SaaS-blue (#007acc, indigo, #3b82f6 etc.)
- No `Inter` as a font choice
- No hero photo on the homepage
- No card thumbnails on blog/project lists; use typographic rows with prominent dates

### Layout patterns

- Lists of content render as typographic rows (see `.blog-list__item` in `blog.css`): `<time>` left, title + description right, hairline `border-bottom`.
- Footer follows the two-row pattern (social row + colophon row) — see `src/components/Footer.astro`.

## Branch Strategy

- `master` — production branch, auto-deployed to GitHub Pages via GitHub Actions
- Everything else happens on short-lived `feature/*` and `fix/*` branches

## Adding Content

**New blog post:** Create a `.md` file in `src/content/blog/` with this frontmatter (schema: `src/content.config.ts`):

```yaml
---
title: 'Post Title'
titleAlt: '文章标题' # optional — makes the post heading a bilingual toggle
excerpt: 'Short description'
date: '2026-01-15'
category: 'Tools' # Tools | Engineering | Data | Life | etc.
coverImage: '/images/blog-covers/foo.png' # optional
author: # optional — defaults to Jason Xu + bio photo
  name: 'Jason Xu'
  avatar: '/images/bio-photo.png'
draft: false # optional — defaults to false
---
```

**New bilingual text:** Any text on the site can be a click-to-switch en/zh pair. Both variants are written by hand — nothing is machine-translated — and each span picks its own default language, so a Chinese-default span is fine on an otherwise English page.

In `.astro` pages, use the component; `initial` chooses the default:

```astro
<Bi en="my feelings" zh="我的心事" />
<Bi en="Be a Fanatic" zh="做一个狂热的人" initial="zh" />
```

In Markdown (blog posts, `obs_notes/` wiki notes), write the span directly. The visible text is the default; `data-alt` holds the other variant:

```html
<span class="bilingual" data-alt="中文">Chinese</span>
```

Both variants must be plain text — swapping replaces `textContent`, so nested markup is lost. Keep phrases short enough to sit on one line: the span is `inline-block` so the swap can animate, which means it cannot break across lines. Avoid `$` inside wiki-note spans (the wiki's math extractor claims it). `role`, `tabindex`, `title`, and `lang` are added at runtime by `src/scripts/bilingual.ts`; authors never write them.

**New project:** Add an entry to `allProjects` in `src/data/projects.ts` (shape documented there). Images go in `public/images/`.

**New quote:** Edit `src/data/quotes.ts`. **Always ask Jason for the `weight` (1–5) before adding the entry — never pick one silently.** Weight is the only knob on a quote — size, wrap width, color, and center-proximity all follow from it; semantics are documented on the `Quote` interface.

**New coffee shop:** Add an entry to `src/data/coffeeShops.ts`; photo workflow in `src/assets/travel/README.md`.

## Deployment

Deployment happens automatically via `.github/workflows/deploy.yml` on push to `master`.

**One-time setup (if not already done):** In GitHub repo Settings → Pages → Source → set to "GitHub Actions".

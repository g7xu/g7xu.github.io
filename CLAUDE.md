# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An **Astro**-based personal website, rebuilt from Jekyll + Minimal Mistakes. Deployed automatically to GitHub Pages at [g7xu.github.io](https://g7xu.github.io) via GitHub Actions from the `master` branch.

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

# Full deployment helper (build + verify)
bash scripts/deploy.sh
```

## Architecture

### Content Management

Content is data-driven and separated from presentation:

- **`src/data/author.ts`** — All author constants (name, bio, email, avatar, social links, site title/description)
- **`src/data/projects.ts`** — All projects (featured & research). Pages import from this file.
- **`src/data/news.ts`** — Recent news items rendered in the homepage dropdown.
- **`src/content/blog/`** — Blog posts as Markdown files with Zod-validated frontmatter.
- **`src/content/config.ts`** — Astro content collection schema for blog posts.

### Pages

All site pages live in `src/pages/`. Key pages:
- `src/pages/index.astro` — Homepage with author sidebar and news dropdown
- `src/pages/projects.astro` — Projects & Research grid (`/projects/`)
- `src/pages/blog/index.astro` — Blog listing with Notion-style card grid (`/blog/`)
- `src/pages/blog/[...slug].astro` — Dynamic blog post pages
- `src/pages/beyond-tech/` — Personal content sub-section
- `src/pages/learning-wiki.astro` — Learning wiki page

### Styling

Custom styles live in `src/styles/`. Each file corresponds to a concern:
- `global.css` — Resets, typography, news dropdown styles
- `sidebar.css` — Author sidebar
- `navbar.css` — Top navigation bar
- `projects.css` — Project & research card grids
- `blog.css` — Notion-inspired blog styles (design tokens, card layout, post layout)
- `beyond-tech.css` — Beyond-Tech page styles

### Components

Reusable Astro components in `src/components/`:
- `Navbar.astro` — Sticky top navbar
- `Sidebar.astro` — Author bio sidebar (used on homepage)
- `Footer.astro` — Site footer
- `NewsDropdown.astro` — "Recent News" toggle widget
- `ProjectCard.astro`, `ResearchCard.astro` — Project cards
- `BlogCard.astro`, `BlogSidebar.astro` — Blog listing components
- `StructuredData.astro` — JSON-LD SEO schema

### Layouts

- `BaseLayout.astro` — HTML shell: `<head>`, Navbar, Footer, structured data
- `SidebarLayout.astro` — Two-column: author sidebar + main content (homepage only)
- `BlogPostLayout.astro` — Individual blog post layout

### Public Assets

Static files served as-is from `public/`:
- `public/images/` — All site images (bio photo, project covers, etc.)
- `public/files/` — PDF files (resume, papers)
- `public/js/custom.js` — Custom JS (smooth scroll, hover effects, IntersectionObserver)

### Obsidian Notes (`obs_notes/`)

This directory is an Obsidian vault for personal learning notes. Not rendered as part of the Astro site.

## Branch Strategy

- `master` — production branch, auto-deployed to GitHub Pages via GitHub Actions
- `feature/astro_build` — development branch

## Adding Content

**New blog post:** Create a `.md` file in `src/content/blog/` with this frontmatter:
```yaml
---
title: "Post Title"
excerpt: "Short description"
date: "2026-01-15"
category: "Tools"          # Tools | Engineering | Data | Life | etc.
author:
  name: "Jason Xu"
  avatar: "/images/bio-photo.png"
draft: false
---
```

**New project:** Edit `src/data/projects.ts` under `featuredProjects` or `researchProjects`. Images go in `public/images/`.

**New news item:** Edit `src/data/news.ts` under `recentNews`.

## Deployment

Deployment happens automatically via `.github/workflows/deploy.yml` on push to `master`.

**One-time setup (if not already done):** In GitHub repo Settings → Pages → Source → set to "GitHub Actions".

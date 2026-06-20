# Personal Website

An Astro-based personal website featuring data-driven content management and modern styling.

**Live Site:** [g7xu.github.io](https://g7xu.github.io)

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start local server with hot reload
npm run dev

# Visit http://localhost:4321
```

### Production Build

```bash
# Build for production (output in ./dist/)
npm run build

# Preview production build locally
npm run preview

# Clean build artifacts
npm run clean
```

## Project Structure

```
├── src/
│   ├── components/           # Reusable Astro components
│   │   ├── Navbar.astro
│   │   ├── Sidebar.astro
│   │   ├── Footer.astro
│   │   ├── NewsDropdown.astro
│   │   ├── ProjectCard.astro
│   │   ├── ResearchCard.astro
│   │   ├── BlogCard.astro
│   │   ├── BlogSidebar.astro
│   │   └── StructuredData.astro
│   ├── content/
│   │   └── blog/             # Blog posts (Markdown, content collection)
│   ├── data/                 # Data files for dynamic content
│   │   ├── author.ts         # Author info, social links, site metadata
│   │   ├── projects.ts       # Featured & research projects
│   │   ├── news.ts           # Recent news items
│   │   └── quotes.ts         # Quotes rendered in the quote cloud
│   ├── layouts/              # Page layouts
│   │   ├── BaseLayout.astro
│   │   ├── SidebarLayout.astro
│   │   └── BlogPostLayout.astro
│   ├── pages/                # File-based routing
│   │   ├── index.astro
│   │   ├── projects.astro
│   │   ├── learning-wiki.astro
│   │   ├── quotes.astro      # Zoomable typographic quote cloud
│   │   ├── blog/
│   │   └── beyond-tech/
│   ├── scripts/              # Client-side TypeScript
│   │   ├── custom.ts
│   │   ├── learning-wiki.ts
│   │   └── quote-cloud.ts    # Quote cloud packing, zoom/pan, animation
│   └── styles/               # CSS stylesheets
│       ├── global.css
│       ├── sidebar.css
│       ├── navbar.css
│       ├── projects.css
│       ├── blog.css
│       ├── beyond-tech.css
│       └── quote-cloud.css
├── public/                   # Static assets (served as-is)
│   ├── images/
│   ├── files/
│   └── js/
└── obs_notes/                # Obsidian vault (not part of the site)
```

## Data-Driven Content Management

### Adding Projects

Edit `src/data/projects.ts` under `featuredProjects` or `researchProjects`:

```ts
{
  title: "Project Name",
  description: "Project description",
  image: "/images/project-image.png",
  url: "https://project-url.com",
  tags: ["Data Science", "Visualization"],
}
```

### Adding Blog Posts

Create a `.md` file in `src/content/blog/` with frontmatter:

```yaml
---
title: 'Post Title'
excerpt: 'Short description'
date: '2026-01-15'
category: 'Tools'
author:
  name: 'Jason Xu'
  avatar: '/images/bio-photo.png'
draft: false
---
```

### Adding News Items

Edit `src/data/news.ts` under `recentNews`.

### Adding Quotes

Edit `src/data/quotes.ts` — the `/quotes/` page renders them as a full-window,
zoomable typographic "quote cloud" (pan with drag, zoom with the wheel/pinch/buttons).
The layout auto-shrinks so every quote fits, no matter how many you add.

```ts
{
  text: "In me the tiger sniffs the rose.",
  author: "Siegfried Sassoon", // optional — shown on hover
  weight: 4,                    // 1–5: bigger & more central; 5 = accent color, ≤2 = muted
}
```

## Deployment

Automatic deployment to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) on push to `master`.

**One-time setup:** In GitHub repo Settings > Pages > Source, set to "GitHub Actions".

### Branch Strategy

- `master` — production, auto-deployed
- `feature/astro_build` — development

---

_Built with Astro_

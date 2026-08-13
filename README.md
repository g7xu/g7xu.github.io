# Personal Website

An Astro static site featuring data-driven content management and modern styling.

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

### Quality Gates

CI runs these before build — a locally-passing `npm run build` can still fail deploy:

```bash
npm run format:check   # prettier
npm run lint           # eslint
npm run check          # astro check (types)
```

A husky pre-commit hook runs `lint-staged` (eslint + prettier on staged files).

## Project Structure

```
├── src/
│   ├── components/           # Reusable Astro components
│   │   ├── Navbar.astro
│   │   ├── Sidebar.astro
│   │   ├── Footer.astro
│   │   ├── ProjectCard.astro
│   │   ├── BlogCard.astro    # Typographic row, despite the name
│   │   ├── BlogSidebar.astro
│   │   └── StructuredData.astro
│   ├── content/
│   │   └── blog/             # Blog posts (Markdown, content collection)
│   ├── content.config.ts     # Zod schema for the blog collection
│   ├── data/                 # Data files for dynamic content
│   │   ├── author.ts         # Author info, social links, site metadata
│   │   ├── projects.ts       # All projects (single allProjects array)
│   │   ├── coffeeShops.ts    # Coffee shops plotted on the /travel map
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
│   │   ├── travel.astro      # Interactive coffee map (largest page)
│   │   ├── blog/
│   │   └── beyond-tech/      # Unlinked from nav; mostly placeholders
│   ├── assets/travel/        # Coffee-shop photos (optimized at build)
│   ├── scripts/              # Client-side TypeScript
│   │   ├── learning-wiki.ts  # Wiki graph (d3), note rendering
│   │   ├── wiki-callouts.ts
│   │   ├── wiki-multi-column.ts
│   │   └── quote-cloud.ts    # Quote cloud packing, zoom/pan, animation
│   └── styles/               # CSS stylesheets
│       ├── global.css        # Tokens, theme blocks, resets, typography
│       ├── sidebar.css
│       ├── navbar.css
│       ├── projects.css
│       ├── blog.css
│       ├── beyond-tech.css
│       ├── learning-wiki.css
│       ├── travel.css
│       └── quote-cloud.css
├── public/                   # Static assets (served as-is)
│   ├── images/
│   ├── files/
│   └── wiki-images/          # Generated: copied from obs_notes/attachments/
└── obs_notes/                # Obsidian vault; public/ is rendered at /learning-wiki/
```

## Adding Content

See `CLAUDE.md` (Adding Content) for the current schemas — data shapes live there
so they're documented once. Short version:

- **Blog post:** `.md` in `src/content/blog/`; schema in `src/content.config.ts`.
- **Project:** entry in `allProjects` in `src/data/projects.ts`.
- **Quote:** entry in `src/data/quotes.ts`; the `/quotes/` cloud auto-fits any count.
- **Coffee shop:** entry in `src/data/coffeeShops.ts` + photos per
  `src/assets/travel/README.md`.

## Deployment

Automatic deployment to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) on push to `master`.

**One-time setup:** In GitHub repo Settings > Pages > Source, set to "GitHub Actions".

### Branch Strategy

- `master` — production, auto-deployed
- short-lived `feature/*` and `fix/*` branches for everything else

---

_Built with Astro_

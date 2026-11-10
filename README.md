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
npm test               # vitest (wiki parsing)
npm run test:e2e       # playwright page smoke tests; PR checks only, needs a build first
```

A husky pre-commit hook runs `lint-staged` (eslint + prettier on staged files).

## Project Structure

```
├── src/
│   ├── assets/travel/   # Coffee-shop photos (optimized at build)
│   ├── components/      # Reusable Astro components
│   ├── content/blog/    # Blog posts (Markdown content collection)
│   ├── data/            # Site content as typed data
│   ├── layouts/         # Page shells
│   ├── pages/           # File-based routing
│   ├── scripts/         # Client-side TypeScript and its unit tests
│   ├── styles/          # Design tokens and per-page stylesheets
│   └── utils/           # Helpers shared by build and client code
├── e2e/                 # Playwright smoke tests
├── scripts/             # Build-time checks
├── public/              # Static assets; wiki-images/ is generated
└── obs_notes/           # Obsidian vault; public/ is rendered at /learning-wiki/
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

### Branch Strategy

- `master` — production, auto-deployed
- short-lived `feature/*` and `fix/*` branches for everything else

---

_Built with Astro_

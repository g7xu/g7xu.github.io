# Astro Migration Prototype

This folder contains the new Astro-based implementation of the site. It lives
alongside the existing Jekyll project so you can iterate before switching the
production deploy.

## Getting Started

```bash
npm install
npm run dev
# visit http://localhost:4321
```

## Scripts

- `npm run dev` – local development with hot module reload.
- `npm run build` – generates the static site in `dist/`.
- `npm run preview` – serves the production build locally.
- `npm run check` – runs Astro type+content checks.

## Structure

```
astro/
├── astro.config.mjs      # Astro configuration
├── package.json          # Node scripts and dependencies
├── public/               # Static assets copied as-is
│   └── assets/           # Images, PDFs, and favicon assets
└── src/
    ├── components/       # Reusable UI components (news dropdown, cards)
    ├── data/             # TypeScript modules replacing Jekyll YAML data
    ├── layouts/          # BaseLayout with navigation, SEO and footer
    ├── pages/            # Page routes migrated from `_pages/`
    └── styles/           # Global SCSS (ported from `_sass/custom.scss`)
```

## Notes

- SEO metadata and structured data are handled in `src/layouts/BaseLayout.astro`.
- Projects, research, and news entries are now TypeScript modules in `src/data/`.
- Assets from the Jekyll site have been copied into `public/assets/`.
- Navigation currently mirrors the original YAML; adjust `src/data/navigation.ts`
  to add more top-level links.

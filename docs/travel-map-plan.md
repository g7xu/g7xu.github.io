# Travel / Coffee-Shop Map — Implementation Plan

> Companion to [`travel-map-research.md`](./travel-map-research.md). Build plan for a new
> `/travel` tab: an **illustrated, hand-styled SVG map of the US** that you explore freely —
> **click a coffee-shop pin and its polaroid photo collage opens.**

## Direction (decided)

- **Aesthetic:** travel-journal _scrapbook collage_ — polaroid-framed photos, handwritten
  captions, doodle arrows/sparkles, a warm collage feel, an illustrated/sketchy US map.
  We take the **style and elements as inspiration, not a copy** of the reference images.
- **Interaction:** **explore-the-map** — a static illustrated US map; hover a pin for a
  label, **click a pin to open that coffee shop's polaroid collage**. No forced scroll-story.
- **Subject:** the original idea — **coffee shops I've worked from across the US**.

## Goals

- New **Travel** nav tab → `/travel/` page with an illustrated, explorable US map.
- Coffee shops as **pins** on the map; click → polaroid collage (photos + handwritten
  caption + city + date + note).
- A cohesive **scrapbook look**: polaroid frames, one handwriting accent font, doodle
  flourishes, warm palette.
- Stays **static** (GitHub Pages, no server, no API token, no tiles).
- Self-contained immersive page (like `learning-wiki`) so the louder style doesn't fight the
  rest of the site.

## Non-goals (v1)

- No slippy/street map (MapLibre/Leaflet) — wrong tool for a flat illustrated art map.
- No scroll-driven story mode (could be a phase-2 "guided tour" toggle later).
- No real per-state hand illustration art unless I source/draw it — we **approximate the
  vibe** in v1 (see Aesthetic).
- No backend, auth, or EXIF auto-import (manual lat/lng first).

---

## Why SVG, not a mapping library

The reference look is a **flat illustrated art map**, not real geography with tiles. So:

| Need                                    | Tool                                                                                    |
| --------------------------------------- | --------------------------------------------------------------------------------------- |
| US shape + state borders                | **`d3-geo` + `us-atlas` TopoJSON** (we already ship `d3` v7)                            |
| US projection w/ AK + HI insets         | `d3.geoAlbersUsa()` (standard, handles the insets)                                      |
| Hand-drawn / sketchy borders (optional) | **rough.js** for a sketchy SVG stroke, or a hand-tuned CSS/SVG filter                   |
| Pins, hover, click, collage             | plain SVG + CSS + a little JS (`IntersectionObserver` already in `public/js/custom.js`) |

No tiles, no token, no `maplibre`/`leaflet` dependency. Lighter and exactly on-aesthetic.
`react-simple-maps` is a fallback if we'd rather have a component wrapper, but raw `d3-geo`
keeps the dep list minimal.

---

## Data model

`src/data/coffeeShops.ts` (same data-driven pattern as `projects.ts` / `news.ts`):

```ts
export interface CoffeeShop {
  id: string; // slug, e.g. "blue-bottle-ferry-building"
  name: string; // "Blue Bottle Coffee"
  city: string; // "San Francisco, CA"
  lat: number;
  lng: number;
  date?: string; // ISO — when I worked there
  note?: string; // handwritten-style one-liner
  caption?: string; // short caption shown under the polaroid
  photos: string[]; // ["/images/travel/<id>-1.jpg", ...] — collage can be 1–4
  rating?: number; // optional personal score
}

export const coffeeShops: CoffeeShop[] = [
  /* ... */
];
```

`d3.geoAlbersUsa()` projects each `[lng, lat]` to an `[x, y]` on the SVG at build time, so
pins are placed deterministically with no client geocoding.

---

## File-level changes

```
src/
  pages/
    travel.astro            # NEW — projects pins, renders SVG map + collage markup
  data/
    coffeeShops.ts          # NEW — typed shop + photo data
  components/
    CoffeeMap.astro         # NEW — the illustrated SVG map + pins (client script for interactivity)
    Polaroid.astro          # NEW — reusable polaroid-framed photo (Astro <Image/> inside)
  styles/
    travel.css              # NEW — map, polaroid frames, handwriting font, doodles, collage panel
  components/
    Navbar.astro            # EDIT — add { label: 'Travel', href: '/travel/' }
public/
  images/travel/            # NEW — source photos (one folder per shop, or <id>-N.jpg)
  data/us-states.json       # NEW — us-atlas TopoJSON (states), loaded at build time
docs/
  travel-map-plan.md        # this file
  travel-map-research.md     # research digest
```

Add dev deps: `topojson-client` + `us-atlas` (TopoJSON data). Optionally `roughjs` for the
sketchy hand-drawn borders. `astro.config.mjs` stays `output: 'static'`.

---

## Build phases

### Phase 0 — Scaffold & nav (~½ hr)

1. Add **Travel** to `Navbar.astro`.
2. `src/pages/travel.astro` with `BaseLayout`, full-bleed stage, placeholder heading.
3. `src/styles/travel.css` imported; confirm routing + render.

### Phase 1 — Illustrated SVG US map (~½ day)

1. Load `us-atlas` states TopoJSON at build time; render states as SVG paths via `d3-geo` +
   `geoAlbersUsa`.
2. Style the base: warm paper fill, soft state borders, subtle texture — our own take on the
   reference (optionally **rough.js** for sketchy borders). Light per-region color washes.
3. Decorative flourishes: a few doodle sparkles/arrows as inline SVG, hand-lettered title.

### Phase 2 — Coffee-shop pins (~½ day)

1. Project each shop to `[x,y]`; drop a **pin** (custom coffee-cup / 📍 marker) at each.
2. **Hover** → small handwritten-style label (shop + city).
3. Spacing/overlap pass so dense cities (NYC, SF) stay legible — small offset or a tiny
   cluster badge that expands on click.

### Phase 3 — Polaroid collage on click (the payoff, ~½ day)

1. Click a pin → open that shop's **collage**: 1–4 **polaroid-framed photos** (white border,
   slight random rotation, subtle shadow, "taped" corner) with the handwriting caption, city,
   date, note.
2. Present as a side panel or centered overlay (decide in build); doodle arrows connect the
   polaroids; close on Esc / backdrop click.
3. Photos via `Polaroid.astro` → Astro `<Image/>` (thumbnail on map context, larger in panel).

### Phase 4 — Polish & perf (~½ day)

1. Lazy-load collage photos; small thumbnails by default, larger only when a collage opens.
2. `aria` labels on pins, keyboard focus/activation, reduced-motion fallback.
3. Empty/loading + graceful render if data is missing.
4. `npm run build` → verify on `npm run preview` (static output).

### Phase 5 (optional, later)

- A **drawn route line** connecting shops in visit order (SVG `stroke-dashoffset` reveal) as
  a decorative motif.
- A **"guided tour"** toggle that flies pin-to-pin (the deferred scroll-story mode).

---

## Aesthetic guardrails

**Borrow the scrapbook elements, keep them tasteful and scoped to `/travel`:**

- ✅ Polaroid frames, handwriting accent font (e.g. _Caveat_ / _Patrick Hand_, loaded only on
  this page), doodle arrows/sparkles, warm collage palette.
- ✅ Rust `#C2410C` for the active pin / accent; warm paper map fill.
- ✅ This page is a **deliberate immersive exception** to the site's restrained system —
  precedent: `learning-wiki` already goes full-screen and hides the footer.
- ❌ Don't bleed the playful style (handwriting font, polaroid shadows, saturated washes)
  into the rest of the site. Keep Manrope + restraint everywhere else.
- ❌ No SaaS-blue, no gradients-as-decoration outside the collage, no `Inter`.

---

## Open questions (early in build)

1. **Photo data:** how many shops to start, and do you have lat/lng (or city names I can
   geocode once into the data file)?
2. **Per-state illustration depth:** plain warm fills + a few doodles (fast) vs. small
   per-region sticker icons we design (more charm, more art work)?
3. **Collage presentation:** side panel vs. centered overlay vs. inline "exploded" polaroids
   near the pin?
4. **Sketchy borders:** rough.js hand-drawn look, or clean SVG strokes with a paper texture?

---

## Definition of done (v1)

- `/travel/` reachable from the navbar; renders on the static build.
- Illustrated US map with coffee-shop pins; hover shows a label.
- Clicking a pin opens a polaroid collage with photos + caption + city + date + note.
- Photos lazy-load; `npm run build` passes; works in `npm run preview`.
- Scrapbook style reads cohesive and is scoped to `/travel` only.

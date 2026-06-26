# Coffee-Shop Travel Map — Research Digest

> Condensed from a multi-source deep-research pass (5 search angles, 23 sources fetched,
> 25 claims adversarially verified, 25 confirmed / 0 refuted). This is the reference
> doc; the build steps live in [`travel-map-plan.md`](./travel-map-plan.md).

## ⭐ Direction chosen (2026-06-25)

After reviewing scrapbook-style travel-card references, the build shifted **away from a
slippy map** to an **illustrated, hand-styled SVG US map you explore freely** — click a
coffee-shop pin and its **polaroid photo collage** opens. Stack: **`d3-geo` + `us-atlas`
TopoJSON** (SVG, no tiles, no token; `d3` already installed) + scrapbook styling (polaroid
frames, handwriting accent font, doodles) + Astro `<Image/>`. The MapLibre/Leaflet analysis
below is kept as **reference**, not the chosen path — see
[`travel-map-plan.md`](./travel-map-plan.md). The photo-cohesion and performance findings
still fully apply.

## The idea

A new `/travel` tab: an interactive US map plotting the coffee shops I've worked from.
Dots/clusters at the country level; zoom into a city and **stylized photos of each shop
bloom open** on the map. Click a dot for a detail card (name, city, date, a note).

---

## 1. Play with these first (inspiration you can click around)

The fastest way to lock a direction is to feel these in the browser:

| Site                                     | What to notice                                                                                       | Link                                                                                                             |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Stamen / Stadia "Watercolor"** basemap | Warm, hand-drawn paper aesthetic — the coziest map style, closest to a coffee vibe                   | https://stamen.com/watercolor-classic-returns/ · live demo: https://stadiamaps.com/stamen/                       |
| **Leaflet.Photo demo**                   | Geotagged photos as clustered thumbnails that decluster on zoom — _almost exactly our interaction_   | https://turban.github.io/Leaflet.Photo/examples/                                                                 |
| **MapLibre cluster example**             | Dots collapse into counted clusters, expand on zoom-in (open-source, no token)                       | https://maplibre.org/maplibre-gl-js/docs/examples/create-and-style-clusters/                                     |
| **MapLibre custom HTML markers**         | Replace pins with any styled `<div>`/image at a coordinate                                           | https://maplibre.org/maplibre-gl-js/docs/examples/add-custom-icons-with-markers/                                 |
| **Mapbox Storytelling**                  | Scroll-driven "fly between locations" tour (the phase-2 narrative mode)                              | https://www.mapbox.com/blog/how-to-build-a-scrollytelling-map · template: https://github.com/mapbox/storytelling |
| **react-simple-maps examples**           | Flat, _illustrated_ US-states SVG look (the alternative to a slippy map)                             | https://www.react-simple-maps.io/examples/                                                                       |
| **Awwwards map collection**              | Award-winning zoom/scroll-reveal map navigations for pure aesthetic ideas                            | https://www.awwwards.com/awwwards/collections/maps-geolocation-streetview/                                       |
| **Chartogne-Taillet** (winery)           | Real-world hand-drawn map where clicking reveals an animated zoom — closest analog found in the wild | (search "Chartogne-Taillet map"; featured in the Awwwards roundup)                                               |

> **Aesthetic note:** no award-winning _US-geographic photo-reveal_ map was found in the
> wild. The concept is genuinely fresh — the references above are for style and
> interaction, not a 1:1 template to copy.

**What makes the beautiful ones beautiful:** warm/paper textures instead of clinical
gray tiles · restrained color · imagery that _reveals on zoom_ rather than all-at-once ·
a single consistent photo treatment · generous framing.

---

## 2. Library decision (technical)

All recommended options are **token-free and static-host friendly** (work on GitHub Pages
with no server). Mapbox GL JS is excluded — it needs an API token + usage billing, and
**MapLibre is the open-source fork of it** with the same capabilities.

| Library                     | Token?             | Dot layer | Zoom-gated reveal                   | Image markers                | Zoom/pan      | Best when                                                     |
| --------------------------- | ------------------ | --------- | ----------------------------------- | ---------------------------- | ------------- | ------------------------------------------------------------- |
| **MapLibre GL JS** ⭐       | None               | ✅        | ✅ `minzoom`/`maxzoom` + clustering | ✅ DOM/CSS marker at lat/lng | ✅ GPU-smooth | You want full control + future-proofing                       |
| **Leaflet + Leaflet.Photo** | None (MIT)         | ✅        | ✅ via markercluster                | ✅ `divIcon` thumbnail       | ✅ Good       | You want the fastest turnkey path                             |
| **react-simple-maps**       | None               | ✅        | manual                              | SVG only                     | ✅ (SVG)      | You want a flat _illustrated_ US-states map, not real streets |
| ~~Mapbox GL JS~~            | ❌ token + billing | ✅        | ✅                                  | ✅                           | ✅            | Skip — use MapLibre instead                                   |

### Verified capability details

- **MapLibre custom image markers:** `el.style.backgroundImage = url(...)` →
  `new maplibregl.Marker({element: el}).setLngLat(coords).addTo(map)`.
- **Zoom gating:** layers expose `minzoom` ("hidden below") and `maxzoom` ("hidden at/above") —
  this is the native mechanism for "photos only appear when zoomed in."
- **Clustering:** `cluster: true` on a GeoJSON source auto-adds `point_count`;
  `clusterRadius` (default 50) and `clusterMaxZoom` control when clusters split into photos.
- **Leaflet.Photo (MIT):** purpose-built — "show geotagged photos on a Leaflet map,"
  renders each as a `divIcon` with the thumbnail as a CSS `background-image`, clusters via
  Leaflet.markercluster. Needs only `{lat, lng, thumbnail, ...}` per photo.
- **react-simple-maps:** built on `d3-geo` + `topojson-client`; loads a static TopoJSON
  asset (no server); `<ZoomableGroup>` handles pan/zoom. SVG, so great for stylized state
  illustration + a few hundred points, but no GPU tiles or built-in photo clustering.

### Astro integration is solved

The open-source **[`maps-withastro`](https://github.com/roblabs/maps-withastro)** project
embeds Leaflet and MapLibre as Astro components on static builds. Our repo already ships
**`d3` v7** as a dependency, so react-simple-maps / a hand-rolled d3-geo route adds little.

> ⚠️ **Open scaling question:** DOM/HTML markers degrade past some count and would need
> GPU symbol layers instead. For _dozens-to-low-hundreds_ of shops we're comfortably fine
> with the simple approach.

---

## 3. Photo styling — cohesive, not a photo dump

The single biggest lever for beauty is **one consistent treatment on every photo** so 50
different shops read as one set:

- **SVG duotone filter** via CSS `filter: url(#id)` — the SVG filter lives as a hidden
  element in the HTML (`feColorMatrix` grayscale + `feComponentTransfer` gradient map).
  Tint to the site's warm rust accent (`#C2410C`) for instant cohesion.
  Reference: https://css-tricks.com/using-svg-to-create-a-duotone-image-effect/
- **Uniform framing** — thumbnail as a `background-image` inside the marker; choose one of:
  polaroid/instant-photo frame · thin-bordered square · circular drop-pin thumbnail.
- **Clustering** — collapse nearby photos into a counted cluster when zoomed out.

> ⚠️ **Design-system tension:** `CLAUDE.md` bans card thumbnails on lists and drop shadows.
> A photo _map_ is a deliberate exception (it isn't a content list), but the treatment
> should still feel native to the Manrope / warm-paper aesthetic — lean **duotone + a thin
> frame**, not glossy drop-shadowed cards.

---

## 4. Performance & assets (static site)

- **Astro's built-in `<Image/>` / `<Picture/>`** does the heavy lifting: build-time
  optimization, auto `srcset`/`sizes` responsive images, CDN support — fully compatible
  with prerendered GitHub Pages. Docs: https://docs.astro.build/en/guides/images/
- **Strategy:** small **thumbnails on markers**, full-res only inside the click-to-open
  card. Lazy-load. Scales gracefully to dozens-to-hundreds of photos.

---

## 5. Interaction patterns & recommendation

Three patterns surfaced; for a personal coffee-shop travel map, **combine the first two**:

1. **Zoom-to-reveal clustered photos** _(core)_ — your original vision. Clusters at US
   level; zoom into a city and styled photos bloom open. MapLibre/Leaflet do this best.
2. **Click dot → photo card popup** _(detail)_ — shop name, city, date, note, full-res photo.
3. **Scrollytelling "tour"** _(optional, phase 2)_ — guided fly-between-cities narrative
   (Mapbox Storytelling pattern, reproducible on MapLibre). Lovely but more work.

---

## Caveats (from the verification pass)

- **Stamen Watercolor** now requires a **Stadia Maps** account/key (free tier) since Aug 2023 —
  no longer strictly token-free. The aesthetic still stands; for a fully key-free build use
  OpenStreetMap or CARTO raster tiles and approximate the warm look with CSS filters.
- The **award-map references are fantasy-world maps** (Witcher, Fillory) — inspiration only.
- Library claims rest on **primary docs** (MapLibre, Leaflet, Astro, plugin repos) — high
  confidence. Design-inspiration claims rest on a secondary Awwwards collection.
- Not benchmarked: exact marker-count performance ceilings, bundle sizes, learning curve.
- `deck.gl`, Observable Plot, and raw D3-geo were named in the prompt but not separately
  verified by surviving claims.

## Key sources

- MapLibre custom markers — https://maplibre.org/maplibre-gl-js/docs/examples/add-custom-icons-with-markers/
- MapLibre clustering — https://maplibre.org/maplibre-gl-js/docs/examples/create-and-style-clusters/
- MapLibre style spec (min/maxzoom) — https://maplibre.org/maplibre-style-spec/layers/
- Leaflet.Photo — https://github.com/turban/Leaflet.Photo
- Leaflet custom icons — https://leafletjs.com/examples/custom-icons/
- react-simple-maps — https://github.com/zcreativelabs/react-simple-maps
- maps-withastro — https://github.com/roblabs/maps-withastro
- Astro images — https://docs.astro.build/en/guides/images/
- Duotone with SVG — https://css-tricks.com/using-svg-to-create-a-duotone-image-effect/
- Mapbox Storytelling — https://github.com/mapbox/storytelling
- Awwwards map collection — https://www.awwwards.com/awwwards/collections/maps-geolocation-streetview/

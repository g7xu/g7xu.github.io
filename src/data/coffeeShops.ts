// Sample data for the /travel coffee-shop map prototype.
// Replace placeholder photos with real ones in public/images/travel/ later —
// set `photo.src` to the image path and the polaroid will use it instead of the
// generated placeholder.

export interface Photo {
  /** Real image path, e.g. "/images/travel/blue-bottle-1.jpg". Optional in the prototype. */
  src?: string;
  /** Handwritten-style caption shown under the polaroid. */
  caption?: string;
  /** Glyph used for the placeholder tile when `src` is absent. */
  emoji?: string;
}

export interface CoffeeShop {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  /** ISO date I worked there. */
  date?: string;
  /** One-liner vibe / what I did there. */
  note?: string;
  /** Base hue (0–360) for the pin + placeholder tint, so each shop reads distinct. */
  hue: number;
  photos: Photo[];
}

export const coffeeShops: CoffeeShop[] = [
  {
    id: 'blue-bottle-sf',
    name: 'Blue Bottle Coffee',
    city: 'San Francisco, CA',
    lat: 37.7956,
    lng: -122.3937,
    date: '2025-09-14',
    note: 'Ferry Building light, an oat cortado, and four hours of refactoring that finally clicked.',
    hue: 28,
    photos: [
      { emoji: '☕', caption: 'oat cortado' },
      { emoji: '💻', caption: 'refactor day' },
      { emoji: '🌉', caption: 'Ferry Building' },
    ],
  },
  {
    id: 'stumptown-portland',
    name: 'Stumptown Coffee',
    city: 'Portland, OR',
    lat: 45.5226,
    lng: -122.6816,
    date: '2025-08-02',
    note: 'Rainy window seat. Wrote most of a blog post here before the battery died.',
    hue: 152,
    photos: [
      { emoji: '🌧️', caption: 'rainy window' },
      { emoji: '✍️', caption: 'draft #3' },
    ],
  },
  {
    id: 'victrola-seattle',
    name: 'Victrola Coffee Roasters',
    city: 'Seattle, WA',
    lat: 47.6142,
    lng: -122.3201,
    date: '2025-08-05',
    note: 'Capitol Hill. Loud espresso machine, quiet brain — perfect for deep work.',
    hue: 205,
    photos: [
      { emoji: '☕', caption: 'double shot' },
      { emoji: '📓', caption: 'notes + chaos' },
    ],
  },
  {
    id: 'corvus-denver',
    name: 'Corvus Coffee',
    city: 'Denver, CO',
    lat: 39.6905,
    lng: -104.987,
    date: '2025-07-21',
    note: 'Mile-high pour-over. Read a whole paper on graph layouts in one sitting.',
    hue: 268,
    photos: [
      { emoji: '⛰️', caption: 'mile high' },
      { emoji: '📄', caption: 'one-sitting read' },
    ],
  },
  {
    id: 'houndstooth-austin',
    name: 'Houndstooth Coffee',
    city: 'Austin, TX',
    lat: 30.2729,
    lng: -97.7444,
    date: '2025-06-30',
    note: 'Cold brew, warm afternoon. Paired-programmed with a stranger on a side project.',
    hue: 12,
    photos: [
      { emoji: '🧊', caption: 'cold brew' },
      { emoji: '🤝', caption: 'random pairing' },
    ],
  },
  {
    id: 'intelligentsia-chicago',
    name: 'Intelligentsia',
    city: 'Chicago, IL',
    lat: 41.8838,
    lng: -87.6386,
    date: '2025-05-18',
    note: 'Millennium Park nearby. Shipped a feature between two flat whites.',
    hue: 340,
    photos: [
      { emoji: '🥛', caption: 'flat white' },
      { emoji: '🚀', caption: 'shipped it' },
    ],
  },
  {
    id: 'tatte-boston',
    name: 'Tatte Bakery & Café',
    city: 'Boston, MA',
    lat: 42.3526,
    lng: -71.0976,
    date: '2025-04-09',
    note: 'Marble tables, a maple latte, and the kind of focus that makes hours vanish.',
    hue: 36,
    photos: [
      { emoji: '🍁', caption: 'maple latte' },
      { emoji: '⏳', caption: 'hours gone' },
    ],
  },
  {
    id: 'devocion-nyc',
    name: 'Devoción',
    city: 'Brooklyn, NY',
    lat: 40.7197,
    lng: -73.9573,
    date: '2025-03-22',
    note: 'Williamsburg skylight + a fresh Colombian roast. My favorite place to think.',
    hue: 95,
    photos: [
      { emoji: '🌿', caption: 'the skylight' },
      { emoji: '☕', caption: 'Colombian roast' },
      { emoji: '🧠', caption: 'thinking spot' },
    ],
  },
];

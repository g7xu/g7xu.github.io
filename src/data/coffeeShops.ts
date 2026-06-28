// Coffee shops I've worked from, plotted on the /travel map.
// Add a shop here; drop its photos in src/assets/travel/ named <id>-<n>.jpg
// (see src/assets/travel/README.md). Missing photos fall back to the emoji.

export interface Photo {
  /** Filename of a photo in `src/assets/travel/`, e.g. "cliff-coffee-plano-1.jpg".
   *  Resolved at build to an optimized webp. */
  src?: string;
  /** Handwritten-style caption shown under the polaroid. */
  caption?: string;
}

export interface CoffeeShop {
  id: string;
  name: string;
  city: string;
  /** Full street address, shown in the collage. */
  address?: string;
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
    id: 'cliff-coffee-plano',
    name: 'Cliff Coffee',
    city: 'Plano, TX',
    address: '6185 Assembly Park Blvd A, Plano, TX 75074',
    // Approx coords — fine-tune via Google Maps (right-click the spot → click
    // the coordinates to copy).
    lat: 33.0388,
    lng: -96.6628,
    date: '2026-06-21',
    note: 'first record on the map and first visited coffee shop at Texas',
    hue: 24,
    photos: [
      { src: 'cliff-coffee-plano-1.jpg', caption: 'the lounge' },
      { src: 'cliff-coffee-plano-2.jpg', caption: 'the menu wall' },
      { src: 'cliff-coffee-plano-3.jpg', caption: 'matcha + deep work' },
    ],
  },
  {
    id: 'flower-pot-sd',
    name: 'The Flower Pot Café',
    city: 'La Jolla, CA',
    address: '7530 Fay Ave, La Jolla, CA 92037',
    lat: 32.84077,
    lng: -117.27424,
    date: '2025-10-12',
    note: 'One of my favorites in San Diego',
    hue: 135,
    photos: [
      { src: 'flower-pot-sd-1.jpg', caption: 'iced latte + work' },
      { src: 'flower-pot-sd-2.jpg', caption: 'the piano corner' },
      { src: 'flower-pot-sd-3.jpg', caption: 'the patio' },
      { src: 'flower-pot-sd-4.jpg', caption: 'poem on the wall' },
      { src: 'flower-pot-sd-5.jpg', caption: 'dreamers & outcasts' },
    ],
  },
  {
    id: 'two-hands-austin',
    name: 'Two Hands',
    city: 'Austin, TX',
    address: '1011 S Congress Ave Ste 170, Austin, TX 78704',
    lat: 30.2546,
    lng: -97.7487,
    date: '2026-06-28',
    note: 'Aussie-inspired café & bar on South Congress — comfort food, cold-pressed juice, great cocktails',
    hue: 212,
    photos: [
      { src: 'two-hands-austin-1.jpg', caption: 'the blue-tiled corner' },
      { src: 'two-hands-austin-2.jpg', caption: 'chairs out front' },
      { src: 'two-hands-austin-3.jpg', caption: 'patio under the oaks' },
      { src: 'two-hands-austin-5.jpg', caption: 'ordering at the window' },
      { src: 'two-hands-austin-6.jpg', caption: 'shade & string lights' },
    ],
  },
];

// Coffee shops I've worked from, plotted on the /travel map.
// Add a shop here; drop its photos in src/assets/travel/ named <id>-<n>.jpg
// (see src/assets/travel/README.md). Missing photos fall back to the emoji.

export interface Photo {
  /** Filename of a photo in `src/assets/travel/`, e.g. "cliff-coffee-plano-1.jpg".
   *  Resolved at build to an optimized webp. If the file is missing (or `src`
   *  is absent), the emoji placeholder is shown instead. */
  src?: string;
  /** Handwritten-style caption shown under the polaroid. */
  caption?: string;
  /** Glyph for the placeholder tile, shown until/unless a real photo loads. */
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
    id: 'cliff-coffee-plano',
    name: 'Cliff Coffee',
    city: 'Plano, TX',
    // Approx — 6185 Assembly Park Blvd, Plano, TX 75074. Fine-tune via Google
    // Maps (right-click the spot → click the coordinates to copy).
    lat: 33.0388,
    lng: -96.6628,
    date: '2026-06-21',
    note: 'Peach-lit lounge with a highland cow on the wall — an iced matcha, an egg sandwich, and a long Sunday of deep work.',
    hue: 24,
    photos: [
      { src: 'cliff-coffee-plano-1.jpg', emoji: '🛋️', caption: 'the lounge' },
      {
        src: 'cliff-coffee-plano-2.jpg',
        emoji: '📋',
        caption: 'the menu wall',
      },
      {
        src: 'cliff-coffee-plano-3.jpg',
        emoji: '🍵',
        caption: 'matcha + deep work',
      },
    ],
  },
];

// Coffee shops I've worked from, plotted on the /travel map.
// Add a shop here; drop its photos in src/assets/travel/ named <id>-<n>.jpg
// (see src/assets/travel/README.md). A missing file renders as an empty
// hue-tinted frame — no build error.

export interface Photo {
  /** Filename within src/assets/travel/; resolved at build to an optimized webp. */
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
  /** YYYY-MM-DD of the visit — not the date this entry was added. */
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
    note: 'Great coffee after talking to a VC.',
    hue: 212,
    photos: [
      { src: 'two-hands-austin-1.jpg', caption: 'the blue-tiled corner' },
      { src: 'two-hands-austin-2.jpg', caption: 'chairs out front' },
      { src: 'two-hands-austin-3.jpg', caption: 'patio under the oaks' },
      { src: 'two-hands-austin-6.jpg', caption: 'shade & string lights' },
    ],
  },
  {
    id: 'desnudo-austin',
    name: 'Desnudo Coffee: Downtown',
    city: 'Austin, TX',
    address: '111 Congress Ave, Austin, TX 78701',
    lat: 30.26354,
    lng: -97.7435,
    date: '2026-06-28',
    note: 'Colombian coffee from a vintage camper on the plaza.',
    hue: 190,
    photos: [
      { src: 'desnudo-austin-1.jpg', caption: 'the camper' },
      { src: 'desnudo-austin-2.jpg', caption: 'shade on the plaza' },
    ],
  },
  {
    id: 'summer-moon-frisco',
    name: 'Summer Moon Coffee',
    city: 'Frisco, TX',
    address: '1377 Legacy Dr #100, Frisco, TX 75034',
    lat: 33.08906,
    lng: -96.83982,
    date: '2026-07-03',
    note: 'Wood-fired coffee under a cowboy mural.',
    hue: 45,
    photos: [
      { src: 'summer-moon-frisco-1.jpg', caption: "thanks y'all" },
      { src: 'summer-moon-frisco-2.jpg', caption: 'the brick wall' },
      { src: 'summer-moon-frisco-3.jpg', caption: 'the merch shelves' },
    ],
  },
  {
    id: 'black-sheep-plano',
    name: 'Black Sheep Coffee',
    city: 'Plano, TX',
    address: '1501 Preston Rd, Plano, TX 75093',
    lat: 33.01913,
    lng: -96.79583,
    date: '2026-07-04',
    note: 'Iced matcha under the neon — leave the herd behind.',
    hue: 285,
    photos: [
      { src: 'black-sheep-plano-1.jpg', caption: 'the pop-art mural' },
      { src: 'black-sheep-plano-2.jpg', caption: 'leave the herd behind' },
    ],
  },
];

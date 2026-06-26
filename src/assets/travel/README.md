# Coffee-shop photos

Real photos for the `/travel` map collage live here. They're optimized at build
time by Astro (resized to ~300px, converted to webp, lazy-loaded), so drop in
**full-size photos** — don't pre-shrink them.

## How to add a photo

1. **Convert if needed.** iPhone `.HEIC` won't work (Astro's sharp can't read it).
   Export to JPEG first:
   - Photos app → select → **File → Export → Export Photo** → Format **JPEG**, or
   - Terminal: `sips -s format jpeg input.heic --out output.jpg`

   JPG / PNG / WEBP / AVIF work as-is.

2. **Name it** `<shop-id>-<n>.jpg`, matching the shop's `id` in
   `src/data/coffeeShops.ts` — e.g. `blue-bottle-sf-1.jpg`, `blue-bottle-sf-2.jpg`,
   `stumptown-portland-1.jpg`. Drop it in this folder.

3. **Reference it** in `src/data/coffeeShops.ts` — set that photo's entry to:

   ```ts
   { src: 'blue-bottle-sf-1.jpg', emoji: '☕', caption: 'oat cortado' }
   ```

   Keep `emoji` as a fallback (shown if the file is missing).

4. `npm run dev` to preview → click the shop's pin. Commit the image + the data edit.

## Notes

- Photos display as a **square center-crop** (150×150), so framing isn't critical.
- A referenced file that doesn't exist falls back to the emoji — no build error.
- If a portrait shot looks sideways, re-export it (bakes in the rotation).

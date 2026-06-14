**Summary**: How a real camera turns a 3D scene into pixel values — camera design (pinhole → lens → digital sensor), what determines a pixel's brightness, reflection models and the BRDF, and color sensing.

**Sources**: CSE 152A (SP26, Manmohan Chandraker) — Photometry & Geometry of Image Formation.

**Last updated**: 2026-06-11

---

Two fundamental questions in computer vision:

1. **Photometry** — *why does the image look the way it does?* (intensity, color, brightness)
2. **Geometry** — *where does everything appear in the image?* (placement, projection, perspective — see [[Geometric Projection Model]])

The same scene looks completely different depending on lighting — e.g. Monet's haystacks at different times of day: same geometry, different photometry.

## Camera Design

### Problem: just film
- Every point on an object sends light in **all directions**
- Multiple rays hit the same spot on film → **blurry mess**

### Solution: pinhole camera
- Add a **barrier with a tiny hole (aperture)**
- Only **one ray per point** passes through → each point maps to exactly one point on the film → sharp image
- Resulting image is **flipped upside down**

### Camera obscura
- Literally a dark room/box with a pinhole
- Used historically to observe eclipses and as an artist's aid (e.g. Vermeer); Leonardo da Vinci described objects appearing in proper form, reduced in size, reversed

### Aperture & the circle of confusion
- Real apertures have **finite size** → rays from one point hit slightly different spots → **circle of confusion** (blur)
- **Smaller aperture** → sharper, BUT less light gets through and **diffraction** kicks in at very small sizes → there is a **sweet spot**

| Aperture | Result |
|---|---|
| 2mm | Very blurry |
| 1mm | Blurry |
| 0.6mm | Clearer |
| 0.35mm | Sharp |
| 0.15mm | Sharp |
| 0.07mm | Blurry again (diffraction) |

### Adding a lens
- A lens **bends all rays from one point back together** onto one spot → allows a **large aperture** (lots of light) AND a sharp image
- Only objects at a **specific distance** are perfectly in focus; other distances → circle of confusion → **background blur (bokeh)**
- Changing lens shape changes the focus distance

### Digital camera
- Replaces film with a **sensor array**; each cell is a light-sensitive diode converting **photons → electrons** (two types: **CCD** and **CMOS**)
- Recording chain: `light source → hits scene → reflects → passes through imaging system → hits sensor`

### The raster image (pixel matrix)
- An image is a **2D grid of numbers**, each = brightness (0 = black, 1 = white, between = grey)
- Color image = **3 matrices** stacked: R, G, B

## What Determines a Pixel's Value?

### What the pixel measures: irradiance
A pixel measures the **irradiance at the sensor**. The units ladder:
- **Radiant energy** — total # of photons that hit. Unit: **Joules (J)**
- **Radiant flux** — photons per second. Unit: **J/s = Watts (W)**
- **Irradiance** — photons per second *per unit area*. Unit: **W/m²** ← the pixel's quantity
- **Radiance** — energy per second, per unit area, per **solid angle** (a direction). Unit: **W/(m²·sr)**

The BRDF is the ratio of **outgoing differential radiance** to **incoming differential irradiance** → its unit is **1/sr**.

### The 5 factors
A pixel's brightness depends on **5 factors** — which is why a single pixel is too ambiguous to interpret alone:

1. **Illumination** — strength, direction, color of the light source
2. **Surface orientation** — angle between surface and light
3. **Surface material** — how it reflects light (shiny vs. matte)
4. **Nearby surfaces** — shadows, inter-reflections
5. **Camera parameters** — exposure, aperture, sensor sensitivity

### Intensity & surface orientation (foreshortening)
$$I(x) \propto (S \cdot N(x))$$
- **S** = light direction, **N(x)** = surface normal
- The dot product is between 0 and 1: 0° → cos 0 = 1 (max brightness); 45° → 0.7; 90° → 0 (no light)
- Intuition: sunlight directly overhead (equator) is hot & bright; at a low angle (poles) the same light spreads over more area → cold & dim

## Reflection Models

### Diffuse (Lambertian) reflectance
- Some light **absorbed** (controlled by albedo ρ); the rest **scattered equally in all directions**
- Looks equally bright from any viewing angle — e.g. cloth, concrete, matte paint
- Modeled in depth in [[Lambertian Photometric Model]]

### Specular reflection
- Light reflects at a **specific angle** (angle in = angle out); appearance changes with viewing angle; creates **highlights** — e.g. mirrors, shiny metal

> Most real surfaces = a **mix of diffuse + specular**.

### The full image-formation equation (BRDF)
$$L_o(\omega_o) = \int_\Omega L_i(\omega_i)\, f(\omega_o, \omega_i)\, (\omega_i \cdot n)\, d\omega_i$$

As a **chain of percentages**:

| Term | Meaning |
|---|---|
| $L_i(\omega_i)$ | How much light is coming in |
| $(\omega_i \cdot n)$ | What % of that light lands on the surface (geometry) |
| $f(\omega_o, \omega_i)$ | What % of landed light reflects toward the camera (material) |
| $L_o(\omega_o)$ | Final pixel brightness |

Each term is an independent fraction applied in sequence, so they multiply. And $\text{BRDF} = \text{Diffuse} + \text{Specular}$.

### Other lighting effects (beyond the BRDF)
- **Refraction** — light bends passing *through* a surface (glass, water); the BRDF only models light bouncing *off* surfaces
- **Subsurface scattering** — light enters, bounces inside the material, exits elsewhere (e.g. skin backlit; CGI skin like Gollum)
- **Fluorescence** — absorbed at λ₁, instantly re-emitted at λ₂ (e.g. highlighter under UV)
- **Phosphorescence** — like fluorescence but time-delayed (glow-in-the-dark)

## Color

### Light is a spectrum
- Visible range 400–700nm: **400nm** violet/blue, **550nm** green/yellow (peak human sensitivity), **700nm** red

### Why RGB?
- Human eyes have only **3 cone types**: **S** (~420nm, blue), **M** (~534nm, green), **L** (~564nm, red), plus **rods** for intensity (night vision, no color)
- Only 3 receptors → **3 numbers** suffice to describe any color we see → cameras mimic this with RGB

| Animal | Cone Types | Color Vision |
|---|---|---|
| Night animals | 1 | None |
| Dogs | 2 | Limited |
| Humans | 3 | Normal |
| Fish/Birds | 4 | Beyond human |
| Mantis shrimp | 12 | Extraordinary |

### Surface color
- A surface's color = which wavelengths it **reflects** vs. **absorbs** (red tomato reflects red, absorbs the rest)
- Color seen = **E(λ) × ρ(λ)** (light spectrum × surface albedo spectrum)

### Color sensing: the Bayer grid
- Sensors measure only **intensity**, not color → place a **color filter** over each cell
- Pattern alternates R, G, B (twice as many green — matches human sensitivity); each cell records one channel
- Missing channels are **estimated from neighbors** → **demosaicing**

## Key Insights
- **The plight of the poor pixel** — a pixel value is set by 5 factors at once, so it can't be interpreted in isolation; context is everything.
- **Local differences matter most** — we recognize a pencil sketch with no color/accurate brightness because recognition relies on **edges and local differences**, not absolute values.
- **Adelson checker-shadow illusion** — squares A and B are the *exact same* pixel value but look different because the brain compensates for shadow → raw pixel values ≠ perceived reality.

## Related pages
- [[Computer Vision Overview]]
- [[Lambertian Photometric Model]]
- [[Geometric Projection Model]]
- [[Feature Detection]]

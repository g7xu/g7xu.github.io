

# Creating Image
The process of creating data. The actual world is being transformed into digital numbers
## The formation of images
![[three_components_image_capture.svg|697]]
the capturing of images require 3 critical components:
- Light emitted from **Source A**
- Light reflected off from **Source B** to **Camera**
- Light recorded by the **sensors** in **Camera**
## The Full Image extraction pipeline
3D World
↓
[[Camera Projection Pipeline]]
↓
2D Images
↓
[[Lambertian Photometric Model|Photometric Stereo]] (digital 3D modeling)
# Analyzing image
[[Feature Detection]]: detecting feature from image
[[Feature Matching]]: combining different images together











TODO: the content below will be deleted or reconstructed


- pattern identification
- information is also contained in patterns of intensity variations
	- Changes in surface normal
	- Texture
	- Proximity
	- indents and bumps
	- Grooves and creases

Photometric Stereo




Image Formation (Photometric): light from the source to sensor
- Reflectance Models: ...
- Photometric Stereo: getting surface normal and albedo by using multiple images

Geometric Image Formation: mapping of 3D points to 2D image plane
- Pinhole Camera Model: ...
- Homogeneous Coordinates: 
- Intrinsics and Extrinsics: 

Features: points or patterns that can be tracked across different images
- Corner Detection: PCA?



## How Does a Pixel Get Its Value?

The diagram shows the full chain: light source → hits surface → reflects → reaches sensor. The pixel value depends on **5 factors**:

- **Illumination strength and direction** — is the light bright? is it hitting the surface directly or at an angle?
- **Surface geometry** — is the surface tilted away from the light? (explains shadows)
- **Surface material** — is it shiny or matte? dark or light colored?
- **Nearby surfaces** — other objects can block light or reflect it onto the surface
- **Camera parameters** — exposure, aperture, sensor sensitivity





- image formation
	- high interacts with the scene 


Object identification with high accuracy 
Motion Sensing
Material and lighting estimation
Gaze tracking
Depth estimation
Semantic segmentation
Object detection


Representation of Images
Representation of Shapes
Representation of Motions
Representation of Lighting and material


Classification
imitation learning? 


Broad classes of vision applications
- sense
	- reconstruct
	- Recognize
	- Reorganize
- understand (what do these object represent) (Machine Learning)
	- Scenes
	- People
- Interact (objects interact with each other)
	- Human-Human
	- Human-Machine
	- Machine-Machine

Good Application requires a combination all of these factors
Main works come from
- deep learning
- 

The study of image formation



# CSE 152A — Image Formation & Photometry

**Course**: CSE 152A, SP26  
**Instructor**: Manmohan Chandraker  
**Topic**: Photometry & Geometry of Image Formation

---

## 🗂️ Overview

Two fundamental questions in computer vision:

1. **Photometry** — _Why does the image look the way it does?_ (intensity, color, brightness)
2. **Geometry** — _Where does everything appear in the image?_ (placement, projection, perspective)

---

## 📷 Geometry of Image Formation

- A 3D scene is **projected** onto a 2D image plane
- Key concepts:
    - **Perspective projection** — objects farther away appear smaller
    - **Camera models** — pinhole camera, lenses
    - **Vanishing points** — parallel lines converge at a point in the image

---

## 💡 Photometry of Image Formation

- The same scene looks completely different depending on lighting
- Photometry deals with **measuring light** — brightness, color, intensity
- Example: Monet's haystacks look different at different times of day — same geometry, different photometry

---

## 📸 Camera Design

### Problem: Just Film

- Every point on an object sends light in **all directions**
- Multiple rays hit the same spot on film → **blurry mess**

### Solution: Pinhole Camera

- Add a **barrier with a tiny hole (aperture)**
- Only **one ray per point** passes through
- Each point maps to **exactly one point** on the film → sharp image
- Resulting image is **flipped upside down**

### Camera Obscura

- Literally a dark room/box with a pinhole
- Used historically to observe eclipses and as an artist's drawing aid (e.g. Vermeer)
- Leonardo da Vinci described it: objects appear in proper form, reduced in size, reversed

---

## 🔵 Aperture & The Circle of Confusion

- Real apertures have **finite size** → multiple rays from one point hit slightly different spots → **circle of confusion** (blur)
- **Smaller aperture** → sharper image BUT:
    - Less light gets through
    - **Diffraction effects** kick in at very small sizes (light bends around the hole)
- There is a **sweet spot** aperture size

### Shrinking Aperture Demo

|Aperture|Result|
|---|---|
|2mm|Very blurry|
|1mm|Blurry|
|0.6mm|Clearer|
|0.35mm|Sharp|
|0.15mm|Sharp|
|0.07mm|Blurry again (diffraction)|

---

## 🔍 Adding a Lens

- A lens **bends all rays from one point back together** onto one spot on film
- Allows **large aperture** (lots of light) AND sharp image simultaneously
- Only objects at a **specific distance** are perfectly in focus
- Other distances → circle of confusion → **background blur (bokeh)**
- Changing lens shape changes the focus distance

---

## 🖥️ Digital Camera

- Replaces film with a **sensor array**
- Each cell = light-sensitive diode that converts **photons → electrons**
- Two types: **CCD** and **CMOS**

### How Light is Recorded

```
Light source → hits scene → reflects → passes through imaging system → hits sensor
```

---

## 🧮 The Raster Image (Pixel Matrix)

- An image is just a **2D grid of numbers**
- Each number = brightness at that location
    - **0** = black
    - **1** = white
    - Values in between = grey
- Color image = **3 matrices** stacked: R, G, B

---

## ☀️ Light & Shading — What Determines a Pixel's Value?

A pixel's brightness depends on **5 factors**:

1. **Illumination** — strength, direction, color of light source
2. **Surface orientation** — angle between surface and light
3. **Surface material** — how it reflects light (shiny vs matte)
4. **Nearby surfaces** — shadows, inter-reflections
5. **Camera parameters** — exposure, aperture, sensor sensitivity

> A single pixel is **too ambiguous** to interpret alone — any of these 5 factors could explain its value

---

## 📐 Intensity & Surface Orientation

### The Foreshortening Term: (ω_i · n)

$$I(x) \propto (S \cdot N(x))$$

- **S** = light direction
- **N(x)** = surface normal (which way the surface faces)
- The **dot product** gives a number between 0 and 1:
    - 0° angle → cos(0) = **1** → maximum brightness
    - 45° angle → cos(45) = **0.7** → 70% brightness
    - 90° angle → cos(90) = **0** → no light

> Think of sunlight: direct overhead (equator) = hot & bright. Low angle (poles) = same light spread over more area = cold & dim

---

## 🪞 Reflection Models

### Diffuse (Lambertian) Reflectance

- Some light **absorbed** (controlled by albedo ρ)
- Remaining light **scattered equally in all directions**
- Looks the same brightness from any viewing angle
- Examples: cloth, concrete, matte paint

### Specular Reflection

- Light reflects at a **specific angle** (angle in = angle out)
- Appearance changes depending on viewing angle
- Creates **highlights**
- Example: mirrors, shiny metal

> Most real surfaces = **mix of diffuse + specular**

---

## 🧮 The Full Image Formation Equation (BRDF)

$$L_o(\omega_o) = \int_\Omega L_i(\omega_i) , f(\omega_o, \omega_i) , (\omega_i \cdot n) , d\omega_i$$

Breaking it down as a **chain of percentages**:

|Term|Meaning|
|---|---|
|$L_i(\omega_i)$|How much light is coming in|
|$(\omega_i \cdot n)$|What % of that light actually lands on the surface (geometry)|
|$f(\omega_o, \omega_i)$|What % of landed light reflects toward the camera (material)|
|$L_o(\omega_o)$|Final pixel brightness|

**Why multiply?** Each term is an independent fraction/percentage applied sequentially:

- How much light exists × how much hits × how much bounces to camera = pixel brightness

### BRDF = Diffuse + Specular

$$\text{BRDF} = \text{Diffuse Reflectance} + \text{Specular Reflectance}$$

---

## ✨ Other Lighting Effects

### Refraction

- Light **bends** when passing _through_ a surface (glass, water)
- BRDF can't model this — it only handles light bouncing _off_ surfaces

### Subsurface Scattering

- Light enters surface, bounces **inside the material**, exits at a different point
- Example: skin glows reddish when backlit
- Key for realistic CGI skin (e.g. Gollum in Lord of the Rings)

### Fluorescence

- Light absorbed at wavelength λ1, re-emitted at **different wavelength** λ2
- Happens instantly
- Example: highlighter pens under UV light

### Phosphorescence

- Same as fluorescence but with a **time delay**
- Material keeps glowing after light source is removed
- Example: glow-in-the-dark stickers

---

## 🌈 Color

### Light is a Spectrum

- Light exists across a full range of wavelengths (400–700nm visible)
- **400nm** = violet/blue
- **550nm** = green/yellow (peak human sensitivity)
- **700nm** = red

### Why RGB?

- Human eyes have only **3 types of cone cells**:
    - **S cones** — peak ~420nm → blue
    - **M cones** — peak ~534nm → green
    - **L cones** — peak ~564nm → red
- Plus **rods** for intensity (night vision, no color)
- Since we only have 3 receptors, **3 numbers is enough** to describe any color we can see
- Cameras mimic human vision → RGB

### Animal Comparison

|Animal|Cone Types|Color Vision|
|---|---|---|
|Night animals|1|None|
|Dogs|2|Limited|
|Humans|3|Normal|
|Fish/Birds|4|Beyond human|
|Mantis shrimp|12|Extraordinary|

### Surface Color

- A surface's color = which wavelengths it **reflects** vs **absorbs**
- Red tomato = reflects red wavelengths, absorbs others
- Color seen = **E(λ) × ρ(λ)** (light spectrum × surface albedo spectrum)

---

## 🎨 Color Sensing: Bayer Grid

- Camera sensors only measure **intensity**, not color
- Fix: place a **color filter** over each sensor cell
- Pattern: alternating R, G, B filters (twice as many green — matches human sensitivity)
- Each cell measures only **one color channel**
- Missing values are **estimated from neighboring cells** → called **demosaicing**

---

## 🧠 Key Insights

### The Plight of the Poor Pixel

A single pixel value is determined by **5 independent factors** simultaneously — making it impossible to interpret in isolation. Context is everything.

### Local Differences Matter Most

- Humans can recognize a pencil sketch with no color or accurate brightness
- Because recognition relies on **edges and local differences** in brightness, not absolute pixel values
- Edges tell you where objects are, their shape, and depth

### The Adelson Checker Shadow Illusion

- Squares A and B on a checkerboard in shadow appear different shades
- In reality they are the **exact same pixel value**
- The brain compensates for shadow context → perceives them differently
- Proves: **raw pixel values ≠ perceived reality**
- Computer vision challenge: same pixel value can mean completely different things depending on context

---

## 📌 Summary

```
3D World
    ↓ Geometry (projection, perspective)
2D Image Plane
    ↓ Photometry (light, material, angle)
Pixel Values (just numbers!)
    ↓ Interpretation
Scene Understanding
```

> The core challenge of computer vision: working **backwards** from pixel values to understand the 3D world that created them.

---

_Tags: #computervision #imageformation #photometry #geometry #BRDF #pinholecamera #color #RGB_
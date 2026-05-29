**Summary**: Entry point for the computer-vision notes. Vision works *backwards* from pixel values to the 3D scene that produced them, splitting into image **formation** (how pixels get their values) and image **analysis** (extracting meaning from them).

**Last updated**: 2026-05-29

---

Computer vision turns the physical world into digital numbers, then tries to reverse the process: given only pixel values, recover the scene that created them.

## Creating an image
The actual world is transformed into digital numbers. Capturing an image requires three components:
- Light emitted from a **source**
- Light **reflected** off a surface toward the camera
- Light **recorded** by the sensors in the camera

See [[Image Formation & Photometry]] for the full story of how a pixel gets its value — camera design, lenses, sensors, reflection models, and color.

## The image-formation pipeline
3D World → [[Camera Projection Pipeline]] → 2D Image → [[Lambertian Photometric Model|Photometric Stereo]] (recovering 3D)

Two complementary questions:
- **Geometry** — *where* does everything appear? → [[Geometric Projection Model]], [[Extrinsics]], [[From Image Plane to Pixel Coordinates]], [[Ideal Points]]
- **Photometry** — *why* does the image look the way it does? → [[Image Formation & Photometry]], [[Lambertian Photometric Model]]

## Analyzing an image
- [[Feature Detection]] — detect distinctive points in an image
- [[Feature Matching]] — match features across images
- [[Two-View Reconstruction]] — recover 3D structure from two views
- [[RANSAC]] — robustly fit models (e.g. the fundamental matrix) despite outliers
- [[Recognition & Vision Tasks]] — higher-level tasks: classify, detect, identify, segment

## The core challenge
A single pixel's value is set by many factors at once, so it is ambiguous in isolation. Vision works **backwards** from pixels to scene:

```
3D World
    ↓ Geometry (projection, perspective)
2D Image Plane
    ↓ Photometry (light, material, angle)
Pixel Values (just numbers!)
    ↓ Interpretation
Scene Understanding
```

## Related pages
- [[Image Formation & Photometry]]
- [[Camera Projection Pipeline]]
- [[Recognition & Vision Tasks]]
- [[RANSAC]]

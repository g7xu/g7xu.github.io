**Summary**: Sub-index and entry point for the Computer Vision cluster. Vision works *backwards* from pixel values to the scene that produced them — image **formation** (how pixels get their values), **features & reconstruction** (recovering 3D), and **recognition** (extracting meaning). Links to every CV page, grouped by sub-area.

**Last updated**: 2026-05-29

---

Computer vision turns the physical world into digital numbers, then tries to reverse the process: given only pixel values, recover the scene that created them. A single pixel is ambiguous in isolation, so the field works **backwards** from pixels to scene:

```
3D World
    ↓ Geometry (projection, perspective)
2D Image Plane
    ↓ Photometry (light, material, angle)
Pixel Values (just numbers!)
    ↓ Interpretation
Scene Understanding
```

The three sub-areas below follow that arc: **formation** (world → pixels), **features & reconstruction** (pixels → 3D), and **recognition** (pixels → meaning).

## Image Formation & Geometry
How a scene becomes pixels — *where* things appear (geometry) and *why* they look the way they do (photometry).
- [[Image Formation & Photometry]] — how a camera turns a scene into pixels: optics, sensors, reflection models, BRDF, color
- [[Geometric Projection Model]] — pinhole camera model and the projection formula
- [[Camera Projection Pipeline]] — end-to-end mapping from a 3D world point to a 2D pixel
- [[Extrinsics]] — world-to-camera coordinate transformation (rotation + translation)
- [[From Image Plane to Pixel Coordinates]] — intrinsic matrix K and the image-to-pixel step
- [[Ideal Points]] — points at infinity and their role in projective geometry
- [[Lambertian Photometric Model]] — diffuse reflectance model and photometric stereo

## Features & Reconstruction
Find distinctive points, match them across views, and recover 3D structure.
- [[Feature Detection]] — detecting corners and keypoints in images
- [[Feature Matching]] — matching detected features across views
- [[Two-View Reconstruction]] — recovering 3D structure from two images via epipolar geometry
- [[RANSAC]] — robust model fitting: estimating the fundamental matrix despite outlier matches

## Recognition & Retrieval
Higher-level meaning — what's in the image, and finding specific instances.
- [[Recognition & Vision Tasks]] — recognition as classification, the task taxonomy, and the data-driven shift
- [[Discriminative vs Generative Methods]] — modeling the posterior vs. the likelihood/joint; the three pillars (representation, learning, inference)
- [[Image Retrieval (Bag of Words)]] — instance recognition via the bag-of-features pipeline
- [[Scaling Image Retrieval]] — making retrieval fast: inverted file index, TF-IDF, vocabulary tree

## Leads into
Modern recognition is dominated by deep learning, which lives under Machine Learning: [[Neural Network]] → [[Convolutional Neural Network (CNN)]].

# Recognition & Vision Tasks

**Summary**: Recognition maps pixels to concepts. This page covers the taxonomy of recognition tasks (all framed as classification), why recognition is hard (three kinds of variation), and why the field shifted from hand-written rules to data-driven machine learning.

**Last updated**: 2026-05-29

---

Recognition is the **second half** of the course. The first half was about *models* (geometry, photometry, robust estimation) — the power of a few parameters. Recognition is about the power of **data**.

## The four recognition questions
Every recognition problem is really a question we ask of an image:

- **What is it?** → object & scene recognition
- **Who is it?** → identity recognition
- **Where is it?** → object detection
- **What are they doing?** → activity recognition

**All of these are classification problems**: choose one class from a list of possible candidates. Classification is the most basic recognition problem.

## Task taxonomy
Using one street scene as a running example:

- **Verification** — yes/no for a region: *"is that a bus?"*
- **Detection** — find and localize instances: *"where are the cars?"* → pinpoint each
- **Identification** — a specific instance/identity: *"is that a picture of Mao?"* / "is this *this* person?"
- **Object categorization** — label every region with its semantics: sky, building, flag, banner, face, street lamp, bus, cars, wall
- **Scene / context categorization** — the overall scene: outdoor, city, traffic; indoor vs. outdoor, urban vs. rural, sunny vs. rainy

## Recognition in autonomous driving
A single application needs many of these at once:

- **Where is our car?** → [[Two-View Reconstruction|structure from motion]], visual SLAM
- **Where are other agents?** → object detection, 3D localization
- **Where are scene elements?** (road, sidewalk — things you can't box) → **semantic segmentation** (label every pixel)
- **What is a safe path?** → behavior prediction & path planning (you care about not hitting someone *seconds in the future*)

Geometry/motion is solved with 3D estimation ([[Two-View Reconstruction]]); the rest are recognition problems.

## Why is recognition hard? Three kinds of variation
**1. Imaging variations** — same object, different image:
- **Viewpoint** — the object looks different from different angles
- **Lighting** — intensities change, appearance shifts
- **Occlusion / clutter** — the object is partly hidden
- **Deformation** — articulated/soft objects (people, animals) bend and pose

**2. Inter-class variation** — between categories. There are roughly **10,000–30,000** object categories worth recognizing. Few classes are easy (cat vs. bicycle), but as you add dogs, motorbikes, tricycles… the **confusion between class boundaries** grows.

**3. Intra-class variation** — within one category. Try to *define a chair*: seat, back, legs… and someone builds a chair that breaks every rule (wheels instead of legs, no back). *Define a cat*: impossible to capture with rules. Definitions are insufficient for semantic categories.

## Why machine learning (not rules)?
- **Typical CS**: write a program that executes a fixed set of **rules** (a codified algorithm).
- **Computer vision**: for most categories it is *very hard* to define such rules (you can't write the "cat algorithm").
- **Machine learning**: the program is **developed from examples** instead of rules. We stop trying to define a cat and just collect many labeled examples — *cat* vs. *not cat*.
- **Training data** = input–output pairs. In vision, inputs are **images**, outputs are **labels**.

## Why it works now: data-driven vision
Recognition hit an inflection point around **2012**, when three things came together:

1. **Big labeled datasets** — the internet & social media produced massive image+caption data (a caption is a free label)
2. **Deep learning** — methods able to ingest that data
3. **GPU technology** — highly parallel compute to train large networks (cf. NVIDIA)

ImageNet top error rates fell from ~25% (2011) to below the **human level (~5%)** by 2015.

## What's next
The course will look at **discriminative vs. generative** methods, then families of recognition methods — **retrieval**, **classification**, and **deep learning / neural networks**.

## Related pages
- [[Computer Vision Overview]]
- [[Feature Detection]]
- [[Two-View Reconstruction]]
- [[RANSAC]]
- [[ML Overview]]

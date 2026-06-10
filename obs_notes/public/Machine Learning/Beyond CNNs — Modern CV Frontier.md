**Summary**: The capstone map of CSE 152A — a one-paragraph recap of what the course built (image formation → reconstruction → recognition → deep networks), then a survey of the modern frontier the course *opens onto*: vision transformers, vision-language models, diffusion/generative models, and neural rendering, plus the shift toward self-supervised, multimodal, and **agentic** systems. This is the bridge from the CV theory cluster to the [[Robotics & Embodied AI Overview|robotics cluster]].

**Last updated**: 2026-06-09

---
## The trajectory of computer vision
The lecture frames modern CV as a series of widenings (the recurring "*Defining computer vision*" slides):
- **Problems became more complex** — single-object detection → crowded scenes, many categories.
- **Ambitions became higher** — from labeling images to AR and autonomous driving.
- **Tools advanced** — hand-engineered features + a shallow classifier → **end-to-end feature learning** (the CNN shift this course covered).
- **Scope increased** — pure supervised learning → **self-supervised** (pretext-task pretraining, then transfer — see [[Transfer Learning]]) and **multimodal** (vision **+** language).

A useful framing for *why* language matters: a [[Vision-Language Model (VLM)|transformer]] captioning an image does **attention** ("the cat is playing with a camera"); true reasoning needs **intervention / out-of-distribution** reasoning, where **human knowledge encoded in language** helps with unseen problems.

## Four big advances beyond CNNs
The lecture highlights four frontiers, each a forward-reference for future pages:

1. **Vision transformers (ViT)** — split an image into patches, add position embeddings, feed to a transformer encoder (attention instead of convolution). Now solve many vision problems to very high accuracy. → [[Vision Transformer (ViT)]]
2. **Vision-language models** — CLIP, GPT-style multimodal models, DALL·E. Vision reasoning grounded in language. Already in the vault: [[Vision-Language Model (VLM)]].
3. **Diffusion / generative models** — generate images and video from prompts (Imagen); learn a generator $G:\text{latent}\to\text{data}$ (GANs, diffusion). → [[Diffusion Models]], [[Generative Adversarial Networks (GAN)]].
4. **Neural rendering** — graphics-inspired 3D: [[Neural Radiance Fields (NeRF)|NeRF]] / neural fields, inverse rendering, and 3D content creation from images or text.

The same "bigger ≠ better" lesson from [[CNN Architectures#Bigger is not better|architectures]] holds: the **task pipelines themselves evolve** — object detection and segmentation each went HoG+SVM → CNN → transformer → self-supervision → **open-world** (e.g. Segment Anything).

## Keystone problems are becoming solvable
Problems considered very hard five years ago are now consumer-grade in places:
- **Autonomous driving** — practical in many regions (Waymo); fuses camera/IMU/LIDAR, and increasingly reasons over **rules of the road** (driving manuals) — a vision-**and**-language task.
- **Augmented reality** — shippable devices (Apple Vision Pro).
- **Interactive robotics** — robots doing complex human-like tasks (SayCan). This is exactly the [[Robotics & Embodied AI Overview|robotics & embodied-AI cluster]]: [[Vision-Language Model (VLM)|VLMs]] → [[RT-2|VLAs]] that map perception to action.

## The next paradigm: agents
The lecture's parting thesis: the field has **already** moved past "just foundation models" to the question of **how these models are deployed, interact with environments, and get feedback** — i.e. **agentic** systems. The pattern: an LLM that **plans → acts → observes → rethinks**, with short/long-term **memory**, an **objective**, and **tools** (chat, machines, APIs) acting on environments (e.g. HuggingGPT chaining specialist vision models). This is the throughline into the vault's [[Robotics & Embodied AI Overview|VLA / embodied-AI]] work and the "beyond foundation models" framing there.

> **Take-home message** (the instructor's closing line): *this is a great time to study computer vision* — the pace is such that "everything we talk about today will be outdated next year," which makes the field an exciting place to be.

## Related pages
- [[Computer Vision Overview]]
- [[CNN Architectures]]
- [[Vanishing & Exploding Gradients]]
- [[Vision-Language Model (VLM)]]
- [[RT-2]]
- [[Robotics & Embodied AI Overview]]
- [[Transfer Learning]]
- [[Discriminative vs Generative Methods]]

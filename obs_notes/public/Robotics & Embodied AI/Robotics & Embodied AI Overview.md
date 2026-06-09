---
tags:
  - moc
---
**Summary**: Sub-index and entry point for the Robotics & Embodied AI cluster. This domain is where the vault's learning theory meets the physical world: **vision-language-action (VLA) models** that turn web-scale knowledge into robot control, and the **humanoid platforms** they run on. Links to every page in the cluster, grouped by software ("brains") vs. hardware ("bodies").

**Last updated**: 2026-05-30

---

Embodied AI asks: *how do you get a learning system to act in the physical world?* Two halves have to meet — a **policy** (software that decides what to do) and a **platform** (hardware that does it). This cluster tracks both, and how they're converging in 2026 (e.g. Boston Dynamics putting Google DeepMind foundation models into Atlas).

```
Web-scale knowledge (VLMs)
        ↓ co-fine-tune on robot data, tokenize actions
   VLA policy (the "brain")   ←—— RT-2, OpenVLA, …
        ↓ runs on
   Humanoid platform (the "body")  ←—— Atlas
        ↓ acts in
     Physical world
```

## Methods & Models — the "brains"
Learned policies that map perception + instructions to actions. These build on **Vision-Language Models (VLMs)** — the conceptual root of this cluster. A **VLA** is a generative VLM fine-tuned to emit *actions* instead of (only) words, so robotics inherits every advance in VLMs.

- [[Vision-Language Model (VLM)]] — the foundation: image+text → text models (CLIP, Flamingo, BLIP-2, PaLI, PaLM-E); the taxonomy, fusion designs, and why VLA extends them.
- [[RT-2]] — the headline VLA model (Google DeepMind, 2023); coined the paradigm by representing actions as text tokens.
- [[OpenVLA]] — the 7B open-source answer to RT-2; beats closed RT-2-X (55B) with 7× fewer params, and adds LoRA fine-tuning + quantization for consumer GPUs.
- [[CogACT]] — challenges the action-as-tokens design: decouples cognition (VLM) from action (a diffusion-transformer module) for precise continuous control.
- [[OE-VLA]] — widens the *instruction* side: follow open-ended multimodal prompts (object images, whiteboard text, goal images, video demos), not just language.

**The VLA design axes** these four papers explore: RT-2 set the *paradigm*; OpenVLA made it *open & efficient*; CogACT rethinks the *action* representation (diffusion vs tokens); OE-VLA rethinks the *instruction* modality (multimodal vs language).

## Platforms & Hardware — the "bodies"
The physical machines policies run on.

- [[Atlas (Boston Dynamics)]] — all-electric production humanoid (56 DoF, tactile hands, 360° vision); 2026 deployments at Hyundai and **Google DeepMind**, whose foundation models supply Atlas's cognitive layer.

## Builds on
The methods here stand on the Machine Learning cluster — VLA policies are large neural networks at heart:

[[Neural Network]] → [[Convolutional Neural Network (CNN)]] → [[Vision-Language Model (VLM)|VLMs]] → **VLA**

See also [[Transfer Learning]] (co-fine-tuning is transfer learning taken to its limit) and [[Discriminative vs Generative Methods]].

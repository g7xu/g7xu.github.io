**Summary**: OE-VLA (Westlake / Zhejiang University, 2025) widens a different axis of VLAs than [[RT-2]]/[[OpenVLA]]/[[CogACT]]: instead of improving success on *language* commands, it lets a VLA follow **open-ended multimodal instructions** — an object shown as an image, a command written on a whiteboard, a goal image, or a short video demo — closing the gap between rigid language-only prompting and natural human-robot interaction.

**Sources**: Zhao, Li, Gong, Ding, Zhao, Wang, *"Unveiling the Potential of Vision-Language-Action Models with Open-Ended Multimodal Instructions"*, arXiv:2505.11214 (Westlake University / Zhejiang University, 2025).

**Last updated**: 2026-05-30

---

## The gap: VLAs only listen to language
[[RT-2]], [[OpenVLA]], and [[CogACT]] all take **one form of instruction — text**. But real guidance is multimodal (source: OE-VLA (arXiv 2505.11214).pdf): a person might *point at* an object in a photo, write the command on a **whiteboard**, hand the robot a **goal image**, or show a **one-shot video** of the task. OE-VLA's contribution is the **input** side — letting a VLA accept these *open-ended multimodal instructions* through one unified architecture — rather than the action side.

This completes the design-axis map of the cluster:
- [[RT-2]] — the **paradigm** (actions as tokens + web knowledge)
- [[OpenVLA]] — **open-source + efficient**
- [[CogACT]] — better **action representation** (diffusion head)
- **OE-VLA** — richer **instruction modality** (open-ended multimodal input)

## Four open-ended task types
Beyond ordinary language-conditioned tasks, OE-VLA introduces four (source: OE-VLA (arXiv 2505.11214).pdf):
1. **Visual Object Specification (VOS)** — the target objects are shown as *images*, not named in text: "grasp the `<img₁>` and put it into `<img₂>`."
2. **Optical Instruction Following (OIF)** — the command appears *inside an image* (e.g., handwritten on a whiteboard): "follow the command in `<img>`."
3. **Visual Goal Reaching (VGR)** — given a *goal-state image*, act to reach it: "reach the goal state in `<img>`."
4. **Video Demo Learning (VDL)** — given a ~4-frame *video demo*, infer and perform the actions.

## Architecture
A standard VLA stack tuned for **interleaved multi-image input** (source: OE-VLA (arXiv 2505.11214).pdf):
- **Foundation model**: **LLaVA-Next-Interleave** — picked specifically for free-form *multi-image* handling.
- **Vision encoder**: **SigLIP-400M ViT** (384², patch 14), applied to both observation images (static + wrist camera) and instruction images.
- **LLM backbone**: **Qwen-1.5**, whose **32k-token context** is needed to fit multi-image / video instructions.
- **Action representation**: **discretized tokens** — 256 bins, reusing Qwen's least-used tokens, predicting a **5-step action chunk** (max-log-likelihood loss).

Notably, OE-VLA **deliberately keeps the token approach and avoids a diffusion head** — the *opposite* choice from [[CogACT]] — so that the only thing being tested is the **instruction modality**, not the action representation. (RT-2's trick reused, CogACT's not.)

## How it's trained
- **Data construction (a key contribution):** a recipe to **convert any language-annotated robot dataset** into open-ended multimodal data — use a VLM (Qwen2.5-7B) + open-vocabulary detector (Dino) to crop objects for VOS; render text onto images with varied fonts/backgrounds for OIF; sample goal frames for VGR; sample video frames for VDL.
- **Two-stage curriculum** (source: OE-VLA (arXiv 2505.11214).pdf):
  - **Stage 1 — Multi-Image Grounding**: fine-tune on a grounding dataset (object tracking, referencing) to sharpen spatial relationships *across* images — bridging LLaVA-Interleave's storytelling skills toward manipulation.
  - **Stage 2 — Open-Ended Instruction Tuning**: train on the constructed robot data, all task types unified as `(<obs>, interleaved text/image instruction, <action>)`.
- **Benchmarks**: two new suites built on **CALVIN** — **OE-CALVIN_base** and **OE-CALVIN_hard** (hard = web-sourced object images, handwritten fonts, diverse viewpoints).

## Results
- On **standard language** CALVIN (ABC→D), OE-VLA-7b achieves the **best** average successful-sequence length (**2.99**), ahead of KosMos (2.70), RoboFlamingo (2.48), and far ahead of fine-tuned OpenVLA (0.90, hampered by its single-view input). So **adding multimodal capability doesn't cost language performance** (source: OE-VLA (arXiv 2505.11214).pdf).
- On the open-ended benchmarks it's strong on **VOS** (~95% first-task success), **OIF**, and **VDL**; **VGR** (visual goal reaching) is the hardest — a single goal image carries limited information.
- Scaling 1B → 7B markedly improves the multimodal tasks; the Stage-1 grounding step helps most on the harder split.

## Why it matters
OE-VLA reframes VLA progress around **human-robot interaction**, not just task success: a robot you can instruct by showing, writing, or demonstrating — not only by typing a sentence. It rounds out the cluster's exploration of the VLA design space along the *input* dimension, complementing CogACT's work on the *output* dimension. It leans directly on the [[Vision-Language Model (VLM)|VLM]] family's interleaved-image strength (LLaVA-Interleave, Qwen, SigLIP).

## Related pages
- [[RT-2]] · [[OpenVLA]] — the language-only VLAs OE-VLA generalizes (and whose token-action approach it keeps)
- [[CogACT]] — the contrasting design: OE-VLA varies the *input* modality while keeping token actions; CogACT varies the *output* (diffusion) while keeping language input
- [[Vision-Language Model (VLM)]] — LLaVA-Interleave / Qwen / SigLIP foundation; interleaved image-text input
- [[Robotics & Embodied AI Overview]] — the cluster this completes

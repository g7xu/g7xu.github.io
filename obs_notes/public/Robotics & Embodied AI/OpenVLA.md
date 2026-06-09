**Summary**: OpenVLA (Stanford et al., 2024) is a **7B-parameter open-source** vision-language-action model — the open answer to [[RT-2]]. It fine-tunes a [[Vision-Language Model (VLM)|VLM]] (Llama 2 + a fused DINOv2/SigLIP vision encoder) on 970k real robot episodes, and **beats the closed 55B RT-2-X by +16.5% absolute success with 7× fewer parameters**. Its real contribution is making VLAs *practical*: LoRA fine-tuning and 4-bit quantization let you adapt and run one on a single consumer GPU.

**Sources**: Kim, Pertsch, Karamcheti, et al., *"OpenVLA: An Open-Source Vision-Language-Action Model"*, arXiv:2406.09246 (Stanford / UC Berkeley / Toyota Research Institute / Google DeepMind / Physical Intelligence / MIT, 2024).

**Last updated**: 2026-05-30

---

OpenVLA picks up exactly where [[RT-2]] left off. RT-2 proved the [[RT-2|VLA paradigm]] works but was **closed** (no public weights/architecture/data) and **never studied fine-tuning** — the very thing needed for adoption. OpenVLA's thesis: robotics needs *open, fine-tunable* generalist VLAs, like the open-source ecosystem that grew around LLMs (source: OpenVLA (arXiv 2406.09246).pdf).

## Architecture
Given an image + a language instruction, OpenVLA predicts a **7-DoF robot action** (Δposition, Δorientation, Δgripper). It's built on the **Prismatic-7B [[Vision-Language Model (VLM)|VLM]]** (source: OpenVLA (arXiv 2406.09246).pdf):

```
Input image ─► [ DINOv2 + SigLIP ] ─► MLP projector ─┐
                 (fused vision enc.)                  ├─► Llama 2 7B ─► Action De-Tokenizer ─► Δx, Δθ, Δgrip
"Put eggplant in bowl" ─► Llama tokenizer ────────────┘
```

- **Vision encoder**: a *two-part* encoder concatenating **SigLIP** (high-level semantics) and **DINOv2** (low-level spatial features) channel-wise. The DINOv2 half is the key choice — it adds **spatial reasoning** that pure CLIP/SigLIP encoders lack, which matters for precise control.
- **LLM backbone**: **Llama 2 7B**.
- **Patch-as-token**: image patches become tokens projected into the LLM's input space (the modern open-VLM convention).

## Action tokenization (inherited from RT-2, refined)
OpenVLA uses RT-2's "actions as text tokens" trick with two tweaks (source: OpenVLA (arXiv 2406.09246).pdf):
- Each action dimension is discretized into **256 bins**, but bounded by the **1st–99th percentile** of training actions (not min/max) — so outlier actions don't blow up the bin width.
- Llama's tokenizer reserves only **100** special tokens (too few for 256), so OpenVLA **overwrites the 256 least-used tokens** in Llama's vocabulary with action tokens — the same *symbol-tuning* move RT-2 used for PaLM-E.
- Trained with standard next-token prediction, **cross-entropy on the action tokens only**.

## Headline results
- **Beats RT-2-X (55B)** by **+16.5% absolute** success across 29 tasks and multiple robot embodiments — while being **7× smaller (7B vs 55B)** (source: OpenVLA (arXiv 2406.09246).pdf).
- Sets a new state of the art for open generalist manipulation; on fine-tuning, beats from-scratch **Diffusion Policy** by **+20.4%** on multi-object, language-grounding tasks.
- **Why it wins despite being smaller**: a larger, more carefully curated robot dataset (970k vs 350k trajectories), and the fused **DINOv2+SigLIP** spatial encoder.

## The real contribution: practical, efficient VLAs
This is what distinguishes OpenVLA from RT-2 (source: OpenVLA (arXiv 2406.09246).pdf):
- **Parameter-efficient fine-tuning ([[Transfer Learning|LoRA]])** — adapting to a new robot/task trains only **1.4% of parameters** and matches *full* fine-tuning, in **10–15h on a single A100** (~8× compute reduction).
- **Quantization** — **4-bit** inference matches bfloat16 quality at **7.0 GB VRAM** (vs 16.8 GB), so OpenVLA runs on a **consumer GPU**.
- **Fully open-source** — data, weights, *and* training/fine-tuning code released. It's the first open generalist VLA.

## Surprising design findings (ablations)
- **Fine-tune the vision encoder, don't freeze it.** Prior VLM wisdom says freezing the vision encoder preserves its pretrained features. For VLAs the opposite holds — fine-tuning it is **crucial** for the fine-grained spatial detail control needs.
- **Train for many epochs.** LLM/VLM training uses 1–2 epochs; VLA training needed **~27 epochs**, pushing until action-token accuracy passes **95%**.
- **Resolution doesn't help.** 224² and 384² inputs performed the same (unlike VLM benchmarks, where higher res helps) — 384² just costs 3× the training time.

## Limitations & the RT-2 tension
- **Single image only** — no proprioception or observation history; multi-input VLAs are future work.
- **Throughput** — ~6 Hz on an RTX 4090 is too slow for high-frequency control (e.g. ALOHA at 50 Hz); action chunking / speculative decoding are proposed remedies.
- **Reliability** — typically <90% success on tested tasks.
- **The key tension with [[RT-2]]:** RT-2-X still **wins on *semantic* generalization**, because it **[[RT-2|co-fine-tunes on web data]]** alongside robot data, preserving Internet knowledge — whereas OpenVLA is fine-tuned on robot data *alone* and loses some of that semantic transfer. This is direct evidence *for* RT-2's co-fine-tuning insight, and a natural next design question OpenVLA leaves open.

## Why it matters
OpenVLA did for VLAs what open LLMs did for NLP: a strong, *reproducible, fine-tunable* baseline anyone can build on. It makes the [[RT-2|VLA paradigm]] accessible without a 55B closed model or a TPU cloud — the reference point that [[CogACT]] and [[OE-VLA]] extend.

## Related pages
- [[RT-2]] — the closed 55B predecessor OpenVLA opens up and beats
- [[Vision-Language Model (VLM)]] — the Prismatic/Llama-2 backbone OpenVLA fine-tunes
- [[Transfer Learning]] — LoRA, fine-tuning vs. freezing, the efficiency story
- [[Robotics & Embodied AI Overview]] — the cluster this sits in
- forward refs: [[CogACT]], [[OE-VLA]]

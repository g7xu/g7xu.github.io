**Summary**: A Vision-Language Model (VLM) bolts vision onto a large language model so it can take **images *and* text** as input and reason over both — typically `image encoder + text encoder → fusion layer → LLM → text`. VLMs are the conceptual root of the vault's robotics cluster: a [[RT-2|vision-language-action]] model is just a *generative VLM fine-tuned to emit actions instead of words*.

**Sources**: Ghosh, Acharya, Saha, Jain, Chadha, *"Exploring the Frontier of Vision-Language Models: A Survey of Current Methodologies and Future Directions"*, arXiv:2404.07214 (IIT Patna / Stanford / Amazon AI, 2024; surveys ~70 models).

**Last updated**: 2026-05-30

---

## Why VLMs exist
[[Neural Network|LLMs]] are powerful but **confined to a single modality — text** (source: Exploring the Frontier of Vision-Language Models.pdf). Natural intelligence integrates many modalities at once; to close that gap, researchers fused **visual capabilities into LLMs**, producing **Vision-Language Models**. A VLM can do tasks that live at the image–text intersection: visual question answering (VQA), image captioning, multimodal summarization, infographic generation, and multimodal retrieval (source: Exploring the Frontier of Vision-Language Models.pdf).

**Not every multimodal model is a VLM.** Text-to-image generators like DALL-E and Midjourney are multimodal but **lack a language-generation component**, so the survey excludes them — a VLM must understand/produce *language* grounded in vision (source: Exploring the Frontier of Vision-Language Models.pdf).

## General architecture
A VLM consists of an **image encoder** and a **text encoder** producing embeddings, an **image-text fusion layer** that combines them, and an **LLM** that turns the fused vector into visually-aware text (source: Exploring the Frontier of Vision-Language Models.pdf):

```
 TEXT ──► text encoder ─┐
                        ├──► image-text fusion ──► LLM decoder ──► text out
IMAGE ──► image encoder ┘        (variable)

   each block is either  ❄️ frozen  or  🔥 trainable
```

The **fusion layer is the key design axis.** Three canonical approaches (source: Exploring the Frontier of Vision-Language Models.pdf):
- **Q-Former** — a small trainable Querying Transformer bridging a frozen image encoder and frozen LLM → **BLIP-2**.
- **Perceiver Resampler** — compresses variable visual features into a fixed set of tokens → **Flamingo**.
- **MLP / fully-connected projection** — simplest; project image features into the LLM's token space → **LLaVA**.

Which blocks are frozen vs. trained is itself a major lever — freezing the LLM (e.g. Flamingo, BLIP-2) preserves language ability and slashes training cost; this links directly to [[Transfer Learning]].

## The survey's taxonomy (by input/output)
The survey classifies VLMs into **three** groups by what they can take in and produce (source: Exploring the Frontier of Vision-Language Models.pdf):

1. **Vision-Language Understanding (VLU)** — *comprehend* visual info with language; no free-form generation. The contrastive-representation family lives here.
   - **CLIP** (OpenAI) — contrastive image-text pretraining; strong **zero-shot** classification, but weak on abstract/fine-grained tasks and sensitive to wording. Variants: AlphaCLIP, MetaCLIP, GLIP. Plus **ImageBind** (binds 6 modalities into one space) and video models (VideoCLIP, VideoMAE).
2. **Text Generation with Multimodal Input** — `{image (or more), text} → text`. **By far the largest category.**
   - **Flamingo** (DeepMind) — interleaved cross-attention over a *frozen* LM; few-shot from interleaved image-text web data.
   - **BLIP / BLIP-2** — Q-Former links a frozen image encoder to a frozen LLM; efficient, strong transfer.
   - **PaLI** (Google) — jointly-scaled, multilingual (100+ languages, 10B image-text pairs); shows **scaling vision *and* language together** matters.
   - **PaLM-E** (Google/TU Berlin) — an **embodied** multimodal model (562B) fusing **continuous sensor inputs**; targets **robotic manipulation planning** → the direct ancestor of [[RT-2]].
   - **LLaVA** — visual instruction tuning; CLIP encoder + LLM via an MLP projection. Also GPT-4V, Qwen-VL, KOSMOS-1/2, InstructBLIP, MiniGPT-4, CogVLM, Fuyu, Ferret, etc.
3. **Multimodal Output with Multimodal Input** — `multimodal → multimodal` (text/image/audio/video out).
   - **CoDi / CoDi-2** (composable diffusion), **Google Gemini** (deep-fusion, RLHF-aligned), **NeXT-GPT**, **VideoPoet**.

## How this connects to VLA / robotics
A **VLA** (vision-language-action) model is category-2 VLM whose output vocabulary is extended to **action tokens** — so it inherits all the VLM's web knowledge. [[RT-2]] is built on PaLI-X and **PaLM-E**, both surveyed here. This is why VLMs are the *root* of the [[Robotics & Embodied AI Overview|robotics cluster]]: every advance in VLMs flows downstream into robot policies.

## Future directions (per the survey)
Open problems the authors flag (source: Exploring the Frontier of Vision-Language Models.pdf): **modularity vs. black-box pretraining**; incorporating **finer modalities** (gaze/gesture); **fine-grained evaluation** of bias/fairness; **causality & counterfactual** reasoning; **continual learning / unlearning**; **training efficiency** (BLIP-2 beats Flamingo-80B with 54× fewer trainable params); **multilingual grounding**; and **domain-specific VLMs** (e.g. Med-Flamingo).

### Safety of VLMs
Today's VLMs are **brittle**: they can be **jailbroken by adversarial images** and redirected by **visual prompt-injection** (a real risk in clinical settings), and they suffer persistent **multimodal hallucination** (source: Exploring the Frontier of Vision-Language Models.pdf). The authors call for layered safeguards, cross-modal red-teaming, and benchmarks that jointly measure safety, faithfulness (anti-hallucination), and task quality. *(Contrast the physical-safety framing on [[Atlas (Boston Dynamics)]] — different domain, same theme: a capable system whose failure modes need explicit guarding.)*

## Related pages
- [[RT-2]] — VLA = a generative VLM fine-tuned to output actions
- [[Robotics & Embodied AI Overview]] — the cluster this page roots
- [[Discriminative vs Generative Methods]] — CLIP-style contrastive vs. generative VLMs
- [[Transfer Learning]] — freezing/co-fine-tuning the LLM and encoders
- [[Neural Network]] · [[Convolutional Neural Network (CNN)]] — the encoders/LLM are these

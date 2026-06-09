**Summary**: RT-2 (Robotics Transformer 2, Google DeepMind 2023) is a **Vision-Language-Action (VLA)** model — a large pretrained vision-language model co-fine-tuned on robot data to output low-level robot actions directly. Its trick: represent actions as **text tokens**, so controlling a robot becomes "just another language task," letting the policy inherit web-scale knowledge and reason about novel objects and commands.

**Sources**: Brohan et al., *RT-2: Vision-Language-Action Models Transfer Web Knowledge to Robotic Control*, arXiv:2307.15818 (Google DeepMind, 2023).

**Last updated**: 2026-05-30

---

RT-2 asks: *can a large pretrained [[Discriminative vs Generative Methods|vision-language model]] be turned directly into a robot controller, so the robot benefits from everything the model learned on the web?* The answer is a **Vision-Language-Action (VLA) model** — and RT-2 is the headline example that coined the term.

## The core idea: actions as text tokens
Prior approaches used vision-language models only for the *high-level* part of robotics (parse a command into sub-tasks), leaving low-level control to separate controllers that gain nothing from web knowledge. RT-2 instead trains the VLM to emit the **low-level action itself**.

The key move: **represent a robot action as a string of text tokens**, identical in form to language tokens. So a training example looks like a VQA pair — *"Q: what action should the robot take to [instruction]? A: 1 128 91 241 5 101 127"* — and the same model handles both ordinary vision-language tasks and robot control. At inference the predicted text is **de-tokenized back into an action** and executed → closed-loop control.

## Action tokenization (the recipe)
- **Action space** (from RT-1): 6-DoF end-effector motion — Δposition (x,y,z) and Δrotation (x,y,z) — plus gripper extension and a discrete **terminate** flag.
- Each continuous dimension is **discretized into 256 bins** → an action = **8 integers**, written as `terminate Δposₓ Δpos_y Δpos_z Δrotₓ Δrot_y Δrot_z gripper`.
- Those integers are mapped onto the VLM's **existing token vocabulary**: PaLI-X already has a token per integer up to 1000; for PaLM-E they **overwrite the 256 least-used tokens** (a form of *symbol tuning*).
- **Output constraint:** when given a robot-action prompt, decoding is restricted to valid action tokens; on normal vision-language prompts the model still uses its full vocabulary.

## Built on pretrained VLMs
RT-2 doesn't introduce a new architecture — it **reuses existing VLMs** (no new action-specific layers), instantiated at billions of parameters:
- **RT-2-PaLI-X** (5B and 55B) — image + text → text.
- **RT-2-PaLM-E** (12B) — the embodied multimodal model.

## Co-fine-tuning (the key training trick)
The crucial recipe detail: **co-fine-tune on robot data *and* the original web data together**, rather than naively fine-tuning on robot data alone. Keeping the web data in the mix stops the model from forgetting its web concepts, yielding far more generalizable policies. (Robot/web ratios are balanced per batch.) This is a [[Transfer Learning|transfer-learning]] move taken to its logical end — the policy weights are *entirely shared* across language and action.

## Real-time inference
A 55B model can't run on a robot's onboard GPU. RT-2 is deployed in a **multi-TPU cloud service** queried over the network: the 55B PaLI-X runs at **1–3 Hz**, the 5B version at **~5 Hz**. (Said to be the largest model ever used for direct closed-loop control, by an order of magnitude.)

## What it can do: generalization + emergent capabilities
- **Generalization.** On *seen* tasks it matches RT-1, but on **unseen objects / backgrounds / environments** it roughly **doubles** RT-1 and MOO and beats weaker baselines ~6×. The advantage comes from transferring semantic/visual concepts from web pretraining.
- **Emergent capabilities** — behaviors *not* present in the robot data, inherited from the web:
  - **Symbol understanding** — "move apple to 3", "push coke can on top of heart".
  - **Reasoning** — "move the apple to the cup of the same color", math ("move X near the sum of two plus one"), multilingual commands.
  - **Human recognition** — "move the coke to the person with glasses".
  - Best RT-2 scores **>3× the next baseline** on these.

## Chain-of-thought reasoning
Augmenting training with an intermediate natural-language **"Plan"** step before the action tokens (e.g. *"Instruction: I'm hungry. Plan: pick energy bar. Action: 1 128 …"*) lets RT-2 do **multi-stage semantic reasoning** — e.g. choose a rock as an improvised hammer, or an energy drink for someone who is tired. This unifies an LLM/VLM planner and a low-level policy in a *single* model.

## Key findings (ablations)
- **Co-fine-tuning > fine-tuning > from-scratch** for generalization (from-scratch is very poor, even at 5B).
- **Bigger model → better generalization.**

## Limitations
- **No new motions.** Web pretraining transfers *semantics*, not new *physical skills* — RT-2's motions stay within the robot-data distribution; it only **recombines** known skills in new ways. (Future: learn skills from human videos.)
- **Compute / latency.** Large VLAs are expensive; real-time, high-frequency control is a bottleneck.
- **Few open VLMs** were available to build VLAs from.

## Why it matters
RT-2 established the **VLA paradigm**: fold robot control into a pretrained vision-language model by tokenizing actions, and robotics rides the wave of every future VLM advance. It's the reference point the later VLA papers ([[OpenVLA]], [[CogACT]], [[OE-VLA]]) build on, react to, or open-source.

## Related pages
- [[Transfer Learning]]
- [[Discriminative vs Generative Methods]]
- [[Neural Network]]
- [[Convolutional Neural Network (CNN)]]
- [[Recognition & Vision Tasks]]

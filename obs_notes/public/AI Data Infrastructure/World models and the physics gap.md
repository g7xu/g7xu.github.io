**Summary**: Video generation's "teleporting cup" failure — a model with no physics engine — is the bridge from generative multimodal to the [[Robotics & Embodied AI Overview]] cluster: world models are the missing "physical understanding" that both realistic video *and* embodied agents need. Also captures the "no ChatGPT moment" (steerability) gap in image generation.

**Sources**: `LanceDB CEO 佘昶：什么是AI Native的数据格式，以及数据对AI有多重要？.md`

**Last updated**: 2026-07-04

---

## Image generation: pretty ≠ steerable

Chang She's read on today's image models: they lack a **"ChatGPT moment."** Text models let you *"指哪打哪"* — steer the conversation precisely, change one part to exactly what you want. Image generation has improved enormously but isn't there: MidJourney output is beautiful, but *"is it going to do what you told it to do?"* is still uncertain. **Beauty and controllability are different properties**, and the missing one — **steerability** — is what blocks the mass use cases (design, marketing) from fully landing.

His guess on the fix: it's largely treated as an **engineering** problem — more/better training data, better data curation, and **post-training / RL** to make specific use cases steerable — rather than a fundamentally new architecture. He's careful not to overclaim on where model architecture goes. (This is the [[AI Data Infrastructure Overview#The thesis: data is becoming the bottleneck]] thesis again: progress routed through data quality and curation.)

## Video: the physics gap

Video is a *different* problem. A generative video model has **no physical understanding of the world, no physics engine**, so frames don't stay consistent — a cup sits here one frame and has flown across the room the next. The failure isn't visual quality; it's the absence of a model of how the world *works*.

That's the conceptual doorway to **world models**: representations that capture physical dynamics well enough to keep generation consistent — and, more importantly, to let an agent *act*. Chang She names 李飞飞 (Fei-Fei Li), 杨乐坤 (Yann LeCun), and NVIDIA as pushing this direction, explicitly *to support robots and anything that must understand the physical world*.

## Where it plugs into the graph

This is the missing link on the "brains" side of [[Robotics & Embodied AI Overview]]. That cluster tracks **VLA policies** — [[Vision-Language Model (VLM)]] → [[RT-2]] → [[OpenVLA]] — that map perception + instructions to actions. A world model is the piece that would give those policies **physical grounding** rather than pattern-matching from web-scale images:

- Video generation and embodied control turn out to want the *same* thing — a learned physics/dynamics model.
- The training data is shared too: video + **simulation data**, which loops back to the data-management problem this whole cluster is about.

Chang She's honest caveat, worth keeping: there is **no consensus even on the definition** of a world model. So it's an **engineering + research** problem — engineering in how you manage/use massive video and simulation data, research in how the architecture and definition eventually converge. Don't treat "world model" as a settled term.

## Related pages

- [[Robotics & Embodied AI Overview]]
- [[Vision-Language Model (VLM)]]
- [[AI Data Infrastructure Overview]]
- [[Multimodal retrieval and the single-vector bottleneck]]

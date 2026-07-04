**Summary**: The self-driving long-tail example turns "vector search" from an abstract database feature into a concrete ML workflow — and the reason video search still doesn't work is the *same* single-vector information-loss problem the [[Dense retrieval]] page already names, now pushed along the time axis.

**Sources**: `LanceDB CEO 佘昶：什么是AI Native的数据格式，以及数据对AI有多重要？.md`

**Last updated**: 2026-07-04

---

## Why retrieval is the real workflow, not a feature

Chang She's canonical example: a rainy day, daytime San Francisco, an intersection; a child in a **green raincoat** that the model classifies as **tree canopy**. The fix is *not* editing one label. The job is **data mining + data creation** — find every similar scene (same weather, city, time, intersection, object, misclassification type) so you can retrain on the long tail.

That's the concrete version of what the [[Retrieval-Augmented Generation (RAG)]] and [[Dense retrieval]] pages describe abstractly. Here the "query" isn't a text string — it's *text + image + video + metadata + embeddings working together*, and the corpus is billions of training rows. Retrieval is the mechanism by which a model's mistakes turn into its next training data. This is the flywheel from [[AI Data Infrastructure Overview#The thesis: data is becoming the bottleneck]].

## The vector-DB-as-a-RAG-step critique

Chang She (and Jason, emphatically) push back on treating a **vector database as merely the retrieval step of RAG**. If your data is text, embedding it into vectors just to map back to text is round-tripping through a lossy representation for no reason — "脱裤子放屁". The deeper point: for a research org, a *separate* vector DB adds complexity (you load embeddings into another system, then stitch results back into your real data and pipeline). Search should live *next to* the data it searches, not in a bolt-on store. This is the practical case against the naive [[Retrieval-Augmented Generation (RAG)]] pipeline when the data is already multimodal and sitting in your lakehouse.

## The single-vector bottleneck, extended to video

This is the tight connection to [[Dense retrieval]]. That page already states the bi-encoder limitation: *"semantic lost when compressing all the token into a single vector."* ColBERT's answer is **multi-vector** (token-level) representation.

Chang She reports the exact same tradeoff in the multimodal setting:

- **Images** — embedding is mature; **multi-vector** image models (the visual analog of ColBERT) make image search more accurate. Same idea as [[Dense retrieval#ColBERT]], different modality.
- **Video** — a video is a **time series**. Two failure modes, both information-loss:
  - *Frame-sampling + image search* loses the temporal signal (what happens *between* frames).
  - *A single video embedding* over a long clip compresses too hard — the long-video version of "everything squeezed into one vector." Short clips can work (e.g. TwelveLabs); long video is still open research.

So the bottleneck for "search inside a video with one sentence" (Jason's wished-for product: find the exact clip in a lecture/film/podcast) is **how to vectorize video without destroying its structure** — the *same* expressiveness-vs-efficiency tension on [[Dense retrieval]]'s spectrum, now with time as the axis that gets crushed. The research mostly didn't exist because no one framed the need until recently.

## Related pages

- [[Dense retrieval]]
- [[Retrieval-Augmented Generation (RAG)]]
- [[AI Data Infrastructure Overview]]
- [[Lance vs Parquet — AI-native storage]]

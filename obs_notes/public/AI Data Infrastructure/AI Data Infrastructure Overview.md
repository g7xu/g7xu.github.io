**Summary**: Sub-index and entry point for the AI Data Infrastructure cluster, drawn from the LanceDB CEO (佘昶 / Chang She) interview. The cluster's spine is one claim — *as models get stronger, the binding constraint moves to data* — and a reusable way of thinking about tooling that ties this domain back to ML, Information Retrieval, Agent Engineering, and Robotics.

**Sources**: `LanceDB CEO 佘昶：什么是AI Native的数据格式，以及数据对AI有多重要？.md` (interview transcript + edited article)

**Last updated**: 2026-07-04

---
## The thesis: data is becoming the bottleneck

Chang She's framing: pretraining gains increasingly come from **data improvement — data quality, data mixtures, curation, retrieval, backfill, re-experimentation** — not just bigger models or new architectures. So the thing that decides how fast a lab moves is the **data flywheel**: how fast you can generate, filter, search, backfill, and re-run experiments on training data.

That reframes "infrastructure" as a *research-velocity* problem, not a storage-cost problem. His TAM argument makes the same point from the money side: a lab spending 1% of a nine-figure training budget to make its **research velocity 2–3×** is an easy trade — because the scarce resource is *time*, not cloud dollars. See [[Research velocity — time is the scarce resource]].

This connects directly to the **frontier** end of [[ML Overview]] (where model improvement now lives) and to the **research-loop** idea in [[Agent Engineering Overview]]: labs increasingly run the flywheel with *research agents* doing a recursive experiment loop — which is where [[Agentic data experimentation]] picks up.

## The reusable idea: derive the tool from the workload, not the paradigm

The most transferable idea in the interview isn't about databases. It's a *thinking pattern*:

> A new format/tool earns its existence when a **new workload** appears that the old paradigm can't be bent to serve — and the right move is to derive the tool's shape from the workload, **not** to port the old paradigm forward.

- **[[Lance vs Parquet — AI-native storage]]**: Parquet is excellent for BI/OLAP (sequential scan). AI needs point queries, mixed small/large columns, and multimodal blobs. Chang She's line — *"if it could do that, it wouldn't be Parquet anymore"* — is the whole idea in one sentence: a widely-adopted standard is hard to change *because* it's a standard, so new workloads sometimes need new substrates.
- **The pandas parallel** (Jason's own synthesis): pandas didn't port SQL into Python; it derived a shape from what data scientists actually needed. Lance does the same to the database playbook. Same person, same instinct, ~15 years apart — it reads as a durable **technical taste**, and it's the lens worth stealing for your own design decisions. 

There's an echo here of the Agent Engineering thesis that the engineer's job is to **design the environment from the task** rather than reuse a generic setup — see [[Agent Engineering Overview]].

## Aside: open-source commercialization is its own game

Not a data idea, but a sharp business frame worth keeping. Chang She (citing Databricks' Ali Ghodsi): *only open source if it's the only way to win.* An OSS company must hit **two consecutive homeruns** requiring completely different muscles — first **adoption**, then **monetization** — so it's superlinear difficulty, not a linear path. His generational model:

- **1.0** — sell support around an open package.
- **2.0** — Elastic/Redis: sell security, compliance, scale-up around the service. Fragile: a big cloud can fork the OSS and host it themselves.
- **3.0** — keep the open layer and the paid layer *separate* (LanceDB open at **storage**; monetize **compute + data management**). The test: *if a hyperscaler took your open part, could they clone your paid service in three months?* If yes, the monetization layer is too thin. A "multimodal lakehouse" isn't three-months-cloneable.


## Related pages

- [[ML Overview]]
- [[Agent Engineering Overview]]
- [[Dense retrieval]]
- [[Robotics & Embodied AI Overview]]

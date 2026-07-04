**Summary**: The "100 spam-score variants → evaluation loop → pick one" example is a [[Generator-Evaluator Loop]] applied to *data features* instead of code — and the infra it demands (table branching, metadata isolation, a platform that hides distributed-execution entropy) is the same "design the environment for the agent" move from [[Agent Engineering Overview]].

**Sources**: `LanceDB CEO 佘昶：什么是AI Native的数据格式，以及数据对AI有多重要？.md`

**Last updated**: 2026-07-04

---

## The pattern: generator–evaluator, at data scale

Chang She's example: you want a `spam_score` (or `perplexity_score`). There are ~100 candidate algorithms, each with parameters to tune. So an agent spins up 100 variants in parallel, runs them, and an **evaluation loop** picks the winner.

Structurally this is the [[Generator-Evaluator Loop]] the Agent Engineering cluster describes for coding agents — a **doer** proposes, a **judge** scores, feedback selects — but the artifact under evaluation is a **data feature / labeling function**, not a code diff or a UI. The same reason the pattern exists there applies here: you don't trust a single pass, so you generate many and let an external evaluator rank them. It's hyperparameter search reframed as a doer/judge loop that agents can drive.

Multiple researchers × multiple ideas × multiple variants means **massively parallel experimentation** — which is exactly the kind of workload [[LangGraph controllability and multi-agent]] (parallelization, map-reduce, sub-graphs) exists to orchestrate on the application side.

## Why this is an infra requirement, not just a prompt

The pattern only works if the **data layer** supports it. Running N parallel experiments against the same table needs:

- **Table branching with metadata isolation.** Chang She's critique of Iceberg: its branch metadata is mixed into the main branch, so parallel branches contend. Without isolation, "spin up 100 experiments" creates lock/contention chaos. (Substrate detail in [[Lance vs Parquet — AI-native storage]].)
- **Incremental backfill (2D data evolution)** so adding/recomputing a feature column doesn't rewrite the whole table for every variant.

So the *agent* pattern (generate-evaluate many variants) has a hard dependency on the *format* supporting cheap branching and column evolution. The abstraction and the substrate are coupled.

## The platform as a harness that removes entropy

The sharpest bridge to Agent Engineering: an agent can write a **perfect Spark job** but doesn't know how to **tune a Spark cluster** (how many nodes, CPU, RAM for *this* data size). That un-tuned gap is where research velocity leaks.

LanceDB's answer — let the agent write a small **Python UDF** and have the platform own the resilient distributed execution — is precisely the [[Agent Legibility]] / [[Agent Harness]] move: **shrink the surface the agent must reason about to the part it's good at, and absorb the rest into the environment.** It's the same principle as [[Enforcing Invariants & Entropy Control]]: keep the agent inside a space where it can't create operational entropy (a mis-sized cluster) that a human then has to clean up. The platform *is* the harness.

## Related pages

- [[Generator-Evaluator Loop]]
- [[Agent Engineering Overview]]
- [[Agent Legibility]]
- [[LangGraph controllability and multi-agent]]
- [[AI Data Infrastructure Overview]]

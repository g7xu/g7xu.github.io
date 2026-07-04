**Summary**: The economic core of the LanceDB argument — for a frontier lab, the scarce resource is *researcher time*, not cloud dollars — and why that reframes infrastructure value away from cost-per-byte toward loop-speed. Ties the [[AI Data Infrastructure Overview]] thesis to the "velocity" logic already running through [[Agent Engineering Overview]].

**Sources**: `LanceDB CEO 佘昶：什么是AI Native的数据格式，以及数据对AI有多重要？.md`

**Last updated**: 2026-07-04

---

## The argument

Chang She's answer to "why wouldn't OpenAI just use the open Lance format and build the platform themselves?": because for research, **time — not monetary cost — is the binding constraint.** Given a 10-billion-row table, do you really want to spend a research team's attention building distributed index creation and high-throughput distributed search, and hire a dedicated database team to stand it up? The value bought isn't a tool; it's *not spending researcher attention on database engineering.*

The TAM version of the same logic: labs' combined annual training budgets run to $100B+. A lab spending **1%** of that to make **research velocity 2–3×** is an easy trade — because you can't value the infra at cloud cost when the thing it saves is the far more expensive resource: research-team time and experiment-cycle latency.

## Why it generalizes

This is the same principle that runs under [[Agent Engineering Overview]], stated in economic terms:

- The [[Generator-Evaluator Loop]] and [[Agent Harness]] earn their cost by shortening the *iteration loop*, not by minimizing compute.
- [[Agent Legibility]] and [[Enforcing Invariants & Entropy Control]] exist to keep humans (and agents) from spending attention on operational entropy — the human-time analog of Chang She's "don't make researchers tune the Spark cluster" (see [[Agentic data experimentation]]).

**The reusable lens:** when you evaluate infra/tooling, price it against the *scarcest* resource in the loop. In frontier research (and increasingly in agent-built software), that's human attention and cycle time — not storage or CPU. A tool that's more expensive per byte but collapses the loop can still be the obvious buy.

## Related pages

- [[AI Data Infrastructure Overview]]
- [[Agent Engineering Overview]]
- [[Agentic data experimentation]]

**Summary**: Informal doc written *before* coding: high-level implementation strategy + key decisions, with emphasis on trade-offs. Job: make sure the right work gets done. (Google/Ubl anatomy + Zhang template.)

**Sources**: references/Technical Communication/Design Docs at Google.md; references/Technical Communication/How to write a good software design doc.md; references/Technical Communication/Companies Using RFCs or Design Docs and Examples of These.md

**Last updated**: 2026-07-06

---

- Our job is solving problems, not producing code — early in a project, prose beats code as the thinking tool
- What it buys: catch issues **while changes are cheap** · org consensus · forced cross-cutting-concern coverage · scales senior engineers' knowledge · org memory · portfolio artifact
- Threshold (Zhang): **≥1 engineer-month → write one**; smaller → mini-doc

## Anatomy (Google skeleton)

Rule #1: whatever form fits the project. Proven skeleton:

- **Context & scope** — the landscape; objective facts only; succinct, not a requirements doc
- **[[Goals and non-goals]]**
- **The actual design** — overview → details; *the place to write down trade-offs*
  - **system-context diagram** — the new thing among systems readers already know
  - **API sketch** — never paste full definitions (verbose, stale fast); only what's relevant to trade-offs
  - **data storage** — same rule
  - **code/pseudo-code** — rarely (novel algorithms only); link prototypes instead — "I tried it and it works" is a top-tier argument
  - **degree of constraint** — greenfield (invent rules to narrow the space) ↔ legacy (enumerate moves, pick least-bad combo)
- **[[Alternatives considered and trade-offs]]** — one of the most important sections
- **Cross-cutting concerns** — security, privacy, observability (Google: dedicated privacy doc + mandatory privacy/security reviews)

## Zhang's operational add-ons

- **Title & people** — authors, reviewers, last-updated
- **Overview ≤3 paragraphs** — any engineer can decide whether to read on
- **Milestones** — calendar dates + `[Update]` subsection when ETAs move
- **Existing solution** — current state as a user story
- **Proposed solution** — big picture → detail deep enough for the *vacation test*
- **Testability, monitoring, alerting** — the skipped section that bites later
- **Cross-team impact** — on-call burden, $ cost, latency, security, support
- **Open questions** — "known unknowns," decisions you want input on
- **Detailed scoping & timeline** — at the end; doubles as task tracker

## Length / when NOT to write

- Sweet spot **10–20 pages** large project; **1–3 page mini-doc** legit for incremental work; bigger → split the problem
- Skip when the solution is unambiguous. Tell: the **implementation manual** — "here's how we'll implement it," zero trade-offs → just write the code
- Agile ≠ excuse: most projects have *actually known problems*; prototyping can be part of doc creation
- Ubl's checklist (write if ≥3 yes): design uncertain? · senior input valuable? · contentious/consensus needed? · team forgets cross-cutting concerns? · org needs legacy-system insight docs?

## Style (Zhang)

- Simple words, short sentences, lists, concrete examples ("User Alice connects her bank account, then…")
- Diagrams everywhere; link the editable original under each screenshot
- **Real numbers** — DB rows, error counts, latency, scaling behavior
- A little humor (Spolsky: be *specific* when it's not called for — "left-handed avocado farmers")
- **Skeptic test** (review it as a hostile reviewer) + **vacation test** (team can implement without you)

## Success metric

- Not "doc looks complete" — **the right ROI of work got done**
- Zhang's example: 5 days doc → review flags X riskiest → build X first → 3 days → X infeasible → kill project. 8 days spent vs months. *Successful* doc

## Company variants (Orosz survey)

- **Uber** services: approvers, abstract, architecture changes, SLAs, dependencies, load/perf testing, multi-DC, security, rollout, metrics, support. Mobile adds UI/UX, analytics, accessibility
- **Sourcegraph**: summary → background → problem → proposal → **definition of success**
- **HashiCorp**: background → proposal → **abandoned ideas**
- **SoundCloud**: header w/ **revisit date** → need → approach → benefits → completion/alternatives
- **RazorPay**: … drawbacks/constraints → alternatives → adoption strategy → "how do we educate people?"
- **Monzo**: **why now** → goals/non-goals → client API per platform → legal & privacy → **risks (must have!)** → observability & graceful degradation → what we still don't know
- **Stedi**: RFC-2119 MUST/SHOULD/MAY language; context → decision → consequences; + lightweight Decision Records (codify made decisions / force alignment on pending ones)
- **Meta = deliberate outlier**: least doc emphasis in Big Tech (long tenure + strong hiring compensate) — Orosz: don't copy, especially remote/async
- Culture quote (Stedi memo): not everyone must write docs — "but if you just want to execute, you'll be executing on someone else's doc"

## Related pages

- [[Design doc review and lifecycle]]
- [[Product Requirements Document (PRD)]] — the "what/why" doc this pairs with
- [[Technical Communication Overview]]

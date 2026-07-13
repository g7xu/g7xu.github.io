**Summary**: Sub-index for the Technical Communication cluster — writing the two core engineering documents: the PRD (what to build and why) and the design doc / RFC (how, and which trade-offs).

**Sources**: references/Technical Communication/ — Cagan's *How To Write a Good PRD* (SVPG, 2005), *Design Docs at Google* (Malte Ubl, 2020), *How to write a good software design doc* (Angela Zhang, 2018), *Companies Using RFCs or Design Docs* (Gergely Orosz, 2022), Squarespace *"Yes, if"* RFC post (Tanya Reilly, 2019 — truncated clip, needs re-download)

**Last updated**: 2026-07-06

---

Writing is a core engineering skill — a doc is the cheapest place to catch design mistakes, the main consensus tool, and how one person's thinking scales across an org.

| | PRD | Design doc / RFC |
|---|---|---|
| Answers | **What** & **why**? | **How**, and which **trade-offs**? |
| Owner | PM (or engineer wearing that hat) | The engineer(s) building it |
| Audience | Product team + sales/marketing/support | Engineers, senior reviewers, security/SRE |

- Run **side by side**: PRD states the problem/requirements → design doc defends the technical solution
- No PM specs = the company probably has no writing culture at all (Orosz)

## Where this fits in the discipline

- Both = **specification documents**; umbrella = engineering communication / "engineering planning" (Orosz) — **not** system design
- System design is the *activity*; the design doc is the *artifact that records it*

```
Software engineering
└── SDLC planning phases
    ├── Requirements  → PRD              (product management's artifact)
    └── Design        → design doc/RFC   (architecture's artifact)
    both = "specs" / engineering communication
```

- Phases themselves: [[Software Development Lifecycle & System Design]]
- ⚠️ Vocabulary: "TDD" usually means *test-driven development* — say "design doc" / "tech spec" / "RFC"

## Shared principles

- **Problem before solution** — state the need, not the recipe ([[Common PRD pitfalls#What versus How]])
- **Explicit [[Goals and non-goals]]** — strongest scope-creep defense
- **Trade-offs are the point** — no [[Alternatives considered and trade-offs]] → the doc didn't need to exist
- **Right-size**: 1–3 pages small work, 10–20 pages max large; split beyond that
- **Living document** — update through implementation; "if it's not in the PRD, put it in the PRD"
- **The review conversation ≥ the document** ([[Design doc review and lifecycle]])

## Pages in this cluster

- [[Product Requirements Document (PRD)]] — purpose, 4 areas, 10 steps, prioritization
- [[Common PRD pitfalls]] — what-vs-how, detail calibration, specials, pay-your-taxes, you-are-not-your-customer
- [[Design Doc (RFC)]] — anatomy, when (not) to write, style, company template variants
- [[Goals and non-goals]]
- [[Alternatives considered and trade-offs]]
- [[Design doc review and lifecycle]] — creation → review → implementation → maintenance

## Related pages

- [[Software Development Lifecycle & System Design]]
- [[Agent Engineering Overview]] — specs/harness design as a parallel "write it down first" discipline

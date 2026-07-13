**Summary**: The PRD articulates a release's purpose, features, functionality, and behavior — complete enough to build and test from. Done well ≠ success guaranteed; done badly ≈ failure guaranteed. (Cagan, SVPG 2005.)

**Sources**: references/Technical Communication/How-To-Write-a-Good-PRD.pdf

**Last updated**: 2026-07-06

---

- Drives the *entire* company effort — product team + sales + marketing + support; "hard to find a higher-leverage piece of work"
- **PRD vs MRD**: MRD = the opportunity/need; PRD = a product addressing it
- **PRD vs strategy/roadmap**: strategy = 2–5 yr vision; roadmap = the steps; PRD = *one release* on that path
- Mantra: sharp thinking = sustainable vision; fuzzy thinking = failed product

## The 4 areas of a PRD

- **Purpose** — the target: problems (not solutions), who it's for, big picture, scenarios. Test: **elevator pitch** to your CEO
- **Features** — needs, not solutions; interaction-design/use-case level; trace each req → objective (cut costs become visible)
- **Release criteria** — real minimum bar for: perf, scalability, reliability, usability, supportability, localizability. Don't hand-wave
- **Schedule** — target *window* + context/motivation, not a random date

## The 10 steps

1. **Homework** — customers, competitors, team capabilities first
2. **Purpose** — one clear value prop; measurable, prioritized objectives
3. **Users** — personas (fictitious but realistic — "Leon the Power Seller"); goals; tasks. Few key profiles only — pleasing everyone pleases no one. Untangle the *problem* from the solutions everyone hands you
4. **Product principles** — shared decision criteria (TiVo: "It's entertainment, stupid", "No modality or deep hierarchy"; eBay: easy/safe/fun)
5. **Prototype & test** the concept — feasibility + usability + concept testing *before* engineering; beta is too late for big changes
6. **Question assumptions** — "don't specify a candle and prevent yourself from getting a light bulb"
7. **Write it down** — format irrelevant; must be accessible + updatable; unwritten brainstorms are lost
8. **Prioritize** — every req is **must-have** (does NOT ship without it — extremely high bar, maps to core value prop) / **high-want** / **nice-to-have**, then **rank-order 1..n within each class**. Otherwise: easy features get built, customer-critical ones hit the chopping block when schedule slips
9. **Test completeness** — can eng build from it? can QA write a test plan from it?
10. **Manage** — answer every question by pointing at the PRD; *if it's not in the PRD, put it in the PRD*; track features through launch

## Requirements vs design

- "Design" = user interaction, not internals
- Cagan (post-eBay): include interaction design **with** requirements; hold implementation until design is done — design always uncovers requirement changes, cheap before engineering starts

## Related pages

- [[Common PRD pitfalls]]
- [[Goals and non-goals]]
- [[Design Doc (RFC)]] — the engineering-side counterpart
- [[Technical Communication Overview]]

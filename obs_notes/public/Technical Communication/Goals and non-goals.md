**Summary**: Short bullets on what the system/product is trying to achieve — and, often more importantly, what it deliberately is NOT. The non-goals half is the strongest scope-creep defense in either genre.

**Sources**: references/Technical Communication/Design Docs at Google.md; references/Technical Communication/How to write a good software design doc.md

**Last updated**: 2026-07-06

---

## Goals (Zhang)

- Describe **user-driven impact** — "user" can be another team or another system
- **Measurable, with metrics** — bonus: link the dashboard that will track them
- PRD parallel: objectives must be measurable *and prioritized* ([[Product Requirements Document (PRD)]])

## Non-goals (Ubl)

- **≠ negated goals** ("system shouldn't crash" ❌)
- **= things that could reasonably be goals, explicitly chosen against**
- Canonical example: **ACID compliance** for a new database — every reader wonders; the doc must say in/out
- Not a prohibition — fine to get one for free, as long as it costs no trade-offs against real goals


## Related pages

- [[Design Doc (RFC)]]
- [[Product Requirements Document (PRD)]]
- [[Alternatives considered and trade-offs]]
- [[Technical Communication Overview]]

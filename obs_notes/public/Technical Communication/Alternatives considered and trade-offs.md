**Summary**: The design doc is *the place to write down the trade-offs you made*; Alternatives Considered proves the chosen design best fits the goals. No trade-offs = implementation manual = the doc shouldn't exist.

**Sources**: references/Technical Communication/Design Docs at Google.md; references/Technical Communication/How to write a good software design doc.md; references/Technical Communication/Companies Using RFCs or Design Docs and Examples of These.md

**Last updated**: 2026-07-06

---

## Trade-offs ARE the document

- Formula (Ubl): context (facts) + [[Goals and non-goals]] (requirements) → propose solutions → **show why this one best satisfies the goals**
- Trade-off focus = what gives the doc long-term value
- Inverse test: "here's how we'll implement it," no alternatives/decisions → write the program instead

## The Alternatives Considered section

- List designs that would have *reasonably achieved similar outcomes*; per alternative: its trade-offs → why they lost
- OK to be succinct on rejected options — but the section explicitly answers the reader's "why didn't you just…?"
- Zhang's forcing questions:
  - pros/cons of each alternative?
  - **buy** (3rd-party) or **open source** instead of build?

## Same section, different names (Orosz survey)

- Google: *Alternatives considered* · HashiCorp: *Abandoned ideas* · RazorPay: *Drawbacks/constraints + Alternatives* · SoundCloud: *Completion or Alternatives*

## Practical notes

- Write alternatives **while designing**, not retroactively — honest only if genuinely explored
- Prototypes count: "I tried it out and it works" is one of the best design arguments
- Degree of constraint shapes it: greenfield → a few chosen rules narrow a huge space; legacy/constrained → enumerate possible moves, pick the least-bad combo (the whole doc becomes one big trade-off discussion)

## Related pages

- [[Design Doc (RFC)]]
- [[Goals and non-goals]]
- [[Design doc review and lifecycle]]
- [[Technical Communication Overview]]

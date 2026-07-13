**Summary**: Creation → review → implementation → maintenance. Review's value = the org's combined experience lands *while changes are cheap*; the process needs named reviewers, sign-off, and time bounds or it stalls.

**Sources**: references/Technical Communication/Design Docs at Google.md; references/Technical Communication/How to write a good software design doc.md; references/Technical Communication/The Power of “Yes, if” Iterating on our RFC Process.md *(truncated clip)*

**Last updated**: 2026-07-06

---

## Lifecycle (Google)

1. **Create + rapid iteration** — draft with co-authors; share with those closest to the problem; their questions drive v1
2. **Review** — wider audience, 1+ rounds (below)
3. **Implement + iterate** — start once further review is unlikely to force major changes; **update the doc until shipped**. Reality: changes land as linked amendment docs — "US constitution with amendments" — at least link them from the original
4. **Maintain + learn** — "Where's the design doc?" = first question on an unfamiliar system. **Re-read your own docs 1–2 yrs later**: right? wrong? decide differently today? ← how design skill compounds

## Running the review

- Spectrum: send-to-team-list + comment threads ↔ formal senior review meeting. Reviews add value but are "a dangerous trap of overhead" — don't block on the big meeting; get crucial feedback directly
- Zhang's process (feedback *before* writing):
  1. Recruit an experienced engineer as **named reviewer** ("bribe with boba")
  2. Whiteboard: **problem first — don't skip** → then implementation; convince them
  3. Draft → same reviewer reads → **signs the doc** (accountability)
  4. **Specialized reviewers** (SRE, security); Quip adds a *different-team* reviewer
  5. Team review **time-boxed ~1 week**; answer every comment ("leaving comments hanging = bad karma")
  6. Thread >5 comments → in-person; contention → a **Discussion** section; author still makes the final call
- Everyone on the project participates in design; hacky prototype code fine — **never merges to master**

## Org-level reliability (Squarespace, "Yes, if")

- Problem the post solves: RFCs not getting *deep* review, from the *right* people, with a clear *done* signal
- Their answer: opinionated template + standing **Architecture Review** board; used for big calls — adopting **Go** as first-class infra language, switching to **gRPC**; old Infrastructure Council → community forum
- ⚠️ Clip truncated (only closing paragraphs saved) — the "Yes, if" philosophy + template details need re-download + verification
- Scale contrast (Google): one central senior-reviewer mailing list worked small (uniform design culture) → infeasible large → per-team recurring review meetings

## Related pages

- [[Design Doc (RFC)]]
- [[Alternatives considered and trade-offs]]
- [[Technical Communication Overview]]

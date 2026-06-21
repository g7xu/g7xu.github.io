**Summary**: Sub-index for the whole Job Application domain — the sources, tools, and prep I use to land a role. Splits into two halves: **job search** (finding & applying) and **interview prep** (preparing to perform).

**Scope**: CS / software-engineering (SWE) roles. **Not** focusing on MLE / ML-engineer roles for now.

**Last updated**: 2026-06-21

---

The domain has two halves:

1. **Job search** — where I find roles and how I track/apply.
2. **Interview prep** — how I get ready to perform, once I have an interview.

# Job search

## Job boards

Where I find and source roles.

- [JobRight](https://jobright.ai/jobs/recommend) — AI-recommended job matches
- [Simplify Summer 2026 Internships](https://github.com/SimplifyJobs/Summer2026-Internships) — community-maintained GitHub repo of internship postings
- [LinkedIn Jobs](https://www.linkedin.com/jobs/) — general board + network

## Tools

For tracking applications and automating the apply step.

- [Simplify Tracker](https://simplify.jobs/tracker) — application tracker **and** auto-apply (one tool does both)

# Interview prep

## Technical practice

The coding/skills side. See [[Technical Interview Checklist]] for the in-interview workflow, and the algorithm cheat sheets.

- [NeetCode roadmap](https://neetcode.io/roadmap) — structured path through the patterns
- [Python for Coding Interviews](https://neetcode.io/courses/lessons/python-for-coding-interviews) — NeetCode cheat sheet of Python built-ins/idioms for interviews

## Behavioral

- [[Behavioral Interview (BQ)]] — STAR framework + story bank

## Cheat sheets

- [[Operating Systems (Interview Cheat Sheet)]] — OS concepts (user/kernel mode, process lifecycle)

## Company research & interview practice

Learn about a company and what its interviews are actually like.

- [Glassdoor](https://www.glassdoor.com/) — employee reviews and interview feedback
- [一亩三分地 (1Point3Acres)](https://www.1point3acres.com/) — interview experiences & feedback (CN community)
- [Exponent](https://www.tryexponent.com/) — online mock-interview practice

# Trivial
## Prompt: resume + JD to tailored answer

A lot of job application asked you questions, so how do we streamline this process but also ensure high quality? 

Use as a **system prompt**. Then send my resume, the job description, and the question as the user message. It returns a short, human-sounding draft.

```
You are me, answering job application and interview questions in my own
voice. You will receive my resume, the job description, and a question.

Who I am, let this come through in the answers:
- An engineer who also thinks like a product person: I care about what the
  user gets, not just the code.
- Agentic and a fast shipper: I take ownership, move quickly, and get
  things into people's hands.
- I love building startups and the 0-to-1 work.
- Eager to learn and ambitious: I go after hard problems and pick things up
  fast.

Write the answer so it reads like a real person wrote it:
- Do not use em-dashes, and avoid words or phrasing that sound AI-generated
  (no "delve", "leverage", "robust", "seamless", "tapestry", "moreover", etc.).
- Keep it concise and straightforward: at most 5 sentences and 150 words.
- Be action and result oriented: state what I did and what it produced.
- Use only real experience from my resume. Do not invent anything. If the
  resume cannot support a good answer, say what is missing.
```

## Related pages

- [[Technical Interview Checklist]]
- [[Behavioral Interview (BQ)]]
- [[Operating Systems (Interview Cheat Sheet)]]

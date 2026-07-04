**Summary**: The substrate under the rest of the cluster — *why* a new file/table format was needed for AI data, told as concrete mechanics (point queries, mixed column sizes, 2D data evolution, table branching) and an honest tradeoff (early Lance was larger, not smaller). The reusable takeaway is the design lens in [[AI Data Infrastructure Overview#The reusable idea: derive the tool from the workload, not the paradigm]].

**Sources**: `LanceDB CEO 佘昶：什么是AI Native的数据格式，以及数据对AI有多重要？.md`

**Last updated**: 2026-07-04

---

## What Parquet is, and what it's for

Parquet (from Cloudera/Twitter, ~10+ years ago) is a **columnar file format** and the industry standard for analytics/BI. Columnar = store values column-by-column, which makes **sequential scans** fast and compresses well. It's genuinely good at OLAP/BI, and Chang She is explicit: *if that's your workload, don't switch.*

## Why it falls short for AI data

Two structural mismatches:

1. **Point queries are slow.** AI curation constantly needs to *pull a handful of long-tail rows out of billions* (e.g. the green-raincoat scenes from [[Multimodal retrieval and the single-vector bottleneck]]). Parquet interleaves data with offsets, so a point lookup must read at least a whole **row group** — effectively a scan to find a few rows.
2. **Small and large columns don't coexist well.** AI tables mix tiny columns (spam/perplexity scores) with huge ones (images, video). Parquet's row groups force all columns into the same grouping: tune the row-group size small (good for scanning small columns) and big blobs blow up memory; tune it large and scans crawl.

## What Lance changes

### 1. Split data from offsets → constant-time random access

An **offset** is a *pointer + length*: where a given row's value starts inside a column's byte run, and how many bytes it is. Reading cell **(row R, column C)** needs both coordinates — the **column** selects which byte stream to open (columnar storage = each column is its own run of bytes), and the **row** is the position *within* that stream that the offset resolves.

The difference is **not** that Parquet lacks pointers — both formats have offset info. It's *where the pointers live*:

- **Parquet** interleaves the offset bookkeeping *with* the data and only resolves it at **row-group granularity**. You can't read "just the pointers" — a point lookup drags in the whole row group (tens of thousands of rows), decodes it, and throws almost all of it away.
- **Lance** pulls the offsets into their **own contiguous block, separate from the data**. A lookup is then two small precise reads: read the offsets alone → get an exact byte range → seek straight to that one value. The cost doesn't grow with table size — **O(1) random access**.

It's the same idea as an index in a book or a pointer array in memory: the novelty isn't the pointer, it's *not interleaving it with the payload*, so a lookup never has to touch the payload it isn't returning.

This offset block earns its keep specifically on **variable-length** columns. For fixed-width types (`int32`, or a fixed-size embedding vector) row R is just `byte R × width` — no stored offsets needed. For variable-length values (strings, and especially image/video blobs where every value is a different size) you *must* have the offset table — which is exactly the multimodal case. And it's what **point queries, training shuffling, and vector search** all rely on, since all three fetch *scattered specific rows* rather than scanning top-to-bottom.

### 2. Drop the row-group limit → mixed column sizes + 2D data evolution

Parquet forces every column in a **row group** onto the same row chunking, so one size has to serve both a tiny `spam_score` and a huge `video` blob — and no single setting is right for both. The v2 (Rust) rewrite **removed row groups entirely**: each column gets its **own** chunk/row layout, reconciled via file metadata + statistics, so small and large columns finally coexist.

> The Rust rewrite and the row-group removal are *independent*. Rust was chosen for safety + dev velocity, not because C++ needs row groups; dropping row groups was a separate v2 design decision.

That per-column layout is what enables **2D data evolution** — growing the table in *both* directions cheaply:
- **Rows (vertical):** append records. Easy everywhere.
- **Columns (horizontal):** add and **backfill** a feature column *incrementally*, leaving existing columns' bytes untouched. In Delta/Iceberg, backfilling values typically **rewrites the table** — absurd when the table is dominated by images/video you aren't even changing.

### 3. File format *and* table format in one → branching with isolation

Two genuinely different jobs, normally two systems:
- **File format** (Parquet, Lance-the-file) — how *one* file encodes columns/bytes on disk (everything in #1 and #2).
- **Table format** (Delta, Iceberg) — a **metadata layer** over *many* Parquet files that makes them look like one logical table (which files belong, schema history, snapshots). It stores pointers-and-metadata *about* Parquet files, not the data.

Lance designs **both layers together** — a unified **lakehouse format**. Because it owns the metadata layer as a first-class part of the format, it can give each **branch** (a git-like copy-on-write fork of a table) **isolated metadata**. Iceberg has branching, but its branch metadata is mixed into the main branch, so parallel branches **contend**. Isolated branching is the storage capability that makes "spin up 100 parallel experiments" runnable without a lock-storm — the substrate for [[Agentic data experimentation]].

Chang She's one-liner on whether Parquet could just adopt these: *"if it could do that, it wouldn't be Parquet anymore"* — a mature standard is hard to change precisely *because* it's widely implemented and fragmented across languages. That's the [[AI Data Infrastructure Overview#The reusable idea: derive the tool from the workload, not the paradigm]] lens in one sentence.

## What "multimodal data" actually is: blob vs. vector

A common conflation worth killing: an image is **not** stored as "a large vector." Two different columns coexist in a multimodal table, and they behave differently on disk:

| | What it is | Size shape | Needs offsets? |
|---|---|---|---|
| **Image/video blob** | the actual media bytes (a compressed JPEG / video file) | large, **variable-length** | yes |
| **Embedding / vector** | a fixed array of floats (e.g. 768 numbers) computed *from* the blob, used for search | small, **fixed-length** | no (`byte R × width`) |

The **vector** is the searchable representation from [[Multimodal retrieval and the single-vector bottleneck]]; the **blob** is the raw asset. A table usually stores both, plus small scalar metadata — which is precisely the *mixed small/large column* problem #2 solves.

## The real distinction: workload, not data type

Parquet can physically *store* an image column. What it loses on is the **access pattern** AI needs, not the data type per se:

> **Parquet is optimized for *sequentially scanning tabular data* (BI/analytics). Lance is optimized for *randomly accessing, searching, and evolving mixed-size multimodal data* (blobs + embeddings + metadata together).**

So it's less "small data vs. images" and more **"scan a column top-to-bottom" vs. "jump to scattered cells and keep adding columns."** The big variable-length blobs are *why* the access pattern is hard; but it's the access pattern — point queries, search, shuffling, incremental backfill, branching — that Parquet actually loses on.

## The honest tradeoff

New tech is not "better at everything," and this is the part worth modeling. Early Lance had **no compression**, so pure tabular data could be **2–3× larger** than Parquet. The deliberate choice: prioritize **multimodal + random access** first. For a table dominated by images/video, total size is dominated by media that's *already* compressed (JPEG, video codecs), so an outer compression layer adds little — and file-level compression would have killed random access.

Later, as customers brought **LLM text training data**, they added **block-level encoding/compression** that shrinks text *without* sacrificing point-query speed — and in some text cases Lance is now *smaller* than Parquet. The lesson isn't the tech; it's the judgment: **serve the most painful workload each phase, and be explicit about what you're trading away.**

## Related pages

- [[AI Data Infrastructure Overview]]
- [[Multimodal retrieval and the single-vector bottleneck]]
- [[Agentic data experimentation]]

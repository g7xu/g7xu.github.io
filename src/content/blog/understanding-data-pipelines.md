---
title: 'Understanding Data Pipelines: A Visual Guide'
excerpt: 'Data pipelines are everywhere but rarely explained clearly. This post breaks down the core concepts — ingestion, transformation, and serving — with examples from real projects.'
date: '2026-02-10'
category: 'Data'
author:
  name: 'Jason Xu'
  avatar: '/images/bio-photo.png'
draft: false
---

## What Is a Data Pipeline?

A pipeline is a series of steps that move data from where it lives to where it's needed, usually transforming it along the way. The classic stages are:

1. **Ingest** — pull raw data from a source (API, database, file system)
2. **Transform** — clean, enrich, aggregate
3. **Serve** — deliver to a consumer (dashboard, model, downstream system)

## The Patent Pipeline I Built at Tong Consulting

During my internship, I designed an 8-table database and automated weekly ingestion of millions of patent and trademark records.

### Key Decisions

- **Incremental loads over full refreshes** — Processing only new records reduced runtime from hours to minutes.
- **Schema versioning** — Tables had a `schema_version` column so the pipeline could handle format changes in upstream data without breaking downstream queries.
- **Idempotency** — Re-running the pipeline for the same week produced the same result. This made failure recovery trivial: just re-run.

## Three Pipeline Anti-Patterns

1. **Mutable intermediate state** — Never overwrite a source file. Write to a new, timestamped output.
2. **Tight coupling to a single source format** — Sources change. Put a parsing layer between the raw data and your transform logic.
3. **No observability** — If you can't tell when a pipeline failed or how much data it processed, you will debug production at 2am.

## Tools Worth Knowing

| Use case       | Tool                             |
| -------------- | -------------------------------- |
| Orchestration  | Airflow, Prefect, GitHub Actions |
| Transformation | dbt, pandas, PySpark             |
| Storage        | PostgreSQL, BigQuery, Parquet    |
| Monitoring     | Great Expectations, dbt tests    |

More on each of these in future posts.

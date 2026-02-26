---
title: "From Jupyter Notebook to Production: What Nobody Tells You"
excerpt: "The journey from a working notebook to a deployed data product involves more than wrapping code in a function. Here's what I learned the hard way."
date: "2026-01-28"
category: "Engineering"
author:
  name: "Jason Xu"
  avatar: "/images/bio-photo.png"
draft: false
---

## The Notebook Trap

A Jupyter notebook is optimized for exploration — cell-by-cell execution, inline plots, mutable state. A production system is optimized for reliability — reproducibility, error handling, observability. These goals conflict.

### Step 1: Untangle State

Notebooks encourage running cells out of order. Production code cannot. The first task is always: *restart kernel, run all cells, verify it still works*.

### Step 2: Extract Business Logic

Move transformations into pure functions that take inputs and return outputs. No `global df`. No modifying a variable declared three cells earlier.

```python
# Before
df['revenue'] = df['price'] * df['quantity']
df = df[df['revenue'] > 0]

# After
def calculate_revenue(df):
    df = df.copy()
    df['revenue'] = df['price'] * df['quantity']
    return df[df['revenue'] > 0]
```

### Step 3: Parameterize Inputs

Hard-coded file paths and dates are the #1 cause of "works on my machine" failures. Use environment variables or a config file.

### Step 4: Add Logging

`print()` is not logging. Use Python's `logging` module so you get timestamps, severity levels, and the ability to redirect output.

## What This Looks Like End-to-End

1. `src/data_loader.py` — reads raw data
2. `src/transform.py` — business logic functions
3. `src/pipeline.py` — orchestrates the above
4. `tests/test_transform.py` — unit tests
5. `.github/workflows/run_pipeline.yml` — scheduled execution

The notebook becomes a development artifact, not the product.

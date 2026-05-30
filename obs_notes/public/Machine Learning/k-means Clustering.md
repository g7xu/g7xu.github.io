**Summary**: k-means is an unsupervised algorithm that groups data points into *k* clusters by minimizing the within-cluster squared distance. In the bag-of-words pipeline it builds the **visual vocabulary** — the cluster centers become the "visual words."

**Last updated**: 2026-05-29

---

## Why cluster?
After [[Image Retrieval (Bag of Words)|extracting features]], a large dataset gives a *huge* cloud of points in a high-dimensional space (e.g. 1M images × 1k patches ≈ 1 billion points). Most of that is redundant — many patches look alike. **Clustering** replaces each dense neighborhood of points with a single **prototype** (the cluster center), cutting memory and compute while keeping most of the expressive power. Points in one cluster are assumed to share similar properties.

Clustering is **unsupervised learning**: we're given unlabeled points and must discover structure. Simple axis-aligned rules don't recover semantically meaningful groups, so we pose it as a learning problem — most commonly **k-means**.

## The goal (objective)
Find the cluster centers that **minimize the sum of squared Euclidean distances** between points $x_i$ and their nearest cluster center $\bar c_k$:

$$D(X, C) = \sum_{\text{cluster } C_k} \; \sum_{\text{point } i \in C_k} (x_i - \bar c_k)^2$$

## The algorithm
*k* (the number of clusters) is given by the user. Then:

1. **Randomly initialize** *k* cluster centers ("means")
2. **Iterate until convergence:**
   - **Assign** each data point to the **nearest** cluster center (this partitions the space — each center "owns" a set of points)
   - **Recompute** each center as the **mean (centroid)** of the points assigned to it (the center "jumps" to the new location)
3. **Convergence** = the centers stop moving much between iterations.

Algorithmically trivial: alternate *assign* ↔ *recenter* until things settle.

## Choosing k
*k* is an **empirical hyperparameter** — you generally don't know the right value in advance. In practice, try a few values and keep the one that gives good **downstream** results (retrieval/classification quality).

## Caveats
- **No guarantee** of convergence to the optimum — a bad random initialization (or awkward data) can give poor clusters. Still, k-means **works very well in practice**.
- It's the **first tool to reach for** with unlabeled, high-dimensional data: cluster, then check that points in a cluster really do look alike (well-behaved data) vs. mixed (poorly separated data).

## Role in bag of words
The cluster centers are the **visual words** (a.k.a. **codewords**) — the vocabulary. Choosing *k* = 1000 gives a 1000-word vocabulary that can approximately represent any patch, collapsing a billion patches down to 1000 prototypes. This is step 2 of the [[Image Retrieval (Bag of Words)#The four-step pipeline (bag of features)|bag-of-features pipeline]].

## Related pages
- [[Image Retrieval (Bag of Words)]]
- [[Nearest-Neighbor Classification]]
- [[ML Overview]]

**Summary**: Classify a new point by the label(s) of its closest training point(s). Nearest-neighbor (NN) uses the single closest; **k-nearest-neighbors (kNN)** takes a majority vote among the *k* closest. Simple and flexible, but expensive in time and memory.

**Last updated**: 2026-05-29

---

Once every image (or patch) is a **vector** — e.g. a [[Image Retrieval (Bag of Words)|bag-of-words histogram]] — classification is just retrieval with labels attached.

## Nearest neighbor (NN)
Map a labeled training set into the feature space. For a **novel test point**, find the **closest** training point and assign **its label**. The implicit decision boundary is the Voronoi diagram of the training points.

*Problem:* a test point near a class boundary can be decided by a single, possibly noisy, neighbor.

## k-nearest neighbors (kNN)
Generalize: find the **k closest** training points and let their labels **vote**; assign the **majority** label. Larger *k* is more robust (the "ask many people, not one" principle) and dampens the effect of outliers.

- Typical *k* for kNN classification is **small** (5, 7, 11).
- **Caveat:** this *k* is unrelated to the *k* in [[k-means Clustering|k-means]] (which is often in the thousands). The field just reuses the letter.

## Advantages
- **Simple** to implement
- **Flexible** — works with any feature representation and any distance/similarity measure
- **Strong baseline** — does well in practice with enough representative data
- **Great sanity check:** to test whether a learned feature space is meaningful, run kNN and inspect the neighbors — if they look similar to the query, the features captured something real. Often the *first line of attack* on an unknown learning problem.

## Limitations
- **Compute:** every query must compute distances to *all* training points and sort them — cost grows with training-set size.
- **Memory:** you must keep the entire training set around, since you don't know in advance which point is closest.
- In practice no one runs exact kNN at scale; **approximate nearest-neighbor** methods cut the time and storage cost dramatically.

## Related pages
- [[Image Retrieval (Bag of Words)]]
- [[k-means Clustering]]
- [[Bayesian Classification (MAP & ML)]]
- [[Discriminative vs Generative Methods]]

**Summary**: Image retrieval (instance recognition) finds the same specific instance or place in a large image database. The classic approach is **bag of words** (bag of features): extract features, learn a visual vocabulary by clustering, represent each image as a histogram of visual-word frequencies, then compare images by the distance between those histograms.

**Last updated**: 2026-05-29

---

Image retrieval — also called **instance recognition** — is the first kind of recognition we study. Unlike *category* recognition, we want the *same specific instance*, so [[Recognition & Vision Tasks|intra-class variation]] doesn't apply here.

## Applications
- **Place recognition** for self-driving / robots: pre-capture a database of images across a city or building; later take one image and find the closest match to localize ("which block / room am I in?").
- **Photo search on your phone** — instantly retrieve among tens of thousands of images.
- **Google image search** — upload an image, find it (and near-duplicates) among a billion.

## Why is it hard?
Two guiding principles shape every retrieval method:

1. **Robustness to imaging variations** — find the same instance despite changes in scale, viewpoint, lighting, occlusion, clutter, blur, and noise.
2. **Efficiency** — the database is huge and results must be near-instant.

## Baseline: just match local features
Retrieval is fundamentally the [[Feature Matching|feature matching]] we already know, scaled up:

- For every training image, run [[Feature Detection|feature detection]], extract a patch around each feature, and push all patches into one big list (an index).
- For a query image, extract its patches the same way; for each, find the closest match in the index (e.g. lowest SSD / smallest vector distance).
- The training image with the **most matched patches** is the closest instance.

This works, but doesn't scale ([[#Why a visual vocabulary? (why step 2 exists)|see why]]) and does not generalized — which is what motivates the bag-of-words representation.

## Bag of words: the idea
Borrowed from text search (Salton & McGill, 1983 — the representation under classic Google document search). A **bag of words** is an *orderless* representation: throw away all structure and keep only **which words appear and how often**.

- **Text example:** the State-of-the-Union addresses of 2002 vs. 2011. With no other context, word frequencies alone reveal the moment — 2002 emphasizes *security, freedom, terror*; 2011 emphasizes *jobs, business, economy*.
- **For images:** destroy an image's structure and treat it as a **bag of patches**. Even unordered, the patches (a bit of face, some vegetation, some building) let you infer the image contained a person, a building, flowers — enough to classify.

## The four-step pipeline (bag of features)
1. **Extract features.** From every training image, extract patches — either on a **regular grid** (e.g. subdivide into 20×20 patches) or around interest points (corner detectors, SIFT). Each patch becomes a **descriptor**: a vector representing it (simplest: stack the patch's intensities — a 10×10 patch → a 100-D vector), mapping image locations into a high-dimensional feature space.
2. **Learn a "visual vocabulary."** Cluster all the feature vectors; each **cluster center is a "visual word."** A patch is then described by *which cluster it belongs to*, not its raw pixels or vector representation. (A "circle-ish" cluster might come from a car wheel or a round window — we only care that something looked like that.)
3. **Represent images by frequencies of "visual words."** Like word frequencies in the speeches, each image becomes a **histogram** over the vocabulary: how many of its patches fall into each cluster. This gives every image a fixed-length vector.
4. **Use distances between representations for classification.** Compare two images by the distance between their histograms; classify with **nearest neighbors**.

## Why a visual vocabulary? (why step 2 exists)
Naive patch-to-patch matching is **intractable** at scale: 1M images × 1k features ≈ 1 **billion** patches; a query of 1k patches × 1B ≈ **1 trillion** comparisons. And you don't need exact matches — only closeness. Clustering the feature space collapses a billion patches into a small vocabulary, so you compare **global** bag-of-words histograms instead of individual patches — far more efficient.

(High-dimensional feature spaces help here: even a 100-D space with 256 intensity levels per dimension holds $256^{100}$ distinguishable points — plenty to represent diverse features. The clusters in that space *are* the visual words.)

## The tools
Each pipeline step rests on a standard tool:

- **Build the vocabulary → [[k-means Clustering]].** Cluster all feature vectors; the cluster centers are the visual words.
- **Represent an image → a histogram.** Match each patch to its nearest visual word and count: bin $i$ = number of patches closest to codeword $i$. The result is a fixed-length vector (one entry per word). A histogram is just a **vector representation of a distribution**.
- **Compare images → histogram distance.** With a vocabulary of $V$ words, compare query $q$ and database image $d_j$ by **cosine similarity** (the normalized dot product):
$$\text{sim}(d_j, q) = \frac{\langle d_j, q\rangle}{\lVert d_j\rVert\,\lVert q\rVert} = \frac{\sum_{i=1}^{V} d_j(i)\,q(i)}{\sqrt{\sum_i d_j(i)^2}\,\sqrt{\sum_i q(i)^2}}$$
  Cosine measures **similarity** (maximize it — identical vectors → 1); the **Euclidean distance** $\lVert d-q\rVert$ measures **dissimilarity** (minimize it — identical vectors → 0).
- **Classify on top → [[Nearest-Neighbor Classification]].** Retrieval *is* nearest-neighbor: return the database image with the highest similarity; for labeled classification, take the majority label among the *k* nearest (kNN).

Everything above — features → clustering → histograms → distances — exists to give each image an **efficient yet expressive vector**. (A raw 1000×1000 image is a trivial 1M-D pixel vector: expensive *and* meaningless. The histogram compresses it into a few semantically meaningful dimensions.)

## Evaluating retrieval: precision, recall, average precision
Treat retrieval as returning matches one-by-one from best to worst. At each step:

- **precision** = relevant returned / total returned
- **recall** = relevant returned / total relevant in the database

Plotting precision vs. recall over the ranked list gives a **PR curve**. A perfect retriever (all relevant items first) traces a flat line at precision = 1 → area = 1. Summarizing the curve by one number gives the **Average Precision (AP)** = area under the PR curve (also called area-under-the-curve elsewhere).

Caveat: two methods can have the **same AP** but very different PR curves, so AP alone isn't enough to deploy — you also pick an operating point (some apps favor recall, e.g. don't miss pedestrians; others favor precision).

(This pipeline and the [[Bayesian Classification (MAP & ML)|Bayesian skin classifier]] are the basis for Homework 3.)

## Related pages
- [[k-means Clustering]]
- [[Nearest-Neighbor Classification]]
- [[Bayesian Classification (MAP & ML)]]
- [[Feature Detection]]
- [[Feature Matching]]
- [[Recognition & Vision Tasks]]
- [[Discriminative vs Generative Methods]]
- [[Dense retrieval]]

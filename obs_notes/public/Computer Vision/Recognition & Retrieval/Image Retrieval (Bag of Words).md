**Summary**: Image retrieval (instance recognition) finds the same specific instance or place in a large image database. The classic approach is **bag of words** (bag of features): extract features, learn a visual vocabulary by clustering, represent each image as a histogram of visual-word frequencies, then compare images by the distance between those histograms.

**Last updated**: 2026-06-09

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

This works, but doesn't scale ([[#The four-step pipeline (bag of features)|see why]]) and does not generalize — which is what motivates the bag-of-words representation.

## Bag of words: the idea
Borrowed from text search (Salton & McGill, 1983 — the representation under classic Google document search). A **bag of words** is an *orderless* representation: throw away all structure and keep only **which words appear and how often**.

- **Text example:** the State-of-the-Union addresses of 2002 vs. 2011. With no other context, word frequencies alone reveal the moment — 2002 emphasizes *security, freedom, terror*; 2011 emphasizes *jobs, business, economy*.
- **For images:** destroy an image's structure and treat it as a **bag of patches**. Even unordered, the patches (a bit of face, some vegetation, some building) let you infer the image contained a person, a building, flowers — enough to classify.

## The four-step pipeline (bag of features)

### Walkthrough: follow one image through
Tiny numbers, one 100×100-pixel training image:

1. **Image → a pile of points.** Cut the image into 100 patches of 10×10. Flatten each patch's intensities into a list of 100 numbers — that list is the patch's **descriptor**, one point in a 100-D feature space. The image is now **100 loose, independent points**. Not combined, not stacked — its spatial structure is thrown away on purpose (that's the "bag").
2. **Build the dictionary — the only step that uses *other* images.** You can't do this from one image. Pool the points from **all** training images (1,000 images × 100 patches = 100,000 points in one shared space) and cluster them **once, offline** into, say, **50 groups**. Each cluster center is a **visual word** — "circle-ish blob," "vertical edge," "grass texture." (A circle-ish word might come from a car wheel *or* a round window; we only care that something looked like that.)
3. **Back to the single image: count.** For each of its 100 points, ask *which of the 50 words is it closest to?* — the patch is now described by a **word ID**, not its 100 numbers. Tally the answers: word #1 appeared 7 times, word #2 twice, … That tally — a **histogram of 50 counts** — is the image's feature representation. Every image becomes a list of exactly 50 numbers, no matter its size or patch count.
4. **Use it.** Two images are similar if their histograms are close; retrieval returns the database image with the nearest histogram, and classification takes the majority label among the *k* nearest.

One-line version: **patch → 100 numbers → "which word is it?" → image = how many times each word appeared.**

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

## Making it fast at scale
Comparing a query against every database image (and matching every patch against a flat vocabulary) doesn't scale to web-sized databases. See [[Scaling Image Retrieval]] for the standard speed-ups: the **inverted file index** (query by word instead of scanning every image), **TF-IDF** weighting, and the **vocabulary tree** (O(log N) word lookup) — including a full end-to-end worked example.

## Related pages
- [[k-means Clustering]]
- [[Nearest-Neighbor Classification]]
- [[Bayesian Classification (MAP & ML)]]
- [[Scaling Image Retrieval]]
- [[Feature Detection]]
- [[Feature Matching]]
- [[Recognition & Vision Tasks]]
- [[Discriminative vs Generative Methods]]
- [[Dense retrieval]]

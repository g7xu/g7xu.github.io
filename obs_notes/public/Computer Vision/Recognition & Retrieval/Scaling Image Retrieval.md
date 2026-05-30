**Summary**: Three techniques that make [[Image Retrieval (Bag of Words)|bag-of-words image retrieval]] fast at scale: the **inverted file index** (query by word instead of scanning every image), **TF-IDF** weighting (treat discriminative words as more important), and the **vocabulary tree** (search codewords in O(log N) instead of O(N)).

**Last updated**: 2026-05-29

---

Basic [[Image Retrieval (Bag of Words)|bag-of-words retrieval]] compares a query against every database image — too slow for a web-scale database. These three ideas (the machinery behind early Google-style search) make it practical.
## Inverted file index
Finding a word by scanning a whole book line-by-line is wasteful; instead you use the **index** at the back, which maps each important word → the pages it appears on. Do the same for images:

- Instead of storing *image → list of words*, store **word → list of images** the word appears in.
- **Query:** extract the visual words in the query image, look each up in the index, gather the database images that share those words, and compare word counts to rank matches.

This avoids a linear scan over a huge image set — you jump straight to the images that share a word, and can layer hashing on top.
## TF-IDF weighting
So far all visual words are treated as equally important. But when comparing documents, common words (*the*, *and*) shouldn't count as much as distinctive ones. **TF-IDF** assigns each word a weight:

$$t_i = \underbrace{\frac{n_{id}}{n_d}}_{\text{term frequency}} \cdot \underbrace{\log\frac{N}{n_i}}_{\text{inverse doc. frequency}}$$

- **Term frequency** $\frac{n_{id}}{n_d}$ — occurrences of word $i$ in document $d$, over the total words in $d$. A word that appears a lot **in this document** is important to it.
- **Inverse document frequency** $\log\frac{N}{n_i}$ — $N$ = total documents, $n_i$ = documents containing word $i$. **Downweights words common across the whole database** (they don't distinguish documents). Words in nearly every document → IDF ≈ 0.

Example: in a database of Harry Potter books *and* pottery books, "Harry" is discriminative (appears a lot in one book, rare across the database) while "Potter" appears everywhere → "Harry" gets the higher weight. The same weighting applies to visual words. (TF-IDF was a key enabler of early Google search.)
## Vocabulary tree
Even with an index, you must match each query feature to the right visual word — and there may be millions of codewords. Stored as a flat **array**, that lookup is **O(N)**. Stored as a **tree**, it's **O(log N)**.

- **Build:** apply clustering **hierarchically** — cluster the codewords into (say) 3 groups, sub-cluster each into 3, and so on, forming a tree (hierarchical k-means). Each codeword becomes a **leaf**; an image's features map to paths through the tree.
- **Query:** descend the tree instead of scanning a flat vocabulary — O(log N) per lookup.

For databases with millions of codewords, O(log N) vs. O(N) is a large saving. (Nistér & Stewenius, *Scalable Recognition with a Vocabulary Tree*.)

### Why not a plain hash table?
Tempting (O(1) lookup), but a hash set does **exact-match** lookup, and this is a **nearest-neighbor** problem. A query descriptor is a continuous vector that will essentially never equal a codeword exactly, and hashing scatters nearby vectors into different buckets — so the right bucket comes up empty. The tree instead **routes by proximity** (descend toward the nearest center at each level), solving nearest-neighbor deterministically in O(log N). Hashing *can* be used, but only the **locality-sensitive** kind (LSH), where nearby vectors collide on purpose — that's the probabilistic alternative to the deterministic tree.

## Worked example: one query, end to end
The visual words **are the [[k-means Clustering|k-means]] cluster centers** — "cluster center = visual word = codeword = dictionary entry" are all the same thing. The whole method hangs on that. Here's a tiny end-to-end run (2-D descriptors so the arithmetic is visible; real ones are ~128-D).

### The dictionary: 4 visual words
k-means on all training patches (with k = 4) produced 4 cluster centers — these *are* the words:

| word | vector (cluster center) | roughly |
|---|---|---|
| W1 | (1,1) | sky |
| W2 | (9,2) | building corner |
| W3 | (5,9) | leaves |
| W4 | (8,5) | window |

So **k (in k-means) = the vocabulary size**. Here 4; in practice thousands–millions.

### Offline: build the database (once)
Three database images, each already turned into a **bag of words** (count of patches per word):

| Image | W1 | W2 | W3 | W4 |
|---|---|---|---|---|
| Image 1 (building) | 1 | 3 | 0 | 2 |
| Image 2 (building) | 0 | 2 | 0 | 1 |
| Image 3 (forest) | 2 | 0 | 4 | 0 |

Then the **inverted index** — for each word, which images contain it:

```
W1 → {Image1, Image3}
W2 → {Image1, Image2}
W3 → {Image3}
W4 → {Image1, Image2}
```

### Online: a query image arrives
**1. Patches → vectors.** Detect 3 patches with descriptors: a = (8,3), b = (8.5,4.5), c = (9,2).

**2. Each vector → its 1 nearest word (the vocabulary-tree job).** For patch a = (8,3), squared distances to the 4 centers:

| to W1 (1,1) | to W2 (9,2) | to W3 (5,9) | to W4 (8,5) |
|---|---|---|---|
| 49+4 = 53 | 1+1 = **2** ✓ | 9+36 = 45 | 0+4 = 4 |

→ patch a is **W2**. Likewise b → **W4** (distance 0.5) and c → **W2** (sits exactly on it). Each patch gets **exactly one** word — the tree just makes finding that one nearest center fast when there are millions.

**3. Count the words → bag-of-words histogram.** *(This is the step that trips people up — it's just a tally.)* The three patches produced the list **{W2, W4, W2}**. Tally per dictionary word:

| word | which patches | count |
|---|---|---|
| W1 | — | 0 |
| W2 | a, c | 2 |
| W3 | — | 0 |
| W4 | b | 1 |

→ query histogram = **[0, 2, 0, 1]** (4 slots because the dictionary has 4 words).

**4. Words → candidate images (the inverted-index job).** The query contains W2 and W4. Look them up:
- W2 → {Image1, Image2}
- W4 → {Image1, Image2}

Candidates = **{Image1, Image2}**. **Image3 never appears** — it shares no words, so we never even score it. The index is a **filter** ("which images are worth looking at?"), not a ranking.

**5. Score the candidates → rank → return.** Cosine similarity between the query histogram and each candidate:
- query [0,2,0,1] vs Image1 [1,3,0,2] ≈ **0.96**
- query [0,2,0,1] vs Image2 [0,2,0,1] = **1.0** ← identical counts → best match

→ **Return Image 2.** Ranking and any "top-k results" cutoff happen *here*, in scoring — not in the index.

### Two roles, don't merge them
- **Vocabulary tree** = *vector → 1 word* ("what word is this patch?")
- **Inverted index** = *words → candidate images* ("which images use these words?", a filter)
- **Scoring** = rank the candidates → return the top match(es)

### Three different "k"s (a common mix-up)

| "k" | meaning | where |
|---|---|---|
| k in **k-means** | number of clusters = **vocabulary size** | building the words |
| k in **kNN** | number of neighbors that vote | [[Nearest-Neighbor Classification\|classification]] (a different method) |
| "top-k results" | how many images to return | the final ranking step |

## Related pages
- [[Image Retrieval (Bag of Words)]]
- [[k-means Clustering]]
- [[Feature Matching]]
- [[Dense retrieval]]

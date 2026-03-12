There are multiple ways to design and implement dense retrieval. You can use different ways to compare embedding, different embedding strategies, and so on. Making the choice based on the priorities are most critical here.
![[expressiveness_efficiency_spectrum.svg|697]]
# Encoder Overview
**Bi-encoder**: handle query and document separately
**Cross-encoder**: embed query and doc together
**ColBERT**: token-level comparison
# Bi-encoder
**Fast** retrieval, **Scales** to millions of documents, works well with **contrastive learning**
## Design
- encode query x and document d independently
- map each to a single-vector representation in $\mathbb{R}^k$ 
- compute their similarity and get the result 
## Training
Contrastive loss over
- One positive passage
- Hard negatives (BM25 top - k: query with the same keywords)
- in-batch negative (training multiple query at the same time, so positive document for one query can be negative for others)
- **only aiming on getting the right relative rankings**

Training goal: maximize $\mathcal{L}$ 
$$\mathcal{L} = -\log \frac{\exp(\textbf{sim}(q, d^+))}{\exp(\textbf{sim}(q, d^+)) + \sum_{j=1}^{n} \exp(\textbf{sim}(q, d_j^-))}$$

$\exp(\textbf{sim}(q, d^+))$: the similarity score of positive label 
- **Maximize Agreement**: increase this so that query is close together with the embedding space of the positive example

$\sum_{j=1}^{n} \exp(\textbf{sim}(q, d_j^-))$: the similarity score of negative label
- **Minimize Agreement**: decrease this so query is away from the embedding space of negative examples
## Search Scale
Modern approach using Approximate Nearest Neighbor (ANN) search. For example,  the FAISS (Facebook AI Similarity Search) with vector indexing. **Fast retrieval with small accuracy loss**
## Limitation 
- No query-document interaction during encoding
- semantic lost when compressing all the token into a single vector
# Cross-Encoder
expressive encoder that can understand the semantic relationships between query tokens
## Design
- encode query x and document d together
- getting a single score
## Training
same as [[#Training]] process in Bi-encoder with a different scoring function. that is $s(q, d) = f([q; d])$ 
## Limitation
- computationally expensive
# ColBERT
Trying to take the advantage of both [[#Bi-encoder]] and [[#Cross-Encoder]] to keep both pre-computation and allow fine-grained interactions
## Design
- getting per word token for both query x and document d
- for each query-document pair, find the maximum similarity between each query token and all document tokens, then sum those maximums to get the final relevance score
- scoring function $$\text{score}(q, d) = \sum_{i \in q} \max_{j \in d} \langle q_i, d_j \rangle$$
## Training
same as [[#Training]] process in Bi-encoder with a different scoring function which is MaxSim. 

Two approaches on ranking documents
- Two-Stage Retrieval Pipeline
	- getting top-K documents using a fast model and re-rank with ColBERT
	- save computational cost
- Direct token-level retrieval
	- for each query word token find n nearest token
	- finding the documents with highest frequency of appearing across all the query word token

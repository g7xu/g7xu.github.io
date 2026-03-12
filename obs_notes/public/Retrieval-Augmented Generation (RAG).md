technique that lets language model ground its answers in external knowledge rather than replying on internal knowledge

RAG's automated context selection mechanism making it a automatic prompt engineering
![[rag_pipeline.svg|631]]

mathematically
$$p(y \mid x) = \sum_{d} p(y \mid x, d) \, p(d \mid x)$$
to maximize $p(y \mid x)$, getting most relevant document $d$ and get the most relevant text for that document as well.
# Scoring Document relevance 
How do we measure $p(d \mid x)$. In different approach, we have different ways of constructing the following function $f(input, memory)-> score$  

**Sparse retrieval**: literal token overlap
**[[Dense retrieval]]**: (modern approach) (based on semantic similarity) embed both the query and documents into the same vector space, then measure similarity  
# Retrieval Timing

**Retrieve Once** (at the start)
- Most common approach
- Limiting for long-form generation

**Retrieve Periodically**
- Every k tokens

**Retrieve Adaptively**
Model learn when to retrieve
(ex. toolformer)
- teach LLM to make external call during text generation
- getting training data by running candidate few-shot prompting call. and keep the effective ones as the training data
- fine tune model based on these positive result.
# Handling underutilization of retrieved source
retrieving is easy, using and reasoning the retrieved info is hard. Sometimes, pre-trained model learned to related on the pre-trained knowledge rather than the provided source which cause inaccurate info.
## Solution 1 - counterfactual training
fine-tuning the model with retrieval and intentionally use the training data that only has answer from the retrieval document. so that we force the model to learn to read from the retrieval document.
## Solution 2 - Training with retrieval
Improving language models by retrieving from trillions of tokens
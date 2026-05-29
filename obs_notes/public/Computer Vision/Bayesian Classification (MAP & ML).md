**Summary**: A **generative** classifier. We want the posterior $P(\text{class}\mid\text{data})$, but what we can measure from labeled data is the likelihood $P(\text{data}\mid\text{class})$ — a histogram. Bayes' rule converts one to the other; we decide with **MAP** (using a prior) or **ML** (assuming a uniform prior).

**Last updated**: 2026-05-29

---

## Where this fits
This is the worked, concrete instance of the **generative** side of [[Discriminative vs Generative Methods]]. Recall the Bayes decomposition: the posterior we want for classification factors into a likelihood and a prior. Bayesian classification *estimates the likelihood from data* and applies Bayes' rule to recover the posterior.

## The skin-classifier example
Goal: given a pixel's color $R$, decide **skin** vs. **not skin**. This is not deterministic (skin spans many colors), so we model it probabilistically.

- **What we want** is the **posterior** $P(\text{skin}\mid R)$ — given the color, how likely is skin? We classify a pixel as skin where $P(\text{skin}\mid R) > P(\lnot\text{skin}\mid R)$.
- **What we can measure** is the **likelihood** $P(R\mid\text{skin})$ — among skin pixels, how often does color $R$ occur. It's literally a normalized histogram:
$$P(R\mid\text{skin}) = \frac{\#\,\text{skin pixels with color } R}{\#\,\text{skin pixels}}$$

These are not the same thing — so how do we get the posterior we want from the likelihood we have?

## Bayes' rule bridges them
$$P(\text{skin}\mid R) = \frac{\overbrace{P(R\mid\text{skin})}^{\text{likelihood (measured)}}\;\overbrace{P(\text{skin})}^{\text{prior}}}{\underbrace{P(R)}_{\text{normalization}}}$$

- **Likelihood** $P(R\mid\text{skin})$ — the measured histogram.
- **Prior** $P(\text{skin})$ — our belief about how common skin is, from **domain knowledge** (e.g. faces sit near the center of portrait photos) or from **class counts** in a fairly collected dataset.
- **Normalization** $P(R) = P(R\mid\text{skin})P(\text{skin}) + P(R\mid\lnot\text{skin})P(\lnot\text{skin})$ — the **same** for both classes, so for classification we can **ignore it and just compare numerators**.

## Two decision rules
- **MAP — maximum a posteriori.** If we **know the prior**, multiply likelihood × prior to get the (unnormalized) posterior for each class, then pick the larger. Decide skin where $P(\text{skin}\mid R) > P(\lnot\text{skin}\mid R)$ — e.g. the color band $R_1 < R \le R_2$ where the skin posterior curve sits above the not-skin one.
- **ML — maximum likelihood.** If we **don't know the prior**, the best assumption is a **uniform prior** (0.5 / 0.5 for two classes; $1/n$ for *n* classes). Then the prior is identical for both classes, so comparing posteriors **reduces to comparing likelihoods** directly.

This is the precise meaning of the "what are you maximizing?" distinction from [[Discriminative vs Generative Methods]]: **generative training maximizes likelihood** — ML here literally compares/maximizes likelihoods, and MAP maximizes the (unnormalized) posterior.

## Why it connects back
- **Generative recipe:** model the data (estimate $P(R\mid\text{class})$), then use Bayes to classify — exactly "generative models the likelihood and prior."
- **Histograms appear twice:** as the [[Image Retrieval (Bag of Words)|bag-of-words]] image representation *and* as the likelihood $P(R\mid\text{skin})$ here. Both are "a histogram is a vector representation of a distribution."
- Despite its simplicity, MAP/ML skin detection works reasonably well in practice.

## Related pages
- [[Discriminative vs Generative Methods]]
- [[Nearest-Neighbor Classification]]
- [[Image Retrieval (Bag of Words)]]
- [[Recognition & Vision Tasks]]

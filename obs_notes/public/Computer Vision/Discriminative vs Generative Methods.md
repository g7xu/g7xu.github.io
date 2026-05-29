**Summary**: Two paradigms for learning-based recognition. **Discriminative** methods model the posterior (decision boundaries); **generative** methods model the likelihood and prior (the full data distribution). This page also covers the statistical (Bayes) viewpoint and the three pillars of any recognition method: representation, learning, inference.

**Last updated**: 2026-05-29

---

When we can't hand-define a model for a category (you can't write the "cat algorithm" — see [[Recognition & Vision Tasks]]), we learn from labeled examples. There are two dominant ways to set up that learning: **discriminative** and **generative**.

## The statistical viewpoint
Take a classification question — *given an image, is it a zebra?* — and frame it probabilistically. Applying Bayes' rule to the ratio of "zebra" vs. "no zebra":

$$\underbrace{\frac{p(\text{zebra}\mid \text{image})}{p(\text{no zebra}\mid \text{image})}}_{\text{posterior ratio}} = \underbrace{\frac{p(\text{image}\mid \text{zebra})}{p(\text{image}\mid \text{no zebra})}}_{\text{likelihood ratio}} \cdot \underbrace{\frac{p(\text{zebra})}{p(\text{no zebra})}}_{\text{prior ratio}}$$

- **Posterior** $p(\text{zebra}\mid\text{image})$ — given the pixels, how likely is "zebra"? (Usually what we want for classification.)
- **Likelihood** $p(\text{image}\mid\text{zebra})$ — if you sampled from the distribution of all zebra images, how likely is *this* image?
- **Prior** $p(\text{zebra})$ — how common are zebras to begin with?

(Conditional-probability reminder: $p(A\mid B)$ restricts the universe to $B$ and asks how often $A$ also happens — i.e. $p(A\cap B)/p(B)$.)

The two paradigms take opposite sides of this equation.

## Discriminative methods
Model the **posterior** $p(\text{class}\mid\text{image})$ **directly**. They don't care what a zebra "looks like" — only that *zebra* and *not-zebra* are well separated. The output is a **decision boundary**: given a feature representation of the image, which side does it fall on?

- Example: **SAM (Segment Anything)** — type "people" and it returns a boundary between *people* and *not-people* pixels.
- Historically the dominant, most powerful approach for recognition.

## Generative methods
Model the **likelihood** $p(\text{image}\mid\text{class})$ (and the prior) — equivalently the **joint distribution** $p(\text{image}, \text{class}) = p(\text{image}\mid\text{class})\,p(\text{class})$. The question becomes: *if I sampled from the concept "zebra," how likely is a set of pixels like this?* A good zebra model assigns high probability to zebra images and low probability to motorbike images.

- Example: **generative AI** — image/video generation (e.g. Sora) is generative modeling done well.

## Discriminative vs. generative: the trade-off
The lecture's intuition: **"I can recognize a cat but I can't draw one."**

- **Recognizing = discriminative.** To tell cats from dogs you only need an abstract notion that they *differ*. The posterior is a "slice" of the joint — enough to classify, and easier to learn.
- **Drawing = generative.** To draw a cat you must know its *whole appearance distribution*. The joint is strictly more expressive than the posterior, so generative modeling asks a much harder question.

But generative is more **powerful**: modeling the full distribution gives you distances between concepts, interpretability, "give me another zebra slightly different from this one," and generation. A discriminative model only knows *boundaries* — it can't say whether two zebras are similar, nor generate a new one.

## Three pillars of a recognition method
Any learning-based method (discriminative or generative) must address three issues:

1. **Representation** — how to represent a category. The key property is **expressivity**, whose counterpart is **invariance**: a good representation is robust to imaging variations (viewpoint, illumination, occlusion, scale, deformation, clutter) and to intra-/inter-class variation (see [[Recognition & Vision Tasks]]).
2. **Learning** — how to form the classifier from training data (input–output pairs: images → labels). This is where the **training objective** differs by paradigm
	- **Generative → maximize likelihood.** Tune the model so the training images get high probability under their class (maximum-likelihood estimation). You fit the **data distribution** itself.
	- **Discriminative → maximize performance on the train/validation sets.** Tune the decision boundary to classify correctly, measured on the training set and checked on validation to avoid overfitting. You fit the **boundary**, not the data.
3. **Inference** — how the learned model is applied to *new* images at test time, and how efficiently. E.g. face detection must scan boxes at all locations and scales, so scanning speed sets the detection efficiency.

## Levels of supervision
Supervised learning needs labels, and richer supervision unlocks richer tasks (at greater labeling cost):

- **Image label** ("contains a motorbike") → classification
- **Bounding box** → localization / detection
- **Pixel mask / boundaries** → segmentation
- **Part-level labels** (wheels, handlebars, seat) → fine-grained / part understanding

## Related pages
- [[Recognition & Vision Tasks]]
- [[Image Retrieval (Bag of Words)]]
- [[ML Overview]]
- [[RANSAC]]

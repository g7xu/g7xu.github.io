# Regularization

**Summary**: Regularization is any constraint we add to a learner to make it **generalize** rather than memorize — needed because neural networks are over-parameterized "lazy learners" that overfit when data is limited. The lecture covers three levers: constrain the **weights** (L2 / L1), the **architecture** (dropout), or the **data** (augmentation).

**Last updated**: 2026-06-09

---

Regularization is the standard answer to **overfitting**: a model that fits the training data extremely well but fails on unseen data (see [[Generalization & Model Validation]]). The lecture motivates it with the MNIST example — training on only **1,000** images instead of the full **60,000**, the training accuracy keeps climbing (~98%) while test accuracy plateaus well below it (~95%), and the gap is the overfitting.

## Why overfitting happens: lazy learners
Overfitting is fundamentally a problem of **not enough data for the capacity of the model**. Neural networks are **over-parameterized** — you might have a million images but a billion parameters. That capacity is what lets them learn arbitrary functions, but it also makes them **"lazy learners"**: given little data, they take **shortcuts** that explain the training set without capturing the true underlying pattern.

> The analogy from lecture: a very smart student who doesn't study before the exam just **memorizes the lecture slides**. Ask a question straight from the slides and they ace it; ask something slightly outside and they can't generalize, because they never actually understood it.

## The goal: reduce complexity without reducing capacity
The obvious fix — "use a smaller network" — is the **wrong** one. Shrinking from a billion to 10,000 parameters reduces complexity but also throws away **learning capacity**. The right move is to **keep the capacity high but impose structure** on the solution, so the network can't fit "crazy variations."

**The polynomial analogy**. Fit 9 data points with a **degree-9 polynomial** and it passes through every point — **zero training error** — but wiggles wildly, so a new in-distribution point lands far from the curve. A **degree-2** fit has *higher* training error but is a far better explanation: an unseen point lands close to it. Regularization is the analog of "lower the polynomial degree" — but applied to the weights, *without* literally removing parameters.

## L2 regularization (weight decay)
Add the **sum of squared weights** to the original ("data") cost $C_0$:
$$C = C_0 + \frac{\lambda}{2n}\sum_w w^2$$
- $C_0 = \frac{1}{2n}\sum_x \lVert y(x) - a\rVert^2$ is the usual data cost (the [[Neural Network#The cost function|MSE / L2-loss]]).
- $\lambda$ is the **regularization hyperparameter**; $n$ is the training-set size.

Two competing objectives: minimize the data cost **and** keep the weights small. You can't just set all $w=0$ (that minimizes the penalty but ruins predictions), so the network settles for the **smallest weights that still explain the data**. $\lambda$ tunes the trade-off — small $\lambda$ prioritizes fitting the labels, large $\lambda$ drives the weights toward zero.

**Gradient and update.** The penalty's derivative is $\frac{\lambda}{n}w$ (the 2s cancel):
$$\frac{\partial C}{\partial w} = \frac{\partial C_0}{\partial w} + \frac{\lambda}{n}w \qquad\Rightarrow\qquad w \to w - \eta\frac{\partial C_0}{\partial w} - \frac{\eta\lambda}{n}w$$
The extra term shrinks each weight by an amount **proportional to $w$ itself** — hence "weight decay." Large weights get penalized hard, small weights barely move, so over training the weights **even out** — the distribution gets **"sphered out"** onto a small manifold (a sphere), the weight-space analog of the lower-degree polynomial.

## L1 regularization (sparsity)
Penalize the **sum of absolute values** instead:
$$C = C_0 + \frac{\lambda}{n}\sum_w |w|$$
Its derivative is the **sign** of $w$, so the update subtracts a **constant** amount regardless of magnitude:
$$\frac{\partial C}{\partial w} = \frac{\partial C_0}{\partial w} + \frac{\lambda}{n}\,\text{sgn}(w) \qquad\Rightarrow\qquad w \to w - \eta\frac{\partial C_0}{\partial w} - \frac{\eta\lambda}{n}\,\text{sgn}(w)$$

Because the shrink is constant (not proportional), L1 pushes **as many weights as possible all the way to zero**, keeping only a few important non-zero weights to explain the data. The result is a **sparse** weight distribution.

## L1 vs L2, and Lₚ
- **L1** shrinks each weight by a **constant** toward 0 → **sparsifies** (a few large weights, the rest zero).
- **L2** shrinks each weight **proportionally to $w$** → **spheres out** (all weights small and roughly equal).
- For a **large** $|w|$, L1 shrinks **less** than L2; for a **small** $|w|$, L1 shrinks **more** than L2. Net effect: L1 "focuses on the weights of a few important connections and drives the rest to zero".
- You can use any **$L_p$** norm: $L_3$, or $L_{0.5}$ which is **even sparser** than L1.

Applying regularization closes the MNIST gap: the test-accuracy (blue) curve rises much closer to the training-accuracy (orange) curve with the same 1,000 images.

## Dropout — regularizing the architecture
Instead of constraining weights, **modify the network structure**. At **every training iteration**, randomly **delete ~half the hidden neurons** (probability 0.5) and all their connections, then train on the surviving sub-network. Next iteration, a different random subset is dropped. At **test time** you use **all** neurons, so you **halve the outgoing weights** to compensate for having twice as many active units as during training.

Why it regularizes, from two angles:
- **Ensemble of networks.** Each iteration trains a different thinned sub-network; test time averages them. Each sub-network overfits differently, so the average is robust — like an ensemble that votes.
- **Prevents co-adaptation.** Lazy neurons tend to **copy** their neighbors' behavior, which generalizes poorly. Randomly dropping neurons forces each to learn a useful feature **independently** of the others. Intuition: a good "cat" classifier shouldn't need *all* of {has ears, has a tail, is furry, has claws, mischievous look} to fire together — any robust subset should suffice.

## Data augmentation — regularizing the data
If overfitting is a data shortage and collecting labeled data is expensive, **manufacture more data** from what you have. A network doesn't know what a cat *is* — it only learns statistical correlations between pixel distributions and labels. So transform an image into a **different pixel distribution that keeps the same semantic label**:
- **Horizontal flip** — a left-facing cat becomes a right-facing cat; same label, new pixels.
- **Random crops & scales** — pick random $L\in[256,480]$, resize so the short side $=L$, sample a random $224{\times}224$ patch. A large-enough crop of a cat is still a cat.
- **Color jitter** — randomize contrast/brightness.
- **And more** — rotation, shear, non-rigid warps, motion blur, lens distortions, ….

**Caveat: augmentation is not free data**. All augmentations are deterministic **rules** applied to existing images, so one augmented image is **not worth** one genuinely new training image — the outcomes aren't independent. Worse, a powerful network can **learn the augmentation rule itself** ("they always flip and jitter contrast"), at which point the augmentation becomes just another shortcut and its value disappears. Augment to help, but don't treat it as a substitute for real labeled data.

## The big picture: three levers
Regularization acts on whichever lever of the learning problem you can constrain:

| Lever | Technique | Effect |
|---|---|---|
| **Weights** | L2 / L1 / $L_p$ | shrink / sphere / sparsify the weights |
| **Architecture** | Dropout | ensemble + break neuron co-adaptation |
| **Data** | Augmentation | expand the diversity of the training set |

All three serve the same end: keep the network's capacity, but constrain *how* it uses that capacity so it **understands the pattern instead of memorizing the data**.

## Related pages
- [[Generalization & Model Validation]]
- [[Neural Network]]
- [[Convolutional Neural Network (CNN)]]
- [[CNN Architectures]]
- [[Transfer Learning]]

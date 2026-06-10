# Vanishing & Exploding Gradients

**Summary**: When networks get deep, [[Neural Network#Backpropagation|backpropagation]] multiplies many per-layer derivatives together (the chain rule), so the gradient signal **shrinks toward zero** (vanishing) or **blows up** (exploding) the further it travels from the loss layer. Vanishing gradients are why naïvely stacking layers stops working — and the problem [[CNN Architectures#ResNet — residual learning makes depth trainable|residual learning]] was designed to solve.

**Last updated**: 2026-06-09

---

## Why deep plain networks fail — it's not overfitting
Stacking more layers raises model capacity, so when a deeper net does **worse**, the instinct is to blame **overfitting**. But the diagnostic doesn't fit: overfitting means **low training error, high test error** (the net memorizes the small dataset). What's actually observed with "overly deep" *plain* nets is that **both training and test error are high** — a 56-layer plain net trains *worse* than a 20-layer one. High *training* error rules out overfitting; the real culprit is an **optimization difficulty**, and the most common one is **vanishing gradients**.

## The mechanism: chain rule multiplies derivatives
[[Neural Network#Backpropagation|Backpropagation]] computes gradients via the **chain rule** — the gradient at an early layer is the **product** of the local derivatives of all the layers between it and the loss. If each layer contributes a factor with magnitude around $0.5$ (say activations/weights normalized to $[0,1]$):

$$0.5 \times 0.5 = 0.25 \to 0.125 \to \dots \to 0.5^{10} \approx \tfrac{1}{1000}$$

So **10 layers down** the gradient is already ~1000× smaller. Since the [[Neural Network#Gradient descent|gradient-descent]] update is **proportional to the gradient**, the early layers receive a vanishingly small update — they stay **essentially unoptimized**. The learning signal is strong near the loss layer and dies out as you move toward the input.

**Visualizing it.** Plot a **histogram of gradient magnitudes** per layer during training. Near the loss layer the histogram is **fat** (many gradients far from zero); a few layers back it **collapses to a spike at zero** — no learning signal left.

## Exploding gradients — the mirror image
If the per-layer factors are **larger than 1** instead (say magnitude $10$), the product **explodes**: $10 \to 100 \to \dots$ a magnitude of $10$ becomes a **million** a few layers down. This destabilizes training.

**Asymmetry — exploding is easier to handle than vanishing.** You can **clip** a large gradient (cap its magnitude at some threshold), so exploding gradients are manageable. But you **can't artificially boost** a gradient that has decayed to ~0 without inventing signal — so **vanishing gradients are the harder problem**. (Whether you see exploding vs. vanishing also depends on how you normalize gradients.)

## The fix: residual / skip connections
[[CNN Architectures#ResNet — residual learning makes depth trainable|Residual learning]] (ResNet) addresses this with a **skip connection** that adds the block's input $x$ to its output: $H(x) = F(x) + x$. Two complementary readings:

- **Easier learning problem.** The two weight layers only need to learn the **residual / fluctuation** $F(x)$ on top of the identity, rather than an arbitrary mapping $H(x)$. If the optimal map is close to identity, learning a small $F(x)$ is much easier.
- **A second gradient pathway (the vanishing-gradient view).** Without the skip, gradients must flow back *through* the two weight layers, picking up the shrinking chain-rule product. The skip connection provides an **alternate route** that carries the gradient straight past those layers, so it reaches earlier layers **without being attenuated**. This is why chaining 50+ residual blocks still trains: each block can learn a small function, but the gradient highway keeps every block supplied with signal.

With residual blocks, test **and** training error keep going **down** as depth increases — the optimization difficulty of plain deep nets goes away.

## Related pages
- [[CNN Architectures]]
- [[Neural Network]]
- [[Convolutional Neural Network (CNN)]]
- [[Regularization]]

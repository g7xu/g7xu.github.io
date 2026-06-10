**Summary**: A tour of the landmark CNN architectures — LeNet → AlexNet → VGG → ResNet — and the design principles they established: **most parameters live in the FC layers, but depth (the conv stack) is what drives accuracy**. Stacking small 3×3 filters, going deeper rather than wider, and finally **residual (skip) connections** to make very deep nets actually trainable.

**Last updated**: 2026-06-09

---

This page picks up from the [[Convolutional Neural Network (CNN)]] mechanics and asks: *given* conv / ReLU / pool / FC blocks, **which arrangements actually work, and why?**

> **Note on scope.** The lecture **transcript** stops at VGG and depth-vs-width, deferring vanishing gradients and ResNet to "the next lecture". The **slide deck**, however, carries those slides, so they're included below for completeness.

## The recap: what a CNN is made of
The recurring building blocks:
- **Convolutional layers** — *local connectivity* (the same local function evaluated everywhere) + *weight sharing* (far fewer parameters). The **engine** of feature extraction.
- **Pooling** — buys a **larger [[Convolutional Neural Network (CNN)#Receptive field|receptive field]]** for free (no parameters).
- **Regularization** — prevents over-fitting (see [[Regularization]]).
- **Limiting parameters** — sequences of 3×3 filters instead of large filters; 1×1 convolutions to reduce feature dimensions.
- **Skip networks** — easier optimization at greater depth.

## LeNet — the first success (1980s–90s)
CNNs have existed since the 1980s. The first big commercial deployment was **LeCun's LeNet**, doing **OCR** (optical character recognition) on handwritten characters — digits *and* letters — for **postal mail sorting** (USPS).

## AlexNet — the 2012 ImageNet breakthrough
The **ImageNet** challenge (1M images, 1,000 categories) was dominated by **AlexNet** (Krizhevsky), which "blew the other methods out of the water" and started the deep-learning revolution. It achieved **18.2% top-5 error** on ImageNet.

Crucially, AlexNet used **the same principles** as LeNet 25 years earlier — what changed was **scale** and **hardware**:
- **Bigger model**: 7 hidden layers, ~650k units, **60M parameters** (vs. LeNet's tiny net).
- **More data**: $10^6$ images instead of $10^3$.
- **GPU implementation** (a pair of GPUs, ~50× speedup over CPU) — the key enabler for optimizing that many parameters. ("…and thereby the stock value of NVIDIA today.")

**Structure**: 5 conv blocks (each = conv → ReLU → max-pool), then **2 fully-connected layers** (4096 → 4096), then the loss. Standard **224×224** (227×227 in the deck) inputs. Filter sizes are mixed — 11×11, 5×5, then 3×3 — and **dropout** sits between the FC layers.

### The layer-removal ablation — where do params and accuracy live?
Removing layers from trained AlexNet reveals the division of labor:

| Removed | Performance drop | Parameters removed |
|---|---|---|
| FC layer 7 | **−1.1%** | **−16M** |
| FC layers 6 **and** 7 | −5.7% | **−50M** |
| Conv layers 3 **and** 4 | −3.0% | only **−1M** |
| Conv 3, 4 **and** FC 6, 7 | **−33.5%** | — |

The lessons:
- **Most parameters live in the FC layers** — they're *dense* (every neuron connected to every neuron: 4096×4096 connections), needed for **global** image reasoning. Dropping them costs ~50M params but only a few percent accuracy.
- **Conv layers hold few parameters but are the engine** — dropping conv 3+4 sheds only ~1M params yet costs 3% accuracy, because the convolutions do the actual **feature extraction** that makes the FC layers' job possible.
- **Remove both and it collapses (−33.5%).** Conclusion in one word: **Depth!** You need enough depth to build abstract features.

## Width or depth? Go deeper
The **universal approximation theorem** says a **two-layer** network with enough neurons can approximate *any* continuous function — but that's about existence, not efficiency:
- **Wider** network — needs *more and more* neurons to represent an arbitrary function precisely.
- **Deeper** network — in practice needs **far fewer** parameters for the same approximation power.

Formally (Telgarsky, PMLR 2016): for a certain class of functions you need an **exponential** number of neurons at depth $d$ but only a **polynomial** number at depth $d' > d$. **Rule of thumb: if you must choose between bigger kernels (more width/params) and more layers (more depth), choose depth.**

## VGGNet — depth via stacked 3×3 filters
VGGNet (Visual Geometry Group) pushes depth to **up to 19 layers** (vs. AlexNet's ~7) using **only 3×3 filters** everywhere, where AlexNet mixed 11×11 / 5×5 / 3×3.

Why 3×3-only? **Parameter efficiency** — a 3×3 filter has **9** learnable parameters vs. **49** for a 7×7 (a *quadratic* blow-up as kernel size grows). Stacking several small filters reaches the same receptive field with **more depth and fewer parameters**, and depth is what matters. Result: **6.8% top-5 error** vs. AlexNet's 18.2%, but more than twice as many layers and **harder/slower to train**.

## The depth problem: it doesn't get easier
Counterintuitively, **simply stacking more layers makes things worse**:
- "Overly deep" **plain** nets have **higher *training* error** — a 56-layer plain net trains worse than a 20-layer one. This is **not overfitting** (training error itself is high); it's an **optimization** failure, observed across datasets.

The three ways to grow the receptive field each have a cost:
- **More pooling** → lose local detail.
- **Larger filters** → more parameters.
- **More layers** → **[[Vanishing & Exploding Gradients|vanishing gradients]]** — the chain rule multiplies each layer's derivative, so the back-propagated signal shrinks toward zero in the earlier layers and they barely learn. (Note this is an *optimization* failure, not overfitting — training error itself is high.)

> **Motivating example — human pose estimation**. Tasks like pose estimation need *both* local detail and global context: a single cropped patch (a hand, a knee) is ambiguous — "local appearance is insufficient, global appearance is helpful." That demand for a **large receptive field** is exactly what pushes architectures deeper, which is what makes the vanishing-gradient problem unavoidable.

## ResNet — residual learning makes depth trainable
**ResNet** (He, Zhang, Ren, Sun, *Deep Residual Learning for Image Recognition*, CVPR 2016) makes very deep nets trainable — the "revolution of depth": AlexNet 8 → VGG 19 → **ResNet 152** layers.

The idea: instead of asking two stacked weight layers to fit a desired mapping $H(x)$ directly, add a **skip / identity connection** and have them fit the **residual** $F(x) = H(x) - x$, so:
$$H(x) = F(x) + x$$
$F(x)$ is a residual *with respect to the identity*. There are two complementary reasons it helps:
- **Easier learning problem.** If the **identity** is the optimal mapping, it's trivial to represent — just **drive the weights to 0** so $F(x)=0$. And if the optimal mapping is merely **close to** identity, it's much easier to learn the **small fluctuation** $F(x)$ than the whole function $H(x)$.
- **A second gradient pathway.** The skip connection gives the gradient an **alternate route** straight past the two weight layers, so it reaches early layers without the chain-rule attenuation — directly mitigating [[Vanishing & Exploding Gradients|vanishing gradients]]. Chaining 50+ residual blocks still trains because this gradient highway keeps every block supplied with signal.

Design: **simple, 3×3 convs only (like VGG)**, plus the skip connections. With residual blocks, deeper ResNets keep *decreasing* training error where plain nets stall.

## Bigger is not better
Across architectures, accuracy-vs-compute plots (e.g. AlexNet, VGG-16/19, GoogLeNet, the ResNet family, Inception) show **VGG is huge but not the most accurate**, while ResNet/Inception variants are **more accurate with fewer parameters**. The real innovations **reduce** parameter count despite going deeper — e.g. **sequences of 3×3 filters** and **1×1 convolutions** to shrink feature dimensions.

## Debugging: is the CNN trained well?
A practical checklist (after M. Ranzato):
- **Training diverges** → learning rate too large → **decrease** it.
- **Loss minimized but accuracy low** (parameters collapse) → check the **loss function**: is it right for the task? Does it have degenerate solutions (check the "pull-up" term)?
- **Network underperforming** → compute FLOPs / #params; if too small, **make the net larger**; visualize hidden units to fix optimization.
- **Network too slow** → use a GPU / distributed framework, or **make the net smaller**.

## Related pages
- [[Convolutional Neural Network (CNN)]]
- [[Vanishing & Exploding Gradients]]
- [[Regularization]]
- [[Neural Network]]
- [[Beyond CNNs — Modern CV Frontier]]
- [[Transfer Learning]]
- [[Generalization & Model Validation]]

**Summary**: A CNN is a neural network built around the convolution operation, designed to exploit the spatial structure of images. Instead of hand-designing filters (Sobel, etc.), a CNN *learns* its filters from data; each layer convolves learned kernels over its input (local connectivity + weight sharing) to produce feature maps, and stacking conv + nonlinearity builds hierarchical features.

**Last updated**: 2026-05-29

---

A CNN is a neural network architecture built around the **convolution** operation, designed to exploit the spatial structure of grid-like data such as images (and audio spectrograms, geophysical fields, …). It's the dominant way [[Neural Network|neural networks]] are applied to images, and it builds directly on the convolution we saw for [[Feature Detection|filtering]].

## Why learn the filters?
Classic computer vision **hand-crafts** filters — Sobel (edges), Gaussian blur, Gabor, morphological filters, etc. A Sobel kernel like $\begin{bmatrix}-1&0&1\\-2&0&2\\-1&0&1\end{bmatrix}$ responds to vertical edges. Two problems:
- Is a hand-designed filter **optimal** for *your* task? No guarantee.
- You'd have to design a different filter for every problem.

The CNN idea: don't choose filters a priori — **let the data and the optimization learn the optimal filters**. The kernel entries $\theta_1,\dots,\theta_9$ become **learnable weights**, trained by [[Neural Network#Training a neural network|gradient descent]] to map images to their labels as well as possible.

## Convolution recap
A **convolution is a weighted moving sum**: slide a kernel (filter) across the input; at each location take the **dot product** of the kernel with the overlapping patch; record the value. The result is a **feature map** (a.k.a. feature activation map). Just as a Sobel kernel produces an edge map, a learned kernel produces a learned feature map.

## Why convolution fits images
- **Local connectivity** — neighboring pixels are correlated; meaning comes from local structure, not isolated pixels. A kernel acts on a local $k{\times}k$ region, so it directly exploits this.
- **Spatial structure** — convolution is a spatial operation, so spatial relationships are preserved (cat-like features end up next to dog-like features).
- **Channels (depth)** — grayscale = 1 channel, RGB = 3, hyperspectral = k. The spatial axes (W, H) carry *position*; the depth axis carries *channel/color* — they mean different things.

## Fully-connected vs. convolutional layer
- **Fully connected (FC):** every unit connects to *every* unit in the previous layer (dense). Spatial information is thrown away (recall MNIST flattening 28×28 into 784 inputs), and the parameter count **scales with the input size**.
- **Convolutional:** each unit connects to only a **local $k{\times}k$ region** — the kernel. The $k^2$ kernel values are the learnable weights, and the **same kernel slides across the whole input** → one feature map. Two wins: **local connectivity** (respects image structure) and **weight sharing** (one filter reused everywhere).

## From image to feature volume
- One $k{\times}k$ filter on a $W{\times}H$ image → one **$W{\times}H$ 2D feature map**.
- Apply **C different filters** → C feature maps → stack into a **$W{\times}H{\times}C$ volume**. So the first conv layer turns a 2D image into a **3D volume**: spatial dims = input size, depth = number of filters.
- **Convolution on a volume:** the input is now $W{\times}H{\times}C$, so each filter is **3D** — $k'{\times}k'{\times}C$, **local in space but full in depth** (it spans all C channels). Slide it spatially → one 2D feature map; $C'$ such filters → a $W{\times}H{\times}C'$ volume. Repeat layer by layer.
- A **nonlinearity** (ReLU / max) sits between conv layers — the same $W\mathbf{x}\to\max(0,\cdot)$ pattern as a plain [[Neural Network]] — which is what builds higher and higher abstraction.

## Counting parameters
- One filter over C channels: $k^2 \cdot C$ weights.
- A conv layer of $C'$ filters: $k^2 \cdot C \cdot C'$ weights.
- Example: a $7{\times}7$ filter on RGB ($C=3$) → $7\cdot7\cdot3 = 147$ parameters; 5 such filters → $147\cdot5 = 735$.

The key point: because of **weight sharing**, the count depends only on **filter size × number of filters** — **not** on the input image size, unlike an FC layer.

## What weight sharing means
Physically: we expect a feature (say a "chair detector") to appear *anywhere* in the image, so the **same filter should fire wherever the pattern occurs** — there's no reason to use a different filter for a chair in the left corner vs. the right. One shared kernel per feature is therefore enough, and it keeps the parameter count low.

**Exception — registered/aligned inputs.** When images are pre-aligned, location-specific filters can help. Face-recognition kiosks first **warp** the face so eyes/nose/mouth land at canonical locations; then **DeepFace** (Facebook AI) — the first face recognition to beat human accuracy — used location-specialized CNN features. Modern networks are powerful enough that plain weight sharing works without this trick.

## Convolution is differentiable
Training needs gradients (see [[Neural Network#Training a neural network|training]]), so every layer must be differentiable. A convolution is just a **dot product** of the filter with the overlapping patch — a linear operation — so it's trivially differentiable (the derivative w.r.t. a filter weight is the corresponding input value).

## Pooling
A **pooling** layer aggregates a local region of a feature map into a single value. **2×2 max-pooling with stride 2**: slide a non-overlapping 2×2 window over the map and keep the **max** of each window → an $n{\times}n$ map becomes $\tfrac{n}{2}{\times}\tfrac{n}{2}$.

- **No learnable parameters** — it's a fixed, deterministic operation (you only choose the window size *k* and stride).
- **Applied per feature map** (each channel independently) — unlike convolution, which spans the whole depth.
- **Differentiable** — the gradient routes only to the location that won the max (gradient 1 there, 0 elsewhere) — the same "max gate" pattern from [[Neural Network#Gate patterns|backprop]].

Three reasons to pool, least → most important:
1. **Invariance / keep the most informative values** in noisy data.
2. **Less computation & memory** — smaller maps downstream.
3. **The real reason: a bigger receptive field, cheaply.** Pooling widens each unit's view of the input **without adding parameters** (see below).

## Receptive field
The **receptive field** of a unit is the region of the *input image* it "sees" — its footprint. A unit in the first conv layer sees only a small $k{\times}k$ patch; a unit one layer deeper aggregates the receptive fields of all the units feeding it, so **deeper units see broader regions**.

Why this matters: a 3×3 patch of white fur can't tell a white cat from a white dog — you need a **global, holistic view**. So lower layers learn local features (edges, corners) and deeper layers, with wider receptive fields, learn textures → object parts → whole objects. **The magic word for deep networks is *context*** — deep layers must see enough of the image to reason about it.

Growing the receptive field by stacking conv layers costs more parameters each layer. **Pooling is the shortcut**: it collapses a region into one unit, instantly widening the receptive field with *zero* new parameters. (But don't pool *everything* at once — you'd lose information and skip the learning; the art is balancing context, computation, and enough parameters to actually learn.)

## 1×1 convolution
A **1×1 convolution** has spatial size 1 but full channel depth — so it's a dot product across channels at each pixel. Its use: **change the number of channels** while keeping spatial size, in a *learnable* way. E.g. a 56×56×64 map → apply 32 different 1×1 filters → 56×56×**32**. Handy for **multimodal fusion** — line up the channel dimensions of, say, an audio stream (64) and a video stream (32) before combining them.

## The classification head: flatten → fully connected → softmax
The conv/ReLU/pool stack outputs feature maps; a classifier needs one number per class. Two final steps:

1. **Flatten + fully-connected layers.** Once pooling has shrunk the maps (e.g. 4×4 × 100 channels = 1,600 values), **flatten** them and add a couple of **fully-connected layers** ending in output nodes = number of classes. Unlike conv units (local), every FC unit sees the **whole image** — exactly what you need for a holistic class decision.
2. **Softmax.** ReLU outputs are unbounded $[0,\infty)$, but classification wants a **peaky probability distribution** (the ground truth is one-hot — a delta function). Softmax turns the raw scores $z$ into probabilities:
$$\text{softmax}(z)_i = \frac{e^{z_i}}{\sum_j e^{z_j}}$$
Dividing by the sum makes it sum to 1 (a probability); exponentiating **exaggerates differences**, making the output peaky. It's a **differentiable approximation of max** — $e^{100}\gg e^{98}$, so the largest logit dominates, but smoothly enough to backprop through.

## What's next
Full CNN architectures (and the precise receptive-field arithmetic — each extra 3×3 stride-1 conv grows it by 2, pooling/stride multiply it, dilation grows it without adding parameters) — later lectures. CNN features also **transfer** extremely well across tasks → see [[Transfer Learning]].

## Related pages
- [[Neural Network]]
- [[Transfer Learning]]
- [[Generalization & Model Validation]]
- [[Feature Detection]]
- [[ML Architecture Families]]
- [[Recognition & Vision Tasks]]

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

## What's next
Pooling, full CNN architectures, and the **receptive field** (how large a region of the input one deep activation "sees") — covered in the next lecture. *(Personal to-do: define the receptive field, the rule that each extra 3×3 stride-1 conv grows it by 2, how downsampling/pooling multiplies it, and how dilation grows it without adding parameters — e.g. four 3×3 convs → 9×9 receptive field; add one 2× downsample and it doubles.)*

## Related pages
- [[Neural Network]]
- [[Feature Detection]]
- [[ML Architecture Families]]
- [[Recognition & Vision Tasks]]

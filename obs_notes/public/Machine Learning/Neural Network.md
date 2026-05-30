**Summary**: Neural networks learn features automatically from (image, label) pairs instead of relying on hand-crafted features. A network is a composition of linear transformations (weights + bias) interleaved with nonlinearities; the nonlinearity is what lets it build progressively more abstract representations. This page covers what a network *is* and why it's expressive, then how it's *trained* — cost, gradient descent, SGD, momentum, and backpropagation.

**Last updated**: 2026-05-29

---

## Motivation: learning features vs. hand-crafting them
Traditionally, recognition meant **hand-crafting features** (SIFT, HOG, spatial pyramids, textons, SURF, LBP…) and feeding them to a classifier. HOG → pedestrian detection (Dalal & Triggs 2005) was an early ML-for-vision win. But hand-crafting uses **domain expertise** and must be redone for every new problem.

Neural networks remove that burden. You **design the architecture once** (number of layers, widths, etc.); then, given training data, the network **learns the features automatically, end-to-end**. To switch from cat-vs-dog to car-vs-bike you don't redesign features — you just collect labeled images.

Two reasons this is powerful:
- **Hierarchical, expressive features** — lower layers learn edges/gradients/blobs; deeper layers learn textures → object parts → whole objects. The architecture *encourages* this; we don't hand-specify it.
- **Transferable** — features learned for one task transfer to others. Take a trained network and **fine-tune** it on a new task with much less data.

## From biology to the perceptron
The idea is loosely inspired by **biological neurons** (dendrites → nucleus → axon → synapses) and the Hubel–Wiesel hierarchy (simple → complex → hypercomplex cells). An artificial neuron — the **perceptron** — takes inputs, weights them, sums, and applies a function:
- Classic perceptron output: $\text{sign}(\mathbf{w}\cdot\mathbf{x} + b)$.
- The version used here (with a ReLU): output $= \max(0,\ \mathbf{w}\cdot\mathbf{f})$ — if the weighted sum is positive, pass it through; if negative, output 0.

## Multi-layer perceptron (MLP)
Put several neurons in a layer: each takes the **same inputs** but has its **own weights**. The layer's action is a **matrix–vector product** followed by the nonlinearity:
$$\mathbf{f}' = \max(0,\ W\mathbf{f})$$
where the rows of $W$ are the individual neurons' weights. Feed each layer's output into the next and repeat. The full network is a **composition of linear transformations with nonlinearities** in between.

## Why the nonlinearity is essential
Without it, stacking layers is pointless: $W_2(W_1 x) = (W_2 W_1)x$ — two linear layers collapse into **one** linear transformation, no more expressive than a single layer. A nonlinearity between layers is what lets the network lift raw intensities → textures → parts → abstract concepts (cat/dog). This **nonlinearity sits between every pair of layers**.

## Activation functions
- **ReLU** — $\max(0, x)$, the **R**ectified **L**inear **U**nit; most common today.
- **Sigmoid** — $\sigma(x) = 1/(1+e^{-x})$; popular historically.
- **tanh** — $\tanh(x)$.
- **Leaky ReLU** — $\max(0.1x, x)$.
- **ELU** — $x$ if $x>0$, else $\alpha(e^x - 1)$.

## The bias term
In practice each neuron also has a **bias**: $\max(0,\ \mathbf{w}\cdot\mathbf{f} + b)$. Without it, the learned function is forced through the **origin** (input 0 → output 0), restricting the function space. The bias lifts that restriction — a zero input can map to a nonzero output — adding flexibility. So the full network is:
$$f = W_3\,\max(0,\ W_2\,\max(0,\ W_1 x + b_1) + b_2) + b_3$$

## Counting learnable parameters
For a net with input 3 → hidden 4 → hidden 4 → output 1:
- **Weights** (one per connection): $4{\times}3 + 4{\times}4 + 1{\times}4 = 32$
- **Biases** (one per neuron): $4 + 4 + 1 = 9$
- **Total learnable parameters:** $32 + 9 = 41$

(The input is *given*, so input nodes aren't learnable.) Modern networks have hundreds of layers and millions–billions–trillions of parameters.

Implementation is just a few lines — each layer is a dot product + bias + activation:
```python
f  = lambda x: 1.0/(1.0 + np.exp(-x))   # sigmoid activation
x  = np.random.randn(3, 1)              # input (3x1)
h1 = f(np.dot(W1, x) + b1)              # hidden layer 1 (4x1)
h2 = f(np.dot(W2, h1) + b2)            # hidden layer 2 (4x1)
out = np.dot(W3, h2) + b3              # output (1x1)
```

## Universal approximation: why neural networks are powerful
- **Universal function approximators** (Cybenko, 1989): a **two-layer** network (one hidden layer) with *enough* neurons can approximate *any* continuous function to any desired accuracy.
- The catch: "enough" can be **exponential** in the number of neurons for a shallow net. Adding **depth** drastically reduces the neurons needed — which is why modern networks are **deep** (many layers) rather than merely **wide**. Each extra layer applies more nonlinearity → more abstraction.
### Why it's true (the box construction)
An intuitive 1-D proof. Any continuous $f(x)$ can be approximated as a **sum of thin rectangular boxes** (a histogram of the curve):
$$f(x) \approx \sum_i w_i\, I(a_i < x < b_i)$$
where $I(\cdot)$ is 1 inside the interval and 0 outside, and $w_i$ is the box height. Each **box** is built from **4 ReLUs**:
$$I(a<x<b) \approx \text{relu}\!\big(\tfrac{x-(a-c)}{c}\big) - \text{relu}\!\big(\tfrac{x-a}{c}\big) - \text{relu}\!\big(\tfrac{x-(b-c)}{c}\big) + \text{relu}\!\big(\tfrac{x-b}{c}\big)$$
The first two ReLUs make a sharp **step up** at $x=a$; the last two a sharp **step down** at $x=b$; as the slope parameter $c\to 0$ the ramps become vertical → a clean box. The operations are **linear → ReLU → linear** (affine inputs, the nonlinearity, then a $+1,-1,-1,+1$ combination summed over boxes), and the two linear stages collapse into one — i.e. a network with **one hidden layer**. The price of accuracy is *thin* boxes ⇒ *many* neurons.

> Caveat: this is an **existence** result — it says a good network *exists*, not that gradient descent will *find* it, nor that it will *generalize*. Finding the weights is the job of [[#Training a neural network|training]].

---

## Training a neural network
The network is a function with millions of unknown weights. Training = find the weights (and biases) that map inputs to their correct labels, by **minimizing a cost** with **gradient descent**.

### The cost function
Using the **MNIST** digit task as the running example (28×28 = **784** input units → hidden layer(s) → **10** one-hot output nodes, one per digit), the network maps an input $x$ to an output vector $a$, and we want $a$ to match the label $y(x)$. The standard loss is the **quadratic / mean-squared-error (MSE) / L2** cost:
$$C(w,b) = \frac{1}{2n}\sum_x \lVert y(x) - a\rVert^2$$
a sum of squared residuals over all $n$ training examples.

(Aside on encoding: **one-hot** — digit $k$ → node $k$ = 1, rest 0 — is convenient because it lets the outputs look like probabilities later, e.g. via softmax. You *could* encode 10 classes in 4 binary nodes, but one-hot is the simpler default.)

### Gradient descent
Picture the cost as a landscape over the parameters; drop a ball and let it **roll down the valley**. For a small step $\Delta v$ in parameter space, the change in cost is
$$\Delta C \approx \nabla C \cdot \Delta v, \qquad \nabla C = \Big(\tfrac{\partial C}{\partial v_1}, \tfrac{\partial C}{\partial v_2}, \dots\Big)$$
To make $\Delta C$ as **negative** as possible, take the step **opposite** the gradient. That gives the **update rule**:
$$v \to v' = v - \eta\,\nabla C \qquad\Longleftrightarrow\qquad w_k \to w_k - \eta\,\tfrac{\partial C}{\partial w_k}, \quad b_l \to b_l - \eta\,\tfrac{\partial C}{\partial b_l}$$
The **learning rate** $\eta$ sets the step size: **too small** → correct direction but painfully slow; **too large** → overshoot into a worse minimum. Each step is tiny and dumb, but enough of them reach a good solution — "power in numbers," just like the network itself.

### Stochastic gradient descent (SGD)
The exact gradient averages over the *whole* dataset, $\nabla C = \frac1n\sum_x \nabla C_x$, which is **O(n)** — far too slow when $n$ is millions or billions. Instead, draw a random **mini-batch** of $m$ samples and use its average as an estimate:
$$\frac{1}{m}\sum_{j=1}^{m}\nabla C_{x_j} \approx \frac{1}{n}\sum_x \nabla C_x = \nabla C$$
Over many steps the sampling noise tends to cancel. The mini-batch size is also bounded by **GPU memory**. Because the gradient is now a random estimate, this is **stochastic** gradient descent — the standard optimizer for neural networks.

### Pitfalls of gradient descent
- **Local minima & saddle points.** Wherever the gradient is **zero**, the ball has no push and gets **stuck**. A saddle point isn't a minimum but still has zero gradient. In practice, neural-network losses have *far more saddle points than local minima*, and SGD tends to settle at a **good saddle point** that generalizes well — part of why big networks work.
- **Ill-conditioning.** If the loss is **steep in one direction and shallow in another** (a ski-slope valley), the step follows the steep wall, so you **jitter across the walls while crawling along the floor**. Quantified by the **condition number** — the ratio of the largest to smallest singular value of the **Hessian** (the matrix of second derivatives). A large ratio = badly conditioned = slow.
- **SGD noise.** Mini-batch gradients are noisy approximations, so even on a nice bowl the path **meanders** toward the minimum. Bigger batches give cleaner gradients but cost more memory/time — a trade-off bounded by hardware.

### Momentum
Don't step on the *current* gradient alone — keep a **running mean of recent gradients** (a "velocity") and step on that:
$$v_{t+1} = \rho\,v_t + \nabla f(x_t), \qquad x_{t+1} = x_t - \alpha\,v_{t+1}$$
(With $\rho = 0$ this is plain SGD.) Momentum helps three ways at once: **noise** averages out → a smoother path; **flat/zero-gradient regions** (local minima, saddles) still get pushed through, because past gradients carry the ball forward; and **ill-conditioned jitter** across the steep walls cancels while motion along the floor accumulates.

**Learning-rate scheduling** complements this: be aggressive with $\eta$ early, then **decay** it as you near the minimum (often with a small inner search over candidate step sizes).

### Backpropagation
Gradient descent needs $\partial C/\partial w$ and $\partial C/\partial b$ for *every* parameter — there can be millions. Computing these naively is intractable; **backpropagation** is the efficient method.

It exploits the **layer-to-layer structure**. A neuron's output depends *only* on the previous layer:
$$a^l_j = \sigma\!\Big(\underbrace{\textstyle\sum_k w^l_{jk}\,a^{l-1}_k + b^l_j}_{z^l_j}\Big)$$
so the whole network is a **composition of functions**, $f(g(x))$. Gradients of a composition come from the **chain rule**:
$$\frac{dz}{dx} = \frac{dz}{dy}\cdot\frac{dy}{dx}, \qquad \text{(multivariate)}\quad \frac{\partial z}{\partial x_i} = \sum_k \frac{\partial z}{\partial y_k}\,\frac{\partial y_k}{\partial x_i}$$
Applying the chain rule *naively* across all layers produces an explosive number of derivatives. **Backpropagation = applying the chain rule in a careful order, reusing the values already computed in the forward pass**, so the whole gradient costs about the same as one forward pass.

Two things to keep straight:
- **Backpropagation only *computes* gradients.** **SGD** is what *trains* the network (it uses those gradients in the update rule).
- (Overfitting / regularization come in a later lecture.)

#### Worked example
Take $f(x,y,z) = (x+y)\,z$ with $x={-}2,\ y=5,\ z={-}4$. The computational graph has an **add** node $q = x+y$ and a **multiply** node $f = q\,z$.

**Forward pass** (fill node values): $q = -2+5 = 3$, then $f = 3 \times (-4) = -12$.

**Backward pass** (fill gradients, output → inputs), using only the local rule for each node:
- $\dfrac{\partial f}{\partial f} = 1$ (the output w.r.t. itself).
- Multiply node $f = q z$: each input's gradient is the **other** input's value. So $\dfrac{\partial f}{\partial z} = q = 3$ and $\dfrac{\partial f}{\partial q} = z = -4$.
- Add node $q = x+y$: it just **passes the gradient through** ($\partial q/\partial x = \partial q/\partial y = 1$). By the chain rule $\dfrac{\partial f}{\partial x} = \dfrac{\partial f}{\partial q}\dfrac{\partial q}{\partial x} = -4$, and likewise $\dfrac{\partial f}{\partial y} = -4$.

Notice **no derivative was actually computed** — each node just looked up forward-pass values and applied a fixed rule. That's the bookkeeping that makes backprop cheap.

#### Gate patterns
Every node type has a simple backward behavior:
- **add gate → gradient *distributor*** — copies the incoming gradient unchanged to both inputs.
- **multiply gate → gradient *switcher*** — each input receives the *other* input's value × the upstream gradient (it "switches" the two values).
- **max gate → gradient *router*** — sends the whole gradient to the **larger** input only; the other gets 0.

Any operation gets such a rule, so backprop is just: go layer-by-layer from output to input, apply each node's rule. (This is the basis of a homework problem — solve it *with backprop*, not by writing out the full chain rule.)

## Related pages
- [[Convolutional Neural Network (CNN)]]
- [[Recognition & Vision Tasks]]
- [[Discriminative vs Generative Methods]]
- [[ML Architecture Families]]
- [[ML Overview]]
- [[Image Retrieval (Bag of Words)]]

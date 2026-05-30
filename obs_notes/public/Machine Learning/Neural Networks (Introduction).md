**Summary**: Neural networks learn features automatically from (image, label) pairs instead of relying on hand-crafted features. A network is a composition of linear transformations (weights + bias) interleaved with nonlinearities; the nonlinearity is what lets it build progressively more abstract representations. Trained by gradient descent.

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

## Learning the weights: gradient descent
Given training pairs $(x_i, y_i)$, find the weights $W$ (and biases) that **minimize a misclassification loss**, e.g. $\sum_i (y_i - f(x_i))^2$. Because of the nonlinearities and huge parameter counts, we use **gradient descent** — the opposite of hill-climbing: from a random initialization, repeatedly take a small step in the direction that improves the loss, using local derivatives.

It is **not globally optimal** — like climbing a hill one local step at a time, you can get stuck in a **local optimum**. But with large data and large networks, local optimality turns out to be powerful enough in practice. (Details of NN optimization — and overfitting / regularization — are the next lecture.)

## Why neural networks are powerful
- **Universal function approximators** (Cybenko, 1989): a **two-layer** network with *enough* neurons can approximate *any* continuous function to any desired accuracy.
- The catch: "enough" can be **exponential** in the number of neurons for a shallow net. Adding **depth** drastically reduces the neurons needed — which is why modern networks are **deep** (many layers) rather than merely **wide**. Each extra layer applies more nonlinearity → more abstraction.

Practical challenges to watch: large neuron counts, **overfitting** (→ regularization), and **local optima**.

## Related pages
- [[Recognition & Vision Tasks]]
- [[Discriminative vs Generative Methods]]
- [[ML Architecture Families]]
- [[ML Overview]]
- [[Image Retrieval (Bag of Words)]]

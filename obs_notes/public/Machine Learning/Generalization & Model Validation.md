**Summary**: What we want from a model isn't accuracy on data we've seen — it's **generalization** to unseen data. To get it (and to choose hyperparameters honestly) we split data into train / validation / test, tune on validation, and never touch test until the end.

**Last updated**: 2026-05-29

---

The real goal of any machine-learning model — a [[Neural Network]] included — is **generalization**: performing well on examples it has **never seen**, not just on the data it was trained or tuned on.

## The three-way split
Divide the dataset into three disjoint parts:

- **Training set** — used to *learn the weights* (run [[Neural Network#Training a neural network|gradient descent]] on it).
- **Validation set** — used to *choose hyperparameters* (learning rate, architecture, how much to fine-tune in [[Transfer Learning]], etc.). Train with one hyperparameter setting, measure on validation, repeat, keep the best. This is **cross-validation**.
- **Test set** — used **once**, at the very end, to estimate true generalization. It stands in for "unseen data."

## Why not just tune on the test set?
Even if you *have* test labels, you must not pick hyperparameters by test performance. If you do, you've effectively **fit the test set** — your numbers look great, but you've lost the one honest estimate of how the model does on genuinely unseen data.

> **The radiologist analogy.** Train a network on a hospital's X-rays, tune until it scores well on the test X-rays — great accuracy. But a **new patient** walks in whose scans the model has never seen. Will it still work? That question — performance on the truly unseen — is *generalization*, and you can only estimate it if the test set was never used to make choices.

So: **train on train, tune on validation, report on test (once).** Test performance is a measure not just of accuracy but of **generalization**.

## Why generalization is hard → regularization
A model with enough parameters can memorize the training data (fit it perfectly) yet fail on new data — **overfitting**. Neural networks are especially prone to it: they're **over-parameterized "lazy learners"** that take shortcuts to explain limited data instead of learning the true pattern. Ensuring generalization is exactly what **overfitting and regularization** address — keep the network's capacity, but constrain *how* it uses that capacity.

See **[[Regularization]]** for the techniques: weight penalties (L2 / L1), dropout, and data augmentation.

## Related pages
- [[Neural Network]]
- [[Transfer Learning]]
- [[Convolutional Neural Network (CNN)]]
- [[ML Overview]]

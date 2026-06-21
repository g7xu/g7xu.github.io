**Summary**: Sub-index for the Machine Learning cluster, plus the foundations: what ML is, key terms, the three types (supervised / unsupervised / reinforcement), and the end-to-end ML pipeline.

**Last updated**: 2026-06-21

---

## Pages in this cluster

**Foundations**
- [[ML Architecture Families]] — broad categories of ML models (linear, tree-based, kernel, neural, etc.)

**Classical models**
- [[k-means Clustering]] — unsupervised clustering that builds the visual vocabulary
- [[Nearest-Neighbor Classification]] — NN / kNN classification, with pros and cons
- [[Bayesian Classification (MAP & ML)]] — generative classification via likelihood + prior (MAP vs. ML)

**Neural networks**
- [[Neural Network]] — perceptron → MLP, nonlinearity, and how it's trained (gradient descent, SGD, backprop)
- [[Convolutional Neural Network (CNN)]] — the image-specialized network: learned filters, weight sharing, pooling, softmax
- [[CNN Architectures]] — LeNet → AlexNet → VGG → ResNet; depth vs. width, 3×3 stacks, residual connections
- [[Vanishing & Exploding Gradients]] — why deep plain nets fail to optimize, gradient clipping, the residual pathway view

**Training & generalization**
- [[Generalization & Model Validation]] — train/validation/test and why you never tune on test
- [[Regularization]] — constrain capacity: L2/L1, dropout, data augmentation
- [[Transfer Learning]] — reuse a pretrained network for a new task; fine-tuning by data budget

**Frontier**
- [[Beyond CNNs — Modern CV Frontier]] — the frontier beyond CNNs (ViT, VLMs, diffusion, neural rendering); bridges into the robotics cluster

---

**Source:** [Types of Machine Learning – GeeksforGeeks](https://www.geeksforgeeks.org/machine-learning/types-of-machine-learning/)
# What is Machine Learning?
Machine Learning is teaching algorithm and system to learn patterns, make decisions and completing repetitive task for human. The training process usually require a large scale of data in different form.
# Terms
- Features: info used by algorithm to make prediction
- Labels: the ground truth answer
- Training: teaching model with the answer
- Inferencing: machine predicting the future
# Types of Machine Learning
![[types_of_machine_learning_tree_signed.svg|697]]
## Supervised Learning
trained on "Labeled Dataset"
- **Classification**: predict categorical outputs
- **Regression**: predict continuous values
## Unsupervised Learning
deal with unlabeled data, meaning there are no predefined outputs
- **Clustering**: grouping data points into clusters based on their similarity
- **Dimensionality Reduction Techniques**: feature reduction
- **Association Rule Learning**: relationships identification
## Reinforcement Learning
agent that makes a sequence of decisions through trial and error and actively interacting with an environment
# The ML Pipeline
1. Defining the scope of the problem
2. Data Collection
3. Data Processing (raw data -> clean data)
4. Feature Engineering: finding useful info to make prediction
5. Model Selection: identify the right [[ML Architecture Families|architecture]]
6. Training: train model
7. Evaluation: using direct and clear metrics to evaluate model (such as accuracy, precision/recall, F1 for classification, MSE/RMSE) — and on the right data split, to measure [[Generalization & Model Validation|generalization]] rather than memorization
8. Deployment and monitoring

## Related pages
- [[Generalization & Model Validation]]
- [[ML Architecture Families]]
- [[Neural Network]]
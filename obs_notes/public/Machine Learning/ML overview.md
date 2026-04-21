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
7. Evaluation: using direct and clear metrics to evaluate model (such as accuracy, precision/recall, F1 for classification, MSE/RMSE)
8. Deployment and monitoring
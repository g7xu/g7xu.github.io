# Broad Categories
- [[#Linear Models|Linear models]]: creating a straight-line (or hyperplane) using the features to predict the output
- [[#Tree-based Models|Tree-based models]]: recursively splitting data on feature thresholds (like a tree)
- [[#Instance-based Models|Instance-based]]: find the most similar existing case
- [[#Kernel Methods|Kernel methods]]: mapping data to another dimensional space to find the optimal boundary between classes
- [[#Probabilistic Models|Probabilistic models]]: making prediction based on likelihood
- [[#Neural Networks|Neural networks]]: making inference using stacked neural layers
# Linear Models
**Core mechanism** -- Predict the output with a weighted sum of input features plus a bias term. Training the model to find the right weight that minimize the prediction error
## Key Assumptions
- Linear relationship between features and target
- features are independent of each other
## Classic Algorithms
- Linear regression
- logistic regression
- ridge regression
- lasso regression
## Common Characteristic
- Fast to train
- scale well to large datasets
- interpretable features
## Use Case
- price or score prediction
- explainability matters as much as accuracy
# Tree-based Models
**Core mechanism** -- split the data based on feature thresholds with leave node holds a prediction
## Key Assumptions
- features used to split can effectively separate the data
## Classic Algorithms
- Decision trees
- Random forests
- XGBoots, LightGBM, CatBoost
## Common Characteristic
- can handle non-linear relationships 
- can handle messy and noise data
- good interpretability (trace the path of each tree)
- overfitting easily
- hard to handle high-dimensional sparse data
## Use Case
- customer churn prediction
- Fraud detection
# Instance-based Models
TODO...

# Kernel Methods
**Core mechanism** -- mapping data to higher-dimensional space via [[kernel function (TODO)]], creating non-linear decision boundary which makes different classes linearly separable, then find the maximum-margin boundary between them
## Key Assumptions
- valid kernel exist for the problem
- sensitive to feature scaling (TODO, need more explanation on this part)
## Classic Algorithms
- Support Vector Machines (SVM)
- Support Vector Regression (SVR)
- Kernel Ridge Regression
- Principal Component Analysis (PCA)
## Common Characteristic
- effective in high-dimensional spaces
- Memory-efficient
- Low interpretability
## Use Case
- Text classification
- Gene expression and cancer classification
- Protein structure and sequence analysis
# Probabilistic Models
**Core mechanism** -- making prediction by finding the most likely outcome given the observed evidence (Bayes' theorem)
## Key Assumptions
- data follows probability distribution
- more assumptions very depending on the algorithms
## Specific Algorithms
- Naive Bayes
- Hidden Markov Models
- Gaussian Mixture Models
- Bayesian networks
## Common Characteristic
- very sensitive to the breaks of assumptions
- high interpretability
## Use Case
- ...
# Neural Networks
**Core mechanism** -- stack layers of neurons and non-linear activation functions to make prediction. And train the model via backpropagation
## Key Assumptions
- scenario dependent 
## Specific Algorithms
- [[Convolutional Neural Network (CNN)]]
- RNN
- LSTM
- Transformers
- diffusion
- auto-encoder 
## Common Characteristic
- high data demand
- significant computing power
- low interpretability
## Use Case
- Large Language Model
- Computer Vision
- Speech to text

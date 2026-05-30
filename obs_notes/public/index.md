# Wiki Index

**Summary**: Table of contents for the entire wiki. Every reviewed page in `public/` is listed here with a one-line description.

**Last updated**: 2026-05-29

---

## Computer Vision

- [[Computer Vision Overview]] — entry point for the CV notes: image formation and the path to 3D reconstruction

### Image Formation & Geometry
- [[Image Formation & Photometry]] — how a camera turns a scene into pixels: optics, sensors, reflection models, BRDF, color
- [[Geometric Projection Model]] — pinhole camera model and the projection formula
- [[Camera Projection Pipeline]] — end-to-end mapping from a 3D world point to a 2D pixel
- [[Extrinsics]] — world-to-camera coordinate transformation (rotation + translation)
- [[From Image Plane to Pixel Coordinates]] — intrinsic matrix K and the image-to-pixel step
- [[Ideal Points]] — points at infinity and their role in projective geometry
- [[Lambertian Photometric Model]] — diffuse reflectance model and photometric stereo

### Features & Reconstruction
- [[Feature Detection]] — detecting corners and keypoints in images
- [[Feature Matching]] — matching detected features across views
- [[Two-View Reconstruction]] — recovering 3D structure from two images via epipolar geometry
- [[RANSAC]] — robust model fitting: estimating the fundamental matrix despite outlier matches

### Recognition & Retrieval
- [[Recognition & Vision Tasks]] — recognition as classification, task taxonomy, and the data-driven shift
- [[Discriminative vs Generative Methods]] — modeling the posterior vs. the likelihood/joint; the three pillars (representation, learning, inference)
- [[Image Retrieval (Bag of Words)]] — instance recognition via the bag-of-features pipeline
- [[Scaling Image Retrieval]] — making retrieval fast: inverted file index, TF-IDF, vocabulary tree

## Machine Learning

- [[ML Overview]] — what machine learning is and the main types of learning
- [[ML Architecture Families]] — broad categories of ML models (linear, tree-based, kernel, neural, etc.)
- [[k-means Clustering]] — unsupervised clustering that builds the visual vocabulary
- [[Nearest-Neighbor Classification]] — NN / kNN classification, with pros and cons
- [[Bayesian Classification (MAP & ML)]] — generative classification via likelihood + prior (MAP vs. ML)
- [[Neural Network]] — what a network is (perceptron → MLP, nonlinearity, universal approximation) and how it's trained (gradient descent, SGD, momentum, backprop)
- [[Convolutional Neural Network (CNN)]] — the image-specialized network: learned filters, convolution, weight sharing, feature volumes, pooling, receptive field, softmax
- [[Transfer Learning]] — reuse a pretrained network (e.g. ImageNet) for a new task; retrain-by-data-budget and fine-tuning
- [[Generalization & Model Validation]] — train/validation/test, why you never tune on test, and generalization vs. accuracy

## Information Retrieval

- [[Dense retrieval]] — bi-encoder vs. cross-encoder retrieval and training
- [[Retrieval-Augmented Generation (RAG)]] — scoring document relevance and the RAG pipeline

## Algorithms

- [[Dynamic Programming]] — thinking process and patterns for DP problems

## Web & Backend Development

- [[Spring Framework]] — advantages of Spring and core concepts
- [[JSP (Jakarta Server Pages)]] — MVC and server-side rendering with JSP
- [[MAVEN Java Dev Op]] — standard Java application build and dependency management
- [[Error Handling & Validation]] — exception handling across service layers
- [[OAuth 2.0]] — authorization protocol fundamentals (plus OIDC for authentication)
- [[HTML & CSS]] — document structure and styling basics
- [[React Programming Language]] — why React and core front-end concepts
- [[Deployment]] — web servers, containerization, and shipping applications
- [[Distributed System]] — definition and core concepts of distributed systems
- [[Software Development Lifecycle & System Design]] — system design approach and SDLC
- [[Git — Version Control Overview]] — core advantages and version-control workflow
- [[Unit Testing]] — why and how to test software

## Interview Cheat Sheets

- [[Technical Interview Checklist]] — general workflow for technical interviews
- [[Operating Systems (Interview Cheat Sheet)]] — OS concepts (user/kernel mode, process lifecycle)

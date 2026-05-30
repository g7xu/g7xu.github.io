**Summary**: The pinhole-camera projection formula (3D → 2D) and how homogeneous coordinates turn it into a single matrix multiply.

**Last updated**: 2026-05-29

---

The real world is 3D, but photos are 2D. Every time we capture an image, the 3D world "collapses" from three dimensions down to two — losing one dimension (depth). The Geometric Projection model explains exactly how that collapse happens
# How camera works
![[pinhole_camera_model.svg]]
# Projection Formula
$$(x, y, z) \rightarrow \left(-d\frac{x}{z},\ -d\frac{y}{z}\right)$$
where ^1b2ea1
- $(x,y)$ is coordinates ^0d2ac1
- $d$ is focal length
- $z$ is how far the object is from the pinhole
# Optimizing Projection Formula
We want to apply many transformations to millions of pixels as efficiently as possible, but division by z is not a matrix operation -- it breaks the chain, forcing us to process each transformation step by step for every points. To solve the issue, we use **Homogeneous coordinates**.
## The trick
### Homogenenous coordinates
- adding an extra coordinate at the end, so going from $(x, y) \Rightarrow \begin{bmatrix} x \\ y \\ 1 \end{bmatrix}$ and $(x, y, z) \Rightarrow \begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}$
- at the end, converting back from $\begin{bmatrix} x \\ y \\ w \end{bmatrix} \Rightarrow (x/w,\ y/w)$ and $\begin{bmatrix} x \\ y \\ z \\ w \end{bmatrix} \Rightarrow (x/w,\ y/w,\ z/w)$
- when the last coordinate $w = 0$, this conversion divides by zero — the point is at infinity. See [[Ideal Points]].
### Applying the trick
We write the 3D point in homogeneous form:
$$
\begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}
$$
We write the projection as matrix multiplication:
$$\begin{bmatrix} -d & 0 & 0 & 0 \\ 0 & -d & 0 & 0 \\ 0 & 0 & 1 & 0 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix} = \begin{bmatrix} -dx \\ -dy \\ z \end{bmatrix}$$
At the end of everything, we may divide by the last coordinate:
$$\begin{bmatrix} -dx \\ -dy \\ z \end{bmatrix} \rightarrow \left(-d\frac{x}{z},\ -d\frac{y}{z}\right)$$
### Main Reason
All the transformations can now be chained into one single matrix and applied to every point in one shot. The division by z is deferred to the very end -- keeping the entire pipeline as clean matrix multiplications.

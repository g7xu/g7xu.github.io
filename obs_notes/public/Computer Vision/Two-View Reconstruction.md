# Motivation 
Given two photographs of the same scene from different angles, can we recover a 3D geometry of the scene, and the relative position and orientation of the cameras

> [!question] Why are we doing this?
> Photograph is 2D projection where the depth information is lost and it is more useful if we can use geometric relationship between the two viewpoints to recover them

# Fundamental Concept
## Depth from disparity
$$Z_0 = \frac{d \cdot f}{x_L - x_R}$$
Where,
* $Z_0$ is depth: distance from the cameras to the 3D point. What you compute. Real-world units.
* $b$ is baseline: horizontal distance between the two camera centers. Known. Real-world units.
* $f$ is focal length: distance from each camera's optical center to its image plane. Known. Pixels.
* $X_0$ is the sideways position of the 3D point, measured from camera 1. Real-world units.
* $x_L$ is the pixel column where the point appears in the left image. Measured. Pixels.
* $x_R$ is the pixel column where the point appears in the right image. Measured. Pixels.
* $x_L - x_R$ is the disparity: how much the point shifts between the two images. Pixels.

The **Depth is inversely proportional to disparity**
## Cross-product as linear operator
$$\vec{a} \times \vec{b} = \|\vec{a}\| \|\vec{b}\| \sin\theta$$
after mathematical conversation, we can convert everything to:
$$[\mathbf{t}]_\times = \begin{bmatrix} 0 & -t_z & t_y \\ t_z & 0 & -t_x \\ -t_y & t_x & 0 \end{bmatrix}$$ $$\mathbf{t} \times \tilde{\mathbf{p}} = [\mathbf{t}]_\times \tilde{\mathbf{p}}$$
Why? -- matrix multiplication lets us combine them with other linear operations cleanly
## The Epipolar Geometry
- Epipolar plane: the plane containing the 3D point X and both camera centers
- Epipolar line: the intersection of the epipolar plane with the image planes. the matching point must lie somewhere along this line
- Epipolar(e1, e2): how image show up in corresponding image
### Define
- In camera 1 coordinates, 3D point X is given by $\mathbf{X}_1 = \lambda_1 \mathbf{p}$
- In camera 2 coordinates, 3D point X is given by $\mathbf{X}_2 = \lambda_2 \mathbf{p}$
- camera 2 related to camera 1 by $[R, t]$
- we define the following property:
$$
\begin{aligned} \mathbf{X}_2 &= RX_1 + t \\ \lambda_2 q &= \lambda_1 R p + t \\ \lambda_2 [\mathbf{t}]_\times \mathbf{q} &= \lambda_1 [\mathbf{t}]_\times \mathbf{R} \mathbf{p} \\ 0 &= \lambda_1 \mathbf{q}^\top [\mathbf{t}]_\times \mathbf{R} \mathbf{p} \\ 0 &= \mathbf{q}^\top E p \end{aligned}
$$
Where $E = [\mathbf{t}]_\times \mathbf{R}$ 
# System overview
Every two-view reconstruction system follows the same pattern:
- Step 1: [[Feature Detection|Detect features]] in each view
- Step 2: [[Feature Matching|Match features]] across two views
- Step 3: Estimate camera rotation and translation across views, finding $[R | t]$
- Step 4: Backproject rays from camera centers to triangulate 3D point
# Finding $[R|t]$
From the [[#The Epipolar Geometry]], we know that for any pair of matching point $p, q$ across two images, the equation $0 = \mathbf{q}^\top E p$ must hold. We can Find E which contains the transformation from the solving this equation
## About E
### DOF and rank of E
the Essential matrix E has 5 DOF because $3 + 3 -1$
- 3 Rotation: the camera orientation
- 3 Translation: the direction of the placement of the camera
- -1 scale ambiguity: we can't recover the unit
# Find $[R|t]$ under calibrated cameras
We need to account for camera's instinct parameters, so
- $p' = K_1p$ 
- $q' = K_2q$

And we are solving for:
$$\mathbf{q}'^\top \mathbf{F} \mathbf{p}' = 0$$
Where $F$ is called the fundamental matrix and $\mathbf{F} = \mathbf{K}_2^{-\top} \mathbf{E} \mathbf{K}_1^{-1}$
## About F
### Solve for F
- We can solve the problem with 7 matching points according to its DOF of 7
- We can estimate result with 8 or more points solving $\mathbf{A} \mathbf{f} \approx \mathbf{0}$, where $A$ is a stack of matching point rows:
$$
row_i = [x_2x_1, x_2y_1, x_2, y_2x_1, y_2y_1, y_2, x_1, y_1, 1]
$$
- And we we solve this above equation using Singular value decomposition

### DOF and rank of F
the Fundamental matrix F has 7 DOF because $9 - 1 - 1$
- -1 scale ambiguity: we can't recover the unit
- -1 rank constraint: the multiplication of F will produce a linear passing through the epipole line
### F as a function
We can use $F$ as a function calculating the epipolar line. Let $x$ be the point in the first image, then $I=F^Tx'$ is the epipolar line in the first image
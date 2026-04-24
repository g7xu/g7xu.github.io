The projection formula gives us a position in physical units — not pixels yet. K (the intrinsic matrix) bridges this gap by converting image plane coordinates into actual pixel coordinates.

# General Pipeline 
$$\text{pixel} = K \times \text{Projection} \times \begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}$$
where:
- $\begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}$ is the physical point
- $Projection$ is the [[Geometric Projection Model#Projection Formula|model here]]
- $K$ is the [[#K transformation|transformation]]
# K transformation
In general:
$$K = \begin{bmatrix} -d_x' & s & c_x' \\ 0 & -d_y' & c_y' \\ 0 & 0 & 1 \end{bmatrix}$$
Where:
- $\alpha = d_x / d_y$ — **aspect ratio**: are the pixels square? 
  (1 unless pixels are not square)
- $s$ — **skew**: are the pixels rectangular? 
  (0 unless pixels are shaped like rhombuses)
- $(c_x, c_y)$ — **principal point**: where is the center of the image? 
  (origin unless optical axis does not intersect image plane at center)
---
K is called **intrinsic** because these are fixed properties of the 
camera hardware -- they do not change regardless of where the camera 
is pointing.
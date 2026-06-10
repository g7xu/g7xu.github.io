**Summary**: The intrinsic matrix K that converts physical image-plane coordinates into pixels (focal length, skew, principal point).

**Last updated**: 2026-05-29

---

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
- $d_x'$, $d_y'$ — **focal length in pixel units** along the x and y axes. Their ratio $\alpha = d_x'/d_y'$ is the **aspect ratio**: are the pixels square? 
  (equal unless pixels are not square)
- $s$ — **skew**: are the pixels rectangular? 
  (0 unless pixels are shaped like rhombuses)
- $(c_x', c_y')$ — **principal point**: where is the center of the image? 
  (origin unless optical axis does not intersect image plane at center)
---
K is called **intrinsic** because these are fixed properties of the 
camera hardware -- they do not change regardless of where the camera 
is pointing.

## Related pages
- [[Geometric Projection Model]]
- [[Extrinsics]]
- [[Camera Projection Pipeline]]

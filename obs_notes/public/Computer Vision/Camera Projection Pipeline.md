The conversation pipeline that convert 3D worlds into 2D images.

The pipeline covers 3 major steps:
- [[Extrinsics#|standardization Process]]
- [[Geometric Projection Model|Camera Projection]]
- [[From Image Plane to Pixel Coordinates|internal translation]]

the Projection function:
$$\begin{aligned} \Pi &= K \underbrace{\begin{bmatrix} 1&0&0&0\\0&1&0&0\\0&0&1&0 \end{bmatrix}}_{\text{projection}} \underbrace{\begin{bmatrix} R & \mathbf{0}\\0&0&0&1 \end{bmatrix}}_{\text{rotation}} \underbrace{\begin{bmatrix} I_{3\times3} & -\mathbf{c}\\0&0&0&1 \end{bmatrix}}_{\text{translation}} \\ &= K[R \mid -Rc] \end{aligned}$$

Let $q=(x, y, z, 1)$ which is cord in the real world, we will
- $\Pi q$   
- Divide by the last coordinate to get the final 2D pixel coordinates 
$$\left(\frac{(\Pi q)_1}{(\Pi q)_3},\ \frac{(\Pi q)_2}{(\Pi q)_3}\right)$$

Normally, parallel lines never meet. But when a camera 
captures the world, parallel lines appear to converge toward a single 
point on the horizon. We call these points vanishing points or ideal points **How do we represent and handle this mathematically?**
# Mathematical Definition
In homogeneous coordinates, an ideal point is any point where the 
last coordinate w = 0:

$$(x, y, 0)^T$$

When you try to convert back to regular coordinates, you divide by w:

$$\left(\frac{x}{0},\ \frac{y}{0}\right) = \infty$$

Division by zero — the point is at infinity. It exists in projective 
space but not in regular Cartesian space.
# How to Find It
Given two parallel lines in homogeneous coordinates:

$$\mathbf{l} = (a, b, c)^T \quad \mathbf{l}' = (a, b, c')^T$$

Their intersection is given by the cross product:

$$\mathbf{x}_\infty = \mathbf{l} \times \mathbf{l}' = (c - c')(-b, a, 0)^T \sim (-b, a, 0)^T$$

The last coordinate is always 0 — confirming this is an ideal point 
regardless of what c and c' are.
### The Line at Infinity
All ideal points have the form $(x, y, 0)^T$. There is one special 
line that contains ALL ideal points — the line at infinity:

$$\mathbf{l}_\infty = (0, 0, 1)^T$$

**Proof** — a point lies on a line if $\mathbf{l}^T\mathbf{x} = 0$:

$$(0, 0, 1) \cdot (x, y, 0) = 0 + 0 + 0 = 0$$

Works for every ideal point regardless of x and y.
# Use Case
TODO: can do some research and put more use case
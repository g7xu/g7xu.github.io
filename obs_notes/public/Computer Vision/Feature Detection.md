Extracting **unique/meaningful/unusual parts from the image**, serving as the foundation of tasks such as panorama stitching and depth estimation
# Down stream application of feature detection
- Panorama stitching
- Stereo depth estimation
- Autonomous driving
- Image matching
- Object recognition
# Detecting Usual -- Sliding window technic
Creating a sliding window (kernel), monitor the change of the window value as the window slide. Basically, we are trying to answer the question if I move this window slightly, how much do the pixels inside it change?
## Three Scenario
![[feature_detection_cases.svg|697]]
- Flat feature: window movement doesn't matter
- Edge feature: window movement in one direction cause the change
- Corner feature: window movement anywhere would change the feature
# Smoothing
It is a important and common operations that usually performed in the first step to resolve the noise in the image.

Gaussian kernel for 3D model: 
$$G(x,y) = \frac{1}{2\pi\sigma^2} e^{-\frac{x^2 + y^2}{2\sigma^2}}$$
--- start-multi-column
ID: gaussian-smoothing
number of columns: 2
column size: [50, 50]
---

**Gaussian Smoothing**

A discrete approximation to a Gaussian kernel with variance 1

--- column-break ---

<div style="display:flex; align-items:center; justify-content:center; gap:1rem;">

<div>

$$\frac{1}{273}$$

</div>

<table style="text-align:center; font-size:0.95rem; border-collapse:collapse;">
  <tr>
    <td style="padding:0.5rem; border:1px solid gray;">1</td>
    <td style="padding:0.5rem; border:1px solid gray;">4</td>
    <td style="padding:0.5rem; border:1px solid gray;">7</td>
    <td style="padding:0.5rem; border:1px solid gray;">4</td>
    <td style="padding:0.5rem; border:1px solid gray;">1</td>
  </tr>
  <tr>
    <td style="padding:0.5rem; border:1px solid gray;">4</td>
    <td style="padding:0.5rem; border:1px solid gray;">16</td>
    <td style="padding:0.5rem; border:1px solid gray;">26</td>
    <td style="padding:0.5rem; border:1px solid gray;">16</td>
    <td style="padding:0.5rem; border:1px solid gray;">4</td>
  </tr>
  <tr>
    <td style="padding:0.5rem; border:1px solid gray;">7</td>
    <td style="padding:0.5rem; border:1px solid gray;">26</td>
    <td style="padding:0.5rem; border:1px solid gray;"><b>41</b></td>
    <td style="padding:0.5rem; border:1px solid gray;">26</td>
    <td style="padding:0.5rem; border:1px solid gray;">7</td>
  </tr>
  <tr>
    <td style="padding:0.5rem; border:1px solid gray;">4</td>
    <td style="padding:0.5rem; border:1px solid gray;">16</td>
    <td style="padding:0.5rem; border:1px solid gray;">26</td>
    <td style="padding:0.5rem; border:1px solid gray;">16</td>
    <td style="padding:0.5rem; border:1px solid gray;">4</td>
  </tr>
  <tr>
    <td style="padding:0.5rem; border:1px solid gray;">1</td>
    <td style="padding:0.5rem; border:1px solid gray;">4</td>
    <td style="padding:0.5rem; border:1px solid gray;">7</td>
    <td style="padding:0.5rem; border:1px solid gray;">4</td>
    <td style="padding:0.5rem; border:1px solid gray;">1</td>
  </tr>
</table>

</div>

--- end-multi-column
# Edge detection
finding edge of the image via measuring the change of values in all the direction. Assuming h = 1 (h is how far away fix pixel you are going to look at the image)
--- start-multi-column
ID: derivatives
number of columns: 2
column size: [55, 45]
---
x-derivative at $(x_0, y_0)$:
$$dx = \frac{I(x_0+1, y_0) - I(x_0-1, y_0)}{2}$$
y-derivative at $(x_0, y_0)$:
$$dy = \frac{I(x_0, y_0+1) - I(x_0, y_0-1)}{2}$$

--- column-break ---

<table style="width:100%; text-align:center; font-size:1rem; border-collapse:collapse;">
  <tr>
    <td style="padding:1rem;"></td>
    <td style="padding:1rem; border:1px solid gray;"><b>(x₀, y₀-1)</b></td>
    <td style="padding:1rem;"></td>
  </tr>
  <tr>
    <td style="padding:1rem; border:1px solid gray;">(x₀-1, y₀)</td>
    <td style="padding:1rem; border:1px solid gray;"><b>(x₀, y₀)</b></td>
    <td style="padding:1rem; border:1px solid gray;">(x₀+1, y₀)</td>
  </tr>
  <tr>
    <td style="padding:1rem;"></td>
    <td style="padding:1rem; border:1px solid gray;"><b>(x₀, y₀+1)</b></td>
    <td style="padding:1rem;"></td>
  </tr>
</table>

--- end-multi-column
We can actually compute the derivative in dot product form across the entire message：
$$I(x,y) * h = \sum_{i=-a}^{a} \sum_{j=-b}^{b} I(x-i, y-j) \cdot h(i,j)$$The convolution in practice is done via efficient
## Common Expression
The gradient of a single point can be defined as:
$$\nabla f = \left[\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right]$$
The gradient direction is:
$$\theta = \tan^{-1}\left(\frac{\partial f}{\partial y}\bigg/\frac{\partial f}{\partial x}\right)$$
The edge strength is can be found via:
$$||\nabla f|| = \sqrt{\left(\frac{\partial f}{\partial x}\right)^2 + \left(\frac{\partial f}{\partial y}\right)^2}$$
# Corner Detection
In the case of corner, we are observing the change of value within a tiny batch scene. There is no obvious pattern at the exact corner point where two directions meet. Instead, we are interested in the points near corner, which the gradient is more likely to have two different values. At the region near corner, the gradients point in two clearly different directions, neither one or zero
## Implementation
We are actually going to implement this with 2nd-moment matrix
$$
M = \sum_{(x,y) \in W} \begin{bmatrix} I_x^2 & I_x I_y \\ I_x I_y & I_y^2 \end{bmatrix}
$$
where:
- $I_x$: is the partial derivative of $I(x,y)$ 
- $I_y$: is the partial derivative of $I(x,y)$

**Top-left:** $\sum_W I_x^2$ 
- How much horizontal intensity change is happening in the window
- Bigger number means pixel change sharply from left-to-right

**Bottom-right:** $\sum I_y^2$
- How much vertical intensity change is happening in the window
- Bigger number means pixel change sharply from top-to-bottom

**Off-diagonals:** $\sum I_x I_y$
- How much diagonal-edge stuff is in this window, and which way does it tilt

> [!question] What about the tilted corner?
> Every corner is just a rotation of axis aligned corner, so we can always decompose any symmetric matrix into rotational and diagonal matrix.
$$C = Q^{-1} \begin{bmatrix} \lambda_1 & 0 \\ 0 & \lambda_2 \end{bmatrix} Q$$
## Step by step corner detection
**Step 1.** Run small window and compute spatial gradient matrix
**Step 2.** Applying non-maximal suppression to the create R
**Step 3.** Filtering with a threshold value



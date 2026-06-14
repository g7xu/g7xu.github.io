**Summary**: Photometric stereo end-to-end: recovering surface normals and albedo from several images under known lighting (assuming a matte Lambertian surface), then **recovering the 3D surface from the normals** — normals → slopes → integration, the integrability problem, and the least-squares fix.

**Last updated**: 2026-06-11

---

Model we use to convert an image to 3D Model
## Motivation

> [!question] Why not inferencing 3D from one image?
> The formation of an image can be contributed to by factors such as the distance from the light source, the brightness of the light source, the reflectiveness of the surface, and so on. A single pixel of one image is baked with all of this information. If we just use a single image to infer the 3D model, then the result will be random as hell.

> [!question] Why not inferencing 3D from multiple random images of the same object?
> As we discussed earlier, the brightness of a pixel can depend on multiple factors. Getting an accurate 3D model is like running a controlled experiment, where you have to keep most variables fixed and only a few changeable.

## The  Lambertian Photometric Model
To implement this controlled experiment, we will use the Lambertian Photometric model. One key assumption of the Model is that the surface is **matte** (the surface reflect equally regardless of viewing angle).

**The full assumption list** (each one keeps the "controlled experiment" controlled):
- We can **control the lighting** — observe the object under **3 or more** light sources
- Light sources are **distant, directional point lights** (each light is a single known direction $s^k$ for the whole scene)
- Object is **small relative to its distance from the camera**
- Object material is **Lambertian** (matte — no specular highlights)
- Object is **far from all other reflecting surfaces** (no inter-reflections contaminating the measurement)

The brightness of each pixel is described by:
$$
I_k(x,y) = ρ(x,y) * n̂(x,y) · sᵏ
$$
Where:
- $I_k(x,y)$: the brightness of coordinate $(x, y)$ (known; we measure) 
- $ρ(x,y)$: how reflective the surface is (unknown)
- $n̂(x,y)$: the normal direction of the surface (unknown; critical information we want)
- $sᵏ$: the direction of light k (known; we control)


By stacking at least 3 images with different known lighting directions, we get enough equations to solve for the unknowns - giving us the surface normals and albedo at every pixel. The more images (light directions) we provide, the more robust our solution becomes. 
## Solving LP Model in actually application
### Step 1. Simplify
Define:
$$b(x,y) = \rho(x,y) \cdot \hat{n}(x,y)$$

Since $\rho$ is a constant and $\hat{n}$ is a vector,
$$
b(x,y) = \begin{bmatrix} \rho n_1 \\ \rho n_2 \\ \rho n_3 \end{bmatrix}
$$
### Step 2. New equation
We now are trying to solve for:
$$I^k(x,y) = b(x,y) \cdot s^k = \begin{bmatrix} \rho n_1 \\ \rho n_2 \\ \rho n_3 \end{bmatrix} \cdot \begin{bmatrix} s^k_1 \\ s^k_2 \\ s^k_3 \end{bmatrix}$$
### Step 3. Stack for matrix form
With K images, we can stack them for fast computation. We have:
$$\begin{bmatrix} I^1(x,y) \\ I^2(x,y) \\ I^3(x,y) \end{bmatrix} = \begin{bmatrix} s^1_1 & s^1_2 & s^1_3 \\ s^2_1 & s^2_2 & s^2_3 \\ s^3_1 & s^3_2 & s^3_3 \end{bmatrix} \begin{bmatrix} \rho n_1 \\ \rho n_2 \\ \rho n_3 \end{bmatrix}$$
We can simplify the representation to:
$$I = Sb$$
Where:
- $I$ is the measured brightness values (known)
- $S$ is the matrix of light directions (known)
- $b$ is what we are solving for (unknown)
### Step 4. Solving for b
We will use Least squares to find the value of b that minimizes the total error between the brightness values our model predicts and the brightness values the camera actually measured.

We can solve for b with the following equation:
$$b = (S^TS)^{-1}S^TI$$
### Step 5. Get albedo and normal value
- $\rho(x,y) = \|b(x,y)\|$ (we are scaling a unit vector, the length is the scaler)
- $\hat{n}(x,y) = \frac{b(x,y)}{\|b(x,y)\|}$ (typical way of finding the unit vector)
### Step 6. Repeat this for every single pixel

## Recovering the surface from normals
Steps 1–6 give a **normal map** — a normal and albedo at every pixel. The final step of photometric stereo turns those normals into the actual **3D surface**: the height map $z(x,y)$.

### Normals are slopes in disguise
Write every surface point as $s(x,y) = (x, y, z(x,y))$ — the image plane gives $x, y$; the unknown is the depth $z$. The two tangent vectors of this surface are $t_1 = (1, 0, \tfrac{\partial z}{\partial x})$ and $t_2 = (0, 1, \tfrac{\partial z}{\partial y})$, and the normal is their cross product:
$$n = t_1 \times t_2 = \left(-\tfrac{\partial z}{\partial x},\; -\tfrac{\partial z}{\partial y},\; 1\right)$$

Invert that relationship and the measured unit normal hands you the **surface slopes** at each pixel:
$$\frac{\partial z}{\partial x} = \frac{-\hat{n}_1}{\hat{n}_3} \qquad \frac{\partial z}{\partial y} = \frac{-\hat{n}_2}{\hat{n}_3}$$

So the problem becomes: **recover $z(x,y)$ given estimates of its two partial derivatives** (call them $p = \tfrac{\partial z}{\partial x}$, $q = \tfrac{\partial z}{\partial y}$).

### A simple approach: integrate along paths
Slopes tell you height *differences*, so sum them up:
1. **Integrate $p$ along row 0** to get the top row of heights: $z(k{+}1, 0) = z(k, 0) + z_x(k, 0)$
2. **Integrate $q$ down each column**, starting from the row-0 value

(The result is relative — heights up to an unknown constant offset of the starting corner.)

### The catch: integrability
Height by integration is a **path integral** from a start point: $z(x,y) = z(x_0,y_0) + \int (p\,dx + q\,dy)$. For a *true* height function, the path shouldn't matter — going around any closed loop must return you to the same height, which requires the **mixed partials to agree**:
$$\frac{\partial p}{\partial y} = \frac{\partial q}{\partial x} \quad\left(= \tfrac{\partial^2 z}{\partial x \partial y}\right)$$
But $p$ and $q$ were estimated **independently at every pixel** from noisy normals, so this **integrability constraint** can fail — different integration paths give different heights, like an Escher staircase that climbs forever and still meets itself.

### The fix: least-squares surface fitting
Instead of trusting one path, find the surface whose slopes **best match** the measured gradient field everywhere:
$$\iint_{\text{Image}} (z_x - p)^2 + (z_y - q)^2 \; dx\, dy \;\to\; \min$$
where $z_x, z_y$ are the derivatives of the *fitted* surface. Solved by calculus of variations (iterative optimization); because the solution is an actual height function, **integrability is satisfied automatically** [Horn, *Robot Vision*, 1986]. Note the pattern: this is the same move as Step 4 — when noisy measurements over-determine the problem, fit by least squares rather than solving exactly.

**Full pipeline:** K images under known lights → $b = (S^TS)^{-1}S^TI$ per pixel → normals $\hat n$ + albedo $\rho$ → slopes $p, q$ → integrate / least-squares fit → surface $z(x,y)$.

## Related pages
- [[Image Formation & Photometry]]
- [[Geometric Projection Model]]
- [[Computer Vision Overview]]

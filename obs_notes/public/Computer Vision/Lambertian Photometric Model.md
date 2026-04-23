Model we use to convert an image to 3D Model
## Motivation

> [!question] Why not inferencing 3D from one image?
> The formation of an image can be contributed to by factors such as the distance from the light source, the brightness of the light source, the reflectiveness of the surface, and so on. A single pixel of one image is baked with all of this information. If we just use a single image to infer the 3D model, then the result will be random as hell.

> [!question] Why not inferencing 3D from multiple random images of the same object?
> As we discussed earlier, the brightness of a pixel can depend on multiple factors. Getting an accurate 3D model is like running a controlled experiment, where you have to keep most variables fixed and only a few changeable.

## The  Lambertian Photometric Model
To implement this controlled experiment, we will use the Lambertian Photometric model. One key assumption of the Model is that the surface is **matte** (the surface reflect equally regardless of viewing angle). 

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


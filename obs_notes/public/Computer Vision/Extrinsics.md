A process of standardization ^7b2cf4
# Problem
There **TWO** coordinate system when we are talking pictures -- the camera coordinate system and the world coordinate system. Me must standardize both info when handling problem that involve both systems.
# Converting Process
Reference to the projection formula:
![[Geometric Projection Model#^1b2ea1]]
![[Geometric Projection Model#^0d2ac1]]

We need to standardize them before doing projection
## Step 1. Finding positions
- **Camera position** — where is the camera in the world?
- **Camera orientation** — which direction is the camera facing?
## Step 2. Translate
Move the origin of the world to where the camera is sitting.
$$T = \begin{bmatrix} I_{3\times3} & -\mathbf{c} \\ 0 & 0 & 0 & 1 \end{bmatrix}$$
where:
- $c$ is the world position vector of camera
## Step 3. Rotate
Rotate everything so the camera axes align with the world axes. 
$$R = \begin{bmatrix} \mathbf{u}^T \\ \mathbf{v}^T \\ \mathbf{w}^T \end{bmatrix}$$
where $u$, $v$, $w$ are the camera's axis directions
## Step 4. Combine everything

Now the camera sits at the origin looking down the correct axis — 
exactly what the projection formula expects.

$$\text{Extrinsics} = R \times T$$
where:
- $T$ is translation matrix (camera position)
- $R$ is rotation matrix (camera orientation)

At the end, we have
$$(x, y, z) \rightarrow (x_{cam}, y_{cam}, z_{cam})$$
> [!question] Are translation and rotation interchangeable? 
> No, rotation would spins around the origin. Rotation first, would cause the world point spin around the world origin.


# RANSAC (Robust Model Fitting)

**Summary**: RANSAC (RANdom SAmple Consensus) fits a model to data that contains outliers by repeatedly fitting to minimal random samples and keeping the model with the most inliers. In computer vision it is the standard way to estimate the fundamental matrix from noisy feature matches.

**Last updated**: 2026-05-29

---

## Noise vs. outliers
Every real measurement process is imperfect, and the two kinds of error are handled very differently:

- **Noise** — small jitter around the true value (a feature lands a pixel or two off). You beat noise with **more observations** — averaging many measurements, the same way [[Lambertian Photometric Model|photometric stereo]] uses more light sources.
- **Outliers** — *gross* mistakes (a totally wrong match). More observations do **not** help: a single bad measurement can wreck the estimate. You must make a **hard decision** to detect and discard outliers before estimating.

Examples of how outliers sneak in: repetitive structure (all the windows on a building look the same → a point gets mismatched), or a sensor failure (a black image vs. a black image gives a perfect-SSD match that is completely meaningless). Because outliers come from *unmodeled* sources, you can't predict where they are — so don't over-engineer; **let statistics do the heavy lifting**.

## The intuition: fitting a line
A line is defined by **2 points** (its degrees of freedom). Given a cloud of points that mostly lie on a line plus some outliers:

1. Randomly pick 2 points → they define a candidate line (a **hypothesis**)
2. Count how many other points are **consistent** with it (the **inliers** / **consensus**)
3. A bad pick gets few inliers (e.g. 3); a good pick gets many (e.g. 20)
4. Repeat, and keep the hypothesis with the most inliers

The winning hypothesis is a good explanation of the data.

## The RANSAC algorithm (general form)
1. Randomly choose **s** samples — typically *s* = the minimum sample size needed to fit the model
2. Fit a model to those *s* samples
3. Count the **inliers** that approximately fit the model
4. Repeat **N** times
5. Choose the model with the **largest set of inliers**

"Random sample consensus": we randomly draw samples, fit the model, and measure the **consensus** of the rest of the data with that model.

## Application: estimating the fundamental matrix
The [[Two-View Reconstruction#About F|fundamental matrix F]] is the model that relates corresponding points across two views (and decomposes into the camera rotation and translation). Matches come from [[Feature Matching|feature matching]], which produces outliers — so the **overall plan is to use F itself as the model to remove outliers**: find the F most points are consistent with (inliers), then drop the rest (outliers).

For **N** iterations:
- Pick **8** pairs of correspondences (the [[Two-View Reconstruction#Solve for F|DLT / 8-point]] minimal set)
- Estimate an **F** from these 8
- Count inliers — the other correspondences where the epipolar constraint $\mathbf{x}_1^\top \mathbf{F}\, \mathbf{x}_2 \approx 0$ (below a threshold)
- Keep the **F** with the most inliers

## How many iterations N?
There is no guarantee, but for a target **probability of correctness** *p* you can compute *N* adaptively from the outlier proportion:

$$N = \frac{\log(1-p)}{\log\!\left(1-(1-\epsilon)^{s}\right)}$$

where *p* = desired confidence, $\epsilon$ = fraction of outliers, *s* = sample size.

*N* values for **p = 0.99**:

| sample size *s* | 5%  | 10% | 20% | 30% | 40% | 50%  |
| --------------- | --- | --- | --- | --- | --- | ---- |
| 2               | 2   | 3   | 5   | 7   | 11  | 17   |
| 4               | 3   | 5   | 9   | 17  | 34  | 72   |
| 8               | 5   | 9   | 26  | 78  | 272 | 1177 |

The striking takeaway: even with **20% outliers**, fitting F (s = 8) needs only **26 draws** for 99% confidence — that is the power of statistics. Reading down a column, larger sample size *s* (more model DOF) needs more draws; reading across a row, more outliers needs more draws.

## Why degrees of freedom matter (8-point vs. 7-point)
F has **7 degrees of freedom**, so in principle 7 correspondences suffice — but the 7-point method must enforce the nonlinear **rank constraint** ($\det \mathbf F = 0$, a cubic), which is expensive to solve. The **8-point DLT** drops the rank constraint and stays **linear** (solvable fast via SVD), at the cost of one extra correspondence.

This trade-off is the *real* reason DOF matters for **robust** estimation: RANSAC runs the inner solver many, many times. For a self-driving car solving structure-from-motion at 30 fps, each F estimate has a budget of roughly **1 ms**, so a fast linear solver in the inner loop beats a minimal-but-nonlinear one. With robust estimation, the number of times you estimate matters more than the cost of a single perfect estimate.

## Related pages
- [[Two-View Reconstruction]]
- [[Computer Vision Overview]]
- [[Feature Matching]]
- [[Recognition & Vision Tasks]]

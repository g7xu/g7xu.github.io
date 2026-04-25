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
## Common Expression
The gradient of a single point can be defined as:
$$\nabla f = \left[\frac{\partial f}{\partial x}, \frac{\partial f}{\partial y}\right]$$
The gradient direction is:
$$\theta = \tan^{-1}\left(\frac{\partial f}{\partial y}\bigg/\frac{\partial f}{\partial x}\right)$$
The edge strength is can be found via:
$$||\nabla f|| = \sqrt{\left(\frac{\partial f}{\partial x}\right)^2 + \left(\frac{\partial f}{\partial y}\right)^2}$$





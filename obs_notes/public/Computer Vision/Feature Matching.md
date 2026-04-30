
**Interest Point**:
- localized position
- Informative about image content
- Repeatable under variation
- example: [[Feature Detection#Corner Detection|Corner]]

**Descriptor**: function that handle the information around the interest point
- so we can actually compare them
- example
	- Sum of Squared Differences (SSD) $\sum_{x,y} |W_1(x,y) - W_2(x,y)|^2$
	- Normalized Cross Correlation (NCC) $\sum_{x,y} \frac{(W_1(x,y) - \overline{W_1})(W_2(x,y) - \overline{W_2})}{\sigma_{W_1} \sigma_{W_2}}$
- sometimes, we might have ambiguity match where a lot of features from image 2 are similar to image 1. Thus, how do we measure the significance level, via the ratio distance: $SSD(f_1, f_2) / SSD(f_1, f_2')$

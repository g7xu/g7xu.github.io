“building the next solution using the previous outcome”
# Thinking process
1. Brute Force
2. optimization with memo (using space to exchange time)
	1. saving computation result to hashmap
3. optimization space with bottom up strategy
# Planning
1. What does dp\[i\] mean
2. Where do we start?
	1. top down: start with the biggest problem, recursively calling the smaller one (usually involve call stack)
	2. bottom up:  from the smallest problem (array/table)
3. Define DP rule （getting dp\[i\] using dp\[i-1\])
4. Find base case (dp\[0\] and dp\[1\])
# Classic Question type
- Maximum, Minimum, Longest, shortest...
- Best way to...
- Making repetitive decisions (ex. climbing stairs) 
# Complexity
- time complexity: can be high since trying every single possibilities 
- space complexity: needs to save all combinations

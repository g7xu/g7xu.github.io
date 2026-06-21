**Summary**: Interview strategy for linked-list problems — the recurring patterns and when to reach for each. Companion to [[Dynamic Programming]].

**Last updated**: 2026-06-21

---

Linked-list questions are pattern-heavy: most reduce to a handful of moves. Spot the pattern, and the code follows.

## Core patterns

### Dummy / sentinel head
- Allocate a `dummy` node before `head`; return `dummy.next`.
- **When**: the head itself might change or be removed (delete nodes, merge lists, insert at front). Removes the special-case for an empty/changing head.

### Two pointers — fast & slow
- Move `slow` 1 step and `fast` 2 steps. When `fast` reaches the end, `slow` is at the middle.
- **When**: find the middle, detect a cycle (Floyd's), or find the cycle entry.
- **Split**: once `slow` is at the middle, cut `slow.next` to break the list into two halves.

### Two pointers — gap / offset
- Advance one pointer `k` steps first, then move both together.
- **When**: nth node from the end, remove nth-from-end in one pass.

### In-place reversal
- Walk with `prev`, `curr`, `next`; flip the direction with `curr.next = prev` each step.
- **When**: reverse the whole list or a sub-range; palindrome check (reverse second half).

### Runner / merge
- Compare nodes from two lists and splice into a result (often built on a dummy head).
- **When**: merge two sorted lists, merge k lists.

## Edge cases to always check

- [ ] empty list (`head is None`)
- [ ] single node
- [ ] two nodes (off-by-one in fast/slow)
- [ ] operating on head vs. tail
- [ ] losing the `next` pointer before relinking (save it first)

## Complexity

- Most single-pass patterns: **O(n) time, O(1) space**.
- Reversal and cycle detection are O(1) extra space; recursion uses O(n) stack.

## Related pages

- [[Dynamic Programming]]
- [[Technical Interview Checklist]]

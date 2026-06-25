**Summary**: Interview strategy for linked-list problems — the recurring patterns and when to reach for each. Companion to [[Dynamic Programming]].

**Last updated**: 2026-06-22

---

Linked-list questions are pattern-heavy: most reduce to a handful of moves. Spot the pattern, and the code follows. *Cross-problem fundamentals — when a problem breaks, check if it's really one of these.*

## Strategies to try first

1. **Reframe as a linked list** — if values can act as "next" pointers (array of `1..n`, `i → nums[i]`), it's a linked-list problem in disguise. See [[#Index-as-pointer trick (array → linked list)]].
2. **Floyd's cycle detection** — go-to for *detect cycle / find entrance / find duplicate / find middle*, all in **O(1) space**. See [[#Floyd's cycle detection (tortoise & hare)]].

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
- Walk with `prev`, `curr`, `next`; **save `curr.next` BEFORE flipping**, then `curr.next = prev`, advance both.
- **When**: reverse the whole list or a sub-range; palindrome check (reverse second half).
- **Reused in**: 143 (reorder), 234 (palindrome), 92 (reverse II), 25 (reverse k-group).

### Runner / merge
- Compare nodes from two lists and splice into a result (often built on a dummy head).
- **When**: merge two sorted lists, merge k lists.

## Floyd's cycle detection (tortoise & hare)

The interview-ready, O(1)-space technique behind *detect cycle / find entrance / find duplicate / find middle*.

- **Phase 1 — detect:** `slow` +1, `fast` +2. They meet ⇒ cycle. `fast` reaches `null` ⇒ no cycle.
- **Phase 2 — entrance:** reset `slow` to the **head**, move **both +1** → they meet at the cycle's entrance.

**The invariant to remember:** distance(`head → entrance`) **=** distance(`meeting point → entrance`).
- Proof: a = head→entrance, b = entrance→meeting, c = meeting→entrance. slow travels `a+b`; fast travels `2(a+b)` = `a+b + loops` ⇒ `a+b` = loop length ⇒ **a = c**. Equal ⇒ both +1 meet at entrance.

```python
# Linked list — detect + find entrance
def detectCycle(head):
    slow = fast = head
    while fast and fast.next:
        slow, fast = slow.next, fast.next.next
        if slow == fast:                 # cycle found
            slow = head
            while slow != fast:
                slow, fast = slow.next, fast.next
            return slow                  # entrance
    return None                          # no cycle

# Array (index = pointer) — note do-while shape since slow/fast start equal
def findDuplicate(nums):
    slow = fast = nums[0]
    while True:
        slow, fast = nums[slow], nums[nums[fast]]
        if slow == fast: break
    slow = nums[0]
    while slow != fast:
        slow, fast = nums[slow], nums[fast]
    return slow
```

**Interview triggers:** "does it loop?" · "where does the loop start?" · "find the duplicate, O(1) space, don't modify" · "find the middle" · "palindrome list".

**Pitfalls:** (1) guard `while fast and fast.next`; (2) array version needs the do-while shape; (3) Phase 2 moves both by **one**, not two.

**Used in:** 287 (find duplicate) · 142 (cycle II) · 141 (cycle detect) · 876 (middle) · 234 (palindrome list).

## Index-as-pointer trick (array → linked list)

- For an array of values in `[1..n]` (or `[0..n]`) over `n+1` slots, treat **index = node, value = the "next" pointer**: `i → nums[i]`.
- By pigeonhole there **must be a cycle**, and the **cycle entrance = the duplicate value**.
- This is what lets you run Floyd's cycle detection on a plain array with O(1) space (→ 287).

## Edge cases to always check

- [ ] empty list (`head is None`)
- [ ] single node
- [ ] two nodes (off-by-one in fast/slow)
- [ ] operating on head vs. tail
- [ ] losing the `next` pointer before relinking (save it first)

## Complexity

- Most single-pass patterns: **O(n) time, O(1) space**.
- Reversal and cycle detection are O(1) extra space; recursion uses O(n) stack.

## Problem notes

- [[143 — Reorder List]] — find middle → reverse second half → merge
- [[287 — Find the Duplicate Number]] — index-as-pointer + Floyd's cycle detection

## Related pages

- [[Dynamic Programming]]
- [[Technical Interview Checklist]]

# 19.3 Google Sheet: Topological Sorting & Cycle Detection

**Difficulty**: `Hard`  
**Estimated Time**: 25–30 minutes

## Goal

When you edit cell `A1`, you need to know **which other cells are affected** and **in what order** they should be recomputed. This is a classic **Topological Sorting** problem. Additionally, you must detect **circular dependencies** (e.g., `A1 = B1` and `B1 = A1`).

> **What you'll learn**: BFS graph traversal, Kahn's algorithm for topological sorting, and cycle detection in directed graphs.

## The Big Picture

```text
 19.1          19.2           19.3          19.4         19.5       19.6
┌──────┐    ┌─────────┐    ┌────────┐    ┌──────┐    ┌──────────┐ ┌────┐
│ Data │───►│ Compile │───►│ Topo   │───►│ Eval │───►│Recompute │►│ UI │
│Struct│    │ & Deps  │    │ Sort   │    │      │    │ Pipeline │ │    │
└──────┘    └─────────┘    └────────┘    └──────┘    └──────────┘ └────┘
                            ▲ YOU ARE HERE
```

## Background: Why Topological Sorting?

Consider this spreadsheet:

```text
  ┌─────┬──────────┬──────────┬──────────┐
  │     │    A     │    B     │    C     │
  ├─────┼──────────┼──────────┼──────────┤
  │  1  │   10     │  =A1+5   │  =B1*2   │
  └─────┴──────────┴──────────┴──────────┘
```

The dependency graph looks like:

```text
  A1 ───► B1 ───► C1
```

If the user changes `A1` to `20`:

- `B1` must be recomputed **before** `C1` (because C1 depends on B1's new value)
- If we computed C1 first, it would use B1's **stale** value — wrong!

**Topological sorting** gives us a safe evaluation order: `[A1, B1, C1]`.

### What About Cycles?

```text
  A1 = "=B1"    B1 = "=A1"

  A1 ───► B1
   ▲       │
   └───────┘    ← CYCLE! Neither can be computed first.
```

Cells trapped in a cycle can never be resolved. We mark them with `#CYCLE!`.

## Background: Kahn's Algorithm

Kahn's algorithm finds a topological ordering by repeatedly removing nodes with no incoming edges:

```text
    GRAPH           IN-DEGREES         QUEUE         RESULT (ORDER)
 ┌─────────┐      ┌───────────┐      ┌───────┐      ┌─────────────┐
 │ A1──►B1 │      │ A1: 0     │      │ [A1]  │      │ [A1, B1, C1]│
 │ B1──►C1 │      │ B1: 1     │      └───────┘      └─────────────┘
 └─────────┘      │ C1: 1     │
                  └───────────┘
```

### Step-by-Step Walkthrough

Let's trace through the algorithm with `A1 → B1 → C1`:

**Phase 1: Find the affected set** (BFS from the edited cell using `rev`)

```text
Start: A1 was edited
  rev(A1) = {B1}     → add B1 to affected
  rev(B1) = {C1}     → add C1 to affected
  rev(C1) = {}       → done

Affected set = {A1, B1, C1}
```

**Phase 2: Calculate in-degrees** (count deps within the affected set)

```text
For each cell in affected, count how many of its deps are ALSO in affected:

  A1: deps = {}           → in-degree = 0  (no deps in affected set)
  B1: deps = {A1}         → in-degree = 1  (A1 is in affected set)
  C1: deps = {B1}         → in-degree = 1  (B1 is in affected set)
```

**Phase 3: Process queue**

```text
Queue starts with in-degree 0 nodes: [A1]

  Pop A1 → order = [A1]
    rev(A1) has B1 (in affected) → B1's in-degree: 1→0 → push B1

  Pop B1 → order = [A1, B1]
    rev(B1) has C1 (in affected) → C1's in-degree: 1→0 → push C1

  Pop C1 → order = [A1, B1, C1]
    rev(C1) has nothing in affected → done

Queue empty. Result: [A1, B1, C1] ✓
```

**Phase 4: Detect cycles**

```text
If affected.size !== order.length, some cells are in a cycle.
Cyclic cells = affected - order
```

## Requirements

### 1. Implementation Details

#### `#affectedFrom(start: CellId): Set<CellId>`

Standard **BFS traversal** starting from `start` using the `rev` (reverse dependencies) map.

```text
Algorithm:
  1. Create a Set "affected" and add "start"
  2. Create a queue, push "start"
  3. While queue is not empty:
     a. Pop cell "u"
     b. For each cell "v" in rev(u):
        - If "v" is not in affected:
          - Add "v" to affected
          - Push "v" to queue
  4. Return affected
```

> **Note**: The starting cell itself is included in the affected set.

#### `#topoSort(affected: Set<CellId>): { order: CellId[], cyclic: Set<CellId> }`

Implement **Kahn's algorithm** scoped to the `affected` set:

1. **In-degrees**: For each cell in `affected`, count how many of its `deps` are also in `affected`.
2. **Seed queue**: Push all cells with in-degree `0`.
3. **Process**: Pop from queue, add to `order`, decrement neighbors' in-degrees, push newly-zero nodes.
4. **Cycles**: Any cell still in `affected` but not in `order` is cyclic.

```typescript
// Return type:
{
  order: CellId[],      // safe computation order
  cyclic: Set<CellId>   // cells trapped in cycles
}
```

#### `#recomputeFrom(start: CellId): { changed: CellId[] }`

Chain the two methods together:

```text
  1. affected = #affectedFrom(start)
  2. { order, cyclic } = #topoSort(affected)
  3. return { changed: [...order, ...cyclic] }
```

> For now, just return the combined list. Actual evaluation happens in step 19.4.

### 2. Update `setRaw`

After updating the state and dependencies, call `#recomputeFrom(id)` and return its result:

```text
setRaw(id, raw):
  1. this.#raw.set(id, raw)
  2. this.#value.set(id, raw)
  3. const deps = this.#compile(id, raw)
  4. this.#setDeps(id, deps)
  5. return this.#recomputeFrom(id)    // CHANGED
```

## Hints

### 💡 Hint 1: BFS with an array

You don't need a fancy queue data structure. A simple array with an index pointer works fine for BFS at this scale:

```typescript
const queue: CellId[] = [start]
let i = 0
while (i < queue.length) {
  const u = queue[i++]
  // process u...
}
```



### 💡 Hint 2: In-degree calculation

For each cell `c` in the affected set, its in-degree is the count of cells in `deps(c)` that are ALSO in the affected set. Use a `Map<CellId, number>` to track in-degrees.



### 💡 Hint 3: Cycle detection is just a size check

After Kahn's algorithm finishes, if `order.length < affected.size`, the remaining cells are cyclic. You can find them by filtering `affected` for cells not in the `order` array (use a Set for O(1) lookup).



## Edge Cases to Consider

- A cell with no dependents: `affected` set contains only itself, `order = [id]`, no cycles
- A diamond dependency: `A1 → B1, A1 → C1, B1 → D1, C1 → D1` — D1 should appear after both B1 and C1
- Self-referencing cell: `A1 = "=A1"` — should be detected as a cycle
- Mutual cycle: `A1 = "=B1"`, `B1 = "=A1"` — both should be in the cyclic set
- Long chain: `A1 → B1 → C1 → ... → Z1` — should produce correct linear order

## Testing

Run tests to verify that your topological sorter provides the correct sequence and correctly identifies cycles:

```bash
pnpm test src/problems/components/59-google-sheet-topo/test
```

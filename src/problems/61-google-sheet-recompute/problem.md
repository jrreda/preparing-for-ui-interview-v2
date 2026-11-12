# 19.5 Google Sheet: Reactive Recomputation Pipeline

**Difficulty**: `Extreme`  
**Estimated Time**: 15–20 minutes

## Goal

This is the **final logic step** — the moment everything clicks together. You will wire up the full reactive pipeline so that editing a single cell automatically recomputes all affected cells in the correct order, while marking cyclic cells with `#CYCLE!`.

> **What you'll learn**: How to orchestrate a complete reactive computation pipeline, combining graph traversal, topological sorting, and evaluation into a single cohesive flow.

## The Big Picture

```text
 19.1          19.2           19.3          19.4         19.5       19.6
┌──────┐    ┌─────────┐    ┌────────┐    ┌──────┐    ┌──────────┐ ┌────┐
│ Data │───►│ Compile │───►│ Topo   │───►│ Eval │───►│Recompute │►│ UI │
│Struct│    │ & Deps  │    │ Sort   │    │      │    │ Pipeline │ │    │
└──────┘    └─────────┘    └────────┘    └──────┘    └──────────┘ └────┘
                                                      ▲ YOU ARE HERE
```

## Background: The Full Pipeline

Here's what happens when a user types `"=B1+5"` into cell `A1`:

```text
  USER INPUT         COMPILATION        GRAPH UPDATE        TOPOSORT          EVALUATION
┌───────────┐      ┌─────────────┐     ┌────────────┐     ┌───────────┐     ┌────────────┐
│ setRaw A1 │ ───► │ to RPN / AST│ ───►│ sync deps  │ ───►│ find order│ ───►│ eval cells │
│ "=B1+5"   │      │ [B1, 5, +]  │     │ & rev maps │     │ [A1,C1,..]│     │ in order   │
└───────────┘      └─────────────┘     └────────────┘     └───────────┘     └────────────┘
```

Each step was built in a previous problem:

- **19.1**: Data structures (`#raw`, `#value`, `#deps`, `#rev`)
- **19.2**: `#compile` (tokenize → RPN) and `#setDeps` (graph sync)
- **19.3**: `#affectedFrom` (BFS) and `#topoSort` (Kahn's algorithm)
- **19.4**: `_evalCell` (uses `evalRpn` with `getValue` as resolver)

Now you just need to **connect them** in `#recomputeFrom`.

## Walkthrough: End-to-End Example

```text
Initial state:
  A1 = "10"       → value = "10"
  B1 = "=A1+5"    → value = "15"
  C1 = "=B1*2"    → value = "30"

User changes A1 to "20":

  Step 1: setRaw("A1", "20")
    → #raw.set("A1", "20")
    → #compile("A1", "20") → literal, no deps
    → #setDeps("A1", {})

  Step 2: #recomputeFrom("A1")
    → #affectedFrom("A1"):
        BFS via rev: A1 → {B1} → {C1}
        affected = {A1, B1, C1}

    → #topoSort({A1, B1, C1}):
        in-degrees: A1=0, B1=1, C1=1
        order = [A1, B1, C1]
        cyclic = {}

  Step 3: Evaluate in order
    A1: _evalCell("A1") → "20" (literal)     → #value("A1") = "20"
    B1: _evalCell("B1") → resolver("A1")=20  → 20+5 = "25"
                                               → #value("B1") = "25"
    C1: _evalCell("C1") → resolver("B1")=25  → 25*2 = "50"
                                               → #value("C1") = "50"

  Return: { changed: ["A1", "B1", "C1"] }
```

### Cycle Handling Example

```text
  A1 = "=B1"    B1 = "=A1"

  #recomputeFrom("A1"):
    affected = {A1, B1}
    topoSort → order = [], cyclic = {A1, B1}

  Handle cycles:
    #value("A1") = "#CYCLE!"
    #value("B1") = "#CYCLE!"

  Return: { changed: ["A1", "B1"] }
```

## Requirements

### 1. Integration Details

#### `setRaw(id: CellId, raw: string): { changed: CellId[] }`

This method now implements the **full engine pipeline**:

```text
setRaw(id, raw):
  1. this.#raw.set(id, raw)
  2. const deps = this.#compile(id, raw)
  3. this.#setDeps(id, deps)
  4. return this.#recomputeFrom(id)     // does eval + returns changed
```

> Note: We no longer set `#value` directly in `setRaw` — that's now handled inside `#recomputeFrom`.

#### `#recomputeFrom(start: CellId): { changed: CellId[] }`

This is where everything comes together:

```text
#recomputeFrom(start):
  1. affected = this.#affectedFrom(start)
  2. { order, cyclic } = this.#topoSort(affected)

  3. // Step A: Handle cycles
     for each id in cyclic:
       this.#value.set(id, "#CYCLE!")

  4. // Step B: Sequential evaluation (in topo order!)
     for each id in order:
       this.#value.set(id, this._evalCell(id))

  5. return { changed: [...order, ...cyclic] }
```

**Why this order matters:**

- Cyclic cells are marked **first** so that if any non-cyclic cell references a cyclic cell, the resolver will see `#CYCLE!` and propagate the error correctly.
- Ordered cells are evaluated **sequentially** — each cell's dependencies are guaranteed to have fresh values because of the topological ordering.

## Hints

### 💡 Hint 1: Cycle recovery

If a user later fixes a cycle (e.g., changes `A1` from `"=B1"` to `"10"`), the next `setRaw` call will recompute the graph. The previously cyclic cells will now appear in the `order` array instead of `cyclic`, and their values will be recalculated normally.



### 💡 Hint 2: The changed array order

The order of IDs in the `changed` array matters for the UI — it tells the renderer which cells to refresh. Including both `order` and `cyclic` ensures the UI updates everything that was affected.



## Edge Cases to Consider

- Single cell with no dependents: `changed` should be `["A1"]`
- Deep chain: `A1 → B1 → C1 → D1` — all should recompute in order when A1 changes
- Mixed cycle: Some cells in a cycle, others not — non-cyclic cells should still evaluate correctly
- Cycle recovery: After fixing a circular reference, previously `#CYCLE!` cells should get real values again
- Diamond dependency: `A1 → B1, A1 → C1, B1 → D1, C1 → D1` — D1 should only be evaluated once, after both B1 and C1

## Testing

Run tests against the full reactive engine to verify it handles complex dependency trees and cycle recovery correctly:

```bash
pnpm test src/problems/components/61-google-sheet-recompute/test
```

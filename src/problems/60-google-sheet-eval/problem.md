# 19.4 Google Sheet: Cell Evaluation Logic

**Difficulty**: `Hard`  
**Estimated Time**: 20–25 minutes

## Goal

We have the graph and the order, but we still aren't calculating any math! In this step, you will implement the evaluation logic that actually executes the compiled RPN tokens to produce a final value for each cell.

> **What you'll learn**: How to evaluate Reverse Polish Notation expressions, how to bridge the parser's `evalRpn` function with your engine's state, and how to handle error propagation in formulas.

## The Big Picture

```text
 19.1          19.2           19.3          19.4         19.5       19.6
┌──────┐    ┌─────────┐    ┌────────┐    ┌──────┐    ┌──────────┐ ┌────┐
│ Data │───►│ Compile │───►│ Topo   │───►│ Eval │───►│Recompute │►│ UI │
│Struct│    │ & Deps  │    │ Sort   │    │      │    │ Pipeline │ │    │
└──────┘    └─────────┘    └────────┘    └──────┘    └──────────┘ └────┘
                                          ▲ YOU ARE HERE
```

## Background: How Evaluation Works

When the parser encounters a cell reference like `B1` during RPN evaluation, it doesn't know what `B1`'s value is — that's **your engine's** job. You provide a **resolver callback** that the parser calls whenever it needs a cell's numeric value.

```text
  evalRpn([B1, 10, +], resolver)         Your TableEngine
 ┌──────────────────────────┐          ┌─────────────────────┐
 │                          │          │                     │
 │ 1. See token B1 (ref)   │──────────│► resolver("B1")     │
 │                          │          │  → look up #value   │
 │ 2. Receive value 5      │◄─────────│  → parse as number  │
 │                          │          │  → return { ok, n } │
 │ 3. See token 10 (num)   │          │                     │
 │ 4. See token + (op)     │          └─────────────────────┘
 │ 5. Compute 5 + 10 = 15  │
 │ 6. Return "15"          │
 └──────────────────────────┘
```

### Why Topological Sort Matters Here

The resolver looks up `B1`'s value from the `#value` map. This only works correctly if `B1` has **already been evaluated** before `A1`. That's exactly what the topological sort from step 19.3 guarantees!

```text
  Evaluation order: [A1, B1, C1]

  Step 1: Eval A1 → it's a literal "10" → value = "10"  ✓
  Step 2: Eval B1 = "=A1+5"
          resolver("A1") → "10" → 10
          10 + 5 = 15 → value = "15"  ✓
  Step 3: Eval C1 = "=B1*2"
          resolver("B1") → "15" → 15
          15 * 2 = 30 → value = "30"  ✓
```

## Requirements

### 1. Implementation Details

#### `_evalCell(id: CellId): string`

Evaluates a single cell and returns its display value as a string.

**Logic:**

```text
  Get #compiled for cell id
      │
      ▼
  What is it?
  ┌─────────┬──────────┬──────────┐
  │  null   │ {error}  │ {rpn}    │
  │         │          │          │
  ▼         ▼          ▼          │
 Return    Return     Call evalRpn│
 getRaw(id) error     with rpn   │
 (literal)  string    and your   │
                      resolver   │
                      callback   │
                         │       │
                         ▼       │
                      Return     │
                      result     │
                      string     │
```

**Step by step:**

1. Look up the `#compiled` entry for this cell.
2. If `null` → it's a literal, just return `getRaw(id)`.
3. If it has an `error` → return the error string (e.g., `"Syntax error"`).
4. If it has `rpn` → call `evalRpn(rpn, resolverFn)` from the parser.
   - The `resolverFn` is a callback that returns the cell's current value: `(refId) => this.getValue(refId)`.
   - `evalRpn` handles numeric parsing internally and returns the computed result as a string.

### 2. Update `setRaw`

After compilation and graph updates, evaluate the current cell and store the result:

```text
setRaw(id, raw):
  1. this.#raw.set(id, raw)
  2. const deps = this.#compile(id, raw)
  3. this.#setDeps(id, deps)
  4. this.#value.set(id, this._evalCell(id))   // NEW: evaluate!
  5. return this.#recomputeFrom(id)
```

> **Important**: In this step, we only evaluate the **single cell** being edited. Full graph recomputation (evaluating all dependents) comes in step 19.5.

## Walkthrough Example

```text
Setup:
  engine.setRaw("B1", "10")    → value("B1") = "10"
  engine.setRaw("A1", "=B1+5")

Evaluating A1:
  1. #compile("A1", "=B1+5") → rpn = [ref(B1), num(5), op(+)]
  2. #setDeps("A1", {B1})
  3. _evalCell("A1"):
     - #compiled has rpn tokens
     - evalRpn([ref(B1), num(5), op(+)], resolver)
       - resolver("B1") → getValue("B1") → "10"
       - Stack: [10] → [10, 5] → [15]
     - Returns "15"
  4. #value.set("A1", "15")

Result: engine.getValue("A1") → "15" ✓
```

## Hints

### 💡 Hint 1: The resolver callback

The resolver passed to `evalRpn` just needs to return the cell's string value. Numeric parsing is handled internally by `evalRpn`:

```typescript
evalRpn(rpn, (refId) => this.getValue(refId))
```



### 💡 Hint 3: The underscore prefix on _evalCell

`_evalCell` uses a single underscore (not `#`) because it needs to be accessible from tests. It's a convention meaning "internal but not truly private".



## Edge Cases to Consider

- Cell with a literal value (`"42"`) → `_evalCell` should return `"42"`
- Cell referencing an empty cell (`=Z99`) → empty cell = 0, so `=Z99+5` should return `"5"`
- Cell with a compile error → return the error string
- Division by zero (`=A1/0`) → the parser should return `#DIV/0!`
- Cell referencing a cell that contains text (`=A1` where A1 = `"hello"`) → should propagate as an error

## Testing

Run tests to ensure that math is accurately calculated and cell references resolve to their numeric values:

```bash
pnpm test src/problems/components/60-google-sheet-eval/test
```

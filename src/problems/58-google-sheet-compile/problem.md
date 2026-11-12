# 19.2 Google Sheet: AST Compilation & Dependency Analysis

**Difficulty**: `Medium`  
**Estimated Time**: 20–25 minutes

## Goal

Now that we have the basic data structures, we need to understand the **relationships between cells**. If `A1` contains `"=B1 + 5"`, then `A1` depends on `B1`. In this step, you will implement the compilation logic that converts a raw string into an Abstract Syntax Tree (specifically, Reverse Polish Notation) and extracts these dependencies.

> **What you'll learn**: How formula parsing works (tokenization → RPN conversion), how to extract cell references from formulas, and how to maintain a bidirectional dependency graph.

## The Big Picture

```text
 19.1          19.2           19.3          19.4         19.5       19.6
┌──────┐    ┌─────────┐    ┌────────┐    ┌──────┐    ┌──────────┐ ┌────┐
│ Data │───►│ Compile │───►│ Topo   │───►│ Eval │───►│Recompute │►│ UI │
│Struct│    │ & Deps  │    │ Sort   │    │      │    │ Pipeline │ │    │
└──────┘    └─────────┘    └────────┘    └──────┘    └──────────┘ └────┘
             ▲ YOU ARE HERE
```

## Background: RPN and Tokenization

We provide a `google-sheet-parser` utility with three key functions that form a compilation pipeline:

```text
  INPUT RAW         TOKENIZE            TO RPN           DEPS EXTRACT
 ┌─────────┐      ┌──────────┐      ┌───────────┐      ┌─────────────┐
 │ "=B1+5" │ ───► │ [REF,+,5]│ ───► │ [B1, 5, +]│ ───► │  Set { B1 } │
 └─────────┘      └──────────┘      └───────────┘      └─────────────┘
```

### What is RPN (Reverse Polish Notation)?

Normal math notation (infix): `B1 + 5`  
RPN (postfix): `B1 5 +`

RPN eliminates the need for parentheses and operator precedence rules. It's much easier to evaluate programmatically — you just read left to right, pushing values onto a stack and applying operators as you encounter them.

```text
Infix:    (A1 + B1) * C1
RPN:       A1  B1  +  C1  *

Evaluation with a stack:
  Step 1: Push A1     → Stack: [A1]
  Step 2: Push B1     → Stack: [A1, B1]
  Step 3: Apply +     → Stack: [A1+B1]
  Step 4: Push C1     → Stack: [A1+B1, C1]
  Step 5: Apply *     → Stack: [(A1+B1)*C1]  ✓
```

### The Parser Functions

- **`tokenize(expr)`**: Converts a string like `"A1+10"` into a list of typed tokens: `[ref(A1), op(+), num(10)]`
- **`toRpn(tokens)`**: Converts infix tokens into postfix (RPN) order using the Shunting-Yard algorithm
- **`evalRpn(rpn, resolver)`**: Evaluates RPN tokens (used in step 19.4, not this step)

> **Note**: Both `tokenize` and `toRpn` return result objects with an `ok` field. When `ok` is `false`, they include an `error` string instead of the result.

## Requirements

### 1. Extended State

Add a **`#compiled`** Map to store the result of compilation for each cell:

```typescript
#compiled: Map<CellId, Compiled>
```

The `Compiled` type (from `google-sheet-parser`) can be:

- `null` — the cell is a literal (no formula)
- `{ rpn: RpnToken[] }` — successfully compiled formula
- `{ error: string }` — compilation failed

### 2. Private Implementation

#### `#compile(id: CellId, raw: string): Set<CellId>`

This method parses a raw string and returns the set of cell references found in the formula.

**Logic flow:**

```text
  raw string
      │
      ▼
  Starts with "="?
      │
  ┌───┴───┐
  │ NO    │ YES
  │       │
  ▼       ▼
 Store   Strip "=" prefix
 null    │
 in      ▼
 #compiled  tokenize(expr)
 Return     │
 empty   ┌──┴──┐
 Set     │ ERR │ OK
         │     │
         ▼     ▼
        Store  toRpn(tokens)
        error  │
        in     ┌──┴──┐
        #compiled ERR │ OK
               │     │
               ▼     ▼
              Store  Store rpn in #compiled
              error  Extract refs → return Set
```

**Step by step:**

1. If `raw` doesn't start with `=`, it's a literal. Set `#compiled` to `null`, return an empty `Set`.
2. Strip the `=` prefix, then call `tokenize(expr)`.
3. If tokenization fails (`!tokens.ok`), store the error in `#compiled`, return empty `Set`.
4. If successful, call `toRpn(tokens.tokens)`.
5. If RPN conversion fails, store the error in `#compiled`, return empty `Set`.
6. Store the RPN tokens in `#compiled`.
7. **Extract dependencies**: Iterate through the RPN tokens. Any token with type `'ref'` contains a cell reference — add its `id` to the returned `Set<CellId>`.

#### `#setDeps(id: CellId, nextDeps: Set<CellId>)`

This is the **most critical logic** in this step. You must synchronize the `deps` and `rev` maps to keep the bidirectional graph consistent.

**The problem**: When a cell's formula changes, its dependencies change too. We need to:

1. Remove ourselves from old dependencies' `rev` sets
2. Add ourselves to new dependencies' `rev` sets

**Walkthrough example:**

```text
Before: A1 = "=B1+C1"
  deps(A1) = {B1, C1}     (old deps)
  rev(B1)  = {A1}
  rev(C1)  = {A1}

User changes A1 to "=B1+D1"
  nextDeps = {B1, D1}     (new deps from #compile)

Diff:
  Removed: C1 (was in old, not in new)  → remove A1 from rev(C1)
  Added:   D1 (in new, not in old)      → add A1 to rev(D1)
  Kept:    B1 (in both)                 → no change needed

After:
  deps(A1) = {B1, D1}
  rev(B1)  = {A1}          (unchanged)
  rev(C1)  = {}             (A1 removed)
  rev(D1)  = {A1}           (A1 added)
```

**Algorithm:**

1. Get the current (old) deps for this cell.
2. **Cleanup**: For each dep in `oldDeps` that is NOT in `nextDeps`, remove `id` from that dep's `rev` set.
3. **Update**: For each dep in `nextDeps` that is NOT in `oldDeps`, add `id` to that dep's `rev` set.
4. Replace the `deps` map entry with `nextDeps`.

### 3. Update `setRaw`

Integrate the new compilation into the existing `setRaw` method:

```text
setRaw(id, raw):
  1. this.#raw.set(id, raw)
  2. this.#value.set(id, raw)          // still no eval
  3. const deps = this.#compile(id, raw)  // NEW
  4. this.#setDeps(id, deps)              // NEW
  5. return { changed: [id] }
```

## Hints

### 💡 Hint 1: Don't forget to trim

The raw string might have whitespace. Trim it before checking if it starts with `=`. Also trim after stripping the `=` prefix.



### 💡 Hint 2: Token type check for refs

When extracting dependencies from RPN tokens, check `token.t === 'ref'`. The cell ID is stored in `token.id`.



### 💡 Hint 3: Reuse your lazy getters

In `#setDeps`, use your existing `#getDeps` and `#getRevDeps` private helpers (with lazy initialization) to safely access the maps without null checks.



## Edge Cases to Consider

- A cell with no formula (e.g., `"42"`) should have `#compiled = null` and empty deps
- A formula with a syntax error (e.g., `"=+++"`) should store the error and have empty deps
- Changing a formula should correctly remove old reverse dependencies
- A cell referencing itself (e.g., `A1 = "=A1"`) — the deps should include itself (cycle detection comes in 19.3)

## Testing

Run tests to verify that AST tokens are correctly extracted and the bidirectional graph (`deps` ↔ `rev`) is maintained accurately:

```bash
pnpm test src/problems/components/58-google-sheet-compile/test
```

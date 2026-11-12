# 19.1 Google Sheet: Basic Engine Data Structures

**Difficulty**: `Medium`  
**Estimated Time**: 15–20 minutes

## Goal

The core of a spreadsheet is its **Reactive Engine** — the invisible brain that tracks every cell's content, computed result, and relationships with other cells. Before we can handle formulas like `=B1+C1` or build a slick UI, we need a rock-solid data model.

In this first step, you will implement the `TableEngine` class with foundational data structures and basic accessor methods. Think of it as laying the foundation of a house before building the walls.

> **What you'll learn**: How to design a state management layer using `Map` data structures, and why spreadsheets need four separate maps to function efficiently.

## The Big Picture: Where This Step Fits

This problem is part of a 6-step series that builds a fully functional Google Sheets clone:

```text
 ┌─────────────────────────────────────────────────────────────────────┐
 │                    Google Sheet Engine Pipeline                     │
 │                                                                     │
 │  19.1          19.2           19.3          19.4         19.5       │
 │ ┌──────┐    ┌─────────┐    ┌────────┐    ┌──────┐    ┌──────────┐  │
 │ │ Data │───►│ Compile │───►│ Topo   │───►│ Eval │───►│Recompute │  │
 │ │Struct│    │ & Deps  │    │ Sort   │    │      │    │ Pipeline │  │
 │ └──────┘    └─────────┘    └────────┘    └──────┘    └──────────┘  │
 │  ▲ YOU                                                      │      │
 │  ARE HERE                                              19.6 ▼      │
 │                                                      ┌──────────┐  │
 │                                                      │    UI    │  │
 │                                                      └──────────┘  │
 └─────────────────────────────────────────────────────────────────────┘
```

## Background: The Quad-Map Architecture

A performant spreadsheet engine typically uses **four primary mappings** to manage its state. Each map serves a distinct purpose:

```text
       ┌──────────┐      ┌──────────┐
       │   raw    │      │  value   │
       │ (String) │      │ (Result) │
       └────┬─────┘      └────▲─────┘
            │                 │
      (Compilation)      (Evaluation)
            │                 │
       ┌────▼─────┐      ┌────┴─────┐
       │   deps   │      │   rev    │
       │ (Direct) │      │(Inverse) │
       └──────────┘      └──────────┘
```

### What Each Map Stores

| Map         | Key      | Value                                       | Example             |
| ----------- | -------- | ------------------------------------------- | ------------------- |
| **`raw`**   | `CellId` | The literal string the user typed           | `"A1"` → `"=B1+5"`  |
| **`value`** | `CellId` | The final computed display result           | `"A1"` → `"15"`     |
| **`deps`**  | `CellId` | `Set` of cells **this cell depends on**     | `"A1"` → `{B1, C1}` |
| **`rev`**   | `CellId` | `Set` of cells that **depend on this cell** | `"B1"` → `{A1}`     |

### Why Four Maps?

Consider this spreadsheet:

```text
  ┌─────┬─────────┬──────────┐
  │     │    A    │    B     │
  ├─────┼─────────┼──────────┤
  │  1  │  =B1+5  │   10     │
  └─────┴─────────┴──────────┘
```

- **`raw`** stores exactly what the user typed: `A1 → "=B1+5"`, `B1 → "10"`
- **`value`** stores the display result: `A1 → "15"`, `B1 → "10"`
- **`deps`** tracks: `A1` depends on `{B1}` (because A1's formula references B1)
- **`rev`** tracks the reverse: `B1` is depended on by `{A1}` (so if B1 changes, we know to update A1)

> **💡 Why `deps` AND `rev`?** When the user edits `B1`, we need to instantly find all cells affected by that change. Without `rev`, we'd have to scan _every_ cell's `deps` to find who references `B1` — that's O(n) for every edit! With `rev`, it's O(1) lookup.

## Requirements

### 1. State Management

Implement the `TableEngine` class using **private** `Map` structures for the four categories above.

```typescript
// Use branded CellId type from the parser
import type { CellId } from 'google-sheet-parser'

// Your class should have these private fields:
#raw:   Map<CellId, string>        // user input
#value: Map<CellId, string>        // computed result
#deps:  Map<CellId, Set<CellId>>   // "A1 depends on B1"
#rev:   Map<CellId, Set<CellId>>   // "B1 is used by A1"
```

> **Note**: For this step, simply store the `raw` string into the `value` map as well, since we aren't evaluating math yet. That means `setRaw("A1", "=B1+5")` will store `"=B1+5"` as both the raw _and_ the value.

### 2. Implementation Details

#### `setRaw(id: CellId, raw: string): { changed: CellId[] }`

Updates the internal state for the given cell.

- Set the `raw` map entry for `id`.
- Set the `value` map entry for `id` (same value as `raw` for now).
- Return `{ changed: [id] }` — an array of cell IDs that were modified.

```text
Example:
  engine.setRaw("A1", "Hello")

  Internal state after call:
    raw:   { "A1" → "Hello" }
    value: { "A1" → "Hello" }

  Returns: { changed: ["A1"] }
```

#### `getRaw(id: CellId): string`

Returns the raw input string for a cell. Should return an empty string `''` if the cell has never been set.

```text
  engine.getRaw("A1")  →  "Hello"
  engine.getRaw("Z99") →  ""        // never set
```

#### `getValue(id: CellId): string`

Returns the computed value string. Should return `''` if the cell is empty.

> In later steps, `getRaw` and `getValue` will return different things (e.g., raw = `"=B1+5"`, value = `"15"`), but for now they're identical.

#### `getDeps(id: CellId): ReadonlySet<CellId>`

Returns a `ReadonlySet` of cells this cell depends on.

- **Important**: If the map entry is missing, **initialize it** with an empty `Set` and store it back in the map before returning. This "lazy initialization" pattern avoids `undefined` checks everywhere in consumer code.

```typescript
// Lazy initialization pattern:
getDeps(id: CellId): ReadonlySet<CellId> {
  let s = this.#deps.get(id)
  if (!s) {
    s = new Set<CellId>()
    this.#deps.set(id, s)
  }
  return s
}
```

#### `getRevDeps(id: CellId): ReadonlySet<CellId>`

Returns a `ReadonlySet` of cells that depend on this cell. Use the same lazy initialization pattern as `getDeps`.

## Hints

### 💡 Hint 1: Why `ReadonlySet`?

We return `ReadonlySet` instead of `Set` to prevent external code from accidentally modifying the internal state. The actual stored value is still a mutable `Set` — we just expose a read-only view through the type system.



### 💡 Hint 2: Why lazy initialization in getDeps/getRevDeps?

In later steps (19.2, 19.3), we'll iterate over `deps` and `rev` sets frequently. If `getDeps("A1")` could return `undefined`, every caller would need a null check. By always returning a valid `Set` (even if empty), we simplify all downstream code.



## Edge Cases to Consider

- What happens when you call `getRaw` on a cell that was never set? → Return `''`
- What happens when you call `setRaw` twice on the same cell? → The second call should overwrite the first
- What happens when you call `getDeps` on a cell with no formula? → Return an empty `Set`

## Testing

Run the following command to verify your data structures:

```bash
pnpm test src/problems/components/57-google-sheet-basic/test
```

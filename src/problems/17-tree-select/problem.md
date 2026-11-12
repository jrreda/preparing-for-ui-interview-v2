# Tree Select

**Difficulty: Hard**

## Problem

Implement a tree selection system where clicking a node selects/deselects it and all its children, while parent nodes show partial selection state when some (but not all) children are selected.

## Requirements

- **Selection states**: Selected (`v`), Not Selected (` `), Partial (`o`)
- Clicking a node toggles its selection status
- When a parent is selected, all children become selected
- When a parent is deselected, all children become deselected
- When some children are selected, parent shows partial state
- When all children are selected, parent becomes selected
- When no children are selected, parent becomes not selected

## Signature

```typescript
function renderTreeSelect(paths: string[], clicks: string[]): string
```

- `paths`: Array of paths like `["a/b/c", "a/b/d", "a/e"]` defining tree structure
- `clicks`: Array of node names to click in order
- Returns: String representation of tree with selection states

## Example

```typescript
const paths = ['a/b/c', 'a/b/d', 'a/e']
const clicks = ['c']

renderTreeSelect(paths, clicks)
// Output:
// [o]a
// .[o]b
// ..[v]c
// ..[ ]d
// .[ ]e
```

Clicking 'c' selects it, which makes 'b' partial (one child selected), which makes 'a' partial.

## Implementation Hints

### Data Structures

- Use a `TreeNode` class with `name`, `parent`, `children`, and `status`
- Use a `Map<string, TreeNode>` to quickly find nodes by name
- Build tree by parsing paths and creating nodes

### Propagation

- **Downward (propagate)**: When selecting/deselecting, apply same status to all descendants
- **Upward (bubble)**: After changing a node, recalculate all ancestor statuses

### Status Calculation

- Count selected children
- If all children selected → parent selected
- If no children selected and no partial children → parent not selected
- Otherwise → parent partial

### Generator Functions

- Use `yield*` to recursively yield nodes for iteration
- `bubble(node)`: Yields ancestors from immediate parent to root
- `propagate(node)`: Yields all descendants depth-first

## Run Tests

```bash
pnpm test src/problems/17-tree-select/test/tree-select.test.ts
```

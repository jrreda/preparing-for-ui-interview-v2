// pnpm test src/problems/17-tree-select/test/tree-select.test.ts

type TSelectStatus = 'v' | ' ' | 'o'

const SELECTED: TSelectStatus = 'v'
const NOT_SELECTED: TSelectStatus = ' '
const PARTIAL: TSelectStatus = 'o'

// Step 0: Implement TreeNode methods
class TreeNode {
  children: TreeNode[] = []
  status: TSelectStatus = NOT_SELECTED

  constructor(
    public name: string,
    public parent: TreeNode | null = null,
  ) {}

  toString(level: number = -1): string {
    const dots = Math.max(0, level)
    const root = level === -1 ? '' : `${'.'.repeat(dots)}[${this.status}]${this.name}\n`
    return root.concat(this.children.map((n) => n.toString(level + 1)).join(''))
  }
}

// Step 1: Implement createTree
function createTree(paths: string[]): [TreeNode, Map<string, TreeNode>] {}
//   - Create a root TreeNode and a Map<string, TreeNode> store
//   - For each path, split by '/' into tokens
//   - For each token, check if it exists in the store; if not, create a new TreeNode and addChild to parent
//   - Return [root, store]

// Step 2: Implement bubble
function* bubble(node: TreeNode): Iterable<TreeNode> {}

// Step 3: Implement propagate
function* propagate(node: TreeNode): Iterable<TreeNode> {}
// Step 4: Implement renderTreeSelect
//   - Call createTree to build the tree
//   - For each click: toggle the clicked node's status, propagate to descendants, bubble up to update ancestors
//   - Return root.toString()

export const renderTreeSelect = (paths: string[], clicks: string[]): string => {}

// --- Examples ---
// Uncomment to test your implementation:
// Example 1: Basic tree rendering (no clicks)
// const paths1 = ['fruits/apple', 'fruits/banana', 'vegetables/carrot']
// console.log(renderTreeSelect(paths1, []))
// Expected output:
// [ ]fruits
// .[ ]apple
// .[ ]banana
// [ ]vegetables
// .[ ]carrot

// Example 2: Select a leaf node → parent becomes partial
// console.log(renderTreeSelect(['fruits/apple', 'fruits/banana'], ['apple']))
// Expected output:
// [o]fruits
// .[v]apple
// .[ ]banana

// Example 3: Select all children → parent becomes selected
// console.log(renderTreeSelect(['fruits/apple', 'fruits/banana'], ['apple', 'banana']))
// Expected output:
// [v]fruits
// .[v]apple
// .[v]banana

// Example 4: Select parent → all children become selected, then deselect one child
// console.log(renderTreeSelect(['a/b', 'a/c'], ['a', 'b']))
// Expected output:
// [o]a
// .[ ]b
// .[v]c

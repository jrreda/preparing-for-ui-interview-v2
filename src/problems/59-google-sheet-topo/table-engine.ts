// pnpm test src/problems/59-google-sheet-topo/test/table-engine.test.ts

// @ts-ignore
import { tokenize, toRpn, type CellId, type Compiled } from '../../utilities/google-sheet-parser'

export type { CellId } from '../../utilities/google-sheet-parser'

export class TableEngine {
  #raw: Map<CellId, string> = new Map()
  #val: Map<CellId, string> = new Map()
  #deps: Map<CellId, Set<CellId>> = new Map()
  #reverseDeps: Map<CellId, Set<CellId>> = new Map()
  #compiled: Map<CellId, Compiled> = new Map()

  setRaw(id: CellId, raw: string): { changed: CellId[] } {
    this.#raw.set(id, raw)
    this.#val.set(id, raw)

    const deps = this.#compile(id, raw)
    this.setDeps(id, deps)

    const changed = this.#recomputeFrom(id)
    return { changed }
  }

  getRaw(id: CellId): string {
    return this.#raw.get(id) ?? ''
  }

  getValue(id: CellId): string {
    return this.#val.get(id) ?? ''
  }

  getDeps(id: CellId): Set<CellId> {
    let s = this.#deps.get(id)
    if (!s) {
      s = new Set<CellId>()
      this.#deps.set(id, s)
    }
    return s
  }

  getRevDeps(id: CellId): Set<CellId> {
    let s = this.#reverseDeps.get(id)
    if (!s) {
      s = new Set<CellId>()
      this.#reverseDeps.set(id, s)
    }
    return s
  }

  setDeps(id: CellId, nextDeps: Set<CellId>) {
    const prevDeps = this.getDeps(id)

    for (const dep of prevDeps) {
      if (!nextDeps.has(dep)) this.getRevDeps(dep).delete(id)
    }
    for (const dep of nextDeps) {
      if (!prevDeps.has(dep)) this.getRevDeps(dep).add(id)
    }

    this.#deps.set(id, nextDeps)
  }

  #compile(id: CellId, raw: string): Set<CellId> {
    const deps = new Set<CellId>()
    raw = raw.trim()

    if (!raw.startsWith('=')) {
      this.#compiled.set(id, null)
      return deps
    }

    const expr = raw.slice(1).trim()
    const tokens = tokenize(expr)
    if (!tokens.ok) {
      this.#compiled.set(id, { error: tokens.error })
      return deps
    }

    const rpn = toRpn(tokens.tokens)
    if (!rpn.ok) {
      this.#compiled.set(id, { error: rpn.error })
      return deps
    }

    for (const t of rpn.rpn) {
      if (t.t === 'ref') deps.add(t.id)
    }

    this.#compiled.set(id, { rpn: rpn.rpn })
    return deps
  }

  _affectedFrom(_start: CellId): Set<CellId> {
    // TODO: Step 1 - Find Affected Nodes
    // 1. Maintain an `affected` Set to track visited nodes.
    // 2. Using a `queue` array, push the start cell onto it.
    // 3. Iteratively loop: push every cell's `getRevDeps()` onto the backlog until all downstream nodes are exhausted.
    // 4. Return the `affected` set.
    throw new Error('TODO: Collect all nodes transitively affected via reverse deps')
  }

  _topoSort(_affected: Set<CellId>): { order: CellId[]; cyclic: Set<CellId> } {
    // TODO: Step 2 - Kahn's Algorithm
    // 1. Calculate initial weights: Iterate through `affected`. For each of its `getDeps()`, increment its in-degree count ONLY IF the dependency is ALSO inside the `affected` set.
    // 2. Cull the queue: Push all cells with an in-degree of 0 into a processing `queue`.
    // 3. Process ordering: Iterate through the processing `queue` (adding them to the final `order`).
    // 4. As you process a node, decrement the in-degree score of all its `getRevDeps()`. If a descending node falls to an in-degree of 0, immediately push it onto the processing `queue`!
    // 5. Cycle Detection: Any cells from `affected` that didn't make it into your final `order` are caught in a circular reference! Return both!
    throw new Error('TODO: Create TopoSort queue using Kahns algorithm')
  }

  #recomputeFrom(start: CellId): CellId[] {
    const affected = this._affectedFrom(start)
    const { order, cyclic } = this._topoSort(affected)

    const changed: CellId[] = []
    for (const id of cyclic) changed.push(id)
    for (const id of order) {
      if (!cyclic.has(id)) changed.push(id)
    }

    return changed
  }
}

// ── Uncomment below to test your implementation ─────────────────────
// const engine = new TableEngine()
//
// // Build a dependency chain: A1 → B1 → C1
// engine.setRaw('A1', '10')
// engine.setRaw('B1', '=A1*2')
// engine.setRaw('C1', '=B1+5')
//
// // Test _affectedFrom — changing A1 should affect A1, B1, C1
// console.log('affected from A1:', engine._affectedFrom('A1'))  // Set { "A1", "B1", "C1" }
// console.log('affected from B1:', engine._affectedFrom('B1'))  // Set { "B1", "C1" }
// console.log('affected from C1:', engine._affectedFrom('C1'))  // Set { "C1" }
//
// // Test _topoSort — should produce valid evaluation order
// const affected = engine._affectedFrom('A1')
// const { order, cyclic } = engine._topoSort(affected)
// console.log('topo order:', order)   // ["A1", "B1", "C1"] (deps before dependents)
// console.log('cyclic:', cyclic)      // Set {} (no cycles)
//
// // Circular reference — should detect cycle
// engine.setRaw('D1', '=E1+1')
// engine.setRaw('E1', '=D1+1')
// const circAffected = engine._affectedFrom('D1')
// const circResult = engine._topoSort(circAffected)
// console.log('circular order:', circResult.order)   // [] or partial
// console.log('circular cyclic:', circResult.cyclic) // Set { "D1", "E1" }

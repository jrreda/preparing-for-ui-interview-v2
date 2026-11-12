// pnpm test src/problems/60-google-sheet-eval/test/table-engine.test.ts

// @ts-ignore
import {
  CYCLE as _CYCLE,
  ERROR as _ERROR,
  tokenize,
  toRpn,
  evalRpn as _evalRpn,
  type CellId,
  type Compiled,
} from '../../utilities/google-sheet-parser'

export type { CellId } from '../../utilities/google-sheet-parser'

export class TableEngine {
  #raw: Map<CellId, string> = new Map()
  #val: Map<CellId, string> = new Map()
  #deps: Map<CellId, Set<CellId>> = new Map()
  #reverseDeps: Map<CellId, Set<CellId>> = new Map()
  #compiled: Map<CellId, Compiled> = new Map()

  setRaw(id: CellId, raw: string): { changed: CellId[] } {
    this.#raw.set(id, raw)

    const deps = this.#compile(id, raw)
    this.setDeps(id, deps)

    // TODO: Update the value by evaluating the cell directly.
    // Replace this placeholder with: `this._evalCell(id)`
    this.#val.set(id, raw)

    const changed = [id]
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

  // Exposed for testing instead of full recompute loop
  _evalCell(_id: CellId): string {
    // TODO: Step 1 - Build the Evaluation Pipeline
    // 1. Fetch `#raw` text. If it doesn't start with `=`, just return the raw text.
    // 2. Fetch the `#compiled` properties for this cell. If it failed to compile, it contains an `{ error }` — return ERROR.
    // 3. Run `evalRpn(compiled.rpn, (refId) => this.getValue(refId))` to evaluate the formula.
    throw new Error('TODO: Evaluate cell using evalRpn with getValue as the lookup callback')
  }

  // We are copying Topo into the class early here, preparing for 19.5
  _affectedFrom(start: CellId): Set<CellId> {
    const affected = new Set<CellId>()
    const queue: CellId[] = [start]

    for (let i = 0; i < queue.length; i++) {
      const id = queue[i]!
      if (affected.has(id)) continue
      affected.add(id)
      for (const dep of this.getRevDeps(id)) queue.push(dep)
    }

    return affected
  }

  _topoSort(affected: Set<CellId>): { order: CellId[]; cyclic: Set<CellId> } {
    const inDegree = new Map<CellId, number>()

    for (const id of affected) {
      let deg = 0
      for (const dep of this.getDeps(id)) {
        if (affected.has(dep)) deg++
      }
      inDegree.set(id, deg)
    }

    const queue: CellId[] = []
    for (const [id, deg] of inDegree) {
      if (deg === 0) queue.push(id)
    }

    const order: CellId[] = []
    for (let i = 0; i < queue.length; i++) {
      const id = queue[i]!
      order.push(id)

      for (const dependent of this.getRevDeps(id)) {
        if (!affected.has(dependent)) continue
        const next = (inDegree.get(dependent) ?? 0) - 1
        inDegree.set(dependent, next)
        if (next === 0) queue.push(dependent)
      }
    }

    const cyclic = new Set<CellId>()
    if (order.length !== affected.size) {
      const inOrder = new Set(order)
      for (const id of affected) {
        if (!inOrder.has(id)) cyclic.add(id)
      }
    }

    return { order, cyclic }
  }
}

// ── Uncomment below to test your implementation ─────────────────────
// const engine = new TableEngine()
//
// // Basic values
// engine.setRaw('A1', '10')
// engine.setRaw('B1', '20')
// console.log('A1 value:', engine.getValue('A1'))  // "10"
//
// // Formula evaluation — should compute the result
// engine.setRaw('C1', '=A1+B1')
// console.log('C1 value:', engine.getValue('C1'))  // "30" (if _evalCell works)
//
// // Chained formula — depends on another formula
// engine.setRaw('D1', '=C1*2')
// console.log('D1 value:', engine.getValue('D1'))  // "60"
//
// // Division by zero — should return #ERROR
// engine.setRaw('E1', '=1/0')
// console.log('E1 value:', engine.getValue('E1'))  // "#ERROR"
//
// // Plain text — no formula, returned as-is
// engine.setRaw('F1', 'hello')
// console.log('F1 value:', engine.getValue('F1'))  // "hello"
//
// // Invalid formula — should return #ERROR
// engine.setRaw('G1', '=A1+')
// console.log('G1 value:', engine.getValue('G1'))  // "#ERROR"

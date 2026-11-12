// pnpm test src/problems/58-google-sheet-compile/test/table-engine.test.ts

import { tokenize, toRpn, type CellId, type Compiled } from '../../utilities/google-sheet-parser'

export type { CellId } from '../../utilities/google-sheet-parser'

export class TableEngine {
  /* Raw user input for each cell (e.g. "=A1+B1" or "42") */
  #raw: Map<CellId, string> = new Map()
  /* Computed display value for each cell (in this version, same as raw) */
  #val: Map<CellId, string> = new Map()
  /* Forward dependencies: cell → set of cells it depends on */
  #deps: Map<CellId, Set<CellId>> = new Map()
  /* Reverse dependencies: cell → set of cells that depend on it */
  #reverseDeps: Map<CellId, Set<CellId>> = new Map()
  /* Compiled formula AST for each cell */
  #compiled: Map<CellId, Compiled> = new Map()

  setRaw(id: CellId, raw: string): { changed: CellId[] } {
    this.#raw.set(id, raw)
    this.#val.set(id, raw) // Set value as raw text for now (no evaluation yet)

    // Step 4 - Tie it together
    // Call #compile to get deps, then call setDeps to update the graph.
    // Return { changed: [id] }
    throw new Error('TODO: compile and track dependencies')
  }

  getRaw(id: CellId): string {
    return this.#raw.get(id) ?? ''
  }

  getValue(id: CellId): string {
    return this.#val.get(id) ?? ''
  }

  /* Returns the set of cells that the given cell depends on. Lazily initializes. */
  getDeps(id: CellId): Set<CellId> {
    let s = this.#deps.get(id)
    if (!s) {
      s = new Set<CellId>()
      this.#deps.set(id, s)
    }
    return s
  }

  /* Returns the set of cells that depend on the given cell. Lazily initializes. */
  getRevDeps(id: CellId): Set<CellId> {
    let s = this.#reverseDeps.get(id)
    if (!s) {
      s = new Set<CellId>()
      this.#reverseDeps.set(id, s)
    }
    return s
  }

  /* Step 3 - Dependency Diffing
   * Updates forward and reverse dependency maps when a cell's deps change.
   * 1. Grab prevDeps from getDeps(id)
   * 2. For every old dep no longer in nextDeps, delete id from that dep's revDeps
   * 3. For every new dep not in prevDeps, add id to that dep's revDeps
   * 4. Update #deps map with nextDeps
   */
  setDeps(id: CellId, nextDeps: Set<CellId>) {
    throw new Error('TODO: Update dependency and reverse dependency maps')
  }

  /* Step 1–2 - Compile
   * Compiles a cell's raw input into RPN tokens.
   * - Plain text (no '='): store null compiled, return empty deps.
   * - Formula ('='): tokenize() → toRpn(). On error, store { error }, return empty deps.
   * - On success: extract 'ref' tokens as deps, store { rpn }, return deps set.
   */
  #compile(id: CellId, raw: string): Set<CellId> {
    throw new Error('TODO: Use tokenize and toRpn to compile expression into RPN tokens')
  }

  /* Exposed for testing */
  _getCompiled(id: CellId): Compiled | undefined {
    return this.#compiled.get(id)
  }
}

// ── Uncomment below to test your implementation ─────────────────────
// const engine = new TableEngine()
//
// // Basic value — no formula
// engine.setRaw('A1', '10')
// console.log('A1 raw:', engine.getRaw('A1'))       // "10"
// console.log('A1 value:', engine.getValue('A1'))    // "10" (no eval yet)
// console.log('A1 compiled:', engine._getCompiled('A1'))  // null (plain text)
//
// // Formula — should compile to RPN and track deps
// engine.setRaw('B1', '20')
// engine.setRaw('C1', '=A1+B1')
// console.log('C1 compiled:', engine._getCompiled('C1'))  // { rpn: [...] }
// console.log('C1 deps:', engine.getDeps('C1'))            // Set { "A1", "B1" }
// console.log('A1 revDeps:', engine.getRevDeps('A1'))      // Set { "C1" }
// console.log('B1 revDeps:', engine.getRevDeps('B1'))      // Set { "C1" }
//
// // Error — invalid formula
// engine.setRaw('D1', '=A1+')
// console.log('D1 compiled:', engine._getCompiled('D1'))  // { error: "..." }
// console.log('D1 deps:', engine.getDeps('D1'))            // Set {} (no deps on error)
//
// // Dependency update — change C1 formula, old deps should be cleaned up
// engine.setRaw('C1', '=A1*2')
// console.log('C1 deps after update:', engine.getDeps('C1'))    // Set { "A1" }
// console.log('B1 revDeps after update:', engine.getRevDeps('B1'))  // Set {} (removed)

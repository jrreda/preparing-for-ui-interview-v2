// pnpm test src/problems/57-google-sheet-basic/test/table-engine.test.ts

import type { CellId } from '../../utilities/google-sheet-parser'

export type { CellId } from '../../utilities/google-sheet-parser'

export class TableEngine {
  // TODO: Step 1 - Setup Hash Maps
  // Instantiate 4 Map structures:
  // - #raw: What the user typed ("10" or "=A1+5")
  // - #val: The computed mathematical result ("10" or "15")
  // - #deps: Direct dependencies (A1 requires B1 to compute)
  // - #reverseDeps: Reverse dependencies (B1 affects A1, so A1 recomputes if B1 changes)
  setRaw(_id: CellId, _raw: string): { changed: CellId[] } {
    // TODO: Step 4 - Basic Write API
    // Blindly set #raw and #val maps without any compilation or error checking yet.
    // Return { changed: [id] }.
    throw new Error('TODO: Implement')
  }

  getRaw(_id: CellId): string {
    // TODO: Step 2 - Basic Read APIs
    // Return the raw string input for a cell, or '' if empty
    throw new Error('TODO: Implement')
  }

  getValue(_id: CellId): string {
    throw new Error('TODO: Implement')
  }

  getDeps(_id: CellId): ReadonlySet<CellId> {
    // TODO: Step 3 - Fallback Factory
    // If the #deps Map.get() returns undefined, initialize and #set a new
    // empty Set<CellId>() to that Map before returning it, instead of throwing errors.
    throw new Error('TODO: Implement')
  }

  getRevDeps(_id: CellId): ReadonlySet<CellId> {
    // TODO: Step 3 - Fallback Factory
    throw new Error('TODO: Implement')
  }
}

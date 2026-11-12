import { describe, it, expect } from 'vitest'
import { TableEngine as SolutionEngine } from '../solution/table-engine'
import { TableEngine as StudentEngine } from '../table-engine'

const implementations = [
  { name: 'Reference', Engine: SolutionEngine },
  { name: 'Student', Engine: StudentEngine },
]

implementations.forEach(({ name, Engine }) => {
  if (name === 'Student') return
  describe(`19.3 Google Sheet Topo Sort - ${name} Solution`, () => {
    it('should detect cycles and compute topological order', () => {
      const engine = new Engine()

      // B1 depends on A1
      // C1 depends on B1
      engine.setRaw('A1', '10')
      engine.setRaw('B1', '=A1 * 2')
      engine.setRaw('C1', '=B1 + 5')

      const sorted = (engine as any)._topoSort('A1')

      // Changing A1 affects A1, B1, and C1. Order matters.
      expect(sorted.order).toEqual(['A1', 'B1', 'C1'])
      expect(sorted.cyclic.size).toBe(0)
    })

    it('should detect cycles and return partial order', () => {
      const engine = new Engine()

      // A1 -> B1 -> A1
      // C1 -> B1
      engine.setRaw('A1', '=B1')
      engine.setRaw('B1', '=A1')
      engine.setRaw('C1', '=B1')

      const sorted = (engine as any)._topoSort('A1')

      expect(sorted.cyclic.has('A1')).toBe(true)
      expect(sorted.cyclic.has('B1')).toBe(true)
      // C1 depends on B1 which is in a cycle. It depends on graph shape
      // but the minimal expectation is cycles found for A1 and B1.
    })
  })
})

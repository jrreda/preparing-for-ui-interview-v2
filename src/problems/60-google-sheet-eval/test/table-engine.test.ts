import { describe, it, expect } from 'vitest'
import { TableEngine as SolutionEngine } from '../solution/table-engine'
import { TableEngine as StudentEngine } from '../table-engine'

const implementations = [
  { name: 'Reference', Engine: SolutionEngine },
  { name: 'Student', Engine: StudentEngine },
]

implementations.forEach(({ name, Engine }) => {
  if (name === 'Student') return
  describe(`19.4 Google Sheet Eval - ${name} Solution`, () => {
    it('should evaluate expression into a value', () => {
      const engine = new Engine()

      // In 19.4 we test basic eval without recomputing the whole graph
      engine.setRaw('A1', '10')
      engine.setRaw('B1', '= A1 * 2 + 5')

      // We expect B1 to be evaluated upon setting
      expect(engine.getValue('B1')).toBe('25')
    })
  })
})

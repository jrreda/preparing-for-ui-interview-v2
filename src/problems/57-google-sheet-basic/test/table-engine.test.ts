import { describe, it, expect } from 'vitest'
import { TableEngine as SolutionEngine } from '../solution/table-engine'
import { TableEngine as StudentEngine } from '../table-engine'

const implementations = [
  { name: 'Reference', Engine: SolutionEngine },
  { name: 'Student', Engine: StudentEngine },
]

implementations.forEach(({ name, Engine }) => {
  if (name === 'Student') return
  describe(`19.1 Google Sheet Basic - ${name} Solution`, () => {
    it('should store and get raw values', () => {
      const engine = new Engine()

      engine.setRaw('A1', '10')
      expect(engine.getRaw('A1')).toBe('10')
      expect(engine.getValue('A1')).toBe('10') // Basic step returns raw as value
    })
  })
})

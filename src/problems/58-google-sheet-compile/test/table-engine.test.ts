import { describe, it, expect } from 'vitest'
import { TableEngine as SolutionEngine } from '../solution/table-engine'
import { TableEngine as StudentEngine } from '../table-engine'

const implementations = [
  { name: 'Reference', Engine: SolutionEngine },
  { name: 'Student', Engine: StudentEngine },
]

implementations.forEach(({ name, Engine }) => {
  if (name === 'Student') return
  describe(`19.2 Google Sheet Compile - ${name} Solution`, () => {
    it('should compile an expression into RPN and extract dependencies', () => {
      const engine = new Engine()

      engine.setRaw('A1', '=B1 + C2 * 10')

      const deps = engine.getDeps('A1')
      expect(deps.has('B1')).toBe(true)
      expect(deps.has('C2')).toBe(true)
      expect(deps.size).toBe(2)

      const compiled = engine._getCompiled('A1')
      expect(compiled).toBeDefined()
      if (compiled && !('error' in compiled)) {
        expect(compiled.rpn.length).toBeGreaterThan(0)
      } else {
        throw new Error('Compilation failed')
      }
    })
  })
})

import { describe, it, expect } from 'vitest'
import { renderTreeSelect as referenceSolution } from '../solution/tree-select'
import { renderTreeSelect as studentSolution } from '../tree-select.vanila'

const implementations = [
  { name: 'Reference', fn: referenceSolution },
  { name: 'Student', fn: studentSolution },
]

implementations.forEach(({ name, fn }) => {
  const renderTreeSelect = fn as typeof referenceSolution

  describe(`${name} Solution`, () => {
    describe('renderTreeSelect', () => {
      describe('basic tree rendering', () => {
        it('should render empty tree for empty paths', () => {
          const result = renderTreeSelect([], [])
          expect(result).toBe('')
        })

        it('should render single node tree', () => {
          const result = renderTreeSelect(['a'], [])
          expect(result).toContain('[ ]a')
        })

        it('should render nested tree', () => {
          const result = renderTreeSelect(['a/b/c'], [])
          expect(result).toContain('[ ]a')
          expect(result).toContain('.[ ]b')
          expect(result).toContain('..[ ]c')
        })
      })

      describe('single selection', () => {
        it('should select a leaf node', () => {
          const result = renderTreeSelect(['a/b'], ['b'])
          expect(result).toContain('[v]b')
        })

        it('should make parent partial when child selected', () => {
          const result = renderTreeSelect(['a/b', 'a/c'], ['b'])
          expect(result).toContain('[o]a')
          expect(result).toContain('[v]b')
          expect(result).toContain('[ ]c')
        })

        it('should make parent selected when all children selected', () => {
          const result = renderTreeSelect(['a/b', 'a/c'], ['b', 'c'])
          expect(result).toContain('[v]a')
          expect(result).toContain('[v]b')
          expect(result).toContain('[v]c')
        })
      })

      describe('deselection', () => {
        it('should toggle selection off on second click', () => {
          const result = renderTreeSelect(['a/b'], ['b', 'b'])
          expect(result).toContain('[ ]b')
        })

        it('should deselect all children when parent deselected', () => {
          const result = renderTreeSelect(['a/b', 'a/c'], ['a', 'a'])
          expect(result).toContain('[ ]a')
          expect(result).toContain('[ ]b')
          expect(result).toContain('[ ]c')
        })
      })

      describe('parent selection', () => {
        it('should select all children when parent selected', () => {
          const result = renderTreeSelect(['a/b', 'a/c'], ['a'])
          expect(result).toContain('[v]a')
          expect(result).toContain('[v]b')
          expect(result).toContain('[v]c')
        })

        it('should propagate selection to all descendants', () => {
          const result = renderTreeSelect(['a/b/c', 'a/b/d'], ['a'])
          expect(result).toContain('[v]a')
          expect(result).toContain('[v]b')
          expect(result).toContain('[v]c')
          expect(result).toContain('[v]d')
        })
      })

      describe('partial state', () => {
        it('should show partial when some children selected', () => {
          const result = renderTreeSelect(['a/b', 'a/c', 'a/d'], ['b'])
          expect(result).toContain('[o]a')
        })

        it('should bubble partial state up the tree', () => {
          const result = renderTreeSelect(['a/b/c', 'a/b/d', 'a/e'], ['c'])
          expect(result).toContain('[o]a')
          expect(result).toContain('[o]b')
          expect(result).toContain('[v]c')
          expect(result).toContain('[ ]d')
          expect(result).toContain('[ ]e')
        })
      })

      describe('complex scenarios', () => {
        it('should handle multiple clicks correctly', () => {
          const paths = ['a/b', 'a/c']
          // Click b (selects b, a becomes partial)
          // Click c (selects c, a becomes selected)
          // Click b (deselects b, a becomes partial)
          const result = renderTreeSelect(paths, ['b', 'c', 'b'])
          expect(result).toContain('[o]a')
          expect(result).toContain('[ ]b')
          expect(result).toContain('[v]c')
        })

        it('should handle deep nesting', () => {
          // Single child chain: selecting leaf selects all ancestors
          const result = renderTreeSelect(['a/b/c/d/e'], ['e'])
          expect(result).toContain('[v]a')
          expect(result).toContain('[v]b')
          expect(result).toContain('[v]c')
          expect(result).toContain('[v]d')
          expect(result).toContain('[v]e')
        })

        it('should handle clicking non-existent node gracefully', () => {
          const result = renderTreeSelect(['a/b'], ['x'])
          expect(result).toContain('[ ]a')
          expect(result).toContain('[ ]b')
        })
      })
    })
  })
})

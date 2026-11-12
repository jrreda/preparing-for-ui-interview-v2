import { describe, it, expect } from 'vitest'
import { stringify as referenceSolution } from '../solution/stringify'
import { stringify as studentSolution } from '../stringify.vanila'

const implementations = [
  { name: 'Reference', fn: referenceSolution },
  { name: 'Student', fn: studentSolution },
]

implementations.forEach(({ name, fn }) => {
  const stringify = fn as typeof referenceSolution

  describe(`${name} Solution`, () => {
    describe('stringify', () => {
      describe('primitives', () => {
        it('should stringify null', () => {
          expect(stringify(null)).toBe('null')
        })

        it('should stringify numbers', () => {
          expect(stringify(42)).toBe('42')
          expect(stringify(0)).toBe('0')
          expect(stringify(-1)).toBe('-1')
          expect(stringify(3.14)).toBe('3.14')
        })

        it('should stringify booleans', () => {
          expect(stringify(true)).toBe('true')
          expect(stringify(false)).toBe('false')
        })

        it('should stringify BigInt', () => {
          expect(stringify(123n)).toBe('123')
        })

        it('should stringify strings with quotes', () => {
          expect(stringify('hello')).toBe('"hello"')
          expect(stringify('')).toBe('""')
        })

        it('should stringify undefined with quotes', () => {
          expect(stringify(undefined)).toBe('"undefined"')
        })

        it('should stringify symbols with quotes', () => {
          expect(stringify(Symbol('test'))).toContain('Symbol')
        })
      })

      describe('arrays', () => {
        it('should stringify empty arrays', () => {
          expect(stringify([])).toBe('[]')
        })

        it('should stringify arrays with primitives', () => {
          expect(stringify([1, 2, 3])).toBe('[1,2,3]')
        })

        it('should stringify arrays with strings', () => {
          expect(stringify(['a', 'b'])).toBe('["a","b"]')
        })

        it('should stringify nested arrays', () => {
          expect(
            stringify([
              [1, 2],
              [3, 4],
            ]),
          ).toBe('[[1,2],[3,4]]')
        })

        it('should stringify arrays with mixed types', () => {
          expect(stringify([1, 'hello', true])).toBe('[1,"hello",true]')
        })
      })

      describe('objects', () => {
        it('should stringify empty objects', () => {
          expect(stringify({})).toBe('{  }')
        })

        it('should stringify flat objects', () => {
          const result = stringify({ a: 1, b: 2 })
          expect(result).toContain('a: 1')
          expect(result).toContain('b: 2')
        })

        it('should stringify objects with string values', () => {
          const result = stringify({ name: 'John' })
          expect(result).toBe('{ name: "John" }')
        })

        it('should stringify nested objects', () => {
          const result = stringify({ a: { b: 1 } })
          expect(result).toBe('{ a: { b: 1 } }')
        })

        it('should stringify objects with arrays', () => {
          const result = stringify({ arr: [1, 2, 3] })
          expect(result).toBe('{ arr: [1,2,3] }')
        })
      })

      describe('Map', () => {
        it('should stringify empty Map', () => {
          expect(stringify(new Map())).toBe('{  }')
        })

        it('should stringify Map with entries', () => {
          const map = new Map([
            ['a', 1],
            ['b', 2],
          ])
          const result = stringify(map)
          expect(result).toContain('a: 1')
          expect(result).toContain('b: 2')
        })

        it('should stringify Map with nested values', () => {
          const map = new Map([['key', { nested: true }]])
          const result = stringify(map)
          expect(result).toContain('nested: true')
        })
      })

      describe('Set', () => {
        it('should stringify empty Set', () => {
          expect(stringify(new Set())).toBe('[]')
        })

        it('should stringify Set with values', () => {
          expect(stringify(new Set([1, 2, 3]))).toBe('[1,2,3]')
        })

        it('should stringify Set with object values', () => {
          const result = stringify(new Set([{ a: 1 }]))
          expect(result).toContain('a: 1')
        })
      })

      describe('Date', () => {
        it('should stringify Date as locale string', () => {
          const date = new Date('2024-01-01T00:00:00')
          const result = stringify(date)
          // Result depends on locale, just check it's a string
          expect(typeof result).toBe('string')
          expect(result.length).toBeGreaterThan(0)
        })
      })

      describe('RegExp', () => {
        it('should stringify RegExp', () => {
          expect(stringify(/test/)).toBe('/test/')
          expect(stringify(/test/gi)).toBe('/test/gi')
        })
      })

      describe('complex structures', () => {
        it('should stringify deeply nested structures', () => {
          const obj = {
            users: [{ name: 'John', age: 30 }],
            active: true,
          }
          const result = stringify(obj)
          expect(result).toContain('users:')
          expect(result).toContain('name: "John"')
          expect(result).toContain('age: 30')
          expect(result).toContain('active: true')
        })

        it('should handle arrays of objects', () => {
          const result = stringify([{ a: 1 }, { b: 2 }])
          expect(result).toContain('a: 1')
          expect(result).toContain('b: 2')
        })
      })

      describe('unsupported types', () => {
        it('should return "Unsupported Type" for functions', () => {
          expect(stringify(() => {})).toBe('"Unsupported Type"')
        })
      })

      describe('circular references', () => {
        it('should handle self-referencing objects', () => {
          const obj: any = { a: 1 }
          obj.self = obj
          const result = stringify(obj)
          expect(result).toContain('[Circular]')
          expect(result).toContain('a: 1')
        })

        it('should handle self-referencing arrays', () => {
          const arr: any[] = [1, 2]
          arr.push(arr)
          const result = stringify(arr)
          expect(result).toContain('[Circular]')
          expect(result).toContain('1')
        })

        it('should handle cross-circular references', () => {
          const a: any = { name: 'a' }
          const b: any = { name: 'b' }
          a.ref = b
          b.ref = a
          const result = stringify(a)
          expect(result).toContain('[Circular]')
          expect(result).toContain('name: "a"')
          expect(result).toContain('name: "b"')
        })

        it('should handle deeply nested circular references', () => {
          const obj: any = { level1: { level2: { level3: {} } } }
          obj.level1.level2.level3.back = obj
          const result = stringify(obj)
          expect(result).toContain('[Circular]')
        })
      })
    })
  })
})

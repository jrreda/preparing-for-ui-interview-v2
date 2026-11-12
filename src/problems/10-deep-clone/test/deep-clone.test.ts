import { describe, it, expect } from 'vitest'
import { deepClone as referenceSolution } from '../solution/deep-clone'
import { deepClone as studentSolution } from '../deep-clone.vanila'

const implementations = [
  { name: 'Reference', fn: referenceSolution },
  { name: 'Student', fn: studentSolution },
]

implementations.forEach(({ name, fn }) => {
  const deepClone = fn as typeof referenceSolution

  describe(`${name} Solution`, () => {
    describe('deepClone', () => {
      describe('primitive values', () => {
        it('should return same primitive values', () => {
          expect(deepClone(1)).toBe(1)
          expect(deepClone('hello')).toBe('hello')
          expect(deepClone(true)).toBe(true)
          expect(deepClone(null)).toBe(null)
          expect(deepClone(undefined)).toBe(undefined)
        })

        it('should handle special numbers', () => {
          expect(deepClone(NaN)).toBeNaN()
          expect(deepClone(Infinity)).toBe(Infinity)
          expect(deepClone(-Infinity)).toBe(-Infinity)
        })
      })

      describe('arrays', () => {
        it('should clone empty arrays', () => {
          const original: any[] = []
          const cloned = deepClone(original)
          expect(cloned).toEqual([])
          expect(cloned).not.toBe(original)
        })

        it('should clone arrays with primitives', () => {
          const original = [1, 2, 3]
          const cloned = deepClone(original)
          expect(cloned).toEqual([1, 2, 3])
          expect(cloned).not.toBe(original)
        })

        it('should deep clone nested arrays', () => {
          const original = [
            [1, 2],
            [3, 4],
          ]
          const cloned = deepClone(original)
          expect(cloned).toEqual([
            [1, 2],
            [3, 4],
          ])
          expect(cloned).not.toBe(original)
          expect(cloned[0]).not.toBe(original[0])
        })

        it('should not affect original when modifying clone', () => {
          const original = [1, 2, 3]
          const cloned = deepClone(original)
          cloned.push(4)
          expect(original).toEqual([1, 2, 3])
          expect(cloned).toEqual([1, 2, 3, 4])
        })
      })

      describe('objects', () => {
        it('should clone empty objects', () => {
          const original = {}
          const cloned = deepClone(original)
          expect(cloned).toEqual({})
          expect(cloned).not.toBe(original)
        })

        it('should clone flat objects', () => {
          const original = { a: 1, b: 2 }
          const cloned = deepClone(original)
          expect(cloned).toEqual({ a: 1, b: 2 })
          expect(cloned).not.toBe(original)
        })

        it('should deep clone nested objects', () => {
          const original = { a: { b: { c: 1 } } }
          const cloned = deepClone(original)
          expect(cloned).toEqual({ a: { b: { c: 1 } } })
          expect(cloned).not.toBe(original)
          expect(cloned.a).not.toBe(original.a)
          expect(cloned.a.b).not.toBe(original.a.b)
        })

        it('should not affect original when modifying clone', () => {
          const original = { a: 1, nested: { b: 2 } }
          const cloned = deepClone(original)
          cloned.a = 100
          cloned.nested.b = 200
          expect(original).toEqual({ a: 1, nested: { b: 2 } })
          expect(cloned).toEqual({ a: 100, nested: { b: 200 } })
        })
      })

      describe('mixed structures', () => {
        it('should clone objects with arrays', () => {
          const original = { arr: [1, 2, 3], value: 'test' }
          const cloned = deepClone(original)
          expect(cloned).toEqual({ arr: [1, 2, 3], value: 'test' })
          expect(cloned.arr).not.toBe(original.arr)
        })

        it('should clone arrays with objects', () => {
          const original = [{ a: 1 }, { b: 2 }]
          const cloned = deepClone(original)
          expect(cloned).toEqual([{ a: 1 }, { b: 2 }])
          expect(cloned[0]).not.toBe(original[0])
        })

        it('should clone complex nested structures', () => {
          const original = {
            users: [
              { name: 'John', scores: [1, 2, 3] },
              { name: 'Jane', scores: [4, 5, 6] },
            ],
            meta: { count: 2 },
          }
          const cloned = deepClone(original)
          expect(cloned).toEqual(original)
          expect(cloned.users[0].scores).not.toBe(original.users[0].scores)
        })
      })

      describe('Map', () => {
        it('should clone empty Map', () => {
          const original = new Map()
          const cloned = deepClone(original)
          expect(cloned).toBeInstanceOf(Map)
          expect(cloned.size).toBe(0)
          expect(cloned).not.toBe(original)
        })

        it('should clone Map with primitive values', () => {
          const original = new Map([
            ['a', 1],
            ['b', 2],
          ])
          const cloned = deepClone(original)
          expect(cloned.get('a')).toBe(1)
          expect(cloned.get('b')).toBe(2)
          expect(cloned).not.toBe(original)
        })

        it('should deep clone Map with object values', () => {
          const original = new Map([['key', { nested: true }]])
          const cloned = deepClone(original)
          expect(cloned.get('key')).toEqual({ nested: true })
          expect(cloned.get('key')).not.toBe(original.get('key'))
        })
      })

      describe('Set', () => {
        it('should clone empty Set', () => {
          const original = new Set()
          const cloned = deepClone(original)
          expect(cloned).toBeInstanceOf(Set)
          expect(cloned.size).toBe(0)
          expect(cloned).not.toBe(original)
        })

        it('should clone Set with primitive values', () => {
          const original = new Set([1, 2, 3])
          const cloned = deepClone(original)
          expect(cloned.has(1)).toBe(true)
          expect(cloned.has(2)).toBe(true)
          expect(cloned.has(3)).toBe(true)
          expect(cloned).not.toBe(original)
        })

        it('should deep clone Set with object values', () => {
          const obj = { a: 1 }
          const original = new Set([obj])
          const cloned = deepClone(original)
          const clonedObj = [...cloned][0]
          expect(clonedObj).toEqual({ a: 1 })
          expect(clonedObj).not.toBe(obj)
        })
      })

      describe('Date', () => {
        it('should clone Date objects', () => {
          const original = new Date('2024-01-01')
          const cloned = deepClone(original)
          expect(cloned).toBeInstanceOf(Date)
          expect(cloned.getTime()).toBe(original.getTime())
          expect(cloned).not.toBe(original)
        })

        it('should not affect original when modifying cloned Date', () => {
          const original = new Date('2024-01-01')
          const cloned = deepClone(original)
          cloned.setFullYear(2025)
          expect(original.getFullYear()).toBe(2024)
          expect(cloned.getFullYear()).toBe(2025)
        })
      })

      describe('circular references', () => {
        it('should handle self-referencing objects', () => {
          const original: any = { a: 1 }
          original.self = original
          const cloned = deepClone(original)
          expect(cloned.a).toBe(1)
          expect(cloned.self).toBe(cloned)
          expect(cloned).not.toBe(original)
        })

        it('should handle self-referencing arrays', () => {
          const original: any[] = [1, 2]
          original.push(original)
          const cloned = deepClone(original)
          expect(cloned[0]).toBe(1)
          expect(cloned[1]).toBe(2)
          expect(cloned[2]).toBe(cloned)
          expect(cloned).not.toBe(original)
        })

        it('should handle cross-circular references', () => {
          const a: any = { name: 'a' }
          const b: any = { name: 'b' }
          a.ref = b
          b.ref = a

          const clonedA = deepClone(a)
          expect(clonedA.name).toBe('a')
          expect(clonedA.ref.name).toBe('b')
          expect(clonedA.ref.ref).toBe(clonedA)
        })

        it('should handle deeply nested circular references', () => {
          const original: any = { level1: { level2: { level3: {} } } }
          original.level1.level2.level3.back = original

          const cloned = deepClone(original)
          expect(cloned.level1.level2.level3.back).toBe(cloned)
          expect(cloned).not.toBe(original)
        })
      })
    })
  })
})

/* eslint-disable no-sparse-arrays */
import { describe, it, expect } from 'vitest'
import { deepEquals as referenceSolution } from '../solution/deep-equals'
import { deepEquals as studentSolution } from '../deep-equals.vanila'

const implementations = [
  { name: 'Reference', fn: referenceSolution },
  { name: 'Student', fn: studentSolution },
]

implementations.forEach(({ name, fn }) => {
  const deepEquals = fn as typeof referenceSolution

  describe(`${name} Solution`, () => {
    describe('deepEquals', () => {
      describe('primitive values', () => {
        it('should return true for equal numbers', () => {
          expect(deepEquals(1, 1)).toBe(true)
          expect(deepEquals(0, 0)).toBe(true)
          expect(deepEquals(-1, -1)).toBe(true)
          expect(deepEquals(3.14, 3.14)).toBe(true)
        })

        it('should return false for different numbers', () => {
          expect(deepEquals(1, 2)).toBe(false)
          expect(deepEquals(0, 1)).toBe(false)
          expect(deepEquals(3.14, 3.15)).toBe(false)
        })

        it('should return true for equal strings', () => {
          expect(deepEquals('hello', 'hello')).toBe(true)
          expect(deepEquals('', '')).toBe(true)
        })

        it('should return false for different strings', () => {
          expect(deepEquals('hello', 'world')).toBe(false)
          expect(deepEquals('hello', 'Hello')).toBe(false)
        })

        it('should return true for equal booleans', () => {
          expect(deepEquals(true, true)).toBe(true)
          expect(deepEquals(false, false)).toBe(true)
        })

        it('should return false for different booleans', () => {
          expect(deepEquals(true, false)).toBe(false)
        })

        it('should handle null values', () => {
          expect(deepEquals(null, null)).toBe(true)
          expect(deepEquals(null, undefined)).toBe(false)
          expect(deepEquals(null, 0)).toBe(false)
          expect(deepEquals(null, '')).toBe(false)
        })

        it('should handle undefined values', () => {
          expect(deepEquals(undefined, undefined)).toBe(true)
          expect(deepEquals(undefined, null)).toBe(false)
          expect(deepEquals(undefined, 0)).toBe(false)
        })

        it('should handle NaN', () => {
          // NaN !== NaN in JS, so this tests the behavior
          expect(deepEquals(NaN, NaN)).toBe(false)
        })

        it('should handle Infinity', () => {
          expect(deepEquals(Infinity, Infinity)).toBe(true)
          expect(deepEquals(-Infinity, -Infinity)).toBe(true)
          expect(deepEquals(Infinity, -Infinity)).toBe(false)
        })
      })

      describe('type coercion', () => {
        it('should return false for different types with same value', () => {
          expect(deepEquals(1, '1')).toBe(false)
          expect(deepEquals(0, false)).toBe(false)
          expect(deepEquals('', false)).toBe(false)
          expect(deepEquals([], '')).toBe(false)
        })
      })

      describe('arrays', () => {
        it('should return true for equal empty arrays', () => {
          expect(deepEquals([], [])).toBe(true)
        })

        it('should return true for equal arrays with primitives', () => {
          expect(deepEquals([1, 2, 3], [1, 2, 3])).toBe(true)
          expect(deepEquals(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(true)
          expect(deepEquals([true, false], [true, false])).toBe(true)
        })

        it('should return false for arrays with different lengths', () => {
          expect(deepEquals([1, 2], [1, 2, 3])).toBe(false)
          expect(deepEquals([1, 2, 3], [1, 2])).toBe(false)
        })

        it('should return false for arrays with different values', () => {
          expect(deepEquals([1, 2, 3], [1, 2, 4])).toBe(false)
          expect(deepEquals([1, 2, 3], [3, 2, 1])).toBe(false)
        })

        it('should return true for deeply nested equal arrays', () => {
          expect(
            deepEquals(
              [
                [1, 2],
                [3, 4],
              ],
              [
                [1, 2],
                [3, 4],
              ],
            ),
          ).toBe(true)
          expect(deepEquals([[[1]]], [[[1]]])).toBe(true)
        })

        it('should return false for deeply nested different arrays', () => {
          expect(
            deepEquals(
              [
                [1, 2],
                [3, 4],
              ],
              [
                [1, 2],
                [3, 5],
              ],
            ),
          ).toBe(false)
        })

        it('should handle arrays with mixed types', () => {
          expect(deepEquals([1, 'a', true, null], [1, 'a', true, null])).toBe(true)
          expect(deepEquals([1, 'a', true, null], [1, 'a', true, undefined])).toBe(false)
        })

        it('should handle sparse arrays', () => {
          const a = [1, , 3]
          const b = [1, , 3]
          expect(deepEquals(a, b)).toBe(true)
        })
      })

      describe('objects', () => {
        it('should return true for equal empty objects', () => {
          expect(deepEquals({}, {})).toBe(true)
        })

        it('should return true for equal flat objects', () => {
          expect(deepEquals({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true)
          expect(deepEquals({ name: 'John', age: 30 }, { name: 'John', age: 30 })).toBe(true)
        })

        it('should return true for equal objects with different key order', () => {
          expect(deepEquals({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true)
        })

        it('should return false for objects with different keys', () => {
          expect(deepEquals({ a: 1 }, { b: 1 })).toBe(false)
          expect(deepEquals({ a: 1, b: 2 }, { a: 1, c: 2 })).toBe(false)
        })

        it('should return false for objects with different values', () => {
          expect(deepEquals({ a: 1 }, { a: 2 })).toBe(false)
        })

        it('should return false for objects with different number of keys', () => {
          expect(deepEquals({ a: 1 }, { a: 1, b: 2 })).toBe(false)
          expect(deepEquals({ a: 1, b: 2 }, { a: 1 })).toBe(false)
        })

        it('should return true for deeply nested equal objects', () => {
          const obj1 = { a: { b: { c: 1 } } }
          const obj2 = { a: { b: { c: 1 } } }
          expect(deepEquals(obj1, obj2)).toBe(true)
        })

        it('should return false for deeply nested different objects', () => {
          const obj1 = { a: { b: { c: 1 } } }
          const obj2 = { a: { b: { c: 2 } } }
          expect(deepEquals(obj1, obj2)).toBe(false)
        })

        it('should handle objects with array values', () => {
          expect(deepEquals({ arr: [1, 2, 3] }, { arr: [1, 2, 3] })).toBe(true)
          expect(deepEquals({ arr: [1, 2, 3] }, { arr: [1, 2, 4] })).toBe(false)
        })

        it('should handle arrays with object elements', () => {
          expect(deepEquals([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 2 }])).toBe(true)
          expect(deepEquals([{ a: 1 }, { b: 2 }], [{ a: 1 }, { b: 3 }])).toBe(false)
        })
      })

      describe('complex nested structures', () => {
        it('should handle deeply nested mixed structures', () => {
          const obj1 = {
            users: [
              { name: 'John', scores: [1, 2, 3] },
              { name: 'Jane', scores: [4, 5, 6] },
            ],
            meta: { count: 2, active: true },
          }
          const obj2 = {
            users: [
              { name: 'John', scores: [1, 2, 3] },
              { name: 'Jane', scores: [4, 5, 6] },
            ],
            meta: { count: 2, active: true },
          }
          expect(deepEquals(obj1, obj2)).toBe(true)
        })

        it('should detect differences in deeply nested structures', () => {
          const obj1 = {
            users: [{ name: 'John', scores: [1, 2, 3] }],
          }
          const obj2 = {
            users: [{ name: 'John', scores: [1, 2, 4] }],
          }
          expect(deepEquals(obj1, obj2)).toBe(false)
        })
      })

      describe('reference equality', () => {
        it('should return true for same reference', () => {
          const obj = { a: 1 }
          expect(deepEquals(obj, obj)).toBe(true)

          const arr = [1, 2, 3]
          expect(deepEquals(arr, arr)).toBe(true)
        })
      })

      describe('circular references', () => {
        it('should handle simple circular reference in objects', () => {
          const obj1: any = { a: 1 }
          obj1.self = obj1

          const obj2: any = { a: 1 }
          obj2.self = obj2

          // Circular references should be handled correctly
          expect(deepEquals(obj1, obj2)).toBe(true)
        })

        it('should handle circular reference in arrays', () => {
          const arr1: any[] = [1, 2]
          arr1.push(arr1)

          const arr2: any[] = [1, 2]
          arr2.push(arr2)

          // Circular references should be handled correctly
          expect(deepEquals(arr1, arr2)).toBe(true)
        })

        it('should handle cross-circular references', () => {
          const obj1: any = { a: 1 }
          const obj2: any = { b: 2 }
          obj1.ref = obj2
          obj2.ref = obj1

          const obj3: any = { a: 1 }
          const obj4: any = { b: 2 }
          obj3.ref = obj4
          obj4.ref = obj3

          // Cross-circular references should be handled correctly
          expect(deepEquals(obj1, obj3)).toBe(true)
        })

        it('should handle circular references with different cycle shapes', () => {
          const a: any = {}
          a.self = a

          const b: any = {}
          const c: any = {}

          b.self = c
          c.self = b

          expect(deepEquals(a, b)).toBe(true)
        })

        it('should handle deeply nested circular references', () => {
          const obj1: any = { level1: { level2: { level3: {} } } }
          obj1.level1.level2.level3.back = obj1

          const obj2: any = { level1: { level2: { level3: {} } } }
          obj2.level1.level2.level3.back = obj2

          // Deeply nested circular references should be handled correctly
          expect(deepEquals(obj1, obj2)).toBe(true)
        })

        it('should handle lodash circular reference edge case (all should be true)', () => {
          // This is a known lodash bug - see https://github.com/lodash/lodash/issues
          // All of these comparisons should return true without stack overflow
          const a: any = {}
          a.self = a

          const b: any = { self: a }

          const c: any = {}
          c.self = c

          const d: any = { self: { self: a } }

          const e: any = { self: { self: b } }

          // All comparisons should return true (unlike lodash which has _.isEqual(b, e) === false)
          expect(deepEquals(a, b)).toBe(true)
          expect(deepEquals(a, c)).toBe(true)
          expect(deepEquals(a, d)).toBe(true)
          expect(deepEquals(a, e)).toBe(true)
          expect(deepEquals(b, c)).toBe(true)
          expect(deepEquals(b, d)).toBe(true)
          expect(deepEquals(b, e)).toBe(true) // This is false in lodash!
          expect(deepEquals(c, d)).toBe(true)
          expect(deepEquals(c, e)).toBe(true)
          expect(deepEquals(d, e)).toBe(true)
        })
      })

      describe('edge cases', () => {
        it('should handle objects with null prototype', () => {
          const obj1 = Object.create(null)
          obj1.a = 1
          const obj2 = Object.create(null)
          obj2.a = 1
          // This might throw due to getType implementation
          expect(() => deepEquals(obj1, obj2)).not.toThrow()
        })

        it('should handle functions', () => {
          const fn1 = () => {}
          const fn2 = () => {}
          // Functions are compared by reference
          expect(deepEquals(fn1, fn1)).toBe(true)
          expect(deepEquals(fn1, fn2)).toBe(false)
        })

        it('should handle Symbol values', () => {
          const sym1 = Symbol('test')
          const sym2 = Symbol('test')
          expect(deepEquals(sym1, sym1)).toBe(true)
          expect(deepEquals(sym1, sym2)).toBe(false)
        })

        it('should handle BigInt values', () => {
          expect(deepEquals(BigInt(1), BigInt(1))).toBe(true)
          expect(deepEquals(BigInt(1), BigInt(2))).toBe(false)
        })

        it('should handle empty vs non-empty structures', () => {
          expect(deepEquals({}, { a: undefined })).toBe(false)
          expect(deepEquals([], [undefined])).toBe(false)
        })

        it('should handle properties with undefined values', () => {
          expect(deepEquals({ a: undefined }, { a: undefined })).toBe(true)
          expect(deepEquals({ a: undefined }, { b: undefined })).toBe(false)
        })
      })
    })
  })
})

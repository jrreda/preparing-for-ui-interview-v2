import { describe, it, expect } from 'vitest'
import { detectType as referenceSolution } from '../solution/detect-type'
import { detectType as studentSolution } from '../detect-type.vanila'

const implementations = [
  { name: 'Reference', fn: referenceSolution },
  { name: 'Student', fn: studentSolution },
]

implementations.forEach(({ name, fn }) => {
  const detectType = fn as typeof referenceSolution

  describe(`${name} Solution`, () => {
    describe('detectType', () => {
      describe('null and undefined', () => {
        it('should return "null" for null', () => {
          expect(detectType(null)).toBe('null')
        })

        it('should return "undefined" for undefined', () => {
          expect(detectType(undefined)).toBe('undefined')
        })
      })

      describe('primitives', () => {
        it('should return "number" for numbers', () => {
          expect(detectType(42)).toBe('number')
          expect(detectType(0)).toBe('number')
          expect(detectType(-1)).toBe('number')
          expect(detectType(3.14)).toBe('number')
          expect(detectType(NaN)).toBe('number')
          expect(detectType(Infinity)).toBe('number')
        })

        it('should return "string" for strings', () => {
          expect(detectType('hello')).toBe('string')
          expect(detectType('')).toBe('string')
          expect(detectType('123')).toBe('string')
        })

        it('should return "boolean" for booleans', () => {
          expect(detectType(true)).toBe('boolean')
          expect(detectType(false)).toBe('boolean')
        })

        it('should return "symbol" for symbols', () => {
          expect(detectType(Symbol('test'))).toBe('symbol')
          expect(detectType(Symbol.for('test'))).toBe('symbol')
        })

        it('should return "bigint" for BigInt', () => {
          expect(detectType(BigInt(123))).toBe('bigint')
          expect(detectType(123n)).toBe('bigint')
        })
      })

      describe('objects', () => {
        it('should return "object" for plain objects', () => {
          expect(detectType({})).toBe('object')
          expect(detectType({ a: 1 })).toBe('object')
        })

        it('should return "array" for arrays', () => {
          expect(detectType([])).toBe('array')
          expect(detectType([1, 2, 3])).toBe('array')
        })

        it('should return "function" for functions', () => {
          expect(detectType(() => {})).toBe('function')
          expect(detectType(function () {})).toBe('function')
          expect(detectType(function named() {})).toBe('function')
        })

        it('should return "asyncfunction" for async functions', () => {
          expect(detectType(async () => {})).toBe('asyncfunction')
          expect(detectType(async function () {})).toBe('asyncfunction')
        })
      })

      describe('built-in objects', () => {
        it('should return "date" for Date', () => {
          expect(detectType(new Date())).toBe('date')
        })

        it('should return "regexp" for RegExp', () => {
          expect(detectType(/test/)).toBe('regexp')
          expect(detectType(new RegExp('test'))).toBe('regexp')
        })

        it('should return "map" for Map', () => {
          expect(detectType(new Map())).toBe('map')
        })

        it('should return "set" for Set', () => {
          expect(detectType(new Set())).toBe('set')
        })

        it('should return "weakmap" for WeakMap', () => {
          expect(detectType(new WeakMap())).toBe('weakmap')
        })

        it('should return "weakset" for WeakSet', () => {
          expect(detectType(new WeakSet())).toBe('weakset')
        })

        it('should return "promise" for Promise', () => {
          expect(detectType(Promise.resolve())).toBe('promise')
          expect(detectType(new Promise(() => {}))).toBe('promise')
        })

        it('should return "error" for Error', () => {
          expect(detectType(new Error())).toBe('error')
          expect(detectType(new TypeError())).toBe('typeerror')
        })

        it('should return "arraybuffer" for ArrayBuffer', () => {
          expect(detectType(new ArrayBuffer(8))).toBe('arraybuffer')
        })
      })

      describe('edge cases', () => {
        it('should return "object" for objects with null prototype', () => {
          const nullProto = Object.create(null)
          expect(detectType(nullProto)).toBe('object')
        })

        it('should handle boxed primitives', () => {
          expect(detectType(new Number(42))).toBe('number')
          expect(detectType(new String('hello'))).toBe('string')
          expect(detectType(new Boolean(true))).toBe('boolean')
        })
      })
    })
  })
})

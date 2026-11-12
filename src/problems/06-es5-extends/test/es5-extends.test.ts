import { describe, it, expect } from 'vitest'
import { myExtends as referenceSolution } from '../solution/es5-extends'
import { myExtends as studentSolution } from '../es5-extends.vanila'

const implementations = [
  { name: 'Reference', fn: referenceSolution },
  { name: 'Student', fn: studentSolution },
]

implementations.forEach(({ name, fn }) => {
  const myExtends = fn as typeof referenceSolution

  describe(`${name} Solution`, () => {
    describe('myExtends', () => {
      // Test fixtures
      function SuperType(this: any, _name: string) {
        this.name = _name
        this.superProp = 'super'
      }
      SuperType.prototype.greet = function () {
        return `Hello, ${this.name}`
      }

      function SubType(this: any, _name: string) {
        this.subProp = 'sub'
      }
      SubType.prototype.farewell = function () {
        return `Goodbye, ${this.name}`
      }

      it('should return a new function', () => {
        const ExtendedType = myExtends(SuperType, SubType)
        expect(typeof ExtendedType).toBe('function')
      })

      it('should apply both constructors', () => {
        const ExtendedType = myExtends(SuperType, SubType)
        const instance = new (ExtendedType as any)('Dev')

        // SuperType constructor applied
        expect(instance.name).toBe('Dev')
        expect(instance.superProp).toBe('super')

        // SubType constructor applied
        expect(instance.subProp).toBe('sub')
      })

      it('should have __proto__ as SubType.prototype', () => {
        const ExtendedType = myExtends(SuperType, SubType)
        const instance = new (ExtendedType as any)('Dev')

        expect(Object.getPrototypeOf(instance)).toBe(SubType.prototype)
      })

      it('should have __proto__.__proto__ as SuperType.prototype', () => {
        const ExtendedType = myExtends(SuperType, SubType)
        const instance = new (ExtendedType as any)('Dev')

        expect(Object.getPrototypeOf(Object.getPrototypeOf(instance))).toBe(SuperType.prototype)
      })

      it('should have ExtendedType prototype as SuperType', () => {
        const ExtendedType = myExtends(SuperType, SubType)

        expect(Object.getPrototypeOf(ExtendedType)).toBe(SuperType)
      })

      it('should inherit methods from SuperType prototype', () => {
        const ExtendedType = myExtends(SuperType, SubType)
        const instance = new (ExtendedType as any)('Dev')

        expect(instance.greet()).toBe('Hello, Dev')
      })

      it('should have methods from SubType prototype', () => {
        const ExtendedType = myExtends(SuperType, SubType)
        const instance = new (ExtendedType as any)('Dev')

        expect(instance.farewell()).toBe('Goodbye, Dev')
      })

      it('should work with instanceof', () => {
        const ExtendedType = myExtends(SuperType, SubType)
        const instance = new (ExtendedType as any)('Dev')

        // Note: instanceof behavior depends on implementation
        expect(instance instanceof SubType).toBe(true)
        expect(instance instanceof SuperType).toBe(true)
      })
    })
  })
})

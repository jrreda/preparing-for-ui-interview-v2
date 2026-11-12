import { describe, it, expect } from 'vitest'
import { throttle as referenceSolution } from '../solution/throttle'
import { throttle as studentSolution } from '../throttle.vanila'

const implementations = [
  { name: 'Reference', fn: referenceSolution },
  { name: 'Student', fn: studentSolution },
]

implementations.forEach(({ name, fn }) => {
  const throttle = fn as typeof referenceSolution

  describe(`${name} Solution`, () => {
    describe('throttle', () => {
      it('should return a function', () => {
        const throttled = throttle(() => {}, 100)
        expect(typeof throttled).toBe('function')
      })

      it('should execute immediately on first call', () => {
        let callCount = 0
        const throttled = throttle(() => {
          callCount++
        }, 100)

        throttled()
        expect(callCount).toBe(1)
      })

      it('should ignore calls within delay period', () => {
        let callCount = 0
        const throttled = throttle(() => {
          callCount++
        }, 100)

        throttled()
        throttled()
        throttled()

        expect(callCount).toBe(1)
      })

      it('should allow call after delay period', async () => {
        let callCount = 0
        const throttled = throttle(() => {
          callCount++
        }, 50)

        throttled()
        expect(callCount).toBe(1)

        await new Promise((r) => setTimeout(r, 100))

        throttled()
        expect(callCount).toBe(2)
      })

      it('should pass arguments to the function', () => {
        let result = ''
        const throttled = throttle((msg: string) => {
          result = msg
        }, 100)

        throttled('hello')
        expect(result).toBe('hello')
      })

      it('should use first call arguments when throttled', () => {
        let result = ''
        const throttled = throttle((msg: string) => {
          result = msg
        }, 100)

        throttled('a')
        throttled('b')
        throttled('c')

        expect(result).toBe('a')
      })

      it('should not reopen throttle window because of stacked timers', async () => {
        let callCount = 0

        const throttled = throttle(() => {
          callCount++
        }, 50)

        throttled()
        expect(callCount).toBe(1)

        await new Promise((r) => setTimeout(r, 10))
        throttled()

        await new Promise((r) => setTimeout(r, 10))
        throttled()

        await new Promise((r) => setTimeout(r, 35))

        throttled()
        expect(callCount).toBe(2)

        await new Promise((r) => setTimeout(r, 10))
        throttled()

        expect(callCount).toBe(2)
      })
    })
  })
})

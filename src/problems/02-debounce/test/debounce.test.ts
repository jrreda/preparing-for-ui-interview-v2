import { describe, it, expect } from 'vitest'
import { debounce as referenceSolution } from '../solution/debounce'
import { debounce as studentSolution } from '../debounce.vanila'

const implementations = [
  { name: 'Reference', fn: referenceSolution },
  { name: 'Student', fn: studentSolution },
]

implementations.forEach(({ name, fn }) => {
  const debounce = fn as typeof referenceSolution

  describe(`${name} Solution`, () => {
    describe('debounce', () => {
      it('should return a function', () => {
        const debounced = debounce(() => {}, 100)
        expect(typeof debounced).toBe('function')
      })

      it('should delay execution', async () => {
        let callCount = 0
        const debounced = debounce(() => {
          callCount++
        }, 50)

        debounced()
        expect(callCount).toBe(0)

        await new Promise((r) => setTimeout(r, 100))
        expect(callCount).toBe(1)
      })

      it('should reset timer on subsequent calls', async () => {
        let callCount = 0
        const debounced = debounce(() => {
          callCount++
        }, 50)

        debounced()
        await new Promise((r) => setTimeout(r, 30))
        debounced() // Reset timer
        await new Promise((r) => setTimeout(r, 30))

        expect(callCount).toBe(0) // Still waiting

        await new Promise((r) => setTimeout(r, 50))
        expect(callCount).toBe(1)
      })

      it('should pass arguments to the function', async () => {
        let result = ''
        const debounced = debounce((msg: string) => {
          result = msg
        }, 50)

        debounced('hello')
        await new Promise((r) => setTimeout(r, 100))

        expect(result).toBe('hello')
      })

      it('should use the last call arguments', async () => {
        let result = ''
        const debounced = debounce((msg: string) => {
          result = msg
        }, 50)

        debounced('a')
        debounced('b')
        debounced('c')

        await new Promise((r) => setTimeout(r, 100))
        expect(result).toBe('c')
      })

      it('should preserve apply() context', async () => {
        let capturedValue: number | undefined

        const debounced = debounce(function (this: { value: number }) {
          capturedValue = this.value
        }, 50)

        const context = { value: 42 }

        debounced.apply(context)
        await new Promise((r) => setTimeout(r, 100))

        expect(capturedValue).toBe(42)
      })

      it('should not share timer state between debounce instances', async () => {
        const fired: string[] = []
        const first = debounce(() => {
          fired.push('first')
        }, 50)
        const second = debounce(() => {
          fired.push('second')
        }, 50)

        first()
        second()

        await new Promise((r) => setTimeout(r, 100))

        expect(fired.sort()).toEqual(['first', 'second'])
      })
    })
  })
})

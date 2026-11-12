import { describe, it, expect } from 'vitest'
import { MyPromise as referenceSolution } from '../solution/promise'
import { MyPromise as studentSolution } from '../promise.vanila'

const implementations = [
  { name: 'Reference', fn: referenceSolution },
  { name: 'Student', fn: studentSolution },
]

implementations.forEach(({ name, fn }) => {
  const MyPromise = fn as typeof referenceSolution

  describe(`${name} Solution`, () => {
    describe('MyPromise', () => {
      describe('structure', () => {
        it('MyPromise.prototype.then should exist', () => {
          expect(typeof MyPromise.prototype.then).toBe('function')
        })

        it('then() should return a new Promise', () => {
          const p1 = new MyPromise(() => {})
          const p2 = p1.then()
          expect(p2).toBeInstanceOf(MyPromise)
          expect(p2).not.toBe(p1)
        })

        it('catch() should exist', () => {
          expect(typeof MyPromise.prototype.catch).toBe('function')
        })

        it('catch() should return a new Promise', () => {
          const p1 = new MyPromise(() => {})
          const p2 = p1.catch(() => {})
          expect(p2).toBeInstanceOf(MyPromise)
          expect(p2).not.toBe(p1)
        })
      })

      describe('constructor', () => {
        it('new MyPromise(() => {})', () => {
          const p = new MyPromise(() => {})
          expect(p).toBeInstanceOf(MyPromise)
        })
      })

      describe('settlement', () => {
        it('Promise could only be settled once', async () => {
          let settleCount = 0
          const p = new MyPromise((resolve) => {
            resolve(1)
            resolve(2)
          })
          await p.then(() => {
            settleCount++
          })
          expect(settleCount).toBe(1)
        })

        it('Promise could only be resolved once', async () => {
          const values: number[] = []
          const p = new MyPromise((resolve) => {
            resolve(1)
            resolve(2)
          })
          await p.then((v: number) => {
            values.push(v)
          })
          expect(values).toEqual([1])
        })

        it('Promise could only be rejected once', async () => {
          const values: number[] = []
          const p = new MyPromise((_, reject) => {
            reject(1)
            reject(2)
          })
          await p.catch((v: number) => {
            values.push(v)
          })
          expect(values).toEqual([1])
        })

        it('Promise could only be resolved or rejected once', async () => {
          const values: number[] = []
          const p = new MyPromise((resolve, reject) => {
            resolve(1)
            reject(2)
          })
          await p.then(
            (v: number) => {
              values.push(v)
            },
            (v: number) => {
              values.push(v)
            },
          )
          expect(values).toEqual([1])
        })
      })

      describe('then()', () => {
        it('then(onFulfilled)', async () => {
          let result = 0
          await new MyPromise((resolve) => resolve(42)).then((v: number) => {
            result = v
          })
          expect(result).toBe(42)
        })

        it('then(onFulfilled, onRejected)', async () => {
          let result = 0
          await new MyPromise((_, reject) => reject(42)).then(
            () => {
              result = 1
            },
            (v: number) => {
              result = v
            },
          )
          expect(result).toBe(42)
        })

        it('then(onFulfilled, onRejected) rejection handler should swallow the rejection', async () => {
          let caught = false
          await new MyPromise((_, reject) => reject('error'))
            .then(undefined, () => {
              /* swallow */
            })
            .then(() => {
              caught = true
            })
          expect(caught).toBe(true)
        })
      })

      describe('catch()', () => {
        it('MyPromise.prototype.catch should work', async () => {
          let result = ''
          await new MyPromise((_, reject) => reject('error')).catch((e: string) => {
            result = e
          })
          expect(result).toBe('error')
        })

        it('catch() should swallow error and works like then()', async () => {
          let continued = false
          await new MyPromise((_, reject) => reject('error'))
            .catch(() => 'recovered')
            .then(() => {
              continued = true
            })
          expect(continued).toBe(true)
        })
      })

      describe('chaining', () => {
        it('support chaining then().then().then()', async () => {
          let result = 0
          await new MyPromise((resolve) => resolve(1))
            .then((v: number) => v + 1)
            .then((v: number) => v + 1)
            .then((v: number) => {
              result = v
            })
          expect(result).toBe(3)
        })

        it('multiple then()', async () => {
          const results: number[] = []
          const p = new MyPromise((resolve) => resolve(1))
          await Promise.all([
            p.then((v: number) => {
              results.push(v)
            }),
            p.then((v: number) => {
              results.push(v * 2)
            }),
            p.then((v: number) => {
              results.push(v * 3)
            }),
          ])
          expect(results.sort()).toEqual([1, 2, 3])
        })

        it('then() returns a resolved promise if callback returns value', async () => {
          let result = ''
          await new MyPromise((resolve) => resolve('a'))
            .then((v: string) => v + 'b')
            .then((v: string) => {
              result = v
            })
          expect(result).toBe('ab')
        })

        it('then() returns a resolved promise of undefined if callback returns nothing', async () => {
          let result: any = 'not-undefined'
          await new MyPromise((resolve) => resolve('a'))
            .then(() => {
              /* return nothing */
            })
            .then((v: any) => {
              result = v
            })
          expect(result).toBe(undefined)
        })

        it('then(callback) return a promise chained to the promise(fulfilled) from callback', async () => {
          let result = 0
          await new MyPromise((resolve) => resolve(1))
            .then((v: number) => new MyPromise((res) => res(v + 10)))
            .then((v: number) => {
              result = v
            })
          expect(result).toBe(11)
        })

        it('then(callback) return a promise chained to the promise(rejected) from callback', async () => {
          let result = ''
          await new MyPromise((resolve) => resolve(1))
            .then(() => new MyPromise((_, rej) => rej('error')))
            .catch((e: string) => {
              result = e
            })
          expect(result).toBe('error')
        })
      })

      describe('error handling', () => {
        it('error in constructor should reject', async () => {
          let caught = ''
          await new MyPromise(() => {
            throw new Error('constructor error')
          }).catch((e: Error) => {
            caught = e.message
          })
          expect(caught).toBe('constructor error')
        })

        it('error in fulfill handler should reject', async () => {
          let caught = ''
          await new MyPromise((resolve) => resolve(1))
            .then(() => {
              throw new Error('handler error')
            })
            .catch((e: Error) => {
              caught = e.message
            })
          expect(caught).toBe('handler error')
        })
      })

      describe('async behavior', () => {
        it('constructor should be sync, then handlers should be async', () => {
          const order: number[] = []
          order.push(1)
          new MyPromise((resolve) => {
            order.push(2)
            resolve(undefined)
            order.push(3)
          }).then(() => {
            order.push(5)
          })
          order.push(4)
          // After sync execution: [1, 2, 3, 4]
          // After microtask: [1, 2, 3, 4, 5]
          expect(order).toEqual([1, 2, 3, 4])
        })
      })

      describe('static methods', () => {
        it('MyPromise.resolve(1)', async () => {
          let result = 0
          await MyPromise.resolve(1).then((v: number) => {
            result = v
          })
          expect(result).toBe(1)
        })

        it('MyPromise.reject(1)', async () => {
          let result = 0
          await MyPromise.reject(1).catch((v: number) => {
            result = v
          })
          expect(result).toBe(1)
        })
      })
    })
  })
})

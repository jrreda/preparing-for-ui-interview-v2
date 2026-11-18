// pnpm test src/problems/02-debounce/test/debounce.test.ts

type AnyFunction = (...args: any[]) => any
type Debounced<T extends AnyFunction> = (...args: Parameters<T>) => void
type TimerId = ReturnType<typeof setTimeout>

export function debounce<T extends AnyFunction>(fn: T, delay: number): Debounced<T> {
  // Shared by every call; a new call cancels the previous wait
  let timerId: TimerId | null = null

  return function debounced(this: unknown, ...args: Parameters<T>): void {
    // Only the latest call is allowed to run
    if (timerId) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      // Arrow keeps the caller's `this`; apply forwards it with the latest args
      fn.apply(this, args)
    }, delay)
  }
}

// --- Examples ---
// Uncomment to test your implementation:

// const log = debounce((msg: string) => console.log(msg), 300)
// log('a')  // cancelled by next call
// log('b')  // cancelled by next call
// log('c')  // only this one fires after 300ms → "c"

/**
 * Track a promise.
 *
 * `null` means nothing has started. A new promise replaces the previous one.
 * Only the latest promise may update the returned state.
 *
 * Expected usage:
 *   const { status, value, error } = usePromise(promise)
 *
 * Steps:
 * 1. When `promise` is null, status is `idle`.
 * 2. When `promise` changes, status becomes `pending` and the previous value and error are cleared.
 * 3. When it fulfills, store the value only if this promise is still current.
 * 4. When it rejects, store the error the same way.
 * 5. Ignore a settlement that belongs to an older promise.
 * 6. Do not update state after the component unmounts.
 */
export type TPromiseState<T> = {
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected'
  value?: T
  error?: unknown
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function usePromise<T>(promise: Promise<T> | null): TPromiseState<T> {}

/**
 * Debounce a value.
 *
 * The returned value stays put until `delay` milliseconds have passed
 * without `value` changing. A newer change restarts the wait.
 *
 * Expected usage:
 *   const debouncedQuery = useDebounce(query, 500)
 *
 * Steps:
 * 1. Keep the debounced value in state. Start it as `value`.
 * 2. When `value` or `delay` changes, wait `delay` ms, then store the latest `value`.
 * 3. If `value` changes again before the wait ends, cancel the previous timer.
 * 4. Clear the timer when the component unmounts.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useDebounce<T>(value: T, delay: number): T {}

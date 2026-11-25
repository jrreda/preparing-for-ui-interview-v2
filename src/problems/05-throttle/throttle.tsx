/**
 * Throttle a value.
 *
 * The returned value updates at most once per `delay` milliseconds.
 * The first change is kept immediately. Changes inside the wait are ignored.
 * The next change after the wait is kept immediately.
 *
 * Expected usage:
 *   const throttledCount = useThrottle(count, 1000)
 *
 * Steps:
 * 1. Keep the throttled value in state. Start it as `value`.
 * 2. Remember when the last value was accepted. A ref survives re-renders.
 * 3. When `value` changes, accept it only if `delay` ms have passed since the last accept.
 * 4. Ignore changes that arrive inside the wait.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useThrottle<T>(value: T, delay: number): T {}

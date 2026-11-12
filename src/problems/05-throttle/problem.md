# Throttle

**Difficulty: Easy**

## Problem

Implement a `throttle` function that limits the rate at which a function can fire. The function will execute at most once per specified time period.

## Use Cases

- Scroll handler: Fire at most once per 100ms
- API rate limiting: Limit requests per second
- Gaming: Cap button press frequency

## Signature

```typescript
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void
```

## Example

```typescript
const log = throttle((msg: string) => console.log(msg), 1000)

log('a') // Logs 'a' immediately
log('b') // Ignored (within 1000ms)
log('c') // Ignored (within 1000ms)
// ... after 1000ms
log('d') // Logs 'd'
```

## Hints

1. Track the timestamp of the last execution
2. Use `Date.now()` to check elapsed time
3. Only execute if enough time has passed

## Run Tests

```bash
pnpm test src/problems/05-throttle/test/throttle.test.ts
```

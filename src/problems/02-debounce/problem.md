# Debounce

**Difficulty: Easy**

## Problem

Implement a `debounce` function that delays invoking a function until after a specified wait time has elapsed since the last time it was invoked.

## Use Cases

- Search input: Wait until user stops typing before sending API request
- Window resize: Don't fire handler on every pixel change
- Button clicks: Prevent accidental double-clicks

## Signature

```typescript
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void
```

## Example

```typescript
const log = debounce((msg: string) => console.log(msg), 1000)

log('a') // Timer starts
log('b') // Timer resets
log('c') // Timer resets
// ... after 1000ms of no calls: logs 'c'
```

## Hints

1. Use `setTimeout` to delay execution
2. Clear previous timeout on each call with `clearTimeout`
3. Preserve `this` context with `.apply()`

## Run Tests

```bash
pnpm test src/problems/02-debounce/test/debounce.test.ts
```

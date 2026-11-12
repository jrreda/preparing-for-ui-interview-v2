# Promise

**Difficulty: Hard**

## Problem

Implement your own `MyPromise` class that follows the Promises/A+ specification.

## Requirements

- Constructor takes an executor function: `new MyPromise((resolve, reject) => {})`
- Implement `.then(onFulfilled, onRejected)` method
- Implement `.catch(onRejected)` method
- Handle async resolution/rejection
- Support promise chaining
- Handle error propagation
- Static methods: `MyPromise.resolve()` and `MyPromise.reject()`

## Signature

```typescript
class MyPromise<T> {
  constructor(executor: (resolve: (value: T) => void, reject: (reason: any) => void) => void)
  then<R>(onFulfilled?: (value: T) => R, onRejected?: (reason: any) => R): MyPromise<R>
  catch<R>(onRejected: (reason: any) => R): MyPromise<T | R>
  static resolve<T>(value: T): MyPromise<T>
  static reject<T>(reason: any): MyPromise<T>
}
```

## Implementation Hints

### State Management

- Track three states: `pending`, `fulfilled`, `rejected`
- Store the resolved value or rejection reason
- Use a flag to prevent double resolution (a promise can only settle once)

### The `then()` Method Logic

1. **Create a handler object** that stores the `onFulfilled` and `onRejected` callbacks
2. **Create a new promise** that will be returned - this enables chaining
3. **Capture the new promise's resolve/reject** functions and attach them to the handler
4. **Store the handler** in a queue for later execution
5. **If already settled**, execute handlers immediately
6. **Return the new promise** to enable chaining

### Handler Execution Logic

- When the promise settles, iterate through all stored handlers
- Pick the appropriate callback based on fulfilled/rejected state
- Execute callbacks **asynchronously** using `queueMicrotask()`
- If callback returns a value, resolve the chained promise with it
- If callback returns a promise, chain to that promise's resolution
- If callback throws, reject the chained promise

### Error Propagation

- Wrap handler execution in try/catch
- Default `onRejected` should re-throw: `(err) => { throw err }`
- Default `onFulfilled` should pass through: `(v) => v`

### Settlement Logic

- Resolve/reject should only work once (guard with a flag)
- If resolving with a promise, wait for it to settle
- After settling, execute all queued handlers

## TypeScript Hints

### Generic Type Parameter

- Use `MyPromise<T>` where `T` is the resolved value type
- `then<R>()` returns `MyPromise<R>` where `R` is the callback return type

### Key Types to Define

- `Executor<T>`: The constructor callback type
- `OnFulfilled<T, R>`: Callback that takes `T`, returns `R` or `PromiseLike<R>`
- `OnRejected<R>`: Callback that takes `any` reason, returns `R`
- `Handler<T>`: Internal interface with callbacks and resolve/reject functions

### Catch Return Type

- `catch<R>()` should return `MyPromise<T | R>` (union of success and recovery types)
- Default `R = never` so `T | never` simplifies to `T` when no handler

### Private Fields

- Use `#` prefix for truly private fields (e.g., `#status`, `#handlers`)
- Arrow function properties for methods that need `this` binding

## Example

```typescript
const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => resolve('Hello'), 100)
})

promise.then((value) => value + ' World').then((value) => console.log(value)) // "Hello World"
```

## Run Tests

```bash
pnpm test src/problems/14-promise/test/promise.test.ts
```

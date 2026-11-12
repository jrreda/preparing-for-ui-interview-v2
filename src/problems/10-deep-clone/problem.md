# Deep Clone

## Problem

Implement a `deepClone` function that creates a deep copy of a value. The cloned value should be completely independent from the original.

## Requirements

1. **Primitives**: Return as-is (immutable)
2. **Arrays**: Create new array, recursively clone elements
3. **Objects**: Create new object, recursively clone properties
4. **Map**: Create new Map, clone entries
5. **Set**: Create new Set, clone values
6. **Date**: Create new Date with same timestamp
7. **Circular references**: Handle without stack overflow

## Signature

```typescript
function deepClone<T>(value: T): T
```

## Examples

```typescript
// Primitives (returned as-is)
deepClone(42) // 42
deepClone('hello') // 'hello'

// Arrays
const arr = [1, 2, 3]
const clonedArr = deepClone(arr)
clonedArr.push(4)
arr // [1, 2, 3] - unaffected

// Objects
const obj = { a: { b: 1 } }
const clonedObj = deepClone(obj)
clonedObj.a.b = 2
obj.a.b // 1 - unaffected

// Map
const map = new Map([['key', { value: 1 }]])
const clonedMap = deepClone(map)

// Set
const set = new Set([{ a: 1 }])
const clonedSet = deepClone(set)

// Date
const date = new Date('2024-01-01')
const clonedDate = deepClone(date)

// Circular reference
const circular: any = { a: 1 }
circular.self = circular
const cloned = deepClone(circular)
cloned.self === cloned // true
```

## Edge Cases

- Empty objects and arrays
- Nested structures (objects in arrays, arrays in objects)
- Self-referencing objects
- Cross-circular references (A → B → A)

## Provided Utilities

The `detectType` function from `@course/utils` is pre-imported in your student file. It returns the type of any value as a lowercase string (e.g., `"object"`, `"array"`, `"map"`, `"set"`, `"date"`).

## Hints

1. Use a `Map` cache to track cloned objects for circular reference handling
2. Store the clone in cache **before** recursing to handle cycles
3. Use `forEach` for iterating over `Map` and `Set`

## Run Tests

```bash
pnpm test src/problems/10-deep-clone/test/deep-clone.test.ts
```

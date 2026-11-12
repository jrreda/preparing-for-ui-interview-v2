# Deep Equals

## Problem

Implement a `deepEquals` function that compares two values for deep equality. The function should return `true` if the two values are structurally identical, and `false` otherwise.

## Requirements

1. **Primitive values**: Compare using strict equality (`===`)
   - Numbers, strings, booleans, `null`, `undefined`, `Symbol`, `BigInt`
   - Handle special cases like `NaN` (note: `NaN !== NaN` in JavaScript)

2. **Objects and Arrays**: Recursively compare all properties/elements
   - Same number of keys/elements
   - Same keys exist in both objects
   - All values are deeply equal

3. **Type checking**: Values of different types should not be equal
   - `1` should not equal `"1"`
   - `[]` should not equal `{}`
   - `null` should not equal `undefined`

4. **Circular references**: Handle objects with circular references without causing stack overflow
   - Track visited object pairs during comparison
   - Return `true` if the same pair is encountered again

## Signature

```typescript
function deepEquals(a: any, b: any): boolean
```

## Examples

```typescript
// Primitives
deepEquals(1, 1) // true
deepEquals('hello', 'hello') // true
deepEquals(null, null) // true
deepEquals(null, undefined) // false

// Arrays
deepEquals([1, 2, 3], [1, 2, 3]) // true
deepEquals([1, 2], [1, 2, 3]) // false

// Objects
deepEquals({ a: 1, b: 2 }, { a: 1, b: 2 }) // true
deepEquals({ a: 1, b: 2 }, { b: 2, a: 1 }) // true (order doesn't matter)
deepEquals({ a: 1 }, { a: 2 }) // false

// Nested structures
deepEquals({ users: [{ name: 'John' }] }, { users: [{ name: 'John' }] }) // true

// Circular references
const a = { value: 1 }
a.self = a
const b = { value: 1 }
b.self = b
deepEquals(a, b) // true (should not stack overflow)
```

## Edge Cases

- Objects with `null` prototype (`Object.create(null)`)
- Sparse arrays
- Functions (compare by reference)
- Properties with `undefined` values vs missing properties

Your implementation should return `true` for all valid structural comparisons including this edge case.

## Provided Utilities

The `detectType` function from `@course/utils` is pre-imported in your student file. It returns the type of any value as a lowercase string (e.g., `"object"`, `"array"`, `"null"`).

## Hints

1. Use `detectType()` to compare the types of `a` and `b`
2. Use a `Map` to track visited object pairs for circular reference detection
3. Store the pair `(a, b)` before recursing, not after
4. Check `store.has(a)` before comparing `store.get(a) === b` to avoid false positives with `undefined`

## Run Tests

```bash
pnpm test src/problems/09-deep-equals/test/deep-equals.test.ts
```

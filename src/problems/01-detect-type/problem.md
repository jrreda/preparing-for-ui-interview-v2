# Detect Type

## Problem

Implement a `detectType` function that returns the type of any JavaScript value as a lowercase string.

## Requirements

- Return `"null"` for `null`
- Return `"undefined"` for `undefined`
- Return the constructor name (lowercase) for all other values
- Handle objects with `null` prototype gracefully

## Signature

```typescript
type TType =
  | 'null'
  | 'undefined'
  | 'string'
  | 'number'
  | 'boolean'
  | 'symbol'
  | 'bigint'
  | 'object'
  | 'array'
  | 'function'
  | 'date'
  | 'regexp'
  | 'map'
  | 'set'
  | 'weakmap'
  | 'weakset'
  | 'error'
  | 'promise'
  | 'arraybuffer'
  | string

function detectType(value: any): TType
```

## Examples

```typescript
// Null and undefined
detectType(null) // "null"
detectType(undefined) // "undefined"

// Primitives
detectType(42) // "number"
detectType('hello') // "string"
detectType(true) // "boolean"
detectType(Symbol()) // "symbol"
detectType(123n) // "bigint"

// Objects
detectType({}) // "object"
detectType([]) // "array"
detectType(() => {}) // "function"

// Built-in objects
detectType(new Date()) // "date"
detectType(/regex/) // "regexp"
detectType(new Map()) // "map"
detectType(new Set()) // "set"
detectType(new Error()) // "error"
detectType(Promise.resolve()) // "promise"
```

## Why Not `typeof`?

The built-in `typeof` operator has limitations:

- `typeof null` returns `"object"` (historical bug)
- `typeof []` returns `"object"`
- Can't distinguish between different object types

## Hints

1. Check for `null`/`undefined` first using `value == null`
2. Use `Object.getPrototypeOf(value)` to get the prototype
3. Access `.constructor.name` and lowercase it
4. Use nullish coalescing (`??`) to handle objects with null prototype

## Run Tests

```bash
pnpm test src/problems/01-detect-type/test/detect-type.test.ts
```

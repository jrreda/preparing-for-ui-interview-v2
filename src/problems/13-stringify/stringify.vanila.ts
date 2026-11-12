// pnpm test src/problems/13-stringify/test/stringify.test.ts

import { detectType } from '@course/utils'

/**
 * Converts a value to its string representation.
 *
 * Expected output by type:
 * - null:      null             → "null"
 * - number:    42               → "42"
 * - bigint:    42n              → "42"
 * - boolean:   true             → "true"
 * - symbol:    Symbol('x')      → '"Symbol(x)"'
 * - undefined: undefined        → '"undefined"'
 * - string:    "hello"          → '"hello"'
 * - object:    {a: 1, b: "x"}  → '{ a: 1, b: "x" }'
 * - map:       Map{a => 1}     → '{ a: 1 }'
 * - array:     [1, "a", true]   → '[1,"a",true]'
 * - set:       Set{1, 2}       → '[1,2]'
 * - date:      new Date()       → '3/7/2026, 5:47:00 PM'  (toLocaleString)
 * - regexp:    /abc/gi          → '/abc/gi'
 * - circular:  (ref to self)    → '[Circular]'
 * - other:     unknown type     → '"Unsupported Type"'
 */
export const stringify = (a: any, cache = new Set()) => {
  const type = detectType(a)
  switch (type) {
    case 'null':
    case 'number':
    case 'bigint':
    case 'boolean':
    case 'symbol':
    case 'undefined':
    case 'string':
    case 'object':
    case 'map':
    case 'array':
    case 'set':
    case 'date':
    case 'regexp':
    default:
      return '"Unsupported Type"'
  }
}

// --- Examples ---
// Uncomment to test your implementation:

// console.log(stringify(null))              // Expected: null
// console.log(stringify(42))                // Expected: 42
// console.log(stringify(true))              // Expected: true
// console.log(stringify('hello'))           // Expected: "hello"
// console.log(stringify([1, 'a', true]))    // Expected: [1,"a",true]
// console.log(stringify({ a: 1, b: 'x' })) // Expected: { a: 1, b: "x" }
// console.log(stringify(new Date()))        // Expected: 3/7/2026, 8:15:00 PM (toLocaleString)
// console.log(stringify(/abc/gi))           // Expected: /abc/gi
// const circular: any = { a: 1 }; circular.self = circular
// console.log(stringify(circular))          // Expected: { a: 1, self: [Circular] }

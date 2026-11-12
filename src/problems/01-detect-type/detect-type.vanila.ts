// pnpm test src/problems/01-detect-type/test/detect-type.test.ts

export type TType =
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

export const detectType = (value: any): TType => {
    throw new Error('Not implemented')
}

// --- Examples ---
// Uncomment to test your implementation:

// console.log(detectType(null))        // Expected: "null"
// console.log(detectType(undefined))   // Expected: "undefined"
// console.log(detectType(42))          // Expected: "number"
// console.log(detectType('hello'))     // Expected: "string"
// console.log(detectType(true))        // Expected: "boolean"
// console.log(detectType([]))          // Expected: "array"
// console.log(detectType({}))          // Expected: "object"
// console.log(detectType(new Date()))  // Expected: "date"
// console.log(detectType(new Map()))   // Expected: "map"
// console.log(detectType(new Set()))   // Expected: "set"
// console.log(detectType(/regex/))     // Expected: "regexp"

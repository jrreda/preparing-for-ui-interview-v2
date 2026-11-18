/**
 * 1.2 First of Array
 *
 * Implement a generic `First<T>` that takes an Array `T` and returns its first element's type.
 *
 * @example
 * type arr1 = ['a', 'b', 'c']
 * type arr2 = [3, 2, 1]
 *
 * type head1 = First<arr1> // 'a'
 * type head2 = First<arr2> // 3
 *
 * type arr3 = []
 * type head3 = First<arr3> // never
 */

import type { Equal, Expect } from '@course/types'

/* _____________ Your Code Here _____________ */

type First<T extends readonly any[]> = T extends[infer FirstElement, ...any] ? FirstElement : never ;

/* _____________ Test Cases _____________ */

type cases = [
  Expect<Equal<First<[3, 2, 1]>, 3>>,
  Expect<Equal<First<[() => 123, { a: string }]>, () => 123>>,
  Expect<Equal<First<[]>, never>>,
  Expect<Equal<First<[undefined]>, undefined>>,
]

type errors = [
  // @ts-expect-error strings are not arrays
  First<'notArray'>,
  // @ts-expect-error objects are not arrays
  First<{ 0: 'arrayLike' }>,
]

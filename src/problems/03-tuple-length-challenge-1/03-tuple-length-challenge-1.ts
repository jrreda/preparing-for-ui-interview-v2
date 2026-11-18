/**
 * 1.1 Tuple Length
 *
 * For a given tuple, you need to create a generic `Length` that picks the length of the tuple
 * (as a specific number literal, not just `number`).
 *
 * @example
 * type tesla = ['tesla', 'model 3', 'model X', 'model Y']
 * type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']
 *
 * type teslaLength = Length<tesla>  // 4
 * type spaceXLength = Length<spaceX> // 5
 */

import type { Equal, Expect } from '@course/types'

/* _____________ Your Code Here _____________ */

type Length<T extends readonly any[]> = T['length'];

/* _____________ Test Cases _____________ */

const tesla = ['tesla', 'model 3', 'model X', 'model Y'] as const
const spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT'] as const

type cases = [
  Expect<Equal<Length<typeof tesla>, 4>>,
  Expect<Equal<Length<typeof spaceX>, 5>>,
  // @ts-expect-error - should only accept arrays/tuples
  Length<5>,
  // @ts-expect-error strings are not valid tuples
  Length<'hello world'>,
]

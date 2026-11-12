// pnpm test src/problems/41-calculator/test/calculator.utils.test.ts
import { useState } from 'react'
import css from './calculator.module.css'
import flex from '@course/styles'
import cx from '@course/cx'
import { BUTTONS, INVALID_VALUE } from './calculator.utils'

export const Calculator = () => {
  // Step 1: State — single string state for the display value, initialized to '0'
  // Step 2: handleButtonClick — use event delegation on the keypad section:
  //   - Read `data-label` from the clicked button
  //   - Look up the button in BUTTONS map and call its `action(state, label)`
  //   - Update state with the result
  // Step 3: Render — output display + keypad section with BUTTONS.values() mapped to <button> elements
  //   - Each button has `data-label` attribute and className styling
  //   - Disable all buttons except 'AC' when state === INVALID_VALUE
  return <div>TODO: Implement</div>
}

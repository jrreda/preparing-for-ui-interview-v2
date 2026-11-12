// pnpm test src/problems/41-calculator/test/calculator.utils.test.ts
import { AbstractComponent, type TComponentConfig } from '@course/utils'
import css from './calculator.module.css'
import flex from '@course/styles'
import cx from '@course/cx'
import { BUTTONS, INVALID_VALUE } from './calculator.utils'

interface ICalculatorState {
  value: string
}

export class Calculator extends AbstractComponent<{}> {
  state: ICalculatorState = { value: '0' }

  // Step 1: onButtonClick — event delegation handler:
  //   - Read `data-label` from target, look up in BUTTONS map
  //   - Call button.action(state.value, label), update state.value
  //   - Call updateDisplay() to sync DOM without full re-render
  // Step 2: updateDisplay — update output element textContent + toggle disabled on buttons
  //   - If state === INVALID_VALUE, disable all buttons except 'AC'
  // Step 3: toHTML — render calculator container with:
  //   - <output> element for display
  //   - <section> keypad with BUTTONS.values() mapped to <button> elements with data-label
  // Step 4: afterRender — attach click listener to the keypad section

  constructor(config: TComponentConfig<{}>) {
    super(config)
  }
  toHTML() {
    return '<div>TODO: Implement Calculator</div>'
  }
}

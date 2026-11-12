import { describe, it, expect } from 'vitest'
import {
  applyNumber as refApplyNumber,
  applyOperation as refApplyOperation,
  calculate as refCalculate,
  clear as refClear,
  negate as refNegate,
  BUTTONS as refBUTTONS,
  INVALID_VALUE,
} from '../solution/calculator.utils'
import {
  applyNumber as stuApplyNumber,
  applyOperation as stuApplyOperation,
  calculate as stuCalculate,
  clear as stuClear,
  negate as stuNegate,
  BUTTONS as stuBUTTONS,
} from '../calculator.utils'

const implementations = [
  {
    name: 'Reference',
    applyNumber: refApplyNumber,
    applyOperation: refApplyOperation,
    calculate: refCalculate,
    clear: refClear,
    negate: refNegate,
    BUTTONS: refBUTTONS,
  },
  {
    name: 'Student',
    applyNumber: stuApplyNumber,
    applyOperation: stuApplyOperation,
    calculate: stuCalculate,
    clear: stuClear,
    negate: stuNegate,
    BUTTONS: stuBUTTONS,
  },
]

implementations.forEach(
  ({ name, applyNumber, applyOperation, calculate, clear, negate, BUTTONS }) => {
    describe(`${name} Solution`, () => {
      // ── applyNumber ──
      describe('applyNumber', () => {
        it('should replace initial "0" with the digit', () => {
          expect(applyNumber('0', '5')).toBe('5')
        })

        it('should append digit to existing number', () => {
          expect(applyNumber('1', '2')).toBe('12')
          expect(applyNumber('12', '3')).toBe('123')
        })

        it('should append digit after an operator', () => {
          expect(applyNumber('5+', '3')).toBe('5+3')
        })

        it('should append decimal point', () => {
          expect(applyNumber('3', '.')).toBe('3.')
        })
      })

      // ── applyOperation ──
      describe('applyOperation', () => {
        it('should append operator to a number', () => {
          expect(applyOperation('5', '+')).toBe('5+')
          expect(applyOperation('10', '-')).toBe('10-')
          expect(applyOperation('3', '*')).toBe('3*')
          expect(applyOperation('7', '/')).toBe('7/')
        })

        it('should replace the last operator if one is already present', () => {
          expect(applyOperation('5+', '*')).toBe('5*')
          expect(applyOperation('10-', '+')).toBe('10+')
          expect(applyOperation('3/', '-')).toBe('3-')
        })

        it('should append operator after a multi-digit expression', () => {
          expect(applyOperation('12+34', '*')).toBe('12+34*')
        })
      })

      // ── calculate ──
      describe('calculate', () => {
        it('should evaluate simple addition', () => {
          expect(calculate('2+3', '=')).toBe('5')
        })

        it('should evaluate subtraction', () => {
          expect(calculate('10-4', '=')).toBe('6')
        })

        it('should evaluate multiplication', () => {
          expect(calculate('3*4', '=')).toBe('12')
        })

        it('should evaluate division', () => {
          expect(calculate('10/2', '=')).toBe('5')
        })

        it('should respect order of operations', () => {
          expect(calculate('2+3*4', '=')).toBe('14')
        })

        it('should handle decimal results with precision', () => {
          expect(calculate('10/3', '=')).toBe('3.33333')
        })

        it('should return INVALID_VALUE for division by zero', () => {
          expect(calculate('1/0', '=')).toBe(INVALID_VALUE)
        })

        it('should return INVALID_VALUE for invalid expressions', () => {
          expect(calculate('abc', '=')).toBe(INVALID_VALUE)
        })

        it('should evaluate a single number', () => {
          expect(calculate('42', '=')).toBe('42')
        })

        it('should handle modulo operation', () => {
          expect(calculate('10%3', '=')).toBe('1')
        })
      })

      // ── clear ──
      describe('clear', () => {
        it('should reset to "0"', () => {
          expect(clear('123+456', '')).toBe('0')
        })

        it('should return "0" even when already "0"', () => {
          expect(clear('0', '')).toBe('0')
        })
      })

      // ── negate ──
      describe('negate', () => {
        it('should wrap a simple number in -(…)', () => {
          expect(negate('5', '')).toBe('-(5)')
        })

        it('should wrap an expression in -(…)', () => {
          expect(negate('5+3', '')).toBe('-(5+3)')
        })

        it('should unwrap an already negated expression', () => {
          expect(negate('-(5+3)', '')).toBe('5+3')
        })

        it('should unwrap a negated simple number', () => {
          expect(negate('-(42)', '')).toBe('42')
        })
      })

      // ── BUTTONS Map ──
      describe('BUTTONS Map', () => {
        it('should contain 19 buttons', () => {
          expect(BUTTONS.size).toBe(19)
        })

        it('should have AC button with clear action', () => {
          const ac = BUTTONS.get('AC')
          expect(ac).toBeDefined()
          expect(ac!.action('123', '')).toBe('0')
        })

        it('should have digit buttons with applyNumber action', () => {
          for (const digit of ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']) {
            const btn = BUTTONS.get(digit)
            expect(btn).toBeDefined()
            expect(btn!.label).toBe(digit)
          }
        })

        it('should have operator buttons', () => {
          for (const op of ['+', '-', '*', '/', '%']) {
            expect(BUTTONS.has(op)).toBe(true)
          }
        })

        it('should have = button with calculate action', () => {
          const eq = BUTTONS.get('=')
          expect(eq).toBeDefined()
          expect(eq!.action('2+3', '=')).toBe('5')
        })
      })
    })
  },
)

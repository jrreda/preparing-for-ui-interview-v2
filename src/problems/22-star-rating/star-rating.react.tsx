import { useState } from 'react'
import css from './star-rating.module.css'

/**
 * Expected input:
 * {
 *   value: number,
 *   onChange: (value: number) => void,
 *   readonly?: boolean
 * }
 *
 * Steps to complete:
 * 1. Init constructor - define props type with value, onChange, readonly
 * 2. Provide template - render star buttons with proper attributes
 * 3. Handle click event - delegate click to update value
 * 4. Add ARIA attributes:
 *    Container:
 *    - role="radiogroup" — groups related radio-like controls so screen readers announce "radiogroup" when entering
 *    - aria-label="Star Rating" — provides an accessible name for the group (no visible label exists)
 *    - aria-readonly="true/false" — tells assistive tech whether the rating can be changed
 *    Each star button:
 *    - role="radio" — each star acts as a radio option within the group
 *    - aria-checked="true/false" — indicates which star is currently selected
 *    - aria-label="N Star(s)" — provides a meaningful label (e.g. "3 Stars") instead of just the emoji
 * 5. Add CSS styles for stars
 */

const STAR = '⭐️'
const STARS_COUNT = 5
type TProps = {
  value: number
  onChange: (value: number) => void
  readonly?: boolean
}

export const StarRating = ({ value, onChange, readonly = false }: TProps) => {
  const [hover, setHover] = useState(0)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (readonly) return

    const button = (e.target as HTMLElement).closest('button')
    if (!button) return

    const starValue = Number(button.dataset.starValue)
    if (!Number.isNaN(starValue)) {
      onChange(starValue)
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Star Rating"
      aria-readonly={readonly}
      className={css.container}
      onClick={handleClick}
      onMouseLeave={() => setHover(0)}
    >
      <input type="number" value={value} readOnly hidden />

      {Array.from({ length: STARS_COUNT }, (_, idx) => {
        const starValue = idx + 1
        const displayValue = Math.max(hover, value)

        return (
          <button
            type="button"
            role="radio"
            className={css.star}
            aria-label={`${starValue} Star${starValue === 1 ? '' : 's'}`}
            aria-checked={starValue === value}
            aria-readonly={readonly}
            data-star-value={starValue}
            data-active={displayValue >= starValue}
            disabled={readonly}
            onMouseEnter={() => setHover(starValue)}
            key={starValue}
          >
            <span>{STAR}</span>
          </button>
        )
      })}
    </div>
  )
}

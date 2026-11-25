import { useState } from 'react'
import flex from '@course/styles'
import { useThrottle } from './throttle'

const DELAY = 1000

export const ThrottleStudentExample = () => {
  const [count, setCount] = useState(0)
  const throttled = useThrottle(count, DELAY)

  return (
    <div className={flex.flexColumnGap16} style={{ maxWidth: 480 }}>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Click
      </button>
      <p>Clicks: {count}</p>
      <p>
        Throttled ({DELAY}ms): {throttled ?? '—'}
      </p>
    </div>
  )
}

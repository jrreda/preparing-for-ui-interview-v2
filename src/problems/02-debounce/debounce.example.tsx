import { useState } from 'react'
import flex from '@course/styles'
import { useDebounce } from './debounce'

const DELAY = 500

export const DebounceStudentExample = () => {
  const [value, setValue] = useState('')
  const debounced = useDebounce(value, DELAY)

  return (
    <div className={flex.flexColumnGap16} style={{ maxWidth: 480 }}>
      <label className={flex.flexColumnGap8}>
        <span>Search</span>
        <input
          value={value}
          placeholder="Type, then pause"
          onChange={(event) => setValue(event.target.value)}
          style={{ padding: '8px 10px' }}
        />
      </label>
      <p>Immediate: {value || '—'}</p>
      <p>
        Debounced ({DELAY}ms): {debounced || '—'}
      </p>
    </div>
  )
}

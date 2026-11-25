import { useState } from 'react'
import flex from '@course/styles'
import { usePromise } from './promise'

const wait = (ms: number, value: string, shouldReject = false) =>
  new Promise<string>((resolve, reject) => {
    window.setTimeout(() => {
      if (shouldReject) reject(new Error(value))
      else resolve(value)
    }, ms)
  })

export const PromiseStudentExample = () => {
  const [promise, setPromise] = useState<Promise<string> | null>(null)
  const [started, setStarted] = useState('None')
  const result = usePromise(promise)

  return (
    <div className={flex.flexColumnGap16} style={{ maxWidth: 520 }}>
      <div className={flex.flexRowGap8}>
        <button
          type="button"
          onClick={() => {
            setStarted('Resolve in 800ms')
            setPromise(wait(800, 'Loaded'))
          }}
        >
          Resolve
        </button>
        <button
          type="button"
          onClick={() => {
            setStarted('Reject in 800ms')
            setPromise(wait(800, 'Request failed', true))
          }}
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => {
            setStarted('Slow (1500ms), then fast (300ms)')
            setPromise(wait(1500, 'Slow'))
            queueMicrotask(() => setPromise(wait(300, 'Fast')))
          }}
        >
          Slow then fast
        </button>
      </div>
      <p>Started: {started}</p>
      <p>Status: {result?.status ?? '—'}</p>
      <p>Value: {result?.value ?? '—'}</p>
      <p>Error: {result?.error instanceof Error ? result.error.message : '—'}</p>
    </div>
  )
}

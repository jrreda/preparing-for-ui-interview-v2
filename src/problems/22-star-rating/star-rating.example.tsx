import { useState, useRef, useEffect } from 'react'
import { StarRating as StarRatingStudent } from './star-rating.react'
import flex from '@course/styles'
import { StarRatingComponent } from './solution/star-rating.react'
import { StarRating } from './solution/star-rating.vanila'
import { StarRating as StarRatingStudentVanilla } from './star-rating.vanila'

export const StarRatingExample = () => {
  const [rating, setRating] = useState(0)

  return (
    <div className={flex.flexColumnGap24}>
      <div className={flex.flexColumnGap8}>
        <h3>Interactive Rating</h3>
        <StarRatingComponent value={rating} onChange={setRating} />
        <p>Current Value: {rating}</p>
      </div>

      <div className={flex.flexColumnGap8}>
        <h3>Readonly (3 Stars)</h3>
        <StarRatingComponent readonly value={3} onChange={() => {}} />
      </div>

      <div className={flex.flexColumnGap8}>
        <h3>Readonly (5 Stars)</h3>
        <StarRatingComponent readonly value={5} onChange={() => {}} />
      </div>
    </div>
  )
}

export const StarRatingVanillaExample = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const readonly3Ref = useRef<HTMLDivElement>(null)
  const readonly5Ref = useRef<HTMLDivElement>(null)

  const ratingRef = useRef<StarRating | null>(null)
  const readonly3RatingRef = useRef<StarRating | null>(null)
  const readonly5RatingRef = useRef<StarRating | null>(null)

  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (!containerRef.current || !readonly3Ref.current || !readonly5Ref.current) return

    ratingRef.current = new StarRating({
      root: containerRef.current,
      className: ['star-rating'],
      value: rating,
      onValueChange: (newValue) => setRating(newValue),
    })
    ratingRef.current.render()

    readonly3RatingRef.current = new StarRating({
      root: readonly3Ref.current,
      className: ['star-rating'],
      value: 3,
      readOnly: true,
      onValueChange: () => {},
    })
    readonly3RatingRef.current.render()

    readonly5RatingRef.current = new StarRating({
      root: readonly5Ref.current,
      className: ['star-rating'],
      value: 5,
      readOnly: true,
      onValueChange: () => {},
    })
    readonly5RatingRef.current.render()

    return () => {
      ratingRef.current?.destroy()
      ratingRef.current = null
      readonly3RatingRef.current?.destroy()
      readonly3RatingRef.current = null
      readonly5RatingRef.current?.destroy()
      readonly5RatingRef.current = null
    }
  }, [rating])

  return (
    <div className={flex.flexColumnGap24}>
      <div className={flex.flexColumnGap8}>
        <h3>Interactive Rating</h3>
        <div ref={containerRef} />
        <p>Current Value: {rating}</p>
      </div>

      <div className={flex.flexColumnGap8}>
        <h3>Readonly (3 Stars)</h3>
        <div ref={readonly3Ref} />
      </div>

      <div className={flex.flexColumnGap8}>
        <h3>Readonly (5 Stars)</h3>
        <div ref={readonly5Ref} />
      </div>
    </div>
  )
}

export const StarRatingStudentExample = () => {
  const [rating, setRating] = useState(0)

  return (
    <div className={flex.flexColumnGap24}>
      <div className={flex.flexColumnGap8}>
        <h3>Interactive Rating</h3>
        <StarRatingStudent value={rating} onChange={setRating} />
        <p>Current Value: {rating}</p>
      </div>

      <div className={flex.flexColumnGap8}>
        <h3>Readonly (mirrors the rating above)</h3>
        <StarRatingStudent readonly value={rating} onChange={() => {}} />
      </div>

      <div className={flex.flexColumnGap8}>
        <h3>Readonly (3 Stars)</h3>
        <StarRatingStudent readonly value={3} onChange={() => {}} />
      </div>

      <div className={flex.flexColumnGap8}>
        <h3>Readonly (5 Stars)</h3>
        <StarRatingStudent readonly value={5} onChange={() => {}} />
      </div>
    </div>
  )
}

export const StarRatingStudentVanillaExample = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const readonly3Ref = useRef<HTMLDivElement>(null)
  const readonly5Ref = useRef<HTMLDivElement>(null)

  const ratingRef = useRef<StarRatingStudentVanilla | null>(null)
  const readonly3RatingRef = useRef<StarRatingStudentVanilla | null>(null)
  const readonly5RatingRef = useRef<StarRatingStudentVanilla | null>(null)

  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (!containerRef.current || !readonly3Ref.current || !readonly5Ref.current) return

    ratingRef.current = new StarRatingStudentVanilla({
      root: containerRef.current,
      className: ['star-rating'],
      value: rating,
      onValueChange: (newValue) => setRating(newValue),
    })
    ratingRef.current.render()

    readonly3RatingRef.current = new StarRatingStudentVanilla({
      root: readonly3Ref.current,
      className: ['star-rating'],
      value: 3,
      readOnly: true,
      onValueChange: () => {},
    })
    readonly3RatingRef.current.render()

    readonly5RatingRef.current = new StarRatingStudentVanilla({
      root: readonly5Ref.current,
      className: ['star-rating'],
      value: 5,
      readOnly: true,
      onValueChange: () => {},
    })
    readonly5RatingRef.current.render()

    return () => {
      ratingRef.current?.destroy()
      ratingRef.current = null
      readonly3RatingRef.current?.destroy()
      readonly3RatingRef.current = null
      readonly5RatingRef.current?.destroy()
      readonly5RatingRef.current = null
    }
  }, [rating])

  return (
    <div className={flex.flexColumnGap24}>
      <div className={flex.flexColumnGap8}>
        <h3>Interactive Rating</h3>
        <div ref={containerRef} />
        <p>Current Value: {rating}</p>
      </div>

      <div className={flex.flexColumnGap8}>
        <h3>Readonly (3 Stars)</h3>
        <div ref={readonly3Ref} />
      </div>

      <div className={flex.flexColumnGap8}>
        <h3>Readonly (5 Stars)</h3>
        <div ref={readonly5Ref} />
      </div>
    </div>
  )
}

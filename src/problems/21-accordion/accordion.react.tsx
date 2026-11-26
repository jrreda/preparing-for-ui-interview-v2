import css from './accordion.module.css'
import flex from '@course/styles'
import cx from '@course/cx'

/**
 * Expected input:
 * {
 *   items: [
 *     { id: "1", title: "Section 1", content: "Lorem ipsum..." },
 *     { id: "2", title: "Section 2", content: "Sed ut perspiciatis..." }
 *   ]
 * }
 *
 * Steps to complete:
 * 1. Define properties — create TAccordionItem type (id, title, content) and props type (items array)
 * 2. Init constructor — accept items via props destructuring
 * 3. Provide toHTML template — map over items, render <details>/<summary>/<p> for each
 * 4. Add CSS — use styles and cx() for className composition
 */

type TAccordionItem = {
  id: string
  title: string
  content: string
}

type TProps = {
  items: TAccordionItem[]
}

export const Accordion = (props: TProps) => {
  const { items } = props

  if (!items.length) return

  return (
    <div className={css.container}>
      {items.map((item) => (
        <details key={item.id} className={css.details}>
          <summary className={css.summary}>{item.title}</summary>
          <p className={css.content}>{item.content}</p>
        </details>
      ))}
    </div>
  )
}

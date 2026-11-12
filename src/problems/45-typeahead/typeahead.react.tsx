import { useEffect, useRef, useState } from 'react'
import css from './typeahead.module.css'
import flex from '@course/styles'
import cx from '@course/cx'

export type TTypeaheadEntry<T> = {
  query: string
  id: string
  value: T
}

type TTypeaheadProps<T> = {
  id?: string
  entries?: TTypeaheadEntry<T>[]
  onQuery: (query: string, signal?: AbortSignal) => Promise<TTypeaheadEntry<T>[]>
  itemRender: (item: TTypeaheadEntry<T>) => React.ReactNode
}

/**
 * Expected usage:
 * <Typeahead
 *   onQuery={async (query, signal) => fetch(`/api/search?q=${query}`, { signal }).then(r => r.json())}
 *   itemRender={(item) => <div>{item.query}</div>}
 * />
 */
const DEFAULT: TTypeaheadEntry<any>[] = []

export function Typeahead<T>({
  id = 'typeahead',
  entries = DEFAULT,
  onQuery,
  itemRender,
}: TTypeaheadProps<T>) {
  // Step 1: State — query, isLoading, isVisible as useState + trieRef via useRef<Trie>
  //   Helper: insertAll(entries) — loop entries and trie.current.insert(entry.query, entry)

  // Step 2: Input change handler — onQueryChange: React.ChangeEventHandler
  //   - Read target.value, setQuery, setLoading(true), setIsVisible(true)
  //   - Call onQuery(query).then(insertAll).finally(() => setLoading(false))

  // Step 3: Keyboard handler — onKeyDown: React.KeyboardEventHandler
  //   - Check target.dataset.item exists (event delegation on <li> elements)
  //   - Enter or Space → setQuery(target.dataset.item), setIsVisible(false)
  //   - Escape → setIsVisible(false)

  // Step 4: Sync external entries into trie — useEffect on [entries] → insertAll(entries)

  // Step 5: Read visible items from trie — const items = trie.current.getWithPrefix(query)

  // Step 6: Click handler — onListClick: React.MouseEventHandler<HTMLUListElement>
  //   - Event delegation on <ul>: use (target as HTMLElement).closest('[data-item]')
  //   - If li?.dataset.item exists → setQuery, setIsVisible(false)

  // Step 7: Render + a11y
  //   - Wrap in <section onKeyDown={onKeyDown}>
  //   - <input role="combobox" aria-autocomplete="list" aria-controls={id}
  //       aria-expanded={items.length > 0 && isVisible} aria-label="search"
  //       onChange={onQueryChange} value={query} type="text" />
  //   - Conditional <ul id={id} role="listbox" onClick={onListClick}>
  //     - Each <li className={css.item} data-item={item.query} role="option"
  //         aria-selected={item.query === query} tabIndex={0} key={item.id}>
  //   - <div role="status" aria-live="polite"> showing "loading" or "{count} results"

  return <div>TODO: Implement</div>
}

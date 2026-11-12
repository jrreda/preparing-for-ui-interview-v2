# Accordion

**Difficulty**: 🟢 Easy · **Time**: 10–15 min

## What You'll Learn

- Semantic HTML with `<details>` / `<summary>`
- CSS transitions on collapsible content
- Accessibility for free with native elements

## Goal

Build an accordion component that displays a list of expandable/collapsible items. Each item has a **title** (summary) and **content** (details). Users can toggle each section independently.

```
┌──────────────────────────────────┐
│ ▶ What is React?                 │  ← collapsed
├──────────────────────────────────┤
│ ▼ Why use TypeScript?            │  ← expanded
│                                  │
│   TypeScript adds static types   │
│   to JavaScript, catching bugs   │
│   at compile time …              │
│                                  │
├──────────────────────────────────┤
│ ▶ What is CSS?                   │  ← collapsed
└──────────────────────────────────┘
```

## Requirements

### Core Functionality

1. Render a list of accordion items from the provided configuration.
2. Each item displays a **title** that can be clicked to toggle its content.
3. Multiple sections can be open at the same time (independent control).

### Accessibility (A11y)

1. Use native `<details>` / `<summary>` elements — this gives you keyboard support and screen-reader semantics **for free**.
2. Content must be properly hidden/shown for assistive technologies.

## API Design

```ts
type TAccordionItem = {
  id: string      // unique identifier
  title: string   // text shown in the header
  content: string // text shown when expanded
}

// Props
{ items: TAccordionItem[] }
```

## Walkthrough

### Step 1 — Render the list

Map over `items` and render a `<details>` element for each. Inside, place a `<summary>` for the title and a `<span>` (or `<div>`) for the content.

```tsx
items.map(item =>
  <details>
    <summary>{item.title}</summary>
    <p>{item.content}</p>
  </details>
)
```

### Step 2 — Style it

- Add padding and borders to make each section visually distinct.
- Use CSS to style the open/closed indicator (the default triangle marker).

### Step 3 — Animate (bonus)

Use the `::details-content` pseudo-element (modern browsers) or a height transition trick to animate the expand/collapse.

### 💡 Hint — Why `&lt;details&gt;` over manual state?

The `<details>` element manages its own open/closed state natively. You don't need `useState` at all! The browser handles:

- Toggle on click
- Toggle on Enter/Space key
- Proper ARIA roles (`group` / `button`)

This makes the implementation **zero-JS** in its simplest form.

## Edge Cases

| Scenario            | Expected                                       |
| ------------------- | ---------------------------------------------- |
| Empty `items` array | Render nothing (no crash)                      |
| Very long content   | Content scrolls or wraps naturally             |
| Rapid clicking      | Each toggle is independent, no race conditions |
| Duplicate IDs       | Still renders, but use unique keys             |

## Verification

1. Click a title → content expands.
2. Click the same title again → content collapses.
3. Open multiple sections simultaneously → all stay open.
4. Tab to a section and press Enter/Space → toggles correctly.

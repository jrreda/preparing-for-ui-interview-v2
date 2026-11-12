# Markdown Editor

**Difficulty**: 🚀 Extreme · **Time**: 60–90 min

## What You'll Learn

- Regex-based text transformation pipeline
- Rule/Pattern architecture for extensible parsing
- Handling bold, italic, and strikethrough formatting
- Table and list parsing with function replacers
- Live preview with `dangerouslySetInnerHTML`

## Goal

Build a Markdown-to-HTML parser and a live preview editor. The parser converts a subset of Markdown syntax into HTML using a pipeline of regex-based rules. The editor shows a text area on the left and rendered HTML on the right.

````
┌─────────────────────┬─────────────────────┐
│  # Hello World      │  Hello World         │
│                     │  ─────────────       │
│  This is **bold**   │  This is bold        │
│  and *italic*.      │  and italic.         │
│                     │                      │
│  - Item 1           │  • Item 1            │
│  - Item 2           │  • Item 2            │
│                     │                      │
│  [Textarea]         │  [Live Preview]      │
└─────────────────────┴─────────────────────┘
````

## Requirements

### Supported Markdown Syntax

| Syntax              | HTML Output                   | Example                           |
| ------------------- | ----------------------------- | --------------------------------- |
| `# Heading`         | `<h1>Heading</h1>`            | `# Title` → `<h1>Title</h1>`      |
| `## Heading`        | `<h2>Heading</h2>`            | `## Section` → `<h2>Section</h2>` |
| `**bold**`          | `<b>bold</b>`                 | `**text**` → `<b>text</b>`        |
| `*italic*`          | `<i>italic</i>`               | `*text*` → `<i>text</i>`          |
| `~~strike~~`        | `<s>strike</s>`               | `~~text~~` → `<s>text</s>`        |
| `- item`            | `<ul><li>item</li></ul>`      | Unordered lists                   |
| `1. item`           | `<ol><li>item</li></ol>`      | Ordered lists                     |
| `[text](url)`       | `<a href="url">text</a>`      | Links                             |
| `\| table \|`       | `<table>...</table>`          | Pipe-delimited tables             |
| Plain text          | `<p>text</p>`                 | Paragraphs                        |

### Parser Architecture

The parser uses a **Rule → Pattern** pipeline:

````
Input Markdown
  │
  ▼
┌──────────────────────────────────────────────┐
│  Rule Pipeline (applied in order)            │
│                                              │
│  1. LINK_RULE         ([text](url))          │
│  2. HEADER_RULE       (# ## ### ...)         │
│  3. TABLE_RULE        (| ... | ... |)        │
│  4. LIST_RULE         (- item, 1. item)      │
│  5. PARAGRAPH_RULE    (plain text → `<p>`)   │
│  6. FORMATTING_RULE   (**bold**, *italic*,    │
│                        ~~strike~~)           │
│                                              │
└──────────────────────────────────────────────┘
  │
  ▼
Output HTML
````

> **Order matters!** Links must be processed before formatting (to avoid `**[text](url)**` breaking). Headers and block-level elements (tables, lists) must come before paragraphs. Paragraphs must come before inline formatting so bold/italic are applied inside `<p>` tags.

### Core Classes

```ts
class TRichTextPattern {
  regexp: RegExp
  replacer: string | Function
  apply(text: string): string // text.replace(regexp, replacer)
}

class TRichTextRule {
  name: string
  patterns: TRichTextPattern[]
  apply(text: string): string // patterns.reduce((acc, p) => p.apply(acc), text)
}

function parseRichText(text: string, rules: TRichTextRule[]): string {
  return rules.reduce((acc, rule) => rule.apply(acc), text)
}
```

## Walkthrough

### Step 1 — Build the Pattern class

A `TRichTextPattern` wraps a regex and a replacer (string or function). Its `apply()` method calls `text.replace(regexp, replacer)`.

### Step 2 — Build the Rule class

A `TRichTextRule` groups related patterns (e.g., all header patterns: h1–h6). Its `apply()` runs all patterns sequentially via `reduce`.

### Step 3 — Define rules in order

Define 6 rules using the pre-initialised regex constants and replacer functions:

1. **LINK_RULE** — converts `[text](url)` to `<a>` tags (excludes `![` image syntax)
2. **HEADER_RULE** — converts `#` through `######` to heading tags (process h6 first to avoid partial matches)
3. **TABLE_RULE** — converts pipe-delimited tables using `TABLE_REPLACER`
4. **LIST_RULE** — converts ordered and unordered lists using `ORDERED_LIST_REPLACER` and `UNORDERED_LIST_REPLACER`
5. **PARAGRAPH_RULE** — wraps remaining plain text lines in `<p>` tags
6. **FORMATTING_RULE** — applies bold (`**`), italic (`*`), and strikethrough (`~~`) replacements

### Step 4 — Handle complex replacers

Tables and lists need **function replacers** (not simple string templates):

```ts
function TABLE_REPLACER(_, header, __, rows) {
  const headerCells = header.split('|').filter(Boolean)
  const headerHTML = headerCells.map((h) => `<th>${h.trim()}</th>`).join('')
  // ... build <thead> and <tbody>
  return `<table><thead><tr>${headerHTML}</tr></thead><tbody>${rowsHTML}</tbody></table>`
}
```

### Step 5 — Build the editor component

- Left pane: `<textarea>` with `onChange` updating state
- Right pane: `<div dangerouslySetInnerHTML={{ __html: parseRichText(text, rules) }}>`
- Use `useMemo` to avoid re-parsing on every render unless text changes

### 💡 Hint — Why regex order matters for headers

Process `######` (h6) before `#####` (h5) before ... `#` (h1). If you process `#` first, it would match `## Heading` as h1 (consuming the first `#`). Processing from most-specific to least-specific avoids this.



### 💡 Hint — Avoiding double-processing

Some rules use negative lookaheads or exclusion patterns to skip content already wrapped in HTML tags. For example, the list rule skips lines containing `<li>` or `<td>` to avoid re-processing table cells as list items.



## Edge Cases

| Scenario                               | Expected                              |
| -------------------------------------- | ------------------------------------- |
| Empty input                            | Empty output                          |
| Table with empty cells                 | Empty `<td></td>` elements            |
| Link inside bold `**[text](url)**`     | `<b><a href="url">text</a></b>`       |
| Multiple paragraphs                    | Each wrapped in `<p>`                 |
| Bold and italic in same line           | Both applied correctly                |

## Verification

1. Type `# Hello` → renders as `<h1>`.
2. Type `**bold**` → renders as bold text.
3. Type a table → renders as HTML table.
4. Type a list → renders as `<ul>` or `<ol>`.
5. All parser tests pass (`pnpm test markdown`).

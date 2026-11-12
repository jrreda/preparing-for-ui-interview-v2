import { describe, it, expect } from 'vitest'
import {
  parseRichText as refParseRichText,
  RICH_TEXT_RULES as refRICH_TEXT_RULES,
} from '../solution/markdown-parser'
import {
  parseRichText as stuParseRichText,
  RICH_TEXT_RULES as stuRICH_TEXT_RULES,
} from '../markdown-parser'

const implementations = [
  { name: 'Reference', parseRichText: refParseRichText, RICH_TEXT_RULES: refRICH_TEXT_RULES },
  { name: 'Student', parseRichText: stuParseRichText, RICH_TEXT_RULES: stuRICH_TEXT_RULES },
]

implementations.forEach(({ name, parseRichText, RICH_TEXT_RULES }) => {
  describe(`${name} Solution`, () => {
    describe('Markdown Parser', () => {
      // ===========================================
      // parseRichText Function Tests
      // ===========================================
      describe('parseRichText', () => {
        it('should return empty string for empty input', () => {
          expect(parseRichText('', RICH_TEXT_RULES)).toBe('')
        })

        it('should return unchanged text when no rules provided', () => {
          const input = 'Hello World'
          expect(parseRichText(input, [])).toBe(input)
        })

        it('should apply multiple rules in sequence', () => {
          const input = '**bold** and *italic*'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<b>bold</b>')
          expect(result).toContain('<i>italic</i>')
        })
      })

      // ===========================================
      // LINK_RULE Tests
      // ===========================================
      describe('LINK_RULE', () => {
        it('should convert markdown link to anchor tag', () => {
          const input = '[Google](https://google.com)'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<a href="https://google.com">Google</a>')
        })

        it('should handle multiple links in same line', () => {
          const input = '[Link1](url1) and [Link2](url2)'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<a href="url1">Link1</a>')
          expect(result).toContain('<a href="url2">Link2</a>')
        })

        it('should not convert image syntax to link', () => {
          const input = '![Image](image.png)'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).not.toContain('<a href="image.png">')
        })

        it('should handle links with complex URLs', () => {
          const input = '[API Docs](https://api.example.com/v2/docs?lang=en&version=2.0)'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('href="https://api.example.com/v2/docs?lang=en&version=2.0"')
        })
      })

      // ===========================================
      // HEADER_RULE Tests
      // ===========================================
      describe('HEADER_RULE', () => {
        it('should convert # to h1', () => {
          const input = '# Main Title'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<h1>Main Title</h1>')
        })

        it('should convert ## to h2', () => {
          const input = '## Section Title'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<h2>Section Title</h2>')
        })

        it('should convert ### through ###### to appropriate tags', () => {
          expect(parseRichText('### H3', RICH_TEXT_RULES)).toContain('<h3>H3</h3>')
          expect(parseRichText('#### H4', RICH_TEXT_RULES)).toContain('<h4>H4</h4>')
          expect(parseRichText('##### H5', RICH_TEXT_RULES)).toContain('<h5>H5</h5>')
          expect(parseRichText('###### H6', RICH_TEXT_RULES)).toContain('<p>H6</p>')
        })

        it('should handle header without space after #', () => {
          const input = '#Title'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<h1>Title</h1>')
        })

        it('should handle multiple headers', () => {
          const input = '# Title\n## Subtitle'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<h1>Title</h1>')
          expect(result).toContain('<h2>Subtitle</h2>')
        })
      })

      // ===========================================
      // TABLE_RULE Tests
      // ===========================================
      describe('TABLE_RULE', () => {
        it('should convert simple markdown table to HTML', () => {
          const input = `| Name | Age |
|------|-----|
| John | 30  |`
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<table>')
          expect(result).toContain('<thead>')
          expect(result).toContain('<th>Name</th>')
          expect(result).toContain('<th>Age</th>')
          expect(result).toContain('<tbody>')
          expect(result).toContain('<td>John</td>')
          expect(result).toContain('<td>30</td>')
          expect(result).toContain('</table>')
        })

        it('should handle table with multiple rows', () => {
          const input = `| Col1 | Col2 |
|------|------|
| A    | B    |
| C    | D    |`
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<td>A</td>')
          expect(result).toContain('<td>B</td>')
          expect(result).toContain('<td>C</td>')
          expect(result).toContain('<td>D</td>')
        })

        it('should handle table with three columns', () => {
          const input = `| A | B | C |
|---|---|---|
| 1 | 2 | 3 |`
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<th>A</th>')
          expect(result).toContain('<th>B</th>')
          expect(result).toContain('<th>C</th>')
        })
      })

      // ===========================================
      // LIST_RULE Tests (Unordered)
      // ===========================================
      describe('LIST_RULE - Unordered Lists', () => {
        it('should convert single unordered list item', () => {
          const input = '- Item 1'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<ul>')
          expect(result).toContain('<li>Item 1</li>')
          expect(result).toContain('</ul>')
        })

        it('should convert multiple unordered list items', () => {
          const input = '- Item 1\n- Item 2\n- Item 3'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<li>Item 1</li>')
          expect(result).toContain('<li>Item 2</li>')
          expect(result).toContain('<li>Item 3</li>')
        })

        it('should support + as list marker', () => {
          const input = '+ First\n+ Second'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<li>First</li>')
          expect(result).toContain('<li>Second</li>')
        })
      })

      // ===========================================
      // LIST_RULE Tests (Ordered)
      // ===========================================
      describe('LIST_RULE - Ordered Lists', () => {
        it('should convert single ordered list item', () => {
          const input = '1. First item'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<ol>')
          expect(result).toContain('<li>First item</li>')
          expect(result).toContain('</ol>')
        })

        it('should convert multiple ordered list items', () => {
          const input = '1. One\n2. Two\n3. Three'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<li>One</li>')
          expect(result).toContain('<li>Two</li>')
          expect(result).toContain('<li>Three</li>')
        })

        it('should handle double-digit numbers', () => {
          const input = '10. Tenth item'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<li>Tenth item</li>')
        })
      })

      // ===========================================
      // FORMATTING_RULE Tests (Bold)
      // ===========================================
      describe('FORMATTING_RULE - Bold', () => {
        it('should convert **text** to bold', () => {
          const input = '**bold text**'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<b>bold text</b>')
        })

        it('should handle multiple bold segments', () => {
          const input = '**first** normal **second**'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<b>first</b>')
          expect(result).toContain('<b>second</b>')
        })

        it('should handle bold with special characters', () => {
          const input = '**hello-world_test**'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<b>hello-world_test</b>')
        })
      })

      // ===========================================
      // FORMATTING_RULE Tests (Italic)
      // ===========================================
      describe('FORMATTING_RULE - Italic', () => {
        it('should convert *text* to italic', () => {
          const input = '*italic text*'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<i>italic text</i>')
        })

        it('should handle multiple italic segments', () => {
          const input = '*first* and *second*'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<i>first</i>')
          expect(result).toContain('<i>second</i>')
        })
      })

      // ===========================================
      // FORMATTING_RULE Tests (Strikethrough)
      // ===========================================
      describe('FORMATTING_RULE - Strikethrough', () => {
        it('should convert ~~text~~ to strikethrough', () => {
          const input = '~~deleted text~~'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<s>deleted text</s>')
        })

        it('should handle strikethrough with space after tildes', () => {
          const input = '~~ spaced text~~'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<s>spaced text</s>')
        })

        it('should handle multiple strikethrough segments', () => {
          const input = '~~first~~ keep ~~second~~'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<s>first</s>')
          expect(result).toContain('<s>second</s>')
        })
      })

      // ===========================================
      // PARAGRAPH_RULE Tests
      // ===========================================
      describe('PARAGRAPH_RULE', () => {
        it('should wrap plain text in paragraph tags', () => {
          const input = 'This is plain text.'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<p>This is plain text.</p>')
        })

        it('should not double-wrap existing HTML elements', () => {
          const input = '# Header'
          const result = parseRichText(input, RICH_TEXT_RULES)
          // Should have h1, not wrapped in p
          expect(result).toContain('<h1>Header</h1>')
          expect(result).not.toContain('<p><h1>')
        })

        it('should handle multiple paragraphs', () => {
          const input = 'First paragraph.\n\nSecond paragraph.'
          const result = parseRichText(input, RICH_TEXT_RULES)
          expect(result).toContain('<p>First paragraph.</p>')
          expect(result).toContain('<p>Second paragraph.</p>')
        })
      })

      // ===========================================
      // RICH_TEXT_RULES Integration Tests
      // ===========================================
      describe('RICH_TEXT_RULES Integration', () => {
        it('should handle complex markdown document', () => {
          const input = `# Title

This is a **bold** paragraph with *italic* text.

## Features

- Feature 1
- Feature 2

[Learn More](https://example.com)`

          const result = parseRichText(input, RICH_TEXT_RULES)

          expect(result).toContain('<h1>Title</h1>')
          expect(result).toContain('<b>bold</b>')
          expect(result).toContain('<i>italic</i>')
          expect(result).toContain('<h2>Features</h2>')
          expect(result).toContain('<li>Feature 1</li>')
          expect(result).toContain('<li>Feature 2</li>')
          expect(result).toContain('<a href="https://example.com">Learn More</a>')
        })

        it('should handle document with table and formatting', () => {
          const input = `| Name | Status |
|------|--------|
| **John** | ~~inactive~~ |`

          const result = parseRichText(input, RICH_TEXT_RULES)

          expect(result).toContain('<table>')
          expect(result).toContain('<b>John</b>')
          expect(result).toContain('<s>inactive</s>')
        })

        it('should preserve rule order for correct output', () => {
          const input = '[Link](url) and **bold text**'
          const result = parseRichText(input, RICH_TEXT_RULES)

          expect(result).toContain('<a href="url">Link</a>')
          expect(result).toContain('<b>bold text</b>')
        })
      })
    })
  })
})

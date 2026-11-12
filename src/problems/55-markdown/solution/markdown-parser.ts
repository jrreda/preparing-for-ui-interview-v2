// pnpm test src/problems/55-markdown/markdown-parser.test.ts

/**
 * Expected input/output:
 * parseRichText('**bold** and *italic*', RICH_TEXT_RULES)
 * → '<p><b>bold</b> and <i>italic</i></p>'
 *
 * parseRichText('# Heading\n\nParagraph', RICH_TEXT_RULES)
 * → '<h1>Heading</h1>\n<p>Paragraph</p>'
 */

/* ── Pre-initialised [regexp, replacer] tuples ────────────────────────────── */
type TRichTextPatternReplacer = ((content: string, ...groupMatch: any[]) => string) | string
type TRichTextPatternTuple = [RegExp, TRichTextPatternReplacer]

/*
 * Converts [text](url) to <a href="url">text</a>, preserving any preceding character
 * Regex: (^|[^!])    — $1: start of string or any char except '!' (avoids matching ![img](url))
 *        \[([^[]+)\] — $2: link text inside [ ], captured via [^[]+ (one or more non-'[' chars)
 *        \(([^)]+)\) — $3: URL inside ( ), captured via [^)]+ (one or more non-')' chars)
 */
const LINK: TRichTextPatternTuple = [/(^|[^!])\[([^[]+)\]\(([^)]+)\)/g, '$1<a href="$3">$2</a>']

/*
 * Converts ###### text to <h6>text</h6> (must be matched before smaller heading levels)
 * Regex: ^     — start of line (with /m flag)
 *        #{6}  — exactly 6 hash characters
 *        \s?   — optional whitespace after hashes
 *        ([^\n]+) — $1: capture the heading text (everything until newline)
 */
const HEADING_H6: TRichTextPatternTuple = [/^#{6}\s?([^\n]+)/gm, '<p>$1</p>']
// console.log('###### Title'.replace(...HEADING_H6));
/*
 * Converts ##### text to <h5>text</h5>
 * Regex: same pattern as H6 but #{5} — matched after H6 so ###### isn't caught as #####
 */
const HEADING_H5: TRichTextPatternTuple = [/^#{5}\s?([^\n]+)/gm, '<h5>$1</h5>']
// console.log('##### Title'.replace(...HEADING_H5)) → '<h5>Title</h5>'
/*
 * Converts #### text to <h4>text</h4>
 * Regex: same pattern — #{4}
 */
const HEADING_H4: TRichTextPatternTuple = [/^#{4}\s?([^\n]+)/gm, '<h4>$1</h4>']
// console.log('#### Title'.replace(...HEADING_H4)) → '<h4>Title</h4>'
/*
 * Converts ### text to <h3>text</h3>
 * Regex: same pattern — #{3}
 */
const HEADING_H3: TRichTextPatternTuple = [/^#{3}\s?([^\n]+)/gm, '<h3>$1</h3>']
// console.log('### Title'.replace(...HEADING_H3)) → '<h3>Title</h3>'
/*
 * Converts ## text to <h2>text</h2>
 * Regex: same pattern — #{2}
 */
const HEADING_H2: TRichTextPatternTuple = [/^#{2}\s?([^\n]+)/gm, '<h2>$1</h2>']
// console.log('## Title'.replace(...HEADING_H2)) → '<h2>Title</h2>'
/*
 * Converts # text to <h1>text</h1>
 * Regex: same pattern — #{1}; matched last so ## and ### aren't caught as #
 */
const HEADING_H1: TRichTextPatternTuple = [/^#{1}\s?([^\n]+)/gm, '<h1>$1</h1>']
// console.log('# Title'.replace(...HEADING_H1)) → '<h1>Title</h1>'
/*
 * Wraps plain text lines (not headings or already-wrapped HTML) in <p> tags
 * Regex: ^(?!#)       — negative lookahead: line must NOT start with # (skip headings)
 *        (?!.*<\/?(…)>) — negative lookahead: line must NOT contain known HTML tags
 *        (.*\S.*)$    — match the full line ($&) only if it contains at least one non-space char
 *        Flags: /gm   — global + multiline (^ and $ match per line)
 */
const PARAGRAPH: TRichTextPatternTuple = [
    /^(?!#)(?!.*<\/?(ul|ol|img|h1|h2|p|table|tr|th|td|pre|code)>)(.*\S.*)$/gm,
    '<p>$&</p>',
]
// console.log('Hello world'.replace(...PARAGRAPH)) → '<p>Hello world</p>'
/*
 * Converts **text** to <b>text</b>
 * Regex: \*\*  — literal ** (escaped because * is a quantifier)
 *        (.+?) — $1: lazy match (shortest possible) of the bold content
 *        \*\*  — closing **
 */
const BOLD: TRichTextPatternTuple = [/\*\*(.+?)\*\*/g, '<b>$1</b>']
// console.log('**bold**'.replace(...BOLD)) → '<b>bold</b>'
/*
 * Converts *text* to <i>text</i> (applied after BOLD so ** is already consumed)
 * Regex: \*(.+?)\* — same as BOLD but single *; works because ** was already replaced
 */
const ITALIC: TRichTextPatternTuple = [/\*(.+?)\*/g, '<i>$1</i>']
// console.log('*italic*'.replace(...ITALIC))
/*
 * Converts ~~text~~ to <s>text</s>
 * Regex: ~~      — literal opening ~~
 *        \s?     — optional space after opening
 *        ([^\n]+?) — $1: lazy match of content (no newlines)
 *        ~~      — closing ~~
 */
const STRIKETHROUGH: TRichTextPatternTuple = [/~~\s?([^\n]+?)~~/g, '<s>$1</s>']
// console.log('~~deleted~~'.replace(...STRIKETHROUGH)) → '<s>deleted</s>'

/*
 * Converts lines starting with - or + into <ul><li>...</li></ul>
 * Regex: (?:^|\n)           — start of string or newline (non-capturing)
 *        (?![^\n]*<[^>]*>) — negative lookahead: skip lines already containing HTML tags
 *        \s*[-+]\s.*       — optional indent, then - or +, space, rest of line
 *        (?:\n\s*[-+]\s.*)* — continue matching consecutive list item lines
 */
const UNORDERED_LIST: TRichTextPatternTuple = [
    /(?:^|\n)(?![^\n]*<[^>]*>)(\s*[-+]\s.*(?:\n\s*[-+]\s.*)*)/g,
    (fullMatch: string) => {
        const items = fullMatch.split('\n').map(
            v => `<li>${v.substring(2)}</li>`
        ).join('');
        return `\n<ul>${items}</ul>`
    },
]
// console.log('- a\n- b'.replace(...UNORDERED_LIST))

/*
 * Converts lines starting with 1. 2. etc. into <ol><li>...</li></ol>
 * Regex: (?:^|\n)           — start of string or newline
 *        (?![^\n]*<[^>]*>) — skip lines with existing HTML
 *        \s*[0-9]+\.\s.*   — optional indent, digits, dot, space, rest of line
 *        (…)+               — one or more consecutive numbered lines
 */
const ORDERED_LIST: TRichTextPatternTuple = [
    /(?:^|\n)(?![^\n]*<[^>]*>)(\s*[0-9]+\.\s.*)+/g,
    (fullMatch: string) => {
        const items = fullMatch
            .trim()
            .split('\n')
            .reduce((acc, next) => acc + '<li>' + next.substring(next.indexOf('.') + 2) + '</li>', '')
        return `\n<ol>${items}</ol>`
    },
]
// console.log('1. a\n2. b'.replace(...ORDERED_LIST)) → '\n<ol><li>a</li><li>b</li></ol>'

/*
 * Converts markdown tables (header | separator | rows) into <table> with <thead>/<tbody>
 * Regex: ^(\|.+\|\r?\n)        — $1: header row (| col1 | col2 |\n)
 *        (\|[-:| ]+\|\r?\n)    — $2: separator row (|---|---|\n) — dashes, colons, pipes, spaces
 *        ((?:\|.*\|\r?\n?)*)   — $3: zero or more data rows (| val | val |\n)
 *        Flags: /gm             — global + multiline
 */
const TABLE: TRichTextPatternTuple = [
    /^(\|.+\|\r?\n)(\|[-:| ]+\|\r?\n)((?:\|.*\|\r?\n?)*)/gm,
    (_: string, header: string, __: string, rows: string) => {
        const filterEmpty = (str: string) => Boolean(str.trim())
        const xmlHeaders: string = header
            .split('|')
            .filter(filterEmpty)
            .map(h => `<th>${h.trim()}</th>`)
            .join('');
        const xmlRows: string = rows
            .split('\n')
            .filter(Boolean)
            .map((row) => {
                const cells = row.split('|')
                    .filter(filterEmpty)
                    .map(c => `<td>${c.trim()}</td>`)
                    .join('');
                return `<tr>${cells}</tr>`
            }).join('');
        return `<table><thead><tr>${xmlHeaders}</tr></thead><tbody>${xmlRows}</tbody></table>\n`;
    },
]

// console.log('| H1 | H2 |\n|---|---|\n| a | b |\n'.replace(...TABLE));

/* Wraps a [regexp, replacer] tuple — apply() runs text.replace(regexp, replacer) */
class TRichTextPattern {
    constructor(
        public regexp: RegExp,
        public replacer: TRichTextPatternReplacer
    ) {
    }

    apply(source: string) {
        return source.replace(this.regexp, this.replacer as any);
    }
}

/* Groups related patterns under a named rule — apply() pipes text through each pattern sequentially */
class TRichTextRule {
    constructor(
        public name: string,
        public patterns: TRichTextPattern[]
    ) {
    }

    apply(source: string) {
        let result = source;
        for (const pattern of this.patterns) {
            result = pattern.apply(result);
        }
        return result;
    }
}

/*
 * RICH_TEXT_RULES — ordered pipeline of all markdown-to-HTML rules.
 * Order matters: links before formatting, block-level (headers, tables, lists)
 * before paragraphs, paragraphs before inline formatting (bold/italic/strikethrough).
 */
export const RICH_TEXT_RULES: Array<TRichTextRule> = [
    new TRichTextRule(
        'links',
        [new TRichTextPattern(...LINK)]
    ),
    new TRichTextRule(
        'Headings',
        [
            new TRichTextPattern(...HEADING_H6),
            new TRichTextPattern(...HEADING_H5),
            new TRichTextPattern(...HEADING_H4),
            new TRichTextPattern(...HEADING_H3),
            new TRichTextPattern(...HEADING_H2),
            new TRichTextPattern(...HEADING_H1)
        ]
    ),
    new TRichTextRule(
        'table',
        [new TRichTextPattern(...TABLE)]
    ),
    new TRichTextRule(
        'lists',
        [
            new TRichTextPattern(...UNORDERED_LIST),
            new TRichTextPattern(...ORDERED_LIST),
        ]
    ),
    new TRichTextRule(
        'paragraphs',
        [
            new TRichTextPattern(...PARAGRAPH),
        ]
    ),
    new TRichTextRule(
        'formatting',
        [
            new TRichTextPattern(...BOLD),
            new TRichTextPattern(...STRIKETHROUGH),
            new TRichTextPattern(...ITALIC),
        ]
    ),
]

/* Main entry point — pipes source text through each rule in order, producing final HTML */
export function parseRichText(source: string, rules: TRichTextRule[] = RICH_TEXT_RULES) {
    return rules
        .reduce((text, next) => next.apply(text), source);
}


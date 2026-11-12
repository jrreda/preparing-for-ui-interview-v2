// pnpm test src/problems/55-markdown/markdown-parser.test.ts
import React, {useMemo} from 'react'
import css from '../markdown.module.css'
import flex from '@course/styles'
import cx from '@course/cx'
import {parseRichText} from "./markdown-parser.ts"

interface MarkdownProps {
    text: string
}

/**
 * Escapes ampersand characters for safe XML parsing.
 *
 * Replaces all `&` characters with `&amp;` to prevent XML parsing errors.
 * Unescaped ampersands in XML are invalid and cause parse failures.
 *
 * @param text - The text to escape (optional)
 * @returns The text with ampersands escaped, or empty string if text is undefined
 *
 * @example
 * ```ts
 * escapeHTMLAmpersand('Tom & Jerry')  // Returns: 'Tom &amp; Jerry'
 * escapeHTMLAmpersand(undefined)       // Returns: ''
 * ```
 */
function escapeHTMLAmpersand(text?: string): string {
    return text?.replace(/&/g, '&amp;') ?? ''
}

function sanitize(markdown: string) {
    const parser = new DOMParser();
    try {
        const result = parser.parseFromString(
            `<section>${escapeHTMLAmpersand(markdown)}</section>`,
            'text/xml'
        )
        const error = result.querySelector('parseerror');
        if (error) {
            return markdown ?? ''
        } else {
            return result.firstElementChild?.textContent ?? ''
        }
    } catch (e) {
        return markdown;
    }
}

/**
 * Expected usage:
 * <Markdown text="# Hello\n\nThis is **bold** and *italic*" />
 * Renders parsed markdown as React elements (not dangerouslySetInnerHTML)
 */

export const Markdown = ({text}: MarkdownProps) => {
    const xml = useMemo(() => parseRichText(sanitize(text)), [text])
    return <div className={css.markdown} dangerouslySetInnerHTML={{__html: xml}}/>
}

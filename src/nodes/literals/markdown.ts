import { createLiteral, type LiteralNode } from './base.js'

export interface MarkdownNode extends LiteralNode {
  type: 'markdown'
}

export interface AddMarkdown {
  readonly markdown: (markdown: string) => void
  readonly md: (markdown: string) => void
}

export function createMarkdown(value: string): MarkdownNode {
  return createLiteral({ type: 'markdown', value })
}

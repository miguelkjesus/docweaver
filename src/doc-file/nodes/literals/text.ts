import { createLiteral, type LiteralNode } from './base.js'

export type TextNode = LiteralNode &
  Readonly<{
    type: 'text'
  }>

export interface AddText {
  readonly description: (text: string) => void
  readonly text: (text: string) => void
}

export function createText(value: string): TextNode {
  return createLiteral({ type: 'text', value })
}

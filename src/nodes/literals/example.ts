import { createLiteral, type LiteralNode } from './base.js'

export interface ExampleNode extends LiteralNode {
  type: 'example'
  language: string // TODO enum?
}

export interface AddExample {
  readonly example: (language: string, example: string) => void
}

export function createExample(language: string, value: string): ExampleNode {
  return createLiteral({ type: 'example', language, value })
}

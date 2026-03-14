import { createLiteral, type LiteralNode } from '@/nodes/literals/base.js'

describe(createLiteral, () => {
  it('returns the same node reference', () => {
    const node = { type: 'test', value: 'hello' }
    const result = createLiteral(node)

    expect(result).toBe(node)
  })

  it('dedents the value', () => {
    const node = {
      type: 'test',
      value: `
        hello
      `,
    }

    createLiteral(node)

    expect(node.value).toBe('hello')
  })

  it('preserves extended node properties', () => {
    interface StringLiteralNode extends LiteralNode {
      type: 'string'
      quote: 'single' | 'double'
    }

    const node: StringLiteralNode = {
      type: 'string',
      value: 'hello',
      quote: 'single',
    }

    const result = createLiteral(node)

    expect(result).toEqual({
      type: 'string',
      quote: 'single',
      value: 'hello',
    })
  })
})

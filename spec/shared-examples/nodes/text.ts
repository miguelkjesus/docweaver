import type { CompositeNode } from '@/nodes/composites/base.js'
import type { AddText } from '@/nodes/literals/text.js'

export function itAddsTextNodes(
  createNode: (init: string | ((builder: AddText) => void)) => CompositeNode,
) {
  it('adds text nodes via text()', () => {
    const result = createNode(({ text }) => {
      text('foo')
    })

    expect(result.content).toMatchObject([{ type: 'text', value: 'foo' }])
  })

  it('adds text nodes via description()', () => {
    const result = createNode(({ description }) => {
      description('bar')
    })

    expect(result.content).toMatchObject([{ type: 'text', value: 'bar' }])
  })

  it('adds text nodes via a string', () => {
    const result = createNode('baz')

    expect(result.content).toMatchObject([{ type: 'text', value: 'baz' }])
  })
}

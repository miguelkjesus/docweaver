import type { CompositeNode } from '@/nodes/composites/base.js'
import type { AddReturns } from '@/nodes/composites/return.js'

export function itAddsReturnsNodes(
  factory: (init: (builder: AddReturns) => void) => CompositeNode,
) {
  it('adds returns nodes via returns()', () => {
    const result = factory(({ returns }) => {
      returns('the return value description')
    })

    expect(result.content).toMatchObject([
      {
        type: 'returns',
        content: [{ type: 'text', value: 'the return value description' }],
      },
    ])
  })
}

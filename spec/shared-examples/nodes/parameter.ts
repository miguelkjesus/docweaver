import type { CompositeNode } from '@/nodes/composites/base.js'
import type { AddParameter } from '@/nodes/composites/parameter.js'

export function itAddsParameterNodes(
  factory: (init: (builder: AddParameter) => void) => CompositeNode,
) {
  it('adds parameter nodes via parameter()', () => {
    const result = factory(({ parameter }) => {
      parameter('arg1', 'first argument')
    })

    expect(result.content).toMatchObject([
      {
        type: 'parameter',
        key: 'arg1',
        content: [{ type: 'text', value: 'first argument' }],
      },
    ])
  })
}

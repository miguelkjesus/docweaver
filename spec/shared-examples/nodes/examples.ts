import type { CompositeNode } from '@/nodes/composites/base.js'
import type { AddExamples } from '@/nodes/composites/examples.js'

export function itAddsExamplesNodes(
  createNode: (init: (builder: AddExamples) => void) => CompositeNode,
) {
  it('adds examples nodes via examples()', () => {
    const result = createNode(({ examples }) => {
      examples(({ example }) => {
        example('typescript', 'const x = 1')
      })
    })

    expect(result.content).toMatchObject([
      {
        type: 'examples',
        content: [{ type: 'example', language: 'typescript', value: 'const x = 1' }],
      },
    ])
  })
}

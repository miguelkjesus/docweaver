import type { CompositeNode } from '@/nodes/composites/base.js'
import type { AddMethod, AddStaticMethod } from '@/nodes/composites/method.js'

interface ExampleObject {
  testMethod(): void
}

export function itAddsMethodNodes(
  createNode: (init: (builder: AddMethod<ExampleObject>) => void) => CompositeNode,
) {
  it('adds method nodes via method()', () => {
    const result = createNode(({ method }) => {
      method('testMethod', 'method description')
    })

    expect(result.content).toMatchObject([
      {
        type: 'method',
        isStatic: false,
        key: 'testMethod',
        content: [{ type: 'text', value: 'method description' }],
      },
    ])
  })
}

export function itAddsStaticMethodNodes(
  factory: (init: (builder: AddStaticMethod<ExampleObject>) => void) => CompositeNode,
) {
  it('adds static method nodes via method.static()', () => {
    const result = factory(({ method }) => {
      method.static('testMethod', 'static method description')
    })

    expect(result.content).toMatchObject([
      {
        type: 'method',
        isStatic: true,
        key: 'testMethod',
        content: [{ type: 'text', value: 'static method description' }],
      },
    ])
  })
}

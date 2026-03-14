import type { CompositeNode } from '@/nodes/composites/base.js'
import type { AddProperty, AddStaticProperty } from '@/nodes/composites/property.js'

interface ExampleObject {
  testProp: string
}

export function itAddsPropertyNodes(
  factory: (init: (builder: AddProperty<ExampleObject>) => void) => CompositeNode,
) {
  it('adds property nodes via property()', () => {
    const result = factory(({ property }) => {
      property('testProp', 'property description')
    })

    expect(result.content).toMatchObject([
      {
        type: 'property',
        isStatic: false,
        key: 'testProp',
        content: [{ type: 'text', value: 'property description' }],
      },
    ])
  })
}

export function itAddsStaticPropertyNodes(
  factory: (init: (builder: AddStaticProperty<ExampleObject>) => void) => CompositeNode,
) {
  it('adds static property nodes via property.static()', () => {
    const result = factory(({ property }) => {
      property.static('testProp', 'static property description')
    })

    expect(result.content).toMatchObject([
      {
        type: 'property',
        isStatic: true,
        key: 'testProp',
        content: [{ type: 'text', value: 'static property description' }],
      },
    ])
  })
}

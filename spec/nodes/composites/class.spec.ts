import {
  itAddsCommonContentNodes,
  itAddsMethodNodes,
  itAddsPropertyNodes,
  itAddsStaticMethodNodes,
  itAddsStaticPropertyNodes,
} from '@spec/shared-examples/nodes'

import { ClassBuilder, createClass } from '@/nodes'

declare class TestClass {
  testProp: string
  testMethod(): void

  static testProp: string
  static testMethod(): void
}

describe(createClass, () => {
  const factory = (init: string | ((builder: ClassBuilder<typeof TestClass>) => void)) =>
    createClass<typeof TestClass>('TestClass', init)

  itAddsCommonContentNodes(factory)

  itAddsMethodNodes(factory)

  itAddsStaticMethodNodes(factory)

  itAddsPropertyNodes(factory)

  itAddsStaticPropertyNodes(factory)

  it('sets the name property', () => {
    const result = createClass('MyClass', 'description')
    expect(result.name).toBe('MyClass')
  })
})

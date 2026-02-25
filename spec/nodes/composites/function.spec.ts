import {
  itAddsCommonContentNodes,
  itAddsParameterNodes,
  itAddsReturnsNodes,
} from '@spec/shared-examples/nodes'

import { createFunction, FunctionBuilder } from '@/nodes'

describe(createFunction, () => {
  const factory = (init: string | ((builder: FunctionBuilder) => void)) =>
    createFunction('testFunc', init)

  itAddsCommonContentNodes(factory)

  itAddsParameterNodes(factory)

  itAddsReturnsNodes(factory)

  it('sets the name property', () => {
    const result = createFunction('myFunction', 'description')
    expect(result.name).toBe('myFunction')
  })
})

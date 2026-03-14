import { itAddsCommonContentNodes } from '@spec/shared-examples/nodes/common.js'
import { itAddsParameterNodes } from '@spec/shared-examples/nodes/parameter.js'
import { itAddsReturnsNodes } from '@spec/shared-examples/nodes/returns.js'

import { createFunction, type FunctionBuilder } from '@/nodes/composites/function.js'

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

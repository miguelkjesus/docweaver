import { itAddsCommonContentNodes } from '@spec/shared-examples/nodes/common.js'
import { itHasKey } from '@spec/shared-examples/nodes/has-key.js'
import { itAddsParameterNodes } from '@spec/shared-examples/nodes/parameter.js'
import { itAddsReturnsNodes } from '@spec/shared-examples/nodes/returns.js'

import { createMethod, type MethodBuilder } from '@/nodes/composites/method.js'

describe(createMethod, () => {
  const factory = (init: string | ((builder: MethodBuilder) => void)) =>
    createMethod(false, 'foo', init)

  itAddsCommonContentNodes(factory)

  itAddsParameterNodes(factory)

  itAddsReturnsNodes(factory)

  itHasKey((key) => createMethod(false, key, ''))
})

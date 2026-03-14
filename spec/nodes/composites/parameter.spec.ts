import { itAddsCommonContentNodes } from '@spec/shared-examples/nodes/common.js'
import { itHasKey } from '@spec/shared-examples/nodes/has-key.js'

import { createParameter } from '@/nodes/composites/parameter.js'

describe(createParameter, () => {
  itAddsCommonContentNodes((init) => createParameter('foo', init))

  itHasKey<string>((key) => createParameter(key, ''), {
    supportsSymbol: false,
    supportsNumber: false,
  })
})

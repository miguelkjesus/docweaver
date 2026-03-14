import { itAddsCommonContentNodes } from '@spec/shared-examples/nodes/common.js'
import { itHasKey } from '@spec/shared-examples/nodes/has-key.js'

import { createProperty } from '@/nodes/composites/property.js'

describe(createProperty, () => {
  itAddsCommonContentNodes((init) => createProperty(false, 'foo', init))

  itHasKey((key) => createProperty(false, key, ''))
})

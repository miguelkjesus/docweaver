import { itAddsCommonContentNodes } from '@spec/shared-examples/nodes'

import { createReturns } from '@/nodes'

describe(createReturns, () => {
  itAddsCommonContentNodes(createReturns)
})

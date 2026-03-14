import { itAddsExampleNodes } from '@spec/shared-examples/nodes/example.js'

import { createExamples } from '@/nodes/composites/examples.js'

describe(createExamples, () => {
  itAddsExampleNodes(createExamples)
})

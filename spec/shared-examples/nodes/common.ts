import type { CompositeNode } from '@/nodes/composites/base.js'
import type { AddCommonContent } from '@/nodes/composites/common.js'

import { itAddsExampleNodes } from './example.js'
import { itAddsExamplesNodes } from './examples.js'
import { itAddsMarkdownNodes } from './markdown.js'
import { itAddsTextNodes } from './text.js'

export function itAddsCommonContentNodes(
  createNode: (init: string | ((builder: AddCommonContent) => void)) => CompositeNode,
) {
  itAddsTextNodes(createNode)

  itAddsMarkdownNodes(createNode)

  itAddsExampleNodes(createNode)

  itAddsExamplesNodes(createNode)
}

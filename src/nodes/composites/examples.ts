import type { StripInternals } from '@/internal/utils/types.js'

import { type AddExample, createExample, type ExampleNode } from '../literals/example.js'

import { __CompositeBuilder, type CompositeNode } from './base.js'

export interface ExamplesNode extends CompositeNode {
  type: 'examples'
  content: ExampleNode[]
}

export interface AddExamples {
  readonly examples: (examples: (builder: ExamplesBuilder) => void) => void
}

class __ExamplesBuilder extends __CompositeBuilder<ExamplesNode> implements AddExample {
  constructor() {
    super({ type: 'examples', content: [] })
  }

  readonly example = (language: string, example: string) => {
    this.__node.content.push(createExample(language, example))
  }
}

export type ExamplesBuilder = StripInternals<__ExamplesBuilder>

export function createExamples(init: (builder: ExamplesBuilder) => void) {
  return new __ExamplesBuilder().__build(init)
}

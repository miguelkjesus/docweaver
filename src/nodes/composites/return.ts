import { StripInternals } from '@/internal/utils/types'

import { CompositeNode } from './base'
import { __CommonContentBuilder, CommonContentNode } from './common'

export interface ReturnsNode extends CompositeNode {
  type: 'returns'
  content: CommonContentNode[]
}

export interface AddReturns {
  readonly returns: (returns: string | ((builder: ReturnsBuilder) => void)) => void
}

class __ReturnsBuilder extends __CommonContentBuilder<ReturnsNode> {
  constructor() {
    super({ type: 'returns', content: [] })
  }
}

export type ReturnsBuilder = StripInternals<__ReturnsBuilder>

export function createReturns(init: string | ((builder: ReturnsBuilder) => void)) {
  return new __ReturnsBuilder().__build(init)
}

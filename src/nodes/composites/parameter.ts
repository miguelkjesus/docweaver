import type { StripInternals } from '@/internal/utils/types.js'

import type { CompositeNode } from './base.js'
import { __CommonContentBuilder, type CommonContentNode } from './common.js'

export interface ParameterNode extends CompositeNode {
  type: 'parameter'
  key: string
  content: CommonContentNode[]
}

export interface AddParameter {
  readonly parameter: (
    key: string,
    parameter: string | ((builder: ParameterBuilder) => void),
  ) => void
  readonly param: (key: string, parameter: string | ((builder: ParameterBuilder) => void)) => void
}

class __ParameterBuilder extends __CommonContentBuilder<ParameterNode> {
  constructor(key: string) {
    super({ type: 'parameter', key, content: [] })
  }
}

export type ParameterBuilder = StripInternals<__ParameterBuilder>

export function createParameter(key: string, init: string | ((builder: ParameterBuilder) => void)) {
  return new __ParameterBuilder(key).__build(init)
}

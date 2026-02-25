import { StripInternals } from '@/internal/utils/types'

import { CompositeNode } from './base'
import { __CommonContentBuilder, CommonContentNode } from './common'
import { AddParameter, createParameter, ParameterBuilder, ParameterNode } from './parameter'
import { AddReturns, createReturns, ReturnsBuilder, ReturnsNode } from './return'

export interface FunctionNode extends CompositeNode {
  type: 'function'
  name: string
  content: (CommonContentNode | ParameterNode | ReturnsNode)[]
}

class __FunctionBuilder
  extends __CommonContentBuilder<FunctionNode>
  implements AddParameter, AddReturns
{
  constructor(name: string) {
    super({ type: 'function', name, content: [] })
  }

  readonly parameter = (key: string, parameter: string | ((builder: ParameterBuilder) => void)) => {
    this.__node.content.push(createParameter(key, parameter))
  }

  readonly param = this.parameter

  readonly returns = (returns: string | ((builder: ReturnsBuilder) => void)) => {
    this.__node.content.push(createReturns(returns))
  }
}

export type FunctionBuilder = StripInternals<__FunctionBuilder>

export function createFunction(name: string, init: string | ((builder: FunctionBuilder) => void)) {
  return new __FunctionBuilder(name).__build(init)
}

import { Key, MethodKeysOf, StripInternals } from '@/internal/utils/types'

import { CompositeNode } from './base'
import { __CommonContentBuilder, CommonContentNode } from './common'
import { AddParameter, createParameter, ParameterBuilder, ParameterNode } from './parameter'
import { AddReturns, createReturns, ReturnsBuilder, ReturnsNode } from './return'

export interface MethodNode extends CompositeNode {
  type: 'method'
  isStatic: boolean
  key: Key
  content: (CommonContentNode | ParameterNode | ReturnsNode)[]
}

export interface AddMethod<T extends object = object> {
  readonly method: (
    key: MethodKeysOf<T>,
    method: string | ((builder: MethodBuilder) => void),
  ) => void
}

export interface AddStaticMethod<T extends object = object> {
  readonly method: {
    static: (key: MethodKeysOf<T>, method: string | ((builder: MethodBuilder) => void)) => void
  }
}

class __MethodBuilder
  extends __CommonContentBuilder<MethodNode>
  implements AddParameter, AddReturns
{
  constructor(isStatic: boolean, key: Key) {
    super({ type: 'method', isStatic, key, content: [] })
  }

  readonly parameter = (key: string, parameter: string | ((builder: ParameterBuilder) => void)) => {
    this.__node.content.push(createParameter(key, parameter))
  }

  readonly param = this.parameter

  readonly returns = (returns: string | ((builder: ReturnsBuilder) => void)) => {
    this.__node.content.push(createReturns(returns))
  }
}

export type MethodBuilder = StripInternals<__MethodBuilder>

export function createMethod(
  isStatic: boolean,
  key: Key,
  init: string | ((builder: MethodBuilder) => void),
) {
  return new __MethodBuilder(isStatic, key).__build(init)
}

import type { Key, StripInternals } from '@/utils/types.js'

import type { CompositeNode } from './base.js'
import { __CommonContentBuilder, type CommonContentNode } from './common.js'

export type PropertyNode = CompositeNode &
  Readonly<{
    type: 'property'
    isStatic: boolean
    key: Key
    content: CommonContentNode[]
  }>

export interface AddProperty<T extends object = object> {
  readonly property: (key: keyof T, property: string | ((builder: PropertyBuilder) => void)) => void
}

export interface AddStaticProperty<T extends object = object> {
  readonly property: {
    static: (key: keyof T, property: string | ((builder: PropertyBuilder) => void)) => void
  }
}

class __PropertyBuilder extends __CommonContentBuilder<PropertyNode> {
  constructor(isStatic: boolean, key: Key) {
    super({ type: 'property', isStatic, key, content: [] })
  }
}

export type PropertyBuilder = StripInternals<__PropertyBuilder>

export function createProperty(
  isStatic: boolean,
  key: Key,
  init: string | ((builder: PropertyBuilder) => void),
) {
  return new __PropertyBuilder(isStatic, key).__build(init)
}

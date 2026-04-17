import type { AbstractClass, Key, MethodKeysOf, StripInternals } from '@/utils/types.js'

import type { CompositeNode } from './base.js'
import { __CommonContentBuilder, type CommonContentNode } from './common.js'
import {
  type AddMethod,
  type AddStaticMethod,
  createMethod,
  type MethodBuilder,
  type MethodNode,
} from './method.js'
import {
  type AddProperty,
  type AddStaticProperty,
  createProperty,
  type PropertyBuilder,
  type PropertyNode,
} from './property.js'

export type ClassNode = CompositeNode &
  Readonly<{
    type: 'class'
    name: string
    content: (CommonContentNode | PropertyNode | MethodNode)[]
  }>

class __ClassBuilder<Constructor extends AbstractClass>
  extends __CommonContentBuilder<ClassNode>
  implements
    AddMethod<InstanceType<Constructor>>,
    AddProperty<InstanceType<Constructor>>,
    AddStaticMethod<Constructor>,
    AddStaticProperty<Constructor>
{
  constructor(name: string) {
    super({ type: 'class', name, content: [] })
  }

  private _method(
    isStatic: boolean,
    key: Key,
    method: string | ((builder: MethodBuilder) => void),
  ) {
    this.__node.content.push(createMethod(isStatic, key, method))
  }

  readonly method = Object.assign(
    (
      key: MethodKeysOf<InstanceType<Constructor>>,
      method: string | ((builder: MethodBuilder) => void),
    ) => {
      this._method(false, key, method)
    },
    {
      static: (
        key: MethodKeysOf<Constructor>,
        method: string | ((builder: MethodBuilder) => void),
      ) => {
        this._method(true, key, method)
      },
    },
  )

  private _property(
    isStatic: boolean,
    key: Key,
    property: string | ((builder: PropertyBuilder) => void),
  ) {
    this.__node.content.push(createProperty(isStatic, key, property))
  }

  readonly property = Object.assign(
    (
      key: keyof InstanceType<Constructor>,
      property: string | ((builder: PropertyBuilder) => void),
    ) => {
      this._property(false, key, property)
    },
    {
      static: (key: keyof Constructor, property: string | ((builder: PropertyBuilder) => void)) => {
        this._property(true, key, property)
      },
    },
  )
}

export type ClassBuilder<T extends AbstractClass> = StripInternals<__ClassBuilder<T>>

export function createClass<T extends AbstractClass>(
  name: string,
  init: string | ((builder: ClassBuilder<T>) => void),
) {
  return new __ClassBuilder<T>(name).__build(init)
}

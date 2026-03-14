import type { AbstractClass, Callback } from '@/internal/utils/types.js'

import type { CompositeNode } from '../composites/base.js'
import { type ClassBuilder, createClass } from '../composites/class.js'
import { createFunction, type FunctionBuilder } from '../composites/function.js'

export class DocumentApi {
  private readonly nodes: CompositeNode[]

  constructor(nodes: CompositeNode[] = []) {
    this.nodes = nodes
  }

  class<Class extends AbstractClass>(
    cls: string | Class,
    docs: string | ((builder: ClassBuilder<Class>) => void),
  ) {
    const name = typeof cls === 'string' ? cls : cls.name
    const node = createClass(name, docs)
    this.nodes.push(node)
    return node
  }

  function(func: string | Callback, docs: string | ((builder: FunctionBuilder) => void)) {
    const name = typeof func === 'string' ? func : func.name
    const node = createFunction(name, docs)
    this.nodes.push(node)
    return node
  }
}

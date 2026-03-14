import type { LiteralNode } from '../literals/base.js'

export interface CompositeNode {
  type: string
  content: (LiteralNode | CompositeNode)[]
}

export interface NodeWithContent<
  Content extends LiteralNode | CompositeNode,
> extends CompositeNode {
  content: Content[]
}

export abstract class __CompositeBuilder<Node extends CompositeNode> {
  __node: Node

  constructor(node: Node) {
    this.__node = node
  }

  __build(init: (builder: this) => void) {
    init(this)
    return this.__node
  }
}

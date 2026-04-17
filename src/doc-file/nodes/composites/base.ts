import type { LiteralNode } from '../literals/base.js'

export type CompositeNode = Readonly<{
  type: string
  content: (LiteralNode | CompositeNode)[]
}>

export type NodeWithContent<Content extends LiteralNode | CompositeNode> = CompositeNode &
  Readonly<{
    content: Content[]
  }>

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

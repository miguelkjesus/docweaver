import { dedent } from '@/internal/utils/string.js'

export type LiteralNode = Readonly<{
  type: string
  value: string
}>

export function createLiteral<T extends LiteralNode>(node: T): T {
  node.value = dedent(node.value)
  return node
}

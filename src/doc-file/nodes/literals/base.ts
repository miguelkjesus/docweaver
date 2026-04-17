import { dedent } from '@/utils/string.js'

export type LiteralNode = Readonly<{
  type: string
  value: string
}>

export function createLiteral<T extends LiteralNode>(node: T): T {
  return { ...node, value: dedent(node.value) }
}

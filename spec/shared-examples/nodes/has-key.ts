import type { Key } from '@/internal/utils/types.js'
import type { CompositeNode } from '@/nodes/composites/base.js'

interface NodeWithKey<K extends Key> extends CompositeNode {
  key: K
}

export function itHasKey<K extends Key>(
  createNode: (key: string | K) => NodeWithKey<K>,
  {
    supportsNumber = true,
    supportsSymbol = true,
  }: {
    supportsNumber?: boolean
    supportsSymbol?: boolean
  } = {},
) {
  it('sets the key property with a string', () => {
    const result = createNode('myKey')
    expect(result.key).toBe('myKey')
  })

  if (supportsNumber) {
    it('sets the key property with a number', () => {
      const result = createNode(1 as K)
      expect(result.key).toBe(1)
    })
  }

  if (supportsSymbol) {
    it('sets the key property with a symbol', () => {
      const sym = Symbol('mySymbol')
      const result = createNode(sym as K)

      expect(result.key).toBe(sym)
    })
  }
}

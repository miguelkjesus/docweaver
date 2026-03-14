import { createText } from '@/nodes/literals/text.js'

describe(createText, () => {
  it('returns a TextNode with type "text"', () => {
    const result = createText('foo')

    expect(result.type).toBe('text')
  })

  it('sets the value property', () => {
    const result = createText('bar')

    expect(result.value).toBe('bar')
  })

  it('dedents the value', () => {
    const result = createText(`
      foo
        bar
    `)

    expect(result.value).toBe('foo\n  bar')
  })
})

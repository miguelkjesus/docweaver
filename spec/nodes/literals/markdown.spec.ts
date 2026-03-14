import { createMarkdown } from '@/nodes/literals/markdown.js'

describe(createMarkdown, () => {
  it('returns a MarkdownNode with type "markdown"', () => {
    const result = createMarkdown('# foo')

    expect(result.type).toBe('markdown')
  })

  it('sets the value property', () => {
    const result = createMarkdown('*bar*')

    expect(result.value).toBe('*bar*')
  })

  it('dedents the value', () => {
    const result = createMarkdown(`
      - foo
        - bar
    `)

    expect(result.value).toBe('- foo\n  - bar')
  })
})

import { vi } from 'vitest'

import type { AddMarkdown } from '@/nodes/literals/markdown.js'
import { markdown, md } from '@/nodes/utils/markdown.js'

describe('markdown', () => {
  it('returns a function that calls builder.markdown with the provided string', () => {
    const builder: AddMarkdown = {
      markdown: vi.fn(),
      md: vi.fn(),
    }

    const result = markdown('# Hello World')
    result(builder)

    expect(builder.markdown).toHaveBeenCalledWith('# Hello World')
  })

  it('works as a template literal', () => {
    const builder: AddMarkdown = {
      markdown: vi.fn(),
      md: vi.fn(),
    }

    const result = markdown`
# Template Literal
    `
    result(builder)

    expect(builder.markdown).toHaveBeenCalledWith(`
# Template Literal
    `)
  })

  it('interpolates values in template literals', () => {
    const builder: AddMarkdown = {
      markdown: vi.fn(),
      md: vi.fn(),
    }

    const name = 'World'
    const result = markdown`# Hello ${name}!`
    result(builder)

    expect(builder.markdown).toHaveBeenCalledWith('# Hello World!')
  })

  it('handles multiple interpolations', () => {
    const builder: AddMarkdown = {
      markdown: vi.fn(),
      md: vi.fn(),
    }

    const a = 'foo'
    const b = 'bar'
    const c = 'baz'
    const result = markdown`${a} - ${b} - ${c}`
    result(builder)

    expect(builder.markdown).toHaveBeenCalledWith('foo - bar - baz')
  })

  it('converts non-string interpolated values to strings', () => {
    const builder: AddMarkdown = {
      markdown: vi.fn(),
      md: vi.fn(),
    }

    const num = 42
    const result = markdown`The answer is ${num}`
    result(builder)

    expect(builder.markdown).toHaveBeenCalledWith('The answer is 42')
  })
})

describe('md', () => {
  it('is an alias for markdown', () => {
    expect(md).toBe(markdown)
  })
})

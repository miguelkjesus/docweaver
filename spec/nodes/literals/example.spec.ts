import { createExample } from '@/nodes/literals/example.js'

describe(createExample, () => {
  it('returns an ExampleNode with type "example"', () => {
    const result = createExample('typescript', 'const x = 1')

    expect(result.type).toBe('example')
  })

  it('sets the language property', () => {
    const result = createExample('python', 'print("hello")')

    expect(result.language).toBe('python')
  })

  it('sets the value property', () => {
    const result = createExample('javascript', 'console.log("test")')

    expect(result.value).toBe('console.log("test")')
  })

  it('dedents the value', () => {
    const result = createExample(
      'typescript',
      `
        const x = 1
        const y = 2
      `,
    )

    expect(result.value).toBe('const x = 1\nconst y = 2')
  })
})

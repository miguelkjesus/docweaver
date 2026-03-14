import { dedent, templateTag } from '@/internal/utils/string.js'

describe(dedent, () => {
  it('removes common leading indentation', () => {
    const result = dedent(`
      hello
      world
    `)

    expect(result).toBe('hello\nworld')
  })

  it('preserves relative indentation', () => {
    const result = dedent(`
      hello
        world
    `)

    expect(result).toBe('hello\n  world')
  })

  it('ignores empty leading and trailing lines', () => {
    const result = dedent(`


        hello
          world


    `)

    expect(result).toBe('hello\n  world')
  })

  it('does not remove indentation from empty lines in the middle', () => {
    const result = dedent(`
      hello

        world
    `)

    expect(result).toBe('hello\n\n  world')
  })

  it('handles single-line strings', () => {
    const result = dedent(`
        hello
    `)

    expect(result).toBe('hello')
  })

  it('returns an empty string when given only whitespace', () => {
    const result = dedent(`


    `)

    expect(result).toBe('')
  })

  it('handles Windows line endings', () => {
    const result = dedent('\r\n    hello\r\n      world\r\n')

    expect(result).toBe('hello\n  world')
  })

  it('does not change already dedented text', () => {
    const result = dedent(`
hello
  world
    `)

    expect(result).toBe('hello\n  world')
  })
})

describe(templateTag, () => {
  const upper = templateTag((text) => text.toUpperCase())

  it('interpolates expressions like a normal template literal', () => {
    expect(upper`${42} is ${'the'} answer`).toBe('42 IS THE ANSWER')
  })

  it('stringifies undefined, null and objects correctly', () => {
    expect(upper`${undefined} ${null} ${{}}`).toBe('UNDEFINED NULL [OBJECT OBJECT]')
  })

  it('handles empty template', () => {
    expect(upper``).toBe('')
  })

  it('handles template with no expressions', () => {
    expect(upper`hello world`).toBe('HELLO WORLD')
  })

  it('handles consecutive expressions', () => {
    expect(upper`${1}${2}${3}`).toBe('123')
  })

  it('handles direct string invocation', () => {
    expect(upper('foo bar')).toBe('FOO BAR')
  })

  it('preserves whitespace and newlines', () => {
    expect(upper`a\nb`).toBe('A\nB')
  })
})

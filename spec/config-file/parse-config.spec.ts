import { parseConfig } from '@/config-file/parse-config.js'

describe(parseConfig, () => {
  it('returns an empty object for an empty input', () => {
    expect(parseConfig({})).toEqual({})
  })

  it('returns a valid config with all fields', () => {
    const input = { paths: ['src/**'], files: ['a.ts'], tsconfig: 'tsconfig.json' }

    expect(parseConfig(input)).toEqual(input)
  })

  it('returns a valid config with only paths', () => {
    expect(parseConfig({ paths: ['src'] })).toMatchObject({ paths: ['src'] })
  })

  it('strips unknown keys', () => {
    const result = parseConfig({ paths: ['src'], unknown: true })

    expect(result).not.toHaveProperty('unknown')
  })

  it('throws when paths is not an array', () => {
    expect(() => parseConfig({ paths: 'src' })).toThrow()
  })

  it('throws when a paths element is not a string', () => {
    expect(() => parseConfig({ paths: [42] })).toThrow()
  })

  it('throws when files is not an array', () => {
    expect(() => parseConfig({ files: 'a.ts' })).toThrow()
  })

  it('throws when tsconfig is not a string', () => {
    expect(() => parseConfig({ tsconfig: 123 })).toThrow()
  })
})

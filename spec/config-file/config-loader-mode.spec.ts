import { chooseConfigLoaderMode } from '@/config-file/config-loader-mode.js'

describe(chooseConfigLoaderMode, () => {
  it.each(['.yaml', '.yml'])('returns "yaml" for %s', (ext) => {
    expect(chooseConfigLoaderMode(ext)).toBe('yaml')
  })

  it('returns "json" for .json', () => {
    expect(chooseConfigLoaderMode('.json')).toBe('json')
  })

  it.each(['.ts', '.mts', '.cts'])('returns "bundle" for %s', (ext) => {
    expect(chooseConfigLoaderMode(ext)).toBe('bundle')
  })

  it.each(['.js', '.mjs', '.cjs'])('returns "native" for %s', (ext) => {
    expect(chooseConfigLoaderMode(ext)).toBe('native')
  })

  it('returns undefined for an unrecognized extension', () => {
    expect(chooseConfigLoaderMode('.txt')).toBeUndefined()
  })
})

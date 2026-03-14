import { mergeConfig } from '@/config-file/merge-config.js'

describe(mergeConfig, () => {
  it('returns empty fields when both base and overrides are empty', () => {
    expect(mergeConfig({}, {})).toEqual({
      paths: undefined,
      files: undefined,
      tsconfig: undefined,
    })
  })

  it('uses base fields when overrides are empty', () => {
    const base = { paths: ['src'], files: ['a.ts'], tsconfig: 'tsconfig.json' }

    expect(mergeConfig(base, {})).toEqual(base)
  })

  it('uses override fields when provided', () => {
    const base = { paths: ['src'], files: ['a.ts'], tsconfig: 'tsconfig.json' }
    const overrides = { paths: ['lib'], files: ['b.ts'], tsconfig: 'tsconfig.lib.json' }

    expect(mergeConfig(base, overrides)).toEqual(overrides)
  })

  it('overrides only the fields that are present', () => {
    const base = { paths: ['src'], files: ['a.ts'], tsconfig: 'tsconfig.json' }
    const result = mergeConfig(base, { tsconfig: 'tsconfig.lib.json' })

    expect(result.paths).toEqual(['src'])
    expect(result.files).toEqual(['a.ts'])
    expect(result.tsconfig).toBe('tsconfig.lib.json')
  })
})

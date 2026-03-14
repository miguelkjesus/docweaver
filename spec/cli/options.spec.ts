import { parseCliOptions } from '@/cli/options.js'

describe(parseCliOptions, () => {
  it('returns empty config when given an empty object', () => {
    expect(parseCliOptions({})).toMatchObject({
      config: {
        json: {},
        yaml: {},
        bundle: {},
      },
    })
  })

  it('maps paths and files directly', () => {
    const result = parseCliOptions({ paths: ['src'], files: ['a.ts'] })

    expect(result.paths).toEqual(['src'])
    expect(result.files).toEqual(['a.ts'])
  })

  it('maps tsconfig directly', () => {
    const result = parseCliOptions({ tsconfig: 'tsconfig.json' })

    expect(result.tsconfig).toBe('tsconfig.json')
  })

  it('maps config to config.filePath', () => {
    const result = parseCliOptions({ config: 'docspec.config.ts' })

    expect(result.config?.filePath).toBe('docspec.config.ts')
  })

  it('maps config.loader to config.loader', () => {
    const result = parseCliOptions({ 'config.loader': 'yaml' })

    expect(result.config?.loader).toBe('yaml')
  })

  it('maps config.json.encoding to config.json.encoding', () => {
    const result = parseCliOptions({ 'config.json.encoding': 'utf8' })

    expect(result.config?.json?.encoding).toBe('utf8')
  })

  it('maps config.yaml.encoding to config.yaml.encoding', () => {
    const result = parseCliOptions({ 'config.yaml.encoding': 'utf8' })

    expect(result.config?.yaml?.encoding).toBe('utf8')
  })

  it('falls back config.json.encoding to config.encoding', () => {
    const result = parseCliOptions({ 'config.encoding': 'utf8' })

    expect(result.config?.json?.encoding).toBe('utf8')
  })

  it('falls back config.yaml.encoding to config.encoding', () => {
    const result = parseCliOptions({ 'config.encoding': 'utf8' })

    expect(result.config?.yaml?.encoding).toBe('utf8')
  })

  it('prefers config.json.encoding over config.encoding', () => {
    const result = parseCliOptions({ 'config.encoding': 'utf8', 'config.json.encoding': 'latin1' })

    expect(result.config?.json?.encoding).toBe('latin1')
  })

  it('prefers config.yaml.encoding over config.encoding', () => {
    const result = parseCliOptions({ 'config.encoding': 'utf8', 'config.yaml.encoding': 'latin1' })

    expect(result.config?.yaml?.encoding).toBe('latin1')
  })

  it('maps config.bundle.tsconfig to config.bundle.tsconfig', () => {
    const result = parseCliOptions({ 'config.bundle.tsconfig': 'tsconfig.bundle.json' })

    expect(result.config?.bundle?.tsconfig).toBe('tsconfig.bundle.json')
  })

  it('falls back config.bundle.tsconfig to tsconfig', () => {
    const result = parseCliOptions({ tsconfig: 'tsconfig.json' })

    expect(result.config?.bundle?.tsconfig).toBe('tsconfig.json')
  })

  it('prefers config.bundle.tsconfig over tsconfig', () => {
    const result = parseCliOptions({
      tsconfig: 'tsconfig.json',
      'config.bundle.tsconfig': 'tsconfig.bundle.json',
    })

    expect(result.config?.bundle?.tsconfig).toBe('tsconfig.bundle.json')
  })

  it('throws on invalid config.loader value', () => {
    expect(() => parseCliOptions({ 'config.loader': 'invalid' })).toThrow()
  })

  it('throws on invalid config.encoding value', () => {
    expect(() => parseCliOptions({ 'config.encoding': 'not-an-encoding' })).toThrow()
  })

  it('throws on invalid config.json.encoding value', () => {
    expect(() => parseCliOptions({ 'config.json.encoding': 'not-an-encoding' })).toThrow()
  })

  it('throws on invalid config.yaml.encoding value', () => {
    expect(() => parseCliOptions({ 'config.yaml.encoding': 'not-an-encoding' })).toThrow()
  })
})

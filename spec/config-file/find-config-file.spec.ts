import { createMockFileSystem } from '@spec/mocks/fs.js'

import { findConfigFile } from '@/config-file/find-config-file.js'

describe(findConfigFile, () => {
  it('finds docspec.config.json in the given directory', async () => {
    createMockFileSystem({
      '/project/docspec.config.json': '{}',
    })

    expect(await findConfigFile('/project')).toBe('/project/docspec.config.json')
  })

  it('finds docspec.config.ts', async () => {
    createMockFileSystem({
      '/project/docspec.config.ts': '',
    })

    expect(await findConfigFile('/project')).toBe('/project/docspec.config.ts')
  })

  it('finds docspec.config.yaml', async () => {
    createMockFileSystem({
      '/project/docspec.config.yaml': '',
    })

    expect(await findConfigFile('/project')).toBe('/project/docspec.config.yaml')
  })

  it('returns undefined when no config exists', async () => {
    createMockFileSystem({
      '/project/package.json': '',
    })

    expect(await findConfigFile('/project')).toBeUndefined()
  })

  it('walks up to find config in parent directories', async () => {
    createMockFileSystem({
      '/project/docspec.config.json': '{}',
      '/project/src/index.ts': '',
    })

    expect(await findConfigFile('/project/src')).toBe('/project/docspec.config.json')
  })

  it('defaults to process.cwd() when no cwd is given', async () => {
    createMockFileSystem({
      [`${process.cwd()}/docspec.config.json`]: '{}',
    })

    expect(await findConfigFile()).toBe(`${process.cwd()}/docspec.config.json`)
  })
})

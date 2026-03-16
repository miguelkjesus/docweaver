import { createMockFileSystem } from '@spec/mocks/fs.js'

import { findConfigFile } from '@/config-file/find-config-file.js'

describe(findConfigFile, () => {
  it('finds docweaver.config.json in the given directory', async () => {
    createMockFileSystem({
      '/project/docweaver.config.json': '{}',
    })

    expect(await findConfigFile('/project')).toBe('/project/docweaver.config.json')
  })

  it('finds docweaver.config.ts', async () => {
    createMockFileSystem({
      '/project/docweaver.config.ts': '',
    })

    expect(await findConfigFile('/project')).toBe('/project/docweaver.config.ts')
  })

  it('finds docweaver.config.yaml', async () => {
    createMockFileSystem({
      '/project/docweaver.config.yaml': '',
    })

    expect(await findConfigFile('/project')).toBe('/project/docweaver.config.yaml')
  })

  it('returns undefined when no config exists', async () => {
    createMockFileSystem({
      '/project/package.json': '',
    })

    expect(await findConfigFile('/project')).toBeUndefined()
  })

  it('walks up to find config in parent directories', async () => {
    createMockFileSystem({
      '/project/docweaver.config.json': '{}',
      '/project/src/index.ts': '',
    })

    expect(await findConfigFile('/project/src')).toBe('/project/docweaver.config.json')
  })

  it('defaults to process.cwd() when no cwd is given', async () => {
    createMockFileSystem({
      [`${process.cwd()}/docweaver.config.json`]: '{}',
    })

    expect(await findConfigFile()).toBe(`${process.cwd()}/docweaver.config.json`)
  })
})

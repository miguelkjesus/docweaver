import { createMockFileSystem } from '@spec/mocks/fs.js'

import { findTSConfigFile } from '@/internal/utils/find-tsconfig-file.js'

describe(findTSConfigFile, () => {
  it('finds tsconfig.json in the given directory', async () => {
    createMockFileSystem({
      '/project/tsconfig.json': '{}',
    })

    expect(await findTSConfigFile('/project')).toBe('/project/tsconfig.json')
  })

  it('returns undefined when no tsconfig exists', async () => {
    createMockFileSystem({
      '/project/package.json': '',
    })

    expect(await findTSConfigFile('/project')).toBeUndefined()
  })

  it('walks up to find tsconfig in parent directories', async () => {
    createMockFileSystem({
      '/project/tsconfig.json': '{}',
      '/project/src/index.ts': '',
    })

    expect(await findTSConfigFile('/project/src')).toBe('/project/tsconfig.json')
  })

  it('defaults to process.cwd() when no cwd is given', async () => {
    createMockFileSystem({
      [`${process.cwd()}/tsconfig.json`]: '{}',
    })

    expect(await findTSConfigFile()).toBe(`${process.cwd()}/tsconfig.json`)
  })
})

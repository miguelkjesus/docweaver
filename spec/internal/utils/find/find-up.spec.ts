import { createMockFileSystem } from '@spec/mocks/fs.js'

import { findUp } from '@/internal/utils/find/find-up.js'

describe(findUp, () => {
  it('returns undefined when no directories match from patterns', async () => {
    createMockFileSystem({})

    expect(await findUp(['tsconfig.json'], ['/nonexistent'])).toBeUndefined()
  })

  it('returns undefined when no file matches in the directory', async () => {
    createMockFileSystem({
      '/project/package.json': '',
      '/project/README.md': '',
    })

    expect(await findUp(['tsconfig.json'], ['/project'])).toBeUndefined()
  })

  it('returns the full path when a pattern matches', async () => {
    createMockFileSystem({
      '/project/tsconfig.json': '',
      '/project/package.json': '',
    })

    expect(await findUp(['tsconfig.json'], ['/project'])).toBe('/project/tsconfig.json')
  })

  it('returns the first match from the first matching pattern', async () => {
    createMockFileSystem({
      '/project/tsconfig.json': '',
      '/project/README.md': '',
    })

    expect(await findUp(['*.md', '*.json'], ['/project'])).toBe('/project/README.md')
  })

  it('walks up directories to find files in parent directories', async () => {
    createMockFileSystem({
      '/project/tsconfig.json': '',
      '/project/src/index.ts': '',
    })

    expect(await findUp(['tsconfig.json'], ['/project/src'])).toBe('/project/tsconfig.json')
  })

  it('defaults from to process.cwd()', async () => {
    createMockFileSystem({
      [`${process.cwd()}/tsconfig.json`]: '',
    })

    expect(await findUp(['tsconfig.json'])).toBe(`${process.cwd()}/tsconfig.json`)
  })
})

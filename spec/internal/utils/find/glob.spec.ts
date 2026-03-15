import { createMockFileSystem } from '@spec/mocks/fs.js'

import { glob } from '@/internal/utils/find/glob.js'

describe(glob, () => {
  it('returns an empty array when no from directories are resolved', async () => {
    createMockFileSystem({})

    expect(await glob(['**/*.ts'], ['/nonexistent'])).toEqual([])
  })

  it('returns an empty array when no files match in the directory', async () => {
    createMockFileSystem({
      '/project/src/index.js': '',
    })

    expect(await glob(['**/*.ts'], ['/project/src'])).toEqual([])
  })

  it('resolves each matched file against its from directory', async () => {
    createMockFileSystem({
      '/project/src/index.ts': '',
    })

    expect(await glob(['**/*.ts'], ['/project/src'])).toEqual(['/project/src/index.ts'])
  })

  it('flattens results across multiple from directories', async () => {
    createMockFileSystem({
      '/project/src/a.ts': '',
      '/project/lib/b.ts': '',
    })

    expect(await glob(['**/*.ts'], ['/project/src', '/project/lib'])).toEqual([
      '/project/src/a.ts',
      '/project/lib/b.ts',
    ])
  })

  it('defaults from to process.cwd()', async () => {
    createMockFileSystem({
      [`${process.cwd()}/index.ts`]: '',
    })

    expect(await glob(['**/*.ts'])).toContain(`${process.cwd()}/index.ts`)
  })
})

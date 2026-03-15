import { createMockFileSystem } from '@spec/mocks/fs.js'
import ignore from 'ignore'

import { find, findFromRules } from '@/internal/utils/find/rules.js'

describe(find, () => {
  it('returns an empty array when no files match', async () => {
    createMockFileSystem({
      '/project/src/index.js': '',
    })

    expect(await find(['*.ts'], ['/project/src'])).toEqual([])
  })

  it('returns files matching the given patterns', async () => {
    createMockFileSystem({
      '/project/src/index.ts': '',
      '/project/src/README.md': '',
    })

    expect(await find(['*.ts'], ['/project/src'])).toEqual(['/project/src/index.ts'])
  })

  it('excludes files not matching the patterns', async () => {
    createMockFileSystem({
      '/project/src/index.ts': '',
      '/project/src/README.md': '',
    })

    expect(await find(['*.ts'], ['/project/src'])).not.toContain('/project/src/README.md')
  })

  it('defaults from to process.cwd()', async () => {
    createMockFileSystem({
      [`${process.cwd()}/index.ts`]: '',
    })

    expect(await find(['*.ts'])).toContain(`${process.cwd()}/index.ts`)
  })
})

describe(findFromRules, () => {
  it('returns an empty array when directory is empty', async () => {
    createMockFileSystem({
      '/project/src/.gitkeep': '',
    })
    const rules = ignore().add(['*.ts'])

    expect(await findFromRules(rules, ['/project/src'])).toEqual([])
  })

  it('includes files matched by the rules', async () => {
    createMockFileSystem({
      '/project/src/index.ts': '',
      '/project/src/README.md': '',
    })
    const rules = ignore().add(['*.ts'])

    expect(await findFromRules(rules, ['/project/src'])).toEqual(['/project/src/index.ts'])
  })

  it('excludes files not matched by the rules', async () => {
    createMockFileSystem({
      '/project/src/index.ts': '',
      '/project/src/README.md': '',
    })
    const rules = ignore().add(['*.ts'])

    expect(await findFromRules(rules, ['/project/src'])).not.toContain('/project/src/README.md')
  })

  it('includes files from nested directories', async () => {
    createMockFileSystem({
      '/project/src/index.ts': '',
      '/project/src/utils/helper.ts': '',
    })
    const rules = ignore().add(['**/*.ts'])

    expect(await findFromRules(rules, ['/project/src'])).toContain('/project/src/utils/helper.ts')
  })

  it('defaults from to process.cwd()', async () => {
    createMockFileSystem({
      [`${process.cwd()}/index.ts`]: '',
    })
    const rules = ignore().add(['*.ts'])

    expect(await findFromRules(rules)).toContain(`${process.cwd()}/index.ts`)
  })
})

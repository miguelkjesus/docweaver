import type { Mock } from 'vitest'
import { vi } from 'vitest'

vi.mock('node:fs', () => ({
  globSync: vi.fn(),
  readdirSync: vi.fn(),
}))

import { globSync, readdirSync } from 'node:fs'

import ignore from 'ignore'

import { find, findFromRules } from '@/internal/utils/find/rules.js'

const mockGlobSync = globSync as Mock
const mockReaddirSync = readdirSync as Mock

function mockFile(name: string) {
  return { name, isDirectory: () => false }
}

function mockDir(name: string) {
  return { name, isDirectory: () => true }
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe(find, () => {
  it('returns an empty array when no from directories are resolved', () => {
    mockGlobSync.mockReturnValue([])

    expect(find(['src/*.ts'])).toEqual([])
  })

  it('returns files matching the given patterns', () => {
    mockGlobSync.mockReturnValue(['src'])
    mockReaddirSync.mockReturnValue([mockFile('index.ts'), mockFile('README.md')])

    expect(find(['src/*.ts'])).toEqual(['src/index.ts'])
  })

  it('excludes files not matching the patterns', () => {
    mockGlobSync.mockReturnValue(['src'])
    mockReaddirSync.mockReturnValue([mockFile('index.ts'), mockFile('README.md')])

    expect(find(['src/*.ts'])).not.toContain('src/README.md')
  })
})

describe(findFromRules, () => {
  it('returns an empty array when no from directories are resolved', () => {
    mockGlobSync.mockReturnValue([])
    const rules = ignore().add(['**/*.ts'])

    expect(findFromRules(rules)).toEqual([])
  })

  it('includes files matched by the rules', () => {
    mockGlobSync.mockReturnValue(['src'])
    mockReaddirSync.mockReturnValue([mockFile('index.ts'), mockFile('README.md')])
    const rules = ignore().add(['src/*.ts'])

    expect(findFromRules(rules)).toEqual(['src/index.ts'])
  })

  it('excludes files not matched by the rules', () => {
    mockGlobSync.mockReturnValue(['src'])
    mockReaddirSync.mockReturnValue([mockFile('index.ts'), mockFile('README.md')])
    const rules = ignore().add(['src/*.ts'])

    expect(findFromRules(rules)).not.toContain('src/README.md')
  })

  it('includes files from nested directories', () => {
    mockGlobSync.mockReturnValue(['src'])
    mockReaddirSync
      .mockReturnValueOnce([mockDir('utils'), mockFile('index.ts')])
      .mockReturnValueOnce([mockFile('helper.ts')])
    const rules = ignore().add(['src/**/*.ts'])

    expect(findFromRules(rules)).toContain('src/utils/helper.ts')
  })

  it('defaults from to [process.cwd()]', () => {
    mockGlobSync.mockReturnValue([])
    const rules = ignore().add(['**/*.ts'])

    findFromRules(rules)

    expect(mockGlobSync).toHaveBeenCalledWith([process.cwd()])
  })
})

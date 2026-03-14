import type { Mock } from 'vitest'
import { vi } from 'vitest'

vi.mock('node:fs', () => ({
  globSync: vi.fn(),
}))

import { globSync } from 'node:fs'

import { glob } from '@/internal/utils/find/glob.js'

const mockGlobSync = globSync as Mock

beforeEach(() => {
  mockGlobSync.mockReset()
})

describe(glob, () => {
  it('returns an empty array when no from directories are resolved', () => {
    mockGlobSync.mockReturnValue([])

    expect(glob(['**/*.ts'])).toEqual([])
  })

  it('returns an empty array when no files match in the directory', () => {
    mockGlobSync.mockReturnValueOnce(['/project/src']).mockReturnValueOnce([])

    expect(glob(['**/*.ts'])).toEqual([])
  })

  it('resolves each matched file against its from directory', () => {
    mockGlobSync.mockReturnValueOnce(['/project/src']).mockReturnValueOnce(['index.ts'])

    expect(glob(['**/*.ts'])).toEqual(['/project/src/index.ts'])
  })

  it('flattens results across multiple from directories', () => {
    mockGlobSync
      .mockReturnValueOnce(['/project/src', '/project/lib'])
      .mockReturnValueOnce(['a.ts'])
      .mockReturnValueOnce(['b.ts'])

    expect(glob(['**/*.ts'])).toEqual(['/project/src/a.ts', '/project/lib/b.ts'])
  })

  it('defaults from to [process.cwd()]', () => {
    mockGlobSync.mockReturnValue([])

    glob(['**/*.ts'])

    expect(mockGlobSync).toHaveBeenCalledWith([process.cwd()])
  })
})

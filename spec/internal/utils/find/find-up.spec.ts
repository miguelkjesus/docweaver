import type { Mock } from 'vitest'
import { vi } from 'vitest'

vi.mock('node:fs', () => ({
  readdirSync: vi.fn(),
}))

vi.mock('node:fs/promises', () => ({
  glob: vi.fn(),
}))

vi.mock('find-up', () => ({
  findUp: vi.fn(),
}))

import { readdirSync } from 'node:fs'
import { glob } from 'node:fs/promises'

import { findUp as mockWalk } from 'find-up'

import { findUp } from '@/internal/utils/find/find-up.js'

const mockReaddirSync = readdirSync as Mock
const mockGlob = glob as Mock
const mockWalkFn = mockWalk as Mock

beforeEach(() => {
  vi.clearAllMocks()
  mockWalkFn.mockImplementation(
    (matcher: (dir: string) => string | undefined, { cwd }: { cwd: string }) => matcher(cwd),
  )
})

describe(findUp, () => {
  it('returns undefined when glob yields no directories', async () => {
    mockGlob.mockReturnValue([])

    expect(await findUp(['tsconfig.json'])).toBeUndefined()
  })

  it('returns undefined when no file matches in the directory', async () => {
    mockGlob.mockReturnValue(['/project'])
    mockReaddirSync.mockReturnValue(['package.json', 'README.md'])

    expect(await findUp(['tsconfig.json'])).toBeUndefined()
  })

  it('returns the matched filename when a pattern matches', async () => {
    mockGlob.mockReturnValue(['/project'])
    mockReaddirSync.mockReturnValue(['tsconfig.json', 'package.json'])

    expect(await findUp(['tsconfig.json'])).toBe('tsconfig.json')
  })

  it('returns the first match from the first matching pattern', async () => {
    mockGlob.mockReturnValue(['/project'])
    mockReaddirSync.mockReturnValue(['tsconfig.json', 'README.md'])

    expect(await findUp(['*.md', '*.json'])).toBe('README.md')
  })

  it('returns undefined when walk resolves to undefined for every directory', async () => {
    mockGlob.mockReturnValue(['/project'])
    mockWalkFn.mockResolvedValue(undefined)

    expect(await findUp(['tsconfig.json'])).toBeUndefined()
  })

  it('defaults from to [process.cwd()]', async () => {
    mockGlob.mockReturnValue([])

    await findUp(['tsconfig.json'])

    expect(mockGlob).toHaveBeenCalledWith([process.cwd()])
  })
})

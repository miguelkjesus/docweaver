import type { Mock } from 'vitest'
import { vi } from 'vitest'

vi.mock('@/internal/utils/find/find-up.js', () => ({
  findUp: vi.fn(),
}))

import { findConfigFile } from '@/config-file/find-config-file.js'
import { findUp } from '@/internal/utils/find/find-up.js'

const mockFindUp = findUp as Mock

beforeEach(() => {
  vi.clearAllMocks()
})

describe(findConfigFile, () => {
  it('calls findUp with the docspec config glob pattern', async () => {
    mockFindUp.mockResolvedValue(undefined)

    await findConfigFile()

    expect(mockFindUp).toHaveBeenCalledWith(
      ['docspec.config.{ts,mts,cts,js,mjs,cjs,json,yaml,yml}'],
      undefined,
    )
  })

  it('passes undefined for from when no cwd is given', async () => {
    mockFindUp.mockResolvedValue(undefined)

    await findConfigFile()

    expect(mockFindUp).toHaveBeenCalledWith(expect.anything(), undefined)
  })

  it('passes [cwd] for from when cwd is given', async () => {
    mockFindUp.mockResolvedValue(undefined)

    await findConfigFile('/some/dir')

    expect(mockFindUp).toHaveBeenCalledWith(expect.anything(), ['/some/dir'])
  })

  it('returns the result from findUp', async () => {
    mockFindUp.mockResolvedValue('/some/dir/docspec.config.ts')

    expect(await findConfigFile()).toBe('/some/dir/docspec.config.ts')
  })
})

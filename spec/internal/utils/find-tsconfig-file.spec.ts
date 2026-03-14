import type { Mock } from 'vitest'
import { vi } from 'vitest'

vi.mock('@/internal/utils/find/find-up.js', () => ({
  findUp: vi.fn(),
}))

import { findUp } from '@/internal/utils/find/find-up.js'
import { findTSConfigFile } from '@/internal/utils/find-tsconfig-file.js'

const mockFindUp = findUp as Mock

beforeEach(() => {
  vi.clearAllMocks()
})

describe(findTSConfigFile, () => {
  it('calls findUp with tsconfig.json', async () => {
    mockFindUp.mockResolvedValue(undefined)

    await findTSConfigFile()

    expect(mockFindUp).toHaveBeenCalledWith(['tsconfig.json'], undefined)
  })

  it('passes undefined for from when no cwd is given', async () => {
    mockFindUp.mockResolvedValue(undefined)

    await findTSConfigFile()

    expect(mockFindUp).toHaveBeenCalledWith(expect.anything(), undefined)
  })

  it('passes [cwd] for from when cwd is given', async () => {
    mockFindUp.mockResolvedValue(undefined)

    await findTSConfigFile('/some/project')

    expect(mockFindUp).toHaveBeenCalledWith(expect.anything(), ['/some/project'])
  })

  it('returns the result from findUp', async () => {
    mockFindUp.mockResolvedValue('/some/project/tsconfig.json')

    expect(await findTSConfigFile()).toBe('/some/project/tsconfig.json')
  })
})

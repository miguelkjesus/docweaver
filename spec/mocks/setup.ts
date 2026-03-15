import { fs, vol } from 'memfs'
import { afterEach, beforeEach, vi } from 'vitest'

// Shim to convert memfs glob (Promise<string[]>) to Node.js glob (AsyncIterable<string>)
async function* globAsyncIterable(
  pattern: string | string[],
  options?: Parameters<typeof fs.promises.glob>[1],
): AsyncIterable<string> {
  const patterns = Array.isArray(pattern) ? pattern : [pattern]
  for (const p of patterns) {
    const results = await fs.promises.glob(p, options)
    for (const result of results) {
      yield result
    }
  }
}

vi.mock('node:fs', () => ({
  default: fs,
  ...fs,
}))

vi.mock('node:fs/promises', () => ({
  default: { ...fs.promises, glob: globAsyncIterable },
  ...fs.promises,
  glob: globAsyncIterable,
}))

export const mockTsImport = vi.fn()
vi.mock('tsx/esm/api', () => ({ tsImport: mockTsImport }))

beforeEach(() => {
  vol.reset()
  mockTsImport.mockReset()
})

afterEach(() => {
  vi.clearAllMocks()
})

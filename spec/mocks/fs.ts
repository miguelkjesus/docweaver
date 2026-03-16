import type { DirectoryJSON } from 'memfs'
import { vol } from 'memfs'

export { vol }

/**
 * Create a mock filesystem with the given structure
 * @example
 * createMockFileSystem({
 *   '/project/docweaver.config.json': '{"paths": ["src"]}',
 *   '/project/src/index.ts': 'export const x = 1',
 * })
 */
export function createMockFileSystem(structure: DirectoryJSON, cwd = '/') {
  vol.reset()
  vol.fromJSON(structure, cwd)
  return vol
}

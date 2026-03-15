import { createMockFileSystem } from '@spec/mocks/fs.js'
import { mockTsImport } from '@spec/mocks/setup.js'

import { loadConfig } from '@/config-file/load-config.js'

describe(loadConfig, () => {
  it('returns an empty object when no config file is found', async () => {
    createMockFileSystem({
      '/project/package.json': '',
    })

    expect(await loadConfig({ cwd: '/project' })).toEqual({})
  })

  describe('json loader', () => {
    it('reads the file and parses the JSON content', async () => {
      const config = { paths: ['src'] }
      createMockFileSystem({
        '/project/docspec.config.json': JSON.stringify(config),
      })

      const result = await loadConfig({ filePath: '/project/docspec.config.json', loader: 'json' })

      expect(result).toEqual(config)
    })

    it('respects a custom encoding option', async () => {
      createMockFileSystem({
        '/project/docspec.config.json': '{}',
      })

      const result = await loadConfig({
        filePath: '/project/docspec.config.json',
        loader: 'json',
        json: { encoding: 'latin1' },
      })

      expect(result).toEqual({})
    })
  })

  describe('yaml loader', () => {
    it('reads the file and parses YAML content', async () => {
      createMockFileSystem({
        '/project/docspec.config.yaml': 'paths:\n  - src\n',
      })

      const result = await loadConfig({ filePath: '/project/docspec.config.yaml', loader: 'yaml' })

      expect(result).toEqual({ paths: ['src'] })
    })

    it('respects a custom encoding option', async () => {
      createMockFileSystem({
        '/project/docspec.config.yaml': 'tsconfig: custom.json',
      })

      const result = await loadConfig({
        filePath: '/project/docspec.config.yaml',
        loader: 'yaml',
        yaml: { encoding: 'latin1' },
      })

      expect(result).toEqual({ tsconfig: 'custom.json' })
    })
  })

  describe('bundle loader', () => {
    it('calls tsImport and parses the default export', async () => {
      const config = { tsconfig: 'tsconfig.json' }
      mockTsImport.mockResolvedValue({ default: config })
      createMockFileSystem({
        '/project/docspec.config.ts': '',
      })

      const result = await loadConfig({ filePath: '/project/docspec.config.ts', loader: 'bundle' })

      expect(mockTsImport).toHaveBeenCalledWith(
        '/project/docspec.config.ts',
        expect.objectContaining({
          parentURL: expect.any(String) as unknown,
        }),
      )
      expect(result).toEqual(config)
    })

    it('uses the provided tsconfig option', async () => {
      mockTsImport.mockResolvedValue({ default: {} })

      await loadConfig({
        filePath: '/project/docspec.config.ts',
        loader: 'bundle',
        bundle: { tsconfig: 'tsconfig.build.json' },
      })

      expect(mockTsImport).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          tsconfig: 'tsconfig.build.json',
        }),
      )
    })

    it('falls back to findTSConfigFile when no tsconfig option is given', async () => {
      mockTsImport.mockResolvedValue({ default: {} })
      createMockFileSystem({
        '/project/tsconfig.json': '{}',
        '/project/docspec.config.ts': '',
      })

      await loadConfig({
        filePath: '/project/docspec.config.ts',
        loader: 'bundle',
        cwd: '/project',
      })

      expect(mockTsImport).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          tsconfig: '/project/tsconfig.json',
        }),
      )
    })

    it('throws when the module has no default export', async () => {
      mockTsImport.mockResolvedValue({ named: {} })

      await expect(
        loadConfig({ filePath: '/project/docspec.config.ts', loader: 'bundle' }),
      ).rejects.toThrow('Expected /project/docspec.config.ts to have a default export')
    })
  })

  it('throws a descriptive error when the loader is undefined', async () => {
    await expect(
      loadConfig({ filePath: '/project/docspec.config.txt', loader: undefined }),
    ).rejects.toThrow('Could not decide how to load your config file')
  })
})

import type { Mock } from 'vitest'
import { vi } from 'vitest'

vi.mock('node:fs/promises', () => ({
  default: { readFile: vi.fn() },
  readFile: vi.fn(),
}))

vi.mock('js-yaml', () => ({
  default: { load: vi.fn() },
  load: vi.fn(),
}))

vi.mock('tsx/esm/api', () => ({
  tsImport: vi.fn(),
}))

vi.mock('@/config-file/find-config-file.js', () => ({
  findConfigFile: vi.fn(),
}))

vi.mock('@/internal/utils/find-tsconfig-file.js', () => ({
  findTSConfigFile: vi.fn(),
}))

vi.mock('@/config-file/parse-config.js', () => ({
  parseConfig: vi.fn((x: unknown) => x),
}))

import fs from 'node:fs/promises'

import yaml from 'js-yaml'
import { tsImport } from 'tsx/esm/api'

import { findConfigFile } from '@/config-file/find-config-file.js'
import { loadConfig } from '@/config-file/load-config.js'
import { parseConfig } from '@/config-file/parse-config.js'
import { findTSConfigFile } from '@/internal/utils/find-tsconfig-file.js'

const mockReadFile = fs.readFile as Mock
const mockYamlLoad = yaml.load as Mock
const mockTsImport = tsImport as Mock
const mockFindConfigFile = findConfigFile as Mock
const mockFindTSConfigFile = findTSConfigFile as Mock
const mockParseConfig = parseConfig as Mock

beforeEach(() => {
  vi.clearAllMocks()
  mockParseConfig.mockImplementation((x: unknown) => x)
})

describe(loadConfig, () => {
  it('returns an empty object when no config file is found', async () => {
    mockFindConfigFile.mockResolvedValue(undefined)

    expect(await loadConfig()).toEqual({})
  })

  describe('json loader', () => {
    it('reads the file and parses the JSON content', async () => {
      const config = { paths: ['src'] }
      mockReadFile.mockResolvedValue(JSON.stringify(config))

      const result = await loadConfig({ filePath: '/project/docspec.config.json', loader: 'json' })

      expect(mockReadFile).toHaveBeenCalledWith('/project/docspec.config.json', {
        encoding: 'utf8',
      })
      expect(mockParseConfig).toHaveBeenCalledWith(config)
      expect(result).toEqual(config)
    })

    it('respects a custom encoding option', async () => {
      mockReadFile.mockResolvedValue('{}')

      await loadConfig({
        filePath: '/project/docspec.config.json',
        loader: 'json',
        json: { encoding: 'latin1' },
      })

      expect(mockReadFile).toHaveBeenCalledWith(expect.anything(), { encoding: 'latin1' })
    })
  })

  describe('yaml loader', () => {
    it('reads the file and passes contents through js-yaml', async () => {
      const config = { files: ['a.ts'] }
      mockReadFile.mockResolvedValue('files:\n  - a.ts\n')
      mockYamlLoad.mockReturnValue(config)

      const result = await loadConfig({ filePath: '/project/docspec.config.yaml', loader: 'yaml' })

      expect(mockReadFile).toHaveBeenCalledWith('/project/docspec.config.yaml', {
        encoding: 'utf8',
      })
      expect(mockYamlLoad).toHaveBeenCalled()
      expect(mockParseConfig).toHaveBeenCalledWith(config)
      expect(result).toEqual(config)
    })

    it('respects a custom encoding option', async () => {
      mockReadFile.mockResolvedValue('')
      mockYamlLoad.mockReturnValue({})

      await loadConfig({
        filePath: '/project/docspec.config.yaml',
        loader: 'yaml',
        yaml: { encoding: 'latin1' },
      })

      expect(mockReadFile).toHaveBeenCalledWith(expect.anything(), { encoding: 'latin1' })
    })
  })

  describe('bundle loader', () => {
    it('calls tsImport and parses the default export', async () => {
      const config = { tsconfig: 'tsconfig.json' }
      mockTsImport.mockResolvedValue({ default: config })
      mockFindTSConfigFile.mockResolvedValue(undefined)

      const result = await loadConfig({ filePath: '/project/docspec.config.ts', loader: 'bundle' })

      expect(mockTsImport).toHaveBeenCalledWith(
        '/project/docspec.config.ts',
        expect.objectContaining({
          parentURL: expect.any(String) as unknown,
        }),
      )
      expect(mockParseConfig).toHaveBeenCalledWith(config)
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
      mockFindTSConfigFile.mockResolvedValue('/project/tsconfig.json')

      await loadConfig({ filePath: '/project/docspec.config.ts', loader: 'bundle' })

      expect(mockFindTSConfigFile).toHaveBeenCalled()
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

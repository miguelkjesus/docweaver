import fs from 'node:fs/promises'
import path from 'node:path'

import yaml from 'js-yaml'
import { tsImport } from 'tsx/esm/api'

import { findUp } from '@/utils/find.js'

import { chooseConfigLoaderMode, type ConfigLoaderMode } from './config-loader-mode.js'
import { findConfigFile } from './find-config-file.js'
import { parseConfig, type ResolvedConfig } from './parse-config.js'

export type LoadConfigOptions = Readonly<{
  filePath?: string
  loader?: ConfigLoaderMode
  cwd?: string
  json?: {
    encoding?: BufferEncoding
  }
  yaml?: {
    encoding?: BufferEncoding
  }
  bundle?: {
    tsconfig?: string
  }
}>

export async function loadConfig({
  filePath,
  loader,
  cwd,
  ...options
}: LoadConfigOptions = {}): Promise<ResolvedConfig> {
  filePath ??= await findConfigFile(cwd)

  if (!filePath) {
    throw new Error('Could not find config file.')
  }

  loader ??= chooseConfigLoaderMode(path.extname(filePath))

  switch (loader) {
    case 'json': {
      const { encoding = 'utf8' } = options.json ?? {}

      const contents = await fs.readFile(filePath, { encoding })
      const json = JSON.parse(contents) as unknown

      return await parseConfig(json, { cwd })
    }

    case 'yaml': {
      const { encoding = 'utf8' } = options.yaml ?? {}

      const contents = await fs.readFile(filePath, { encoding })
      const yml = yaml.load(contents)

      return await parseConfig(yml, { cwd })
    }

    case 'native': {
      const exports = (await import(filePath)) as unknown

      assertDefaultExport(exports, filePath)

      return await parseConfig(exports.default, { cwd })
    }

    case 'bundle': {
      const { tsconfig = await findUp.first('tsconfig.json', { cwd }) } = options.bundle ?? {}

      const exports = (await tsImport(filePath, {
        tsconfig,
        parentURL: import.meta.url,
      })) as unknown

      assertDefaultExport(exports, filePath)

      return await parseConfig(exports.default, { cwd })
    }

    case undefined:
      throw new Error(
        'Could not decide how to load your config file. Please ensure your file has the correct file extension, or specify --configLoader',
      )
  }
}

function assertDefaultExport(
  exports: unknown,
  filePath: string,
): asserts exports is { default: unknown } {
  if (!exports || !(typeof exports === 'object') || !('default' in exports)) {
    throw new Error(`Expected ${filePath} to have a default export.`)
  }
}

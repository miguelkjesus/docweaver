import { type } from 'arktype'

import { ConfigLoaderMode } from '@/config-file/config-loader-mode.js'
import { Config } from '@/config-file/parse-config.js'

const BufferEncoding = type('string').narrow((v) => Buffer.isEncoding(v))
type BufferEncoding = typeof BufferEncoding.infer

export const CliOptions = Config.and({
  'config?': 'string',
  'config.loader?': ConfigLoaderMode,
  'config.encoding?': BufferEncoding,
  'config.json.encoding?': BufferEncoding,
  'config.yaml.encoding?': BufferEncoding,
  'config.bundle.tsconfig?': 'string',
})

export type CliOptions = typeof CliOptions.infer

export type ResolvedCliOptions = Readonly<Config> &
  Readonly<{
    config?: {
      filePath?: string
      loader?: ConfigLoaderMode
      json?: {
        encoding?: BufferEncoding
      }
      yaml?: {
        encoding?: BufferEncoding
      }
      bundle?: {
        tsconfig?: string
      }
    }
  }>

export function parseCliOptions(options: Record<string, unknown>): ResolvedCliOptions {
  const data = CliOptions(options)

  if (data instanceof type.errors) throw new Error(data.summary)

  return {
    package: data.package,
    tsconfig: data.tsconfig,
    config: {
      filePath: data.config,
      loader: data['config.loader'],
      json: {
        encoding: data['config.json.encoding'] ?? data['config.encoding'],
      },
      yaml: {
        encoding: data['config.yaml.encoding'] ?? data['config.encoding'],
      },
      bundle: {
        tsconfig: data['config.bundle.tsconfig'] ?? data.tsconfig,
      },
    },
  }
}

import z from 'zod'

import type { ConfigLoaderMode } from '@/config-file/config-loader-mode.js'
import type { Config } from '@/config-file/parse-config.js'

export interface RawCliOptions {
  paths?: string[]
  files?: string[]
  tsconfig?: string
  config?: string
  'config.loader'?: ConfigLoaderMode
  'config.encoding'?: BufferEncoding
  'config.json.encoding'?: BufferEncoding
  'config.yaml.encoding'?: BufferEncoding
  'config.bundle.tsconfig'?: string
}

export interface CliOptions extends Config {
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
}

const bufferEncoding = z.string().refine((v) => Buffer.isEncoding(v), 'Invalid buffer encoding.')

const rawCliOptionsSchema = z.object({
  paths: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
  tsconfig: z.string().optional(),
  config: z.string().optional(),
  'config.loader': z.enum(['bundle', 'native', 'json', 'yaml']).optional(),
  'config.encoding': bufferEncoding.optional(),
  'config.json.encoding': bufferEncoding.optional(),
  'config.yaml.encoding': bufferEncoding.optional(),
  'config.bundle.tsconfig': z.string().optional(),
})

export function parseCliOptions(options: Record<string, unknown>): CliOptions {
  const { error, data } = rawCliOptionsSchema.safeParse(options)

  if (error) throw new Error(z.prettifyError(error))

  return {
    paths: data.paths,
    files: data.files,
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

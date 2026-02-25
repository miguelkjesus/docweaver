import z from 'zod'

import { findUp } from '@/internal/utils/find-files'
import { assertDefaultExport } from '@/internal/utils/load-files'

// TODO tests

export interface Config {
  paths: string[]
  files: string[]
}

export type FileConfig = Partial<Config>

export interface CLIConfig extends Partial<Config> {
  config?: string
}

export function parseConfig(config: unknown): Config {
  const schema = z.object({
    paths: z.array(z.string()).default(['.']),
    files: z.array(z.string()).default(['**/*.doc.{ts,mts,cts,js,mjs,cjs}']),
    emitNodesTo: z.string().optional(),
  })

  return schema.parse(config)
}

export function defineConfig(config: FileConfig): FileConfig {
  return config
}

export interface FindAndLoadConfigOptions {
  cwd?: string
}

export async function findAndLoadConfig(
  cliConfig: CLIConfig = {},
  { cwd = process.cwd() }: FindAndLoadConfigOptions = {},
): Promise<Config> {
  const configFile = cliConfig.config ?? (await findConfigFile(cwd))

  console.log({ configFile })

  if (configFile) {
    const config = await assertDefaultExport(
      configFile,
      `"${configFile}" must export the config as the default export`,
    )

    return parseConfig({ ...config, ...cliConfig })
  }

  return parseConfig(cliConfig)
}

export async function findConfigFile(cwd: string = process.cwd()) {
  return await findUp(['docspec.config.{ts,mts,cts,js,mjs,cjs}'], [cwd])
}

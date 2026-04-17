import path from 'node:path'

import { type } from 'arktype'

import { findUp } from '@/utils/find.js'

export const Config = type({
  /**
   * The path to the package's package.json file.
   */
  'package?': 'string',

  /**
   * The path to the package's tsconfig.json file.
   */
  'tsconfig?': 'string',
})

export type Config = typeof Config.infer

export type ResolvedConfig = Readonly<{
  package: string
  tsconfig?: string
}>

export type ParseConfigOptions = Readonly<{
  cwd?: string
}>

export async function parseConfig(
  config: unknown,
  { cwd }: ParseConfigOptions = {},
): Promise<ResolvedConfig> {
  const data = Config(config)

  if (data instanceof type.errors) throw new Error(data.summary)

  // #package

  const packageJson = data.package ?? (await findUp.first('package.json', { cwd }))

  if (!packageJson) {
    throw new Error('Could not find a package.json file.')
  }

  const packageDirectory = path.dirname(packageJson)

  // #tsconfig

  const tsconfig = data.tsconfig ?? (await findUp.first('tsconfig.json', { cwd: packageDirectory }))

  return {
    package: packageJson,
    tsconfig,
  }
}

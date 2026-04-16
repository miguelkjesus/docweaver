import { type } from 'arktype'

export const ConfigLoaderMode = type('"bundle" | "native" | "json" | "yaml"')
export type ConfigLoaderMode = typeof ConfigLoaderMode.infer

export function chooseConfigLoaderMode(fileExtension: string): ConfigLoaderMode | undefined {
  switch (fileExtension) {
    case '.yaml':
    case '.yml':
      return 'yaml'

    case '.json':
      return 'json'

    case '.ts':
    case '.mts':
    case '.cts':
      return 'bundle'

    case '.js':
    case '.mjs':
    case '.cjs':
      return 'native'
  }
}

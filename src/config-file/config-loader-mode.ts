export type ConfigLoaderMode = 'bundle' | 'native' | 'json' | 'yaml'

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

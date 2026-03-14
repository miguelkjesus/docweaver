import type { Config } from './parse-config.js'

export function mergeConfig(base: Config, overrides: Config): Config {
  return {
    paths: overrides.paths ?? base.paths,
    files: overrides.files ?? base.files,
    tsconfig: overrides.tsconfig ?? base.tsconfig,
  }
}

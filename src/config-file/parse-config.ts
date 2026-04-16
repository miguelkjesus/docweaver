import { type } from 'arktype'

const Config = type({
  'paths?': 'string[]',
  'files?': 'string[]',
  'tsconfig?': 'string',
})

export type Config = typeof Config.infer

export function parseConfig(config: unknown): Config {
  const data = Config(config)

  if (data instanceof type.errors) throw new Error(data.summary)

  return {
    paths: data.paths,
    files: data.files,
    tsconfig: data.tsconfig,
  }
}

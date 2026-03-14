import z from 'zod'

export interface Config {
  paths?: string[]
  files?: string[]
  tsconfig?: string
}

export const configSchema = z.object({
  paths: z.array(z.string()).optional(),
  files: z.array(z.string()).optional(),
  tsconfig: z.string().optional(),
})

export function parseConfig(config: unknown): Config {
  const { error, data } = configSchema.safeParse(config)

  if (error) throw new Error(z.prettifyError(error))

  return data
}

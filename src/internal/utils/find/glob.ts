import { globSync } from 'node:fs'
import { resolve } from 'node:path'

export function glob(matchers: string[], from: string[] = [process.cwd()]) {
  return globSync(from).flatMap((cwd) => {
    return globSync(matchers, { cwd }).map((file) => resolve(cwd, file))
  })
}

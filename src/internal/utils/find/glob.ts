import fs from 'node:fs/promises'
import path from 'node:path'

export async function glob(matchers: string[], from: string[] = [process.cwd()]) {
  const matches = []

  for await (const cwd of fs.glob(from)) {
    for await (const match of fs.glob(matchers, { cwd })) {
      matches.push(path.resolve(cwd, match))
    }
  }

  return matches
}

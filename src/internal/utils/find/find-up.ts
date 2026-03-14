import { readdirSync } from 'node:fs'
import { glob } from 'node:fs/promises'

import { findUp as walk } from 'find-up'
import { minimatch } from 'minimatch'

function createMatcher(matchers: string[]) {
  return (directory: string) => {
    const files = readdirSync(directory)

    for (const matcher of matchers) {
      const [match] = minimatch.match(files, matcher)
      if (match) return match
    }
  }
}

export async function findUp(matchers: string[], from: string[] = [process.cwd()]) {
  for await (const cwd of glob(from)) {
    const match = await walk(createMatcher(matchers), { cwd })
    if (match) return match
  }
}

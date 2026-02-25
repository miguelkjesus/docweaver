import { findUp as findUp_ } from 'find-up'
import fs from 'fs'
import { minimatch } from 'minimatch'
import path from 'path'

// TODO tests

function createMatcher(matchers: string[]) {
  return (directory: string) => {
    const files = fs.readdirSync(directory)

    for (const matcher of matchers) {
      const [match] = minimatch.match(files, matcher)
      if (match) return match
    }
  }
}

export async function findUp(matchers: string[], from: string[] = [process.cwd()]) {
  for await (const cwd of fs.promises.glob(from)) {
    const match = await findUp_(createMatcher(matchers), { cwd })
    if (match) return match
  }
}

export function glob(matchers: string[], from: string[] = [process.cwd()]) {
  return fs
    .globSync(from)
    .flatMap((cwd) => fs.globSync(matchers, { cwd }).map((file) => path.resolve(cwd, file)))
}

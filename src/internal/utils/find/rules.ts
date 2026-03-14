import { globSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

import ignore, { type Ignore } from 'ignore'

function walk(rules: Ignore, dir: string) {
  const files: string[] = []
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const path = join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...walk(rules, path))
    } else if (rules.ignores(path)) {
      files.push(path)
    }
  }

  return files
}

export function findFromRules(rules: Ignore, from = [process.cwd()]) {
  return globSync(from).flatMap((dir) => walk(rules, dir))
}

export interface IncludeExcludeOptions {
  readonly include?: string[]
  readonly exclude?: string[]
}

export function find(files: string[], from = [process.cwd()]) {
  return findFromRules(ignore().add(files), from)
}

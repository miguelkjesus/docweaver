import fs from 'node:fs/promises'
import path from 'node:path'

import ignore, { type Ignore } from 'ignore'

async function walk(rules: Ignore, baseDir: string, currentDir: string) {
  const files: string[] = []
  const entries = await fs.readdir(currentDir, { withFileTypes: true })

  for (const entry of entries) {
    const absolutePath = path.join(currentDir, entry.name)
    const relativePath = path.relative(baseDir, absolutePath)

    if (entry.isDirectory()) {
      files.push(...(await walk(rules, baseDir, absolutePath)))
    } else if (rules.ignores(relativePath)) {
      files.push(absolutePath)
    }
  }

  return files
}

export async function findFromRules(rules: Ignore, from = [process.cwd()]) {
  const matches = []

  for await (const dir of fs.glob(from)) {
    matches.push(...(await walk(rules, dir, dir)))
  }

  return matches
}

export interface IncludeExcludeOptions {
  readonly include?: string[]
  readonly exclude?: string[]
}

export async function find(files: string[], from = [process.cwd()]) {
  return await findFromRules(ignore().add(files), from)
}

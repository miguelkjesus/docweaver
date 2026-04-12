import fs from 'node:fs/promises'
import path from 'node:path'

import fg from 'fast-glob'
import micromatch from 'micromatch'

import { createAsyncSequence } from '@/internal/utils/async-sequence.js'

export interface FindOptions {
  from?: string | string[]
  cwd?: string
}

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value]
}

function resolveSearchPaths(searchPaths: string | string[] | undefined, cwd: string): string[] {
  if (!searchPaths) return [cwd]
  return toArray(searchPaths).map((p) => path.resolve(cwd, p))
}

export const findDown = createAsyncSequence(async function* (
  patterns: string | string[],
  { from, cwd = process.cwd() }: FindOptions = {},
): AsyncGenerator<string> {
  const searchPaths = resolveSearchPaths(from, cwd)
  patterns = toArray(patterns)

  for (const basePath of searchPaths) {
    yield* fg.stream(patterns, {
      cwd: basePath,
      absolute: true,
      onlyFiles: true,
    }) as AsyncIterable<string>
  }
})

export const findUp = createAsyncSequence(async function* (
  patterns: string | string[],
  { from, cwd = process.cwd() }: FindOptions = {},
): AsyncGenerator<string> {
  const searchPaths = resolveSearchPaths(from, cwd)
  patterns = toArray(patterns)

  for (const startPath of searchPaths) {
    let currentDir: string | undefined = startPath

    while (currentDir) {
      const files = await fs.readdir(currentDir).catch(() => [])
      const matches = micromatch(files, patterns)

      for (const match of matches) {
        yield path.resolve(currentDir, match)
      }

      const parentDir = path.dirname(currentDir)
      currentDir = parentDir !== currentDir ? parentDir : undefined
    }
  }
})

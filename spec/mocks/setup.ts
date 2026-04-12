import type { Dirent } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

import { fs, vol } from 'memfs'
import micromatch from 'micromatch'
import ts from 'typescript'
import { afterEach, beforeEach, vi } from 'vitest'

function getAllFiles(dir: string): string[] {
  const results: string[] = []
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true }) as Dirent[]
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        results.push(...getAllFiles(fullPath))
      } else {
        results.push(fullPath)
      }
    }
  } catch {
    // Directory doesn't exist
  }
  return results
}

// ─────────────────────────────────────────────────────────────
// Mock: fast-glob
// ─────────────────────────────────────────────────────────────

function fastGlob(
  patterns: string | string[],
  options: { cwd?: string; absolute?: boolean } = {},
): string[] {
  const cwd = options.cwd ?? process.cwd()
  const patternArray = Array.isArray(patterns) ? patterns : [patterns]
  const allFiles = getAllFiles(cwd)
  const relativePaths = allFiles.map((f) => path.relative(cwd, f))
  const matches = micromatch(relativePaths, patternArray)
  return options.absolute ? matches.map((m) => path.resolve(cwd, m)) : matches
}

vi.mock('fast-glob', () => ({
  default: Object.assign((...args: Parameters<typeof fastGlob>) => fastGlob(...args), {
    stream: (...args: Parameters<typeof fastGlob>) => Readable.from(fastGlob(...args)),
    sync: fastGlob,
  }),
}))

// ─────────────────────────────────────────────────────────────
// Mock: node:fs and node:fs/promises
// ─────────────────────────────────────────────────────────────

vi.mock('node:fs', () => ({ default: fs, ...fs }))
vi.mock('node:fs/promises', () => ({ default: fs.promises, ...fs.promises }))

// ─────────────────────────────────────────────────────────────
// Mock: tsx/esm/api
// ─────────────────────────────────────────────────────────────

export const mockTsImport = vi.fn()
vi.mock('tsx/esm/api', () => ({ tsImport: mockTsImport }))

// ─────────────────────────────────────────────────────────────
// Mock: TypeScript sys (so ts.createProgram uses memfs)
// ─────────────────────────────────────────────────────────────

ts.sys.readFile = (filePath, encoding = 'utf-8') => {
  try {
    return fs.readFileSync(filePath, { encoding: encoding as BufferEncoding }) as string
  } catch {
    return undefined
  }
}

ts.sys.fileExists = (filePath) => {
  try {
    return fs.statSync(filePath).isFile()
  } catch {
    return false
  }
}

ts.sys.directoryExists = (dirPath) => {
  try {
    return fs.statSync(dirPath).isDirectory()
  } catch {
    return false
  }
}

ts.sys.getDirectories = (dirPath) => {
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true }) as Dirent[]
    return entries.filter((e) => e.isDirectory()).map((e) => e.name)
  } catch {
    return []
  }
}

ts.sys.readDirectory = (dirPath, extensions) => {
  const allFiles = getAllFiles(dirPath)
  if (extensions) {
    return allFiles.filter((f) => extensions.some((ext) => f.endsWith(ext)))
  }
  return allFiles
}

ts.sys.realpath = (filePath) => {
  try {
    return fs.realpathSync(filePath) as string
  } catch {
    return filePath
  }
}

// ─────────────────────────────────────────────────────────────
// Test Lifecycle
// ─────────────────────────────────────────────────────────────

beforeEach(() => {
  vol.reset()
  mockTsImport.mockReset()
})

afterEach(() => {
  vi.clearAllMocks()
})

import ts from 'typescript'

import { createMockFileSystem } from './fs.js'

const compilerOptions: ts.CompilerOptions = {
  module: ts.ModuleKind.ESNext,
  target: ts.ScriptTarget.ESNext,
  strict: true,
}

export function createMockProgram(files: Record<string, string>) {
  createMockFileSystem(files)
  return ts.createProgram(Object.keys(files), compilerOptions)
}

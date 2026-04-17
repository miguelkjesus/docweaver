import type ts from 'typescript'

import { type Declaration, getFileDeclarations } from './file-declarations.js'
import { getModuleExports, type ModuleExport } from './module-exports.js'

export type FileApi = Readonly<{
  exports: ModuleExport[]
  declarations: Declaration[]
}>

export function getFileApi(file: ts.SourceFile, checker: ts.TypeChecker): FileApi {
  const declarations = getFileDeclarations(file, checker)

  const moduleSymbol = checker.getSymbolAtLocation(file)
  const exports = moduleSymbol ? getModuleExports(moduleSymbol, checker) : []

  return { exports, declarations }
}

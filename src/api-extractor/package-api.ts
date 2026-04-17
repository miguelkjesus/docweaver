import ts from 'typescript'

import { type FileApi, getFileApi } from './file-api.js'

export type PackageApiOptions = Readonly<{
  entrypoints: string[]
  compilerOptions: ts.CompilerOptions
}>

export function getPackageApi({
  entrypoints,
  compilerOptions,
}: PackageApiOptions): Map<string, FileApi> {
  const program = ts.createProgram(entrypoints, compilerOptions)
  const checker = program.getTypeChecker()

  const packageApi = new Map<string, FileApi>()

  for (const entrypoint of entrypoints) {
    const sourceFile = program.getSourceFile(entrypoint)

    if (!sourceFile) {
      throw new Error(`Source file not found for entrypoint: ${entrypoint}`)
    }

    packageApi.set(entrypoint, getFileApi(sourceFile, checker))
  }

  return packageApi
}

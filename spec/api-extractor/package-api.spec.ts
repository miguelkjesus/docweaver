import ts from 'typescript'

import { createMockFileSystem } from '@spec/mocks/fs.js'

import { getPackageApi } from '@/api-extractor/package-api.js'

describe(getPackageApi, () => {
  const compilerOptions: ts.CompilerOptions = {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ESNext,
    strict: true,
  }

  it('processes single entrypoint', () => {
    createMockFileSystem({
      '/index.ts': 'export const x = 1',
    })

    const result = getPackageApi({
      entrypoints: ['/index.ts'],
      compilerOptions,
    })

    expect(result).toBeInstanceOf(Map)
    expect(result.size).toBe(1)
    expect(result.has('/index.ts')).toBe(true)
  })

  it('processes multiple entrypoints', () => {
    createMockFileSystem({
      '/index.ts': 'export const main = 1',
      '/utils.ts': 'export function helper() {}',
    })

    const result = getPackageApi({
      entrypoints: ['/index.ts', '/utils.ts'],
      compilerOptions,
    })

    expect(result.size).toBe(2)
    expect(result.has('/index.ts')).toBe(true)
    expect(result.has('/utils.ts')).toBe(true)

    const indexApi = result.get('/index.ts')
    expect(indexApi?.exports).toHaveLength(1)
    expect(indexApi?.exports[0]).toMatchObject({ name: 'main' })

    const utilsApi = result.get('/utils.ts')
    expect(utilsApi?.exports).toHaveLength(1)
    expect(utilsApi?.exports[0]).toMatchObject({ name: 'helper' })
  })

  it('throws error when entrypoint file does not exist', () => {
    createMockFileSystem({})

    expect(() =>
      getPackageApi({
        entrypoints: ['/nonexistent.ts'],
        compilerOptions,
      }),
    ).toThrow('Source file not found for entrypoint: /nonexistent.ts')
  })

  it('passes compiler options to the program', () => {
    createMockFileSystem({
      '/index.ts': 'export const x: string = "hello"',
    })

    const result = getPackageApi({
      entrypoints: ['/index.ts'],
      compilerOptions: {
        ...compilerOptions,
        strict: false,
      },
    })

    expect(result.size).toBe(1)
  })
})

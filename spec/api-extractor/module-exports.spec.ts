import { createMockProgram } from '@spec/mocks/ts.js'

import { getModuleExports } from '@/api-extractor/module-exports.js'

describe(getModuleExports, () => {
  function getExports(code: string, files: Record<string, string> = {}) {
    const program = createMockProgram({ '/index.ts': code, ...files })
    const checker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('/index.ts')

    if (!sourceFile) throw new Error('Source file not found')

    const moduleSymbol = checker.getSymbolAtLocation(sourceFile)

    if (!moduleSymbol) throw new Error('File is not a module.')

    return getModuleExports(moduleSymbol, checker)
  }

  it('returns direct function export', () => {
    const [exp] = getExports('export function myFunc() {}')

    expect(exp).toMatchObject({ name: 'myFunc', isDefault: false })
  })

  it('returns direct const export', () => {
    const [exp] = getExports('export const myConst = 42')

    expect(exp).toMatchObject({ name: 'myConst', isDefault: false })
  })

  it('returns class export', () => {
    const [exp] = getExports('export class MyClass {}')

    expect(exp).toMatchObject({ name: 'MyClass', isDefault: false })
  })

  it('returns type export', () => {
    const [exp] = getExports('export type MyType = string')

    expect(exp).toMatchObject({ name: 'MyType' })
  })

  it('returns interface export', () => {
    const [exp] = getExports('export interface MyInterface {}')

    expect(exp).toMatchObject({ name: 'MyInterface' })
  })

  it('handles multiple exports', () => {
    const exports = getExports(`
      export const a = 1
      export const b = 2
      export function c() {}
    `)

    const names = exports.map((e) => e.name)
    expect(names).toContain('a')
    expect(names).toContain('b')
    expect(names).toContain('c')
  })

  describe('default exports', () => {
    it('uses declaration name when available', () => {
      const [exp] = getExports('export default function myFunc() {}')

      expect(exp).toMatchObject({ name: 'myFunc', isDefault: true })
    })

    it('falls back to "default" for anonymous', () => {
      const [exp] = getExports('export default function() {}')

      expect(exp).toMatchObject({ name: 'default', isDefault: true })
    })
  })

  describe('aliased exports', () => {
    it('resolves local alias to original symbol', () => {
      const [exp] = getExports(`
        function internal() {}
        export { internal as publicApi }
      `)

      expect(exp).toMatchObject({
        symbol: { name: 'publicApi' },
        originalSymbol: { name: 'internal' },
      })
    })

    it('symbol and originalSymbol are the same for direct exports', () => {
      const [exp] = getExports('export function directExport() {}')

      expect(exp).toBeDefined()
      expect(exp?.symbol).toBe(exp?.originalSymbol)
    })
  })

  describe('re-exports', () => {
    it('resolves re-export from another module', () => {
      const [exp] = getExports('export { helper as publicHelper } from "./utils.js"', {
        '/utils.ts': 'export function helper() {}',
      })

      expect(exp).toMatchObject({
        symbol: { name: 'publicHelper' },
        originalSymbol: { name: 'helper' },
      })
    })

    it('resolves default re-exported as named', () => {
      const [exp] = getExports('export { default as Component } from "./component.js"', {
        '/component.ts': 'export default class MyComponent {}',
      })

      expect(exp).toMatchObject({
        name: 'Component',
        isDefault: false,
        symbol: { name: 'Component' },
        originalSymbol: { name: 'default' },
      })
    })

    it('handles export * from module', () => {
      const exports = getExports('export * from "./utils.js"', {
        '/utils.ts': `
          export function foo() {}
          export const bar = 1
        `,
      })

      const names = exports.map((e) => e.name)
      expect(names).toContain('foo')
      expect(names).toContain('bar')
    })

    it('handles export * as namespace', () => {
      const [exp] = getExports('export * as utils from "./utils.js"', {
        '/utils.ts': `
          export function foo() {}
          export const bar = 1
        `,
      })

      expect(exp).toMatchObject({ name: 'utils' })
    })
  })

  describe('edge cases', () => {
    it('handles enum export', () => {
      const [exp] = getExports('export enum Status { Active, Inactive }')

      expect(exp).toMatchObject({ name: 'Status' })
    })

    it('handles const enum export', () => {
      const [exp] = getExports('export const enum Direction { Up, Down }')

      expect(exp).toMatchObject({ name: 'Direction' })
    })

    it('handles namespace export', () => {
      const [exp] = getExports('export namespace MyNamespace { export const x = 1 }')

      expect(exp).toMatchObject({ name: 'MyNamespace' })
    })
  })
})

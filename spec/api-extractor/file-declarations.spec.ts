import ts from 'typescript'

import { createMockProgram } from '@spec/mocks/ts.js'

import { getFileDeclarations } from '@/api-extractor/file-declarations.js'

describe(getFileDeclarations, () => {
  function getDeclarations(code: string) {
    const program = createMockProgram({ '/index.ts': code })
    const checker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('/index.ts')

    if (!sourceFile) throw new Error('Source file not found')

    return getFileDeclarations(sourceFile, checker)
  }

  describe('globals', () => {
    it('extracts declare global blocks', () => {
      const [decl] = getDeclarations(`
        declare global {
          interface Window {
            myGlobal: string
          }
        }
      `)

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('global')
      expect(decl && ts.isModuleDeclaration(decl.node)).toBe(true)
    })

    it('extracts multiple declare global blocks', () => {
      const decls = getDeclarations(`
        declare global {
          interface Window { a: string }
        }
        declare global {
          interface Window { b: number }
        }
      `)

      expect(decls).toHaveLength(2)
      expect(decls.every((d) => d.kind === 'global')).toBe(true)
    })

    it('returns empty array when no globals', () => {
      const decls = getDeclarations('export const x = 1')

      expect(decls).toEqual([])
    })
  })

  describe('ambientModules', () => {
    it('extracts declare module with string literal name', () => {
      const [decl] = getDeclarations(`
        declare module "my-module" {
          export function foo(): void
        }
      `)

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('ambient-module')
      expect(decl && ts.isModuleDeclaration(decl.node)).toBe(true)
      expect((decl?.node as ts.ModuleDeclaration).name.getText()).toBe('"my-module"')
    })

    it('extracts wildcard module declarations', () => {
      const [decl] = getDeclarations(`
        declare module "*.css" {
          const content: string
          export default content
        }
      `)

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('ambient-module')
      expect((decl?.node as ts.ModuleDeclaration).name.getText()).toBe('"*.css"')
    })

    it('does not include declare global in ambient modules', () => {
      const decls = getDeclarations(`
        declare global { interface Window {} }
        declare module "foo" {}
      `)

      expect(decls).toHaveLength(2)
      expect(decls[0]?.kind).toBe('global')
      expect(decls[1]?.kind).toBe('ambient-module')
    })
  })

  describe('namespaces', () => {
    it('extracts declare namespace', () => {
      const [decl] = getDeclarations(`
        declare namespace MyNamespace {
          export function foo(): void
        }
      `)

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('namespace')
      expect(decl && ts.isModuleDeclaration(decl.node)).toBe(true)
      expect((decl?.node as ts.ModuleDeclaration).name.getText()).toBe('MyNamespace')
    })

    it('does not include non-ambient namespaces', () => {
      const decls = getDeclarations(`
        namespace RegularNamespace {
          export const x = 1
        }
      `)

      expect(decls).toHaveLength(0)
    })

    it('extracts nested namespace declarations', () => {
      const [decl] = getDeclarations(`
        declare namespace Outer.Inner {
          export const x: number
        }
      `)

      expect(decl?.kind).toBe('namespace')
    })
  })

  describe('variables', () => {
    it('extracts declare const', () => {
      const [decl] = getDeclarations('declare const myConst: string')

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('variable')
      expect(decl && ts.isVariableStatement(decl.node)).toBe(true)
      expect(decl?.symbol?.name).toBe('myConst')
    })

    it('extracts declare let', () => {
      const [decl] = getDeclarations('declare let myLet: number')

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('variable')
      expect(decl?.symbol?.name).toBe('myLet')
    })

    it('extracts declare var', () => {
      const [decl] = getDeclarations('declare var myVar: boolean')

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('variable')
      expect(decl?.symbol?.name).toBe('myVar')
    })

    it('does not include non-ambient variables', () => {
      const decls = getDeclarations('const regular = 42')

      expect(decls).toHaveLength(0)
    })
  })

  describe('functions', () => {
    it('extracts declare function', () => {
      const [decl] = getDeclarations('declare function myFunc(): void')

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('function')
      expect(decl && ts.isFunctionDeclaration(decl.node)).toBe(true)
      expect(decl?.symbol?.name).toBe('myFunc')
    })

    it('extracts declare function with parameters', () => {
      const [decl] = getDeclarations('declare function greet(name: string): string')

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('function')
      expect(decl?.symbol?.name).toBe('greet')
    })

    it('does not include non-ambient functions', () => {
      const decls = getDeclarations('function regular() {}')

      expect(decls).toHaveLength(0)
    })
  })

  describe('classes', () => {
    it('extracts declare class', () => {
      const [decl] = getDeclarations('declare class MyClass {}')

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('class')
      expect(decl && ts.isClassDeclaration(decl.node)).toBe(true)
      expect(decl?.symbol?.name).toBe('MyClass')
    })

    it('extracts declare abstract class', () => {
      const [decl] = getDeclarations('declare abstract class AbstractClass {}')

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('class')
      expect(decl?.symbol?.name).toBe('AbstractClass')
    })

    it('does not include non-ambient classes', () => {
      const decls = getDeclarations('class Regular {}')

      expect(decls).toHaveLength(0)
    })
  })

  describe('enums', () => {
    it('extracts declare enum', () => {
      const [decl] = getDeclarations('declare enum Status { Active, Inactive }')

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('enum')
      expect(decl && ts.isEnumDeclaration(decl.node)).toBe(true)
      expect(decl?.symbol?.name).toBe('Status')
    })

    it('extracts declare const enum', () => {
      const [decl] = getDeclarations('declare const enum Direction { Up, Down }')

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('enum')
      expect(decl?.symbol?.name).toBe('Direction')
    })

    it('does not include non-ambient enums', () => {
      const decls = getDeclarations('enum Regular { A, B }')

      expect(decls).toHaveLength(0)
    })
  })

  describe('typeAliases', () => {
    it('extracts declare type', () => {
      const [decl] = getDeclarations('declare type MyType = string | number')

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('type-alias')
      expect(decl && ts.isTypeAliasDeclaration(decl.node)).toBe(true)
      expect(decl?.symbol?.name).toBe('MyType')
    })

    it('does not include non-ambient type aliases', () => {
      const decls = getDeclarations('type Regular = string')

      expect(decls).toHaveLength(0)
    })
  })

  describe('interfaces', () => {
    it('extracts declare interface', () => {
      const [decl] = getDeclarations('declare interface MyInterface { x: number }')

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('interface')
      expect(decl && ts.isInterfaceDeclaration(decl.node)).toBe(true)
      expect(decl?.symbol?.name).toBe('MyInterface')
    })

    it('does not include non-ambient interfaces', () => {
      const decls = getDeclarations('interface Regular { x: number }')

      expect(decls).toHaveLength(0)
    })
  })

  describe('mixed declarations', () => {
    it('extracts all declaration types from a single file', () => {
      const decls = getDeclarations(`
        declare global {
          interface Window { test: boolean }
        }
        declare module "test-module" {}
        declare namespace TestNS {}
        declare const testConst: string
        declare function testFunc(): void
        declare class TestClass {}
        declare enum TestEnum { A }
        declare type TestType = string
        declare interface TestInterface {}
      `)

      expect(decls).toHaveLength(9)
      expect(decls.map((d) => d.kind)).toEqual([
        'global',
        'ambient-module',
        'namespace',
        'variable',
        'function',
        'class',
        'enum',
        'type-alias',
        'interface',
      ])
    })

    it('ignores non-ambient declarations alongside ambient ones', () => {
      const [decl] = getDeclarations(`
        declare const ambient: string
        const regular = 42
        export function exported() {}
      `)

      expect(decl).toBeDefined()
      expect(decl?.kind).toBe('variable')
    })
  })
})

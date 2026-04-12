import { createMockProgram } from '@spec/mocks/ts.js'
import ts from 'typescript'

import { getFileGlobals } from '@/api-extractor/globals.js'

describe(getFileGlobals, () => {
  function getGlobals(code: string) {
    const program = createMockProgram({ '/index.ts': code })
    const sourceFile = program.getSourceFile('/index.ts')

    if (!sourceFile) throw new Error('Source file not found')

    return getFileGlobals(sourceFile)
  }

  it('returns empty array for file with no globals', () => {
    const globals = getGlobals('export const foo = 1')

    expect(globals).toHaveLength(0)
  })

  it('extracts single declare global block', () => {
    const [global] = getGlobals(`
      declare global {
        interface Window {
          myApp: string
        }
      }
    `)

    expect(global?.statements).toHaveLength(1)
  })

  it('extracts multiple declare global blocks', () => {
    const globals = getGlobals(`
      declare global {
        interface Window {
          foo: string
        }
      }

      declare global {
        interface Window {
          bar: number
        }
      }
    `)

    expect(globals).toHaveLength(2)
  })

  it('extracts multiple statements from single block', () => {
    const [global] = getGlobals(`
      declare global {
        interface Window {
          myApp: string
        }
        const MY_GLOBAL: string
        function myGlobalFn(): void
      }
    `)

    expect(global?.statements).toHaveLength(3)
  })

  it('provides access to the declare global declaration', () => {
    const [global] = getGlobals(`
      declare global {
        interface Window {}
      }
    `)

    const { declareGlobalDeclaration } = global ?? {}

    expect(declareGlobalDeclaration).toBeDefined()
    expect(declareGlobalDeclaration && ts.isModuleDeclaration(declareGlobalDeclaration)).toBe(true)
  })

  describe('ignored declarations', () => {
    it('ignores regular module declarations', () => {
      const globals = getGlobals(`
        declare module "my-module" {
          export const foo: string
        }
      `)

      expect(globals).toEqual([])
    })

    it('ignores namespace declarations', () => {
      const globals = getGlobals(`
        declare namespace MyNamespace {
          export const foo: string
        }
      `)

      expect(globals).toHaveLength(0)
    })
  })

  describe('statement types', () => {
    it('handles interface declarations', () => {
      const [global] = getGlobals(`
        declare global {
          interface CustomEvent {
            detail: unknown
          }
        }
      `)

      const [statement] = global?.statements ?? []

      expect(statement).toBeDefined()
      expect(statement && ts.isInterfaceDeclaration(statement)).toBe(true)
    })

    it('handles variable declarations', () => {
      const [global] = getGlobals(`
        declare global {
          const MY_CONST: string
          let myLet: number
          var myVar: boolean
        }
      `)

      const statements = global?.statements ?? []

      expect(statements).toHaveLength(3)

      for (const s of statements) {
        expect(ts.isVariableStatement(s)).toBe(true)
      }
    })

    it('handles function declarations', () => {
      const [global] = getGlobals(`
        declare global {
          function myGlobalFn(): void
        }
      `)

      const [statement] = global?.statements ?? []

      expect(statement).toBeDefined()
      expect(statement && ts.isFunctionDeclaration(statement)).toBe(true)
    })

    it('handles type alias declarations', () => {
      const [global] = getGlobals(`
        declare global {
          type MyGlobalType = string | number
        }
      `)

      const [statement] = global?.statements ?? []

      expect(statement).toBeDefined()
      expect(statement && ts.isTypeAliasDeclaration(statement)).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('handles empty declare global block', () => {
      const [global] = getGlobals('declare global {}')

      expect(global?.statements).toHaveLength(0)
    })

    it('extracts globals from file with mixed content', () => {
      const globals = getGlobals(`
        export const foo = 1

        declare global {
          interface Window {
            myApp: string
          }
        }

        export function bar() {}
      `)

      expect(globals).toHaveLength(1)
      expect(globals[0]?.statements).toHaveLength(1)
    })
  })
})

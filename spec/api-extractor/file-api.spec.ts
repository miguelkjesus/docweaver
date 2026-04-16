import { createMockProgram } from '@spec/mocks/ts.js'

import { getFileApi } from '@/api-extractor/file-api.js'

describe(getFileApi, () => {
  function getApi(code: string) {
    const program = createMockProgram({ '/index.ts': code })
    const checker = program.getTypeChecker()
    const sourceFile = program.getSourceFile('/index.ts')

    if (!sourceFile) throw new Error('Source file not found')

    return getFileApi(sourceFile, checker)
  }

  it('returns FileApi with exports and declarations arrays', () => {
    const api = getApi('export const x = 1')

    expect(api).toHaveProperty('exports')
    expect(api).toHaveProperty('declarations')
    expect(Array.isArray(api.exports)).toBe(true)
    expect(Array.isArray(api.declarations)).toBe(true)
  })

  it('returns empty exports for script file without module symbol', () => {
    const api = getApi('const x = 1')

    expect(api.exports).toEqual([])
  })

  it('returns empty declarations when file has no ambient declarations', () => {
    const api = getApi('export const x = 1')

    expect(api.declarations).toEqual([])
  })

  it('combines exports and declarations from the same file', () => {
    const api = getApi(`
      export function myFunc() {}
      declare global { var __DEBUG__: boolean }
    `)

    expect(api.exports).toHaveLength(1)
    expect(api.exports[0]).toMatchObject({ name: 'myFunc' })

    expect(api.declarations).toHaveLength(1)
    expect(api.declarations[0]).toMatchObject({ kind: 'global' })
  })
})

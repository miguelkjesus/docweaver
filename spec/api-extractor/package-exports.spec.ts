import { createMockFileSystem } from '@spec/mocks/fs.js'

import { resolvePackageExports } from '@/api-extractor/package-exports.js'

describe(resolvePackageExports, () => {
  it('resolves a package with only `types`', async () => {
    const result = await resolvePackageExports({
      packageContents: { name: 'pkg', types: './dist/index.d.ts' },
      packageDirectory: '/project',
    })

    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      subpath: '',
      typesPath: './dist/index.d.ts',
      entrypoints: [
        {
          subpath: '.',
          importPath: 'pkg',
          typesPath: '/project/dist/index.d.ts',
        },
      ],
    })
  })

  it('resolves a conditional `types` leaf at the root', async () => {
    const result = await resolvePackageExports({
      packageContents: { name: 'pkg', exports: { '.': { types: './dist/index.d.ts' } } },
      packageDirectory: '/project',
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.entrypoints[0]).toMatchObject({
      subpath: '.',
      importPath: 'pkg',
      typesPath: '/project/dist/index.d.ts',
    })
  })

  it('skips string-leaf exports (JS targets, not declarations)', async () => {
    const result = await resolvePackageExports({
      packageContents: { name: 'pkg', exports: { '.': './dist/index.js' } },
      packageDirectory: '/project',
    })

    expect(result).toEqual([])
  })

  it('resolves a non-root subpath', async () => {
    const result = await resolvePackageExports({
      packageContents: { name: 'pkg', exports: { './core': { types: './dist/core.d.ts' } } },
      packageDirectory: '/project',
    })

    expect(result[0]?.entrypoints[0]).toMatchObject({
      subpath: 'core',
      importPath: 'pkg/core',
      typesPath: '/project/dist/core.d.ts',
    })
  })

  it('resolves multiple top-level exports in declaration order', async () => {
    const result = await resolvePackageExports({
      packageContents: {
        name: 'pkg',
        exports: {
          './a': { types: './dist/a.d.ts' },
          './b': { types: './dist/b.d.ts' },
        },
      },
      packageDirectory: '/project',
    })

    expect(result.map((d) => d.subpath)).toEqual(['a', 'b'])
  })

  it('composes nested subpaths', async () => {
    const result = await resolvePackageExports({
      packageContents: {
        name: 'pkg',
        exports: {
          './feature': { './foo': { types: './dist/feature/foo.d.ts' } },
        },
      },
      packageDirectory: '/project',
    })

    expect(result[0]?.entrypoints[0]).toMatchObject({
      subpath: 'feature/foo',
      importPath: 'pkg/feature/foo',
      typesPath: '/project/dist/feature/foo.d.ts',
    })
  })

  it('ignores the legacy `types` field when `exports` is defined', async () => {
    const result = await resolvePackageExports({
      packageContents: {
        name: 'pkg',
        types: './dist/index.d.ts',
        exports: { './core': { types: './dist/core.d.ts' } },
      },
      packageDirectory: '/project',
    })

    expect(result.map((d) => d.subpath)).toEqual(['core'])
  })

  it('does not duplicate the root entry when `types` and `exports["."]` both declare it', async () => {
    const result = await resolvePackageExports({
      packageContents: {
        name: 'pkg',
        types: './dist/index.d.ts',
        exports: {
          '.': { types: './dist/index.d.ts' },
          './core': { types: './dist/core.d.ts' },
        },
      },
      packageDirectory: '/project',
    })

    expect(result).toHaveLength(2)
    expect(result.map((d) => d.typesPath)).toEqual(['./dist/index.d.ts', './dist/core.d.ts'])
  })

  it('back-references the export definition on each entrypoint', async () => {
    const result = await resolvePackageExports({
      packageContents: { name: 'pkg', types: './dist/index.d.ts' },
      packageDirectory: '/project',
    })

    expect(result[0]?.entrypoints[0]?.exportDefinition).toBe(result[0])
  })

  it('expands `*` patterns and the capture may cross `/`', async () => {
    createMockFileSystem({
      '/project/dist/feature/a.d.ts': '',
      '/project/dist/feature/nested/b.d.ts': '',
    })

    const result = await resolvePackageExports({
      packageContents: {
        name: 'pkg',
        exports: { './feature/*': { types: './dist/feature/*.d.ts' } },
      },
      packageDirectory: '/project',
    })

    const entrypoints = result[0]?.entrypoints ?? []
    expect(entrypoints.map((e) => e.subpath).sort()).toEqual(['feature/a', 'feature/nested/b'])
    expect(entrypoints.map((e) => e.importPath).sort()).toEqual([
      'pkg/feature/a',
      'pkg/feature/nested/b',
    ])
    expect(entrypoints.map((e) => e.typesPath).sort()).toEqual([
      '/project/dist/feature/a.d.ts',
      '/project/dist/feature/nested/b.d.ts',
    ])
  })

  it('returns an empty entrypoint list when a `*` pattern matches no files', async () => {
    createMockFileSystem({})

    const result = await resolvePackageExports({
      packageContents: {
        name: 'pkg',
        exports: { './feature/*': { types: './dist/feature/*.d.ts' } },
      },
      packageDirectory: '/project',
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.entrypoints).toEqual([])
  })

  it('returns no entrypoints when the LHS has `*` but the RHS does not', async () => {
    createMockFileSystem({
      '/project/dist/feature.d.ts': '',
    })

    const result = await resolvePackageExports({
      packageContents: {
        name: 'pkg',
        exports: { './feature/*': { types: './dist/feature.d.ts' } },
      },
      packageDirectory: '/project',
    })

    expect(result[0]?.entrypoints).toEqual([])
  })

  it('returns an empty array when the package has no `types` and no `exports`', async () => {
    const result = await resolvePackageExports({
      packageContents: { name: 'pkg' },
      packageDirectory: '/project',
    })

    expect(result).toEqual([])
  })
})

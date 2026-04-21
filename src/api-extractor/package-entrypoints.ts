import { scope } from 'arktype'

export type PackageEntrypoint = Readonly<{
  /** Subpath e.g. `core`. If it is the main entrypoint, this will be undefined. */
  subpath?: string

  /** Resolved file the entrypoint points to. */
  declarationPath: string
}>

const { ExportsLeaf, Exports, Package } = scope({
  ExportsLeaf: { type: 'string' },
  Exports: 'Record<string, unknown>',
  Package: {
    'types?': 'string',
    'exports?': 'Exports',
  },
}).export()

type Exports = Readonly<typeof Exports.infer>

// TODO support * exports
export async function resolvePackageEntrypoints(
  packageJsonPath: string,
): Promise<PackageEntrypoint[]> {
  const pkg = Package.assert(await import(packageJsonPath, { with: { type: 'json' } }))

  const entrypoints: PackageEntrypoint[] = []

  // TODO warn if pkg.main but no pkg.types

  if (pkg.types) {
    entrypoints.push({ declarationPath: pkg.types })
  }

  if (pkg.exports) {
    entrypoints.push(...walkExports(pkg.exports))
  }

  return entrypoints
}

type WalkExportsOptions = Readonly<{
  subpath?: string
}>

function walkExports(exports: Exports, { subpath }: WalkExportsOptions = {}): PackageEntrypoint[] {
  if (ExportsLeaf.allows(exports)) {
    return [{ subpath, declarationPath: exports.type }]
  }

  return Object.entries(exports).flatMap(([pathSegment, value]) => {
    const nextExports = Exports.assert(value)

    const cleaned = pathSegment.replace(/^\.\/?/, '')
    const nextSubpath = cleaned ? (subpath ? `${subpath}/${cleaned}` : cleaned) : subpath

    return walkExports(nextExports, { subpath: nextSubpath })
  })
}

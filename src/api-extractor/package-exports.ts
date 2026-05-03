import path from 'node:path'

import { scope } from 'arktype'

import { findDown } from '@/utils/find.js'

/**
 * A single entry from `package.json#types` or `package.json#exports`,
 * paired with the concrete {@link PackageEntrypoint}s it expands to.
 */
export type PackageExportDefinition = Readonly<{
  /**
   * The key of the `package.json#exports` field e.g. `'.'`, `'./core'` or `'./stuff/*'`
   *
   * If the export was resolved from `package.json#types`, the subpath will be `'.'`.
   */
  subpath: string

  /** The path specified in the `#types` field of the export. */
  typesPath: string

  /** Concrete entrypoints this definition expands to. */
  entrypoints: readonly PackageEntrypoint[]
}>

/**
 * A single concrete declaration file exposed by the package, paired with
 * the import path consumers would use to reach it.
 */
export type PackageEntrypoint = Readonly<{
  /**
   * A fully resolved import subpath. This will only differ in the case that the export definition subpath was a matcher.
   */
  subpath: string

  /**
   * The path you would use to import this entrypoint into a program e.g. `'my-pkg'`, `'my-pkg/core'`, `'my-pkg/stuff/foo.js'`
   */
  importPath: string

  /** The path to the declaration file this entrypoint maps to. */
  typesPath: string

  /** The parent export definition this entrypoint was derived from. */
  exportDefinition: PackageExportDefinition
}>

interface MutablePackageExportDefinition {
  subpath: string
  typesPath: string
  entrypoints: PackageEntrypoint[]
}

const $ = scope({
  PackageExportsLeaf: { types: 'string' },
  /**
   * This should really validate `Record<string, Exports | ExportsLeaf>`,
   * however we get infinite recursion errors, so we instead validate as we walk
   * in {@link walkExports}
   */
  PackageExports: 'string | Record<string, unknown>',
  PackageWithExports: {
    name: 'string',
    'types?': 'string',
    'exports?': 'PackageExports',
  },
}).export()

const PackageExportsLeaf = $.PackageExportsLeaf

/**
 * The shape of a `package.json` consumed by {@link resolvePackageExports}.
 * Available as both an arktype schema (value) and a type.
 */
export const PackageWithExports = $.PackageWithExports
export type PackageWithExports = Readonly<typeof PackageWithExports.infer>

const PackageExports = $.PackageExports
type PackageExports = Readonly<typeof PackageExports.infer>

/** Options for {@link resolvePackageExports}. */
export type ResolvePackageExportsOptions = Readonly<{
  /** Parsed `package.json` contents. */
  packageContents: PackageWithExports
  /** Absolute path to the directory containing the `package.json`. */
  packageDirectory: string
}>

/**
 * Resolves the declaration-file entrypoints exposed by a package's
 * `types` and `exports` fields. Returns one {@link PackageExportDefinition}
 * per declared entry.
 *
 * Subpath patterns (`*`) follow the npm spec — captures may cross `/`.
 * Exports that don't point to a declaration file are ignored.
 *
 * @see https://nodejs.org/api/packages.html#subpath-patterns
 */
export async function resolvePackageExports({
  packageContents,
  packageDirectory,
}: ResolvePackageExportsOptions): Promise<PackageExportDefinition[]> {
  const exports: MutablePackageExportDefinition[] = []

  // TODO warn if pkg.main but no pkg.types

  // `exports` supersedes the legacy `types` field — modern resolvers
  // ignore `types`/`main` when `exports` is defined.
  if (packageContents.exports) {
    exports.push(...walkExports(packageContents.exports))
  } else if (packageContents.types) {
    exports.push({ subpath: '', typesPath: packageContents.types, entrypoints: [] })
  }

  // Needs to be done after the export definitions are collated as export defs and entrypoints reference eachother
  async function hydrateEntrypoints(exportDefinition: MutablePackageExportDefinition) {
    exportDefinition.entrypoints = await resolveEntrypoints(
      packageContents.name,
      packageDirectory,
      exportDefinition,
    )
  }

  await Promise.all(exports.map(hydrateEntrypoints))

  return exports
}

type WalkExportsOptions = Readonly<{
  subpath?: string
}>

function walkExports(
  exports: PackageExports,
  { subpath = '' }: WalkExportsOptions = {},
): MutablePackageExportDefinition[] {
  if (typeof exports === 'string') return []

  if (PackageExportsLeaf.allows(exports)) {
    return [{ subpath, typesPath: exports.types, entrypoints: [] }]
  }

  return Object.entries(exports).flatMap(([pathSegment, value]) => {
    const nextExports = PackageExports.assert(value)

    const cleaned = pathSegment.replace(/^\.\/?/, '')
    const nextSubpath = cleaned ? (subpath ? `${subpath}/${cleaned}` : cleaned) : subpath

    return walkExports(nextExports, { subpath: nextSubpath })
  })
}

async function resolveEntrypoints(
  packageName: string,
  packageDirectory: string,
  exportDefinition: MutablePackageExportDefinition,
): Promise<PackageEntrypoint[]> {
  const { subpath, typesPath } = exportDefinition

  function buildEntrypoint(resolvedSubpath: string, resolvedTypesPath: string): PackageEntrypoint {
    const normalised = resolvedSubpath === '' ? '.' : resolvedSubpath
    return {
      subpath: normalised,
      importPath: normalised === '.' ? packageName : `${packageName}/${normalised}`,
      typesPath: path.resolve(packageDirectory, resolvedTypesPath),
      exportDefinition,
    }
  }

  if (!subpath.includes('*') && !typesPath.includes('*')) {
    return [buildEntrypoint(subpath, typesPath)]
  }

  const globPattern = typesPath.replace(/\*/g, '**/*')
  const captureRegex = new RegExp(`^${escapeRegExp(typesPath).replace(/\\\*/g, '(.*)')}$`)

  const matches = await findDown.all(globPattern, { cwd: packageDirectory })

  return matches.flatMap((absoluteMatch) => {
    const relativeMatch = `./${path.relative(packageDirectory, absoluteMatch)}`
    const captured = captureRegex.exec(relativeMatch)?.[1]
    if (captured === undefined) return []
    return [buildEntrypoint(subpath.replace(/\*/g, captured), absoluteMatch)]
  })
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

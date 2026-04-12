import ts from 'typescript'

/**
 * Data about an exported symbol from a module.
 */
export type ModuleExport = Readonly<{
  /**
   * The actual declaration the export points to, resolved through any aliases.
   *
   * For re-exports with aliases (e.g., `export { helper as publicHelper }`),
   * this is the original symbol (`helper`).
   */
  originalSymbol: ts.Symbol

  /**
   * The symbol as it appears in the export statement.
   *
   * For re-exports with aliases (e.g., `export { helper as publicHelper }`),
   * this is the alias symbol (`publicHelper`).
   */
  symbol: ts.Symbol

  /**
   * Whether this export is the default export of its module.
   */
  isDefault: boolean

  /**
   * The name of the exported symbol.
   *
   * This is preferred over `symbol.name` as it will return the correct name of the symbol in cases like `export default function foo() {}`.
   */
  name: string
}>

/**
 * Returns all the data about all the exports file.
 *
 * **Only supports ESM exports.**
 * @param checker The type checker associated with this module symbol
 * @param moduleSymbol Usually accessed via `checker.getSymbolAtLocation(sourceFile)`
 */
export function getModuleExports(
  checker: ts.TypeChecker,
  moduleSymbol: ts.Symbol | undefined,
): ModuleExport[] {
  if (!moduleSymbol) return []

  return checker.getExportsOfModule(moduleSymbol).map((symbol) => {
    const originalSymbol =
      symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol

    const name = getSymbolDeclarationName(symbol)

    const isDefault = symbol.name === 'default'

    return {
      symbol,
      originalSymbol,
      isDefault,
      name,
    }
  })
}

/**
 * Gets the name of a symbol as it appears in its declaration, rather than the exported name.
 * This is important for cases like `export default function foo() {}` where the exported name is `default` but the declaration name is `foo`.
 *
 * @param symbol The symbol to get the declaration name of.
 */
function getSymbolDeclarationName(symbol: ts.Symbol) {
  if (symbol.name === 'default') {
    for (const decl of symbol.declarations ?? []) {
      if (isNamedDeclaration(decl)) {
        return decl.name.text
      }
    }
  }

  return symbol.name
}

/**
 * Checks if a declaration has a name that can be accessed via `declaration.name.text`
 * @param declaration The declaration to check.
 */
function isNamedDeclaration(
  declaration: ts.Declaration,
): declaration is ts.Declaration & { name: { text: string } } {
  return !!(
    'name' in declaration &&
    typeof declaration.name === 'object' &&
    declaration.name &&
    'text' in declaration.name &&
    typeof declaration.name.text === 'string'
  )
}

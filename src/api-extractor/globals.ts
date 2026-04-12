import ts from 'typescript'

/**
 * Data about an exported symbol from a module.
 */
export type DeclaredGlobals = Readonly<{
  /**
   * The statements declared inside the `declare global` block (`declareGlobalDeclaration`).
   */
  statements: ts.NodeArray<ts.Statement>

  /**
   * The `declare global` declaration itself.
   *
   * This can differ in the same file, as some files may have multiple `declare global` blocks.
   * In this case, the `statements` property will only contain the statements from this specific block.
   */
  declareGlobalDeclaration: ts.ModuleDeclaration
}>

/**
 * Returns the global declarations found in a file.
 *
 * @param file The source file to extract global declarations from.
 */
export function getFileGlobals(file: ts.SourceFile) {
  const moduleGlobals: DeclaredGlobals[] = []

  for (const statement of file.statements) {
    if (!isDeclareGlobal(statement)) continue
    if (!statement.body || !ts.isModuleBlock(statement.body)) continue

    moduleGlobals.push({
      declareGlobalDeclaration: statement,
      statements: statement.body.statements,
    })
  }

  return moduleGlobals
}

/**
 * Checks if a statement is a global declaration.
 * @param statement The statement to check.
 */
function isDeclareGlobal(statement: ts.Statement): statement is ts.ModuleDeclaration {
  return ts.isModuleDeclaration(statement) && !!(statement.flags & ts.NodeFlags.GlobalAugmentation)
}

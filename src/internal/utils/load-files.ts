// TODO tests

export async function assertDefaultExport(file: string, errorMessage: string) {
  const { default: def } = (await import(file)) as { default?: unknown }

  if (!def) throw new Error(errorMessage)

  return def
}

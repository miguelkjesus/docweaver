import { findUp } from './find/find-up.js'

export async function findTSConfigFile(cwd?: string) {
  return findUp(['tsconfig.json'], cwd ? [cwd] : undefined)
}

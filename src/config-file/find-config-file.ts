import { findUp } from '@/internal/utils/find/find-up.js'

export function findConfigFile(cwd?: string) {
  return findUp(['docspec.config.{ts,mts,cts,js,mjs,cjs,json,yaml,yml}'], cwd ? [cwd] : undefined)
}

const protoPollutionKeys = new Set(['__proto__', 'prototype', 'constructor'])

function isSafeKey(key: string): boolean {
  return !protoPollutionKeys.has(key)
}

function setPath(target: Record<string, unknown>, path: string[], value: unknown) {
  let obj: Record<string, unknown> = target

  for (let i = 0; i < path.length; i++) {
    const key = path[i]

    if (!key || !isSafeKey(key)) return

    const isLast = i === path.length - 1

    if (isLast) {
      obj[key] = value
      return
    }

    const existing = obj[key]

    if (
      existing === undefined ||
      typeof existing !== 'object' ||
      existing === null ||
      Array.isArray(existing)
    ) {
      obj[key] = {}
    }

    obj = obj[key] as Record<string, unknown>
  }
}

/**
 * Expands dotted keys into nested objects.
 *
 * Example:
 * { "config.foo": true } -> { config: { foo: true } }
 */
export function unflattenObject(input: Record<string, unknown>) {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(input)) {
    if (!key.includes('.')) {
      result[key] = value
      continue
    }

    const parts = key.split('.').filter(Boolean)

    if (parts.length === 0) continue

    setPath(result, parts, value)
  }

  return result
}

export function templateTag<Return>(func: (text: string) => Return) {
  return (strings: TemplateStringsArray | string, ...expr: unknown[]) => {
    if (typeof strings === 'string') {
      return func(strings)
    }

    let text = strings[0] ?? ''

    for (let i = 0; i < expr.length; i++) {
      text += String(expr[i]) + (strings[i + 1] ?? '')
    }

    return func(text)
  }
}

export function dedent(value: string) {
  const lines = value.replace(/\r\n/g, '\n').split('\n')

  while (lines[0]?.trim() === '') lines.shift()
  while (lines[lines.length - 1]?.trim() === '') lines.pop()

  const minIndent = Math.min(
    ...lines.filter((line) => line.trim()).map((line) => /^\s*/.exec(line)?.[0].length ?? 0),
  )

  return lines.map((line) => line.slice(minIndent)).join('\n')
}

export interface AsyncSequence<
  T = unknown,
  Args extends unknown[] = unknown[],
> extends AsyncSequencePrototype<T, Args> {
  (...args: Args): AsyncGenerator<T>
}

export interface AsyncSequencePrototype<T = unknown, Args extends unknown[] = unknown[]> {
  all(...args: Args): Promise<T[]>
  first(...args: Args): Promise<T | undefined>
  last(...args: Args): Promise<T | undefined>
}

const AsyncSequencePrototype: AsyncSequencePrototype = {
  async all(this: AsyncSequence, ...args: unknown[]) {
    const matches: unknown[] = []

    for await (const match of this(...args)) {
      matches.push(match)
    }

    return matches
  },

  async first(this: AsyncSequence, ...args: unknown[]) {
    for await (const match of this(...args)) {
      return match
    }
  },

  async last(this: AsyncSequence, ...args: unknown[]) {
    let lastMatch: unknown
    for await (const match of this(...args)) {
      lastMatch = match
    }
    return lastMatch
  },
}

export function createAsyncSequence<T = unknown, Args extends unknown[] = unknown[]>(
  yieldEach: (...args: Args) => AsyncGenerator<T>,
): AsyncSequence<T, Args> {
  return Object.setPrototypeOf(yieldEach, AsyncSequencePrototype) as AsyncSequence<T, Args>
}

export function isAsyncSequence(value: unknown): value is AsyncSequence {
  return (
    typeof value === 'function' &&
    typeof (value as AsyncSequence).first === 'function' &&
    typeof (value as AsyncSequence).last === 'function' &&
    typeof (value as AsyncSequence).all === 'function'
  )
}

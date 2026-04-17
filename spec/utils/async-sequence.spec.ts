import { createAsyncSequence, isAsyncSequence } from '@/utils/async-sequence.js'

describe(createAsyncSequence, () => {
  it('creates a callable async generator function', () => {
    const sequence = createAsyncSequence(async function* () {
      // no-op
    })

    const generator = sequence()

    expect(generator[Symbol.asyncIterator]).toBeInstanceOf(Function)
  })

  it('passes arguments to the generator function', async () => {
    const sequence = createAsyncSequence(async function* (start: number, end: number) {
      yield Promise.resolve(start)
      yield Promise.resolve(end)
    })

    const results: number[] = []
    for await (const value of sequence(6, 7)) {
      results.push(value)
    }

    expect(results).toEqual([6, 7])
  })

  it('first() stops iteration after first value', async () => {
    let iterationCount = 0

    const sequence = createAsyncSequence(async function* () {
      iterationCount++
      yield Promise.resolve(1)
      iterationCount++
      yield Promise.resolve(2)
    })

    await sequence.first()

    expect(iterationCount).toBe(1)
  })

  describe('with items', () => {
    const sequence = createAsyncSequence(async function* () {
      yield Promise.resolve(1)
      yield Promise.resolve(2)
    })

    it('all() collects all yielded values', async () => {
      expect(await sequence.all()).toEqual([1, 2])
    })

    it('first() returns the first value', async () => {
      expect(await sequence.first()).toBe(1)
    })

    it('last() returns the last value', async () => {
      expect(await sequence.last()).toBe(2)
    })
  })

  describe('with no items', () => {
    const sequence = createAsyncSequence(async function* () {
      // no-op
    })

    it('all() returns an empty array', async () => {
      expect(await sequence.all()).toEqual([])
    })

    it('first() returns undefined', async () => {
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      expect(await sequence.first()).toBeUndefined()
    })

    it('last() returns undefined', async () => {
      // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
      expect(await sequence.last()).toBeUndefined()
    })
  })
})

describe(isAsyncSequence, () => {
  it('returns true for async sequence created with createAsyncSequence', () => {
    const sequence = createAsyncSequence(async function* () {
      // no-op
    })
    expect(isAsyncSequence(sequence)).toBe(true)
  })

  it('returns false for plain function', () => {
    expect(isAsyncSequence(() => void 0)).toBe(false)
  })

  it('returns false for object with partial methods', () => {
    const partial = Object.assign(() => void 0, {
      first: () => void 0,
    })

    expect(isAsyncSequence(partial)).toBe(false)
  })

  it('returns false for non-functions', () => {
    expect(isAsyncSequence(null)).toBe(false)
    expect(isAsyncSequence(undefined)).toBe(false)
    expect(isAsyncSequence({})).toBe(false)
    expect(
      isAsyncSequence({
        first: () => void 0,
        last: () => void 0,
        all: () => void 0,
      }),
    ).toBe(false)
  })
})

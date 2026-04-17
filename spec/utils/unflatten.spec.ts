import { unflattenObject } from '@/utils/unflatten.js'

describe(unflattenObject, () => {
  it('returns an empty object when given an empty input', () => {
    expect(unflattenObject({})).toEqual({})
  })

  it('passes through flat keys unchanged', () => {
    expect(unflattenObject({ foo: 1, bar: 'baz' })).toEqual({ foo: 1, bar: 'baz' })
  })

  it('expands a single dotted key into a nested object', () => {
    expect(unflattenObject({ 'a.b': 1 })).toEqual({ a: { b: 1 } })
  })

  it('expands deeply nested dotted keys', () => {
    expect(unflattenObject({ 'a.b.c': 42 })).toEqual({ a: { b: { c: 42 } } })
  })

  it('merges multiple dotted keys sharing a common prefix', () => {
    expect(unflattenObject({ 'a.b': 1, 'a.c': 2 })).toEqual({ a: { b: 1, c: 2 } })
  })

  it('mixes flat and dotted keys', () => {
    expect(unflattenObject({ x: 'flat', 'a.b': 1 })).toEqual({ x: 'flat', a: { b: 1 } })
  })

  it('ignores __proto__ keys to prevent prototype pollution', () => {
    const result = unflattenObject({ '__proto__.polluted': true })

    expect(result).toEqual({})
  })

  it('ignores prototype keys to prevent prototype pollution', () => {
    const result = unflattenObject({ 'prototype.polluted': true })

    expect(result).toEqual({})
  })

  it('ignores constructor keys to prevent prototype pollution', () => {
    const result = unflattenObject({ 'constructor.polluted': true })

    expect(result).toEqual({})
  })
})

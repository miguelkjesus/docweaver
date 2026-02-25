export type Key = string | symbol | number

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Callback = (...args: any[]) => any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractClass = abstract new (...args: any[]) => any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Class = new (...args: any[]) => any

export type StripInternals<T> = Omit<T, `__${string}`>

export type MethodKeysOf<T> = {
  [K in keyof T]: T[K] extends Callback ? K : never
}[keyof T]

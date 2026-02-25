import { AbstractClass, Callback } from './internal/utils/types'
import { ClassBuilder, createClass, createFunction, FunctionBuilder } from './nodes'

export const document = {
  class: <Class extends AbstractClass>(
    cls: string | Class,
    docs: string | ((builder: ClassBuilder<Class>) => void),
  ) => {
    const name = typeof cls === 'string' ? cls : cls.name
    return createClass(name, docs)
  },
  function: (func: string | Callback, docs: string | ((builder: FunctionBuilder) => void)) => {
    const name = typeof func === 'string' ? func : func.name
    return createFunction(name, docs)
  },
} as const

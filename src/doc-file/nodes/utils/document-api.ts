import type { AbstractClass, Callback } from '@/utils/types.js'

import { type ClassBuilder, createClass } from '../composites/class.js'
import { createFunction, type FunctionBuilder } from '../composites/function.js'

export const doc = {
  class<Class extends AbstractClass>(
    cls: string | Class,
    docs: string | ((builder: ClassBuilder<Class>) => void),
  ) {
    const name = typeof cls === 'string' ? cls : cls.name
    return createClass(name, docs)
  },

  function(func: string | Callback, docs: string | ((builder: FunctionBuilder) => void)) {
    const name = typeof func === 'string' ? func : func.name
    return createFunction(name, docs)
  },
}

export type DocumentApi = typeof doc

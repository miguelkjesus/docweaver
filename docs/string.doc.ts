import { document } from '@/documenter'

export default document.class(String, ({ text, method, property }) => {
  text('String is a thing.')

  // Instance methods/props

  property('length', 'The length of the string.')

  method('charAt', ({ text, parameter }) => {
    text('Returns the character at the specified index.')

    parameter('pos', 'The zero-based index of the desired character.')
  })

  // Static methods/props

  method.static('fromCharCode', ({ text, parameter }) => {
    text('Creates a string from the specified sequence of UTF-16 code units.')

    parameter('...codes', 'The sequence of UTF-16 code units to convert into a string.')
  })

  method.static('fromCodePoint', ({ text, parameter }) => {
    text('Creates a string from the specified sequence of code points.')

    parameter('...codePoints', 'The sequence of code points to convert into a string.')
  })

  method.static('raw', ({ text }) => {
    text('A tag function of a template literal that gets the raw string form of the substitutions.')
  })
})

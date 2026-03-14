import { DocumentApi } from '@/nodes/utils/document-api.js'

describe('document.class', () => {
  const document = new DocumentApi()

  it('creates a class node', () => {
    const result = document.class('', '')

    expect(result.type).toBe('class')
  })

  it('creates node with name from string', () => {
    const result = document.class('MyClass', '')

    expect(result.name).toBe('MyClass')
  })

  it('creates node with name from class constructor', () => {
    // eslint-disable-next-line @typescript-eslint/no-extraneous-class
    class TestClass {}

    const result = document.class(TestClass, '')

    expect(result.name).toBe('TestClass')
  })

  it('passes docs to builder', () => {
    const result = document.class('MyClass', (builder) => {
      builder.text('some text')
    })

    expect(result.content).toMatchObject([{ type: 'text', value: 'some text' }])
  })
})

describe('document.function', () => {
  const document = new DocumentApi()

  it('creates function node with name from string', () => {
    const result = document.function('myFunction', 'description')

    expect(result.name).toBe('myFunction')
  })

  it('creates function node with name from function', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function testFunction() {}

    const result = document.function(testFunction, 'description')

    expect(result.name).toBe('testFunction')
  })

  it('passes docs to builder', () => {
    const result = document.function('myFunction', (builder) => {
      builder.parameter('arg', 'the argument')
    })

    expect(result.content).toMatchObject([{ type: 'parameter', key: 'arg' }])
  })
})

import { createMockFileSystem } from '@spec/mocks/fs.js'

import { isAsyncSequence } from '@/internal/utils/async-sequence.js'
import { findDown, findUp } from '@/utils/find.js'

describe(findDown, () => {
  it('is an async sequence', () => {
    expect(isAsyncSequence(findDown)).toBe(true)
  })

  it('finds files matching pattern in directory', async () => {
    createMockFileSystem({
      '/project/src/index.ts': '',
      '/project/src/utils.ts': '',
      '/project/README.md': '',
    })

    const results = await findDown.all('**/*.ts', { cwd: '/project' })

    expect(results).toEqual(expect.arrayContaining(['/project/src/index.ts', '/project/src/utils.ts']))
    expect(results).toHaveLength(2)
  })

  it('returns absolute paths', async () => {
    createMockFileSystem({
      '/project/file.ts': '',
    })

    const results = await findDown.all('*.ts', { cwd: '/project' })

    expect(results[0]).toBe('/project/file.ts')
  })

  it('supports multiple patterns', async () => {
    createMockFileSystem({
      '/project/index.ts': '',
      '/project/styles.css': '',
      '/project/readme.md': '',
    })

    const results = await findDown.all(['*.ts', '*.css'], { cwd: '/project' })

    expect(results).toEqual(expect.arrayContaining(['/project/index.ts', '/project/styles.css']))
    expect(results).toHaveLength(2)
  })

  it('supports from option', async () => {
    createMockFileSystem({
      '/project/src/index.ts': '',
      '/project/lib/utils.ts': '',
    })

    const results = await findDown.all('*.ts', { from: 'src', cwd: '/project' })

    expect(results).toEqual(['/project/src/index.ts'])
  })

  it('supports multiple from paths', async () => {
    createMockFileSystem({
      '/project/src/index.ts': '',
      '/project/lib/utils.ts': '',
      '/project/test/spec.ts': '',
    })

    const results = await findDown.all('*.ts', { from: ['src', 'lib'], cwd: '/project' })

    expect(results).toEqual(expect.arrayContaining(['/project/src/index.ts', '/project/lib/utils.ts']))
    expect(results).toHaveLength(2)
  })

  it('returns empty array for non-matching patterns', async () => {
    createMockFileSystem({
      '/project/file.ts': '',
    })

    const results = await findDown.all('*.js', { cwd: '/project' })

    expect(results).toEqual([])
  })
})

describe(findUp, () => {
  it('is an async sequence', () => {
    expect(isAsyncSequence(findUp)).toBe(true)
  })

  it('finds file in current directory', async () => {
    createMockFileSystem({
      '/project/config.json': '',
    })

    const result = await findUp.first('config.json', { cwd: '/project' })

    expect(result).toBe('/project/config.json')
  })

  it('walks up to find file in parent directories', async () => {
    createMockFileSystem({
      '/project/config.json': '',
      '/project/src/deep/file.ts': '',
    })

    const result = await findUp.first('config.json', { cwd: '/project/src/deep' })

    expect(result).toBe('/project/config.json')
  })

  it('returns matches from each level when pattern matches in multiple ancestors', async () => {
    createMockFileSystem({
      '/project/package.json': '',
      '/project/src/package.json': '',
      '/project/src/deep/file.ts': '',
    })

    const results = await findUp.all('package.json', { cwd: '/project/src/deep' })

    expect(results).toEqual(['/project/src/package.json', '/project/package.json'])
  })

  it('supports multiple patterns', async () => {
    createMockFileSystem({
      '/project/config.json': '',
      '/project/config.yaml': '',
    })

    const results = await findUp.all(['config.json', 'config.yaml'], { cwd: '/project' })

    expect(results).toEqual(expect.arrayContaining(['/project/config.json', '/project/config.yaml']))
  })

  it('supports from option', async () => {
    createMockFileSystem({
      '/project/config.json': '',
      '/project/src/file.ts': '',
    })

    const result = await findUp.first('config.json', { from: 'src', cwd: '/project' })

    expect(result).toBe('/project/config.json')
  })

  it('supports multiple from paths', async () => {
    createMockFileSystem({
      '/project/config.json': '',
      '/project/src/file.ts': '',
      '/project/lib/file.ts': '',
    })

    const results = await findUp.all('config.json', { from: ['src', 'lib'], cwd: '/project' })

    expect(results).toEqual(['/project/config.json', '/project/config.json'])
  })

  it('returns undefined when file not found', async () => {
    createMockFileSystem({
      '/project/file.ts': '',
    })

    const result = await findUp.first('config.json', { cwd: '/project' })

    expect(result).toBeUndefined()
  })
})

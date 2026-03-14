import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

export function disposableTempDirectory() {
  const dir = path.join(os.tmpdir(), 'docspec-')

  return fs.mkdtempDisposable(dir)
}

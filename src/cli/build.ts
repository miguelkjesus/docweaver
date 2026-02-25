import { glob } from '@/internal/utils/find-files'
import { assertDefaultExport } from '@/internal/utils/load-files'

import { Config } from './config'

// TODO tests

export async function build(config: Config) {
  const files = glob(config.files, config.paths)

  const docs = await Promise.all(files.map(loadDocumentation))

  console.log(docs)
}

export async function loadDocumentation(file: string) {
  return await assertDefaultExport(
    file,
    `"${file}" must export documentation as the default export`,
  )
}

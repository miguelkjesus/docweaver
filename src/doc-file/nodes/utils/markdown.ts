import { templateTag } from '@/utils/string.js'

import type { AddMarkdown } from '../literals/markdown.js'

export const markdown = templateTag((markdown: string) => {
  return (builder: AddMarkdown) => {
    builder.markdown(markdown)
  }
})

export const md = markdown

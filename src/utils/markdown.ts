import { templateTag } from '../internal/utils/string'
import { AddMarkdown } from '../nodes'

export const markdown = templateTag((markdown: string) => {
  return (builder: AddMarkdown) => {
    builder.markdown(markdown)
  }
})

export const md = markdown

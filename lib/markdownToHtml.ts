import remark from 'remark'
import html from 'remark-html'
// @ts-ignore
import prism from 'remark-prism'
import footnotes from 'remark-footnotes'

export default async function markdownToHtml (markdown: string) {
  const result = await remark()
    .use(footnotes, { inlineNotes: true })
    .use(prism)
    .use(html)
    .process(markdown)

  return result.toString()
}

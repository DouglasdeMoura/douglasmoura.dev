const definitionPattern = /<p>\[\^(\w+)\]:\s*([\s\S]*?)<\/p>/g;
const referencePattern = /\[\^(\w+)\]/g;

export const renderFootnotes = (html: string): string => {
  const definitions = new Map<string, string>();

  let processed = html.replace(
    definitionPattern,
    (_, id: string, content: string) => {
      definitions.set(id, content.trim());
      return "";
    }
  );

  if (definitions.size === 0) {
    return html;
  }

  processed = processed.replace(
    referencePattern,
    (_, id: string) =>
      `<sup><a href="#fn-${id}" id="fnref-${id}">[${id}]</a></sup>`
  );

  const items = [...definitions.entries()]
    .map(
      ([id, content]) =>
        `<li id="fn-${id}"><p>${content} <a href="#fnref-${id}" class="footnote-back" aria-label="Back to reference ${id}">↩</a></p></li>`
    )
    .join("\n");

  const section = `<section class="footnotes" role="region" aria-label="Footnotes">\n<hr>\n<ol>\n${items}\n</ol>\n</section>`;

  return `${processed}\n${section}`;
};

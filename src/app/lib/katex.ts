import { renderToString } from "katex";

const X_EQUATION_RE =
  /<x-equation(?: type="display")?>([\s\S]*?)<\/x-equation>/g;
const DISPLAY_RE = /type="display"/;

export const renderMathInHtml = (
  html: string
): { html: string; hasMath: boolean } => {
  let hasMath = false;

  const result = html.replace(X_EQUATION_RE, (match, tex: string) => {
    hasMath = true;
    const displayMode = DISPLAY_RE.test(match);
    return renderToString(tex, {
      displayMode,
      output: "htmlAndMathml",
      throwOnError: false,
    });
  });

  return { hasMath, html: result };
};

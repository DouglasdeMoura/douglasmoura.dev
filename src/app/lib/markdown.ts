import { createHighlighterCore } from "@shikijs/core";
import { createJavaScriptRegexEngine } from "@shikijs/engine-javascript";
import bash from "@shikijs/langs/bash";
import css from "@shikijs/langs/css";
import diff from "@shikijs/langs/diff";
import dockerfile from "@shikijs/langs/dockerfile";
import go from "@shikijs/langs/go";
import graphql from "@shikijs/langs/graphql";
import html from "@shikijs/langs/html";
import javascript from "@shikijs/langs/javascript";
import json from "@shikijs/langs/json";
import jsx from "@shikijs/langs/jsx";
import markdown from "@shikijs/langs/markdown";
import powershell from "@shikijs/langs/powershell";
import python from "@shikijs/langs/python";
import rust from "@shikijs/langs/rust";
import sql from "@shikijs/langs/sql";
import toml from "@shikijs/langs/toml";
import tsx from "@shikijs/langs/tsx";
import typescript from "@shikijs/langs/typescript";
import yaml from "@shikijs/langs/yaml";
import vitesseDark from "@shikijs/themes/vitesse-dark";
import vitesseLight from "@shikijs/themes/vitesse-light";
import { init, renderToHtml } from "md4x/wasm";

import { renderFootnotes } from "#app/lib/footnotes.js";
import { renderMathInHtml } from "#app/lib/katex.js";

let ready: Promise<void> | undefined;

const ensureInit = (): Promise<void> => {
  if (!ready) {
    ready = init();
  }
  return ready;
};

let highlighterPromise: ReturnType<typeof createHighlighterCore> | undefined;

const getHighlighter = () => {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      engine: createJavaScriptRegexEngine(),
      langs: [
        bash,
        css,
        diff,
        dockerfile,
        go,
        graphql,
        html,
        javascript,
        json,
        jsx,
        markdown,
        python,
        rust,
        sql,
        toml,
        tsx,
        typescript,
        yaml,
        powershell,
      ],
      themes: [vitesseLight, vitesseDark],
    });
  }
  return highlighterPromise;
};

export const renderMarkdown = async (
  md: string
): Promise<{ hasMath: boolean; html: string }> => {
  const [, shiki] = await Promise.all([ensureInit(), getHighlighter()]);

  const raw = renderToHtml(md, {
    highlighter: (code, block) => {
      if (!block.lang) {
        return;
      }

      const lines = code.split("\n");
      const decorations =
        block.highlights?.map((lineNum) => {
          const lineIndex = lineNum - 1;
          const lineLength = lines[lineIndex]?.length ?? 0;
          return {
            end: { character: lineLength, line: lineIndex },
            properties: { class: "highlighted-line" },
            start: { character: 0, line: lineIndex },
          };
        }) ?? [];

      let highlighted = shiki.codeToHtml(code, {
        decorations,
        defaultColor: false,
        lang: block.lang,
        themes: {
          dark: "vitesse-dark",
          light: "vitesse-light",
        },
      });

      if (block.filename) {
        highlighted = `<div class="code-block-wrapper"><div class="code-block-filename">${block.filename}</div>${highlighted}</div>`;
      }

      return highlighted;
    },
  }) as string;

  const { hasMath, html: mathHtml } = renderMathInHtml(raw);
  return { hasMath, html: renderFootnotes(mathHtml) };
};

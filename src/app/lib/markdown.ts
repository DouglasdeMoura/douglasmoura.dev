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
import python from "@shikijs/langs/python";
import rust from "@shikijs/langs/rust";
import sql from "@shikijs/langs/sql";
import toml from "@shikijs/langs/toml";
import tsx from "@shikijs/langs/tsx";
import typescript from "@shikijs/langs/typescript";
import yaml from "@shikijs/langs/yaml";
import githubDark from "@shikijs/themes/github-dark";
import githubLight from "@shikijs/themes/github-light";
import { init, renderToHtml } from "md4x/wasm";

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
      ],
      themes: [githubLight, githubDark],
    });
  }
  return highlighterPromise;
};

export const renderMarkdown = async (md: string): Promise<string> => {
  const [, shiki] = await Promise.all([ensureInit(), getHighlighter()]);

  return renderToHtml(md, {
    highlighter: (code, block) => {
      if (!block.lang) {
        return;
      }
      return shiki.codeToHtml(code, {
        defaultColor: false,
        lang: block.lang,
        themes: {
          dark: "github-dark",
          light: "github-light",
        },
      });
    },
  }) as string;
};

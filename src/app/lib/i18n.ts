import pino from "pino";
import { getRequestInfo } from "rwsdk/worker";

const logger = pino({ name: "i18n" });

type Locale = "en-US" | "pt-BR";

const translations = {
  "pt-BR": {
    About: "Sobre",
    "Also available in": "Também disponível em",
    "Back to home": "Voltar ao início",
    Bookmarks: "Favoritos",
    "Conference talks and presentations by Douglas Moura on web development, TypeScript, React, and software engineering at events across Brazil.":
      "Palestras e apresentações de Douglas Moura sobre desenvolvimento web, TypeScript, React e engenharia de software em eventos pelo Brasil.",
    "Douglas Moura is a software engineer in São Paulo. From civil engineering to software — building design systems, banking apps, AI agents, and healthcare solutions.":
      "Douglas Moura é engenheiro de software em São Paulo. Da engenharia civil ao software — construindo design systems, apps bancários, agentes de IA e soluções de saúde.",
    "Douglas Moura — Software Engineer in São Paulo. Articles about web development, TypeScript, React, and the things I learn along the way.":
      "Douglas Moura — Engenheiro de Software em São Paulo. Artigos sobre desenvolvimento web, TypeScript, React e as coisas que aprendo no caminho.",
    "Douglas Moura — Software Engineer | Web Development Blog":
      "Douglas Moura — Engenheiro de Software | Blog de Desenvolvimento Web",
    "Enter a search term": "Digite um termo de pesquisa",
    Event: "Evento",
    Home: "Início",
    "Last updated on": "Atualizado em",
    Next: "Próximo",
    "No results found": "Nenhum resultado encontrado",
    Page: "Página",
    "Page not found": "Página não encontrada",
    Pagination: "Paginação",
    "Posts tagged": "Artigos com a tag",
    Previous: "Anterior",
    "Published on": "Publicado em",
    Recording: "Gravação",
    Search: "Pesquisar",
    "Search or jump to…": "Pesquisar ou ir para…",
    "Search results for": "Resultados da pesquisa para",
    "Skip to content": "Pular para o conteúdo",
    Slides: "Slides",
    "Switch language": "Alterar linguagem",
    Talks: "Palestras",
    Theme: "Tema",
    "Web Development Articles": "Artigos sobre Desenvolvimento Web",
    "min. read": "min. de leitura",
    result: "resultado",
    results: "resultados",
  },
} as const satisfies Record<string, Record<string, string>>;

type TranslationKey = keyof (typeof translations)["pt-BR"];

/** Read locale from rwsdk request context. Falls back to en-US. */
export const getLocale = (): Locale => {
  try {
    const { ctx } = getRequestInfo();
    return (ctx as { locale?: Locale }).locale ?? "en-US";
  } catch {
    return "en-US";
  }
};

/**
 * Gettext-style translate. Returns the translation for the current
 * request locale, or the input string itself when none is found.
 */
export const t = (text: TranslationKey | string): string => {
  const locale = getLocale();
  if (locale === "en-US") {
    return text;
  }
  const translated = (translations as Record<string, Record<string, string>>)[
    locale
  ]?.[text];
  if (!translated) {
    logger.warn({ key: text, locale }, "Missing translation");
  }
  return translated ?? text;
};

/** Format a date string using the current request locale. */
export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat(getLocale(), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));

/** Short date for compact listings (e.g. "Sep 27, 2024" / "27 set. 2024"). */
export const formatDateShort = (iso: string): string =>
  new Intl.DateTimeFormat(getLocale(), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

export const translations = {
  "pt-BR": {
    "A curated collection of links and resources on web development, software engineering, and design.":
      "Uma coleção curada de links e recursos sobre desenvolvimento web, engenharia de software e design.",
    About: "Sobre",
    "Also available in": "Também disponível em",
    "Back to home": "Voltar ao início",
    "Back to reference": "Voltar à referência",
    Bookmarks: "Favoritos",
    Breadcrumbs: "Navegação estrutural",
    "Coming soon.": "Em breve.",
    "Conference talks and presentations by Douglas Moura on web development, TypeScript, React, and software engineering at events across Brazil.":
      "Palestras e apresentações de Douglas Moura sobre desenvolvimento web, TypeScript, React e engenharia de software em eventos pelo Brasil.",
    "Douglas Moura is a software engineer in São Paulo. Building design systems, banking apps, AI agents, and healthcare solutions.":
      "Douglas Moura é engenheiro de software em São Paulo. Construindo design systems, apps bancários, agentes de IA e soluções de saúde.",
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
    Pages: "Páginas",
    Pagination: "Paginação",
    Posts: "Artigos",
    "Posts tagged": "Artigos com a tag",
    Preferences: "Preferências",
    Previous: "Anterior",
    "Privacy Policy": "Política de Privacidade",
    "Privacy policy for douglasmoura.dev — a personal blog with minimal data collection and no tracking cookies.":
      "Política de privacidade do douglasmoura.dev — um blog pessoal com coleta mínima de dados e sem cookies de rastreamento.",
    "Published on": "Publicado em",
    Recording: "Gravação",
    Search: "Pesquisar",
    "Search for": "Pesquisar por",
    "Search or jump to…": "Pesquisar ou ir para…",
    "Search results for": "Resultados da pesquisa para",
    "Skip to content": "Pular para o conteúdo",
    Slides: "Slides",
    "Switch language": "Alterar linguagem",
    Talks: "Palestras",
    Theme: "Tema",
    "Web Development Articles": "Artigos sobre Desenvolvimento Web",
    close: "fechar",
    "min. read": "min. de leitura",
    navigate: "navegar",
    open: "abrir",
    result: "resultado",
    results: "resultados",
  },
} as const satisfies Record<string, Record<string, string>>;

export type Locale = "en-US" | "pt-BR";

export type TranslationKey = keyof (typeof translations)["pt-BR"];

/**
 * Pure gettext-style lookup for a given locale. Safe for client bundles (no request context).
 */
export const translate = (
  locale: Locale,
  text: TranslationKey | string
): string => {
  if (locale === "en-US") {
    return text;
  }
  return (
    (translations as Record<string, Record<string, string>>)[locale]?.[text] ??
    text
  );
};

const shortDateFormatters = new Map<string, Intl.DateTimeFormat>();

/** Short date for compact listings (e.g. "Sep 27, 2024" / "27 set. 2024"). */
export const formatDateShortLocale = (locale: string, iso: string): string => {
  let fmt = shortDateFormatters.get(locale);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    shortDateFormatters.set(locale, fmt);
  }
  return fmt.format(new Date(iso));
};

export const getCommandMenuLabels = (locale: Locale) => ({
  close: translate(locale, "close"),
  navigate: translate(locale, "navigate"),
  open: translate(locale, "open"),
  pages: translate(locale, "Pages"),
  posts: translate(locale, "Posts"),
  preferences: translate(locale, "Preferences"),
  searchFor: translate(locale, "Search for"),
});

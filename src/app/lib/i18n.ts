import pino from "pino";
import { getRequestInfo } from "rwsdk/worker";

const logger = pino({ name: "i18n" });

type Locale = "en-US" | "pt-BR";

const translations = {
  "pt-BR": {
    About: "Sobre",
    Archive: "Arquivo",
    "Back to home": "Voltar ao início",
    Language: "Idioma",
    "Last updated on": "Atualizado em",
    Next: "Próximo",
    "Page not found": "Página não encontrada",
    Pagination: "Paginação",
    Posts: "Artigos",
    Previous: "Anterior",
    "Published on": "Publicado em",
    Search: "Buscar",
    Theme: "Tema",
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

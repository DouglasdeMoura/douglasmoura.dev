const labels = {
  "en-US": { published: "Published on", updated: "Last updated on" },
  "pt-BR": { published: "Publicado em", updated: "Atualizado em" },
} as const;

type Locale = keyof typeof labels;

export const formatDate = (iso: string, locale: Locale): string =>
  new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));

export const getDateLabel = (
  key: "published" | "updated",
  locale: Locale
): string => labels[locale][key];

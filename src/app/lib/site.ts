/** Canonical site origin (no trailing slash). */
export const SITE_URL =
  import.meta.env.VITE_SITE_URL ?? "https://douglasmoura.dev";

/**
 * Path prefix for locale-scoped routes (no trailing slash).
 * English site uses the root; Portuguese uses `/pt-BR`.
 */
export type LocalePathPrefix = "" | "/pt-BR";

export const localePathPrefix = (locale: "en-US" | "pt-BR"): LocalePathPrefix =>
  locale === "pt-BR" ? "/pt-BR" : "";

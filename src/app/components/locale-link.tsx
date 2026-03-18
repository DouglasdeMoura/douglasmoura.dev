import type { PostAlternate } from "#app/lib/posts.js";

export const getLocaleHref = (
  locale: "en-US" | "pt-BR",
  alternates: PostAlternate[]
): string => {
  const targetLocale = locale === "en-US" ? "pt-BR" : "en-US";
  const alt = alternates.find((a) => a.locale === targetLocale);
  if (alt) {
    return `/${targetLocale}?redirect=${encodeURIComponent(`/${alt.slug}`)}`;
  }
  return `/${targetLocale}`;
};

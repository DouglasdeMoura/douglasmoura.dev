import { Translate as TranslateIcon } from "@phosphor-icons/react/dist/ssr/Translate";

import type { PostAlternate } from "#app/lib/posts.js";

interface LocaleLinkProps {
  locale: "en-US" | "pt-BR";
  alternates: PostAlternate[];
}

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

export const LocaleLink = ({ locale, alternates }: LocaleLinkProps) => {
  const targetLocale = locale === "en-US" ? "pt-BR" : "en-US";
  const alt = alternates.find((a) => a.locale === targetLocale);
  const href = getLocaleHref(locale, alternates);

  return (
    <a
      href={href}
      lang={targetLocale}
      hrefLang={targetLocale}
      aria-label={targetLocale === "pt-BR" ? "Português" : "English"}
      className={`inline-flex items-center justify-center size-8 text-sm motion-safe:transition-[color,transform] motion-safe:duration-150 active:scale-[0.97] ${
        alt
          ? "text-text-muted hover:text-text-strong"
          : "text-text-muted/50 hover:text-text-muted"
      }`}
    >
      <TranslateIcon size={18} weight={alt ? "regular" : "thin"} />
    </a>
  );
};

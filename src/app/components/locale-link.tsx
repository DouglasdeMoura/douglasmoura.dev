import { Translate as TranslateIcon } from "@phosphor-icons/react/dist/ssr/Translate";

import type { PostAlternate } from "#app/lib/posts.js";

interface LocaleLinkProps {
  locale: "en-US" | "pt-BR";
  alternates: PostAlternate[];
}

const LOCALE_NAMES: Record<string, string> = {
  "en-US": "English",
  "pt-BR": "Português",
};

export const LocaleLink = ({ locale, alternates }: LocaleLinkProps) => {
  const targetLocale = locale === "en-US" ? "pt-BR" : "en-US";
  const alt = alternates.find((a) => a.locale === targetLocale);
  const href = alt ? `/${alt.slug}` : "/";
  const hasTranslation = Boolean(alt);

  return (
    <a
      href={href}
      lang={targetLocale}
      hrefLang={targetLocale}
      aria-label={LOCALE_NAMES[targetLocale]}
      className={`inline-flex items-center justify-center size-8 text-sm motion-safe:transition-[color,transform] motion-safe:duration-150 active:scale-[0.97] ${
        hasTranslation
          ? "text-text-muted hover:text-text-strong"
          : "text-text-muted/50 hover:text-text-muted"
      }`}
    >
      <TranslateIcon size={18} weight={hasTranslation ? "regular" : "thin"} />
    </a>
  );
};

import { Bookmarks as BookmarksIcon } from "@phosphor-icons/react/dist/ssr/Bookmarks";
import { House as HomeIcon } from "@phosphor-icons/react/dist/ssr/House";
import { Microphone as MicrophoneIcon } from "@phosphor-icons/react/dist/ssr/Microphone";
import { Translate as TranslateIcon } from "@phosphor-icons/react/dist/ssr/Translate";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";

import { getLocaleHref } from "#app/components/locale-link.js";
import { SearchTrigger } from "#app/components/search-trigger.js";
import { t } from "#app/lib/i18n.js";
import type { PostAlternate } from "#app/lib/posts.js";
import { localePathPrefix } from "#app/lib/site.js";

interface HeaderProps {
  locale: "en-US" | "pt-BR";
  alternates: PostAlternate[];
  pathname?: string;
}

export const Header = ({ locale, alternates, pathname }: HeaderProps) => {
  const prefix = localePathPrefix(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-0/80 backdrop-blur-lg">
      <div className="flex items-center justify-between px-4 py-3 max-w-prose mx-auto">
        <a
          href={prefix || "/"}
          className="flex items-center gap-1 text-text-strong no-underline motion-safe:transition-colors motion-safe:duration-150"
        >
          <span className="text-base font-semibold tracking-tight">
            Douglas
          </span>
          <span className="text-base font-normal tracking-tight opacity-90">
            Moura
          </span>
        </a>
        <nav className="flex items-center gap-1 sm:gap-2">
          <a
            href={`${prefix}/about`}
            className="hidden sm:inline-flex items-center justify-center h-8 px-3 rounded-md text-sm text-text-muted hover:text-text-strong hover:bg-surface-2 active:scale-[0.97] motion-safe:transition-[color,background-color,transform] motion-safe:duration-150"
          >
            {t("About")}
          </a>
          <a
            href={`${prefix}/talks`}
            className="hidden sm:inline-flex items-center justify-center h-8 px-3 rounded-md text-sm text-text-muted hover:text-text-strong hover:bg-surface-2 active:scale-[0.97] motion-safe:transition-[color,background-color,transform] motion-safe:duration-150"
          >
            {t("Talks")}
          </a>
          <SearchTrigger
            locale={locale}
            label={t("Search")}
            placeholder={t("Search or jump to…")}
            emptyText={t("No results found")}
            navItems={[
              {
                href: prefix || "/",
                icon: <HomeIcon size={16} />,
                label: t("Home"),
                shortcut: ["0"],
              },
              {
                href: `${prefix}/about`,
                icon: <UserIcon size={16} />,
                label: t("About"),
                shortcut: ["1"],
              },
              {
                href: `${prefix}/talks`,
                icon: <MicrophoneIcon size={16} />,
                label: t("Talks"),
                shortcut: ["2"],
              },
              {
                href: `${prefix}/bookmarks`,
                icon: <BookmarksIcon size={16} />,
                label: t("Bookmarks"),
                shortcut: ["3"],
              },
              {
                forceReload: true,
                group: "preferences",
                href: getLocaleHref(locale, alternates, pathname),
                icon: <TranslateIcon size={16} />,
                label: locale === "en-US" ? "Português" : "English",
                shortcut: ["Alt", "L"],
              },
            ]}
          />
        </nav>
      </div>
    </header>
  );
};

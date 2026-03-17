import { Bookmarks as BookmarksIcon } from "@phosphor-icons/react/dist/ssr/Bookmarks";
import { Microphone as MicrophoneIcon } from "@phosphor-icons/react/dist/ssr/Microphone";
import { User as UserIcon } from "@phosphor-icons/react/dist/ssr/User";

import { LocaleToggle } from "#app/components/locale-toggle.js";
import { SearchTrigger } from "#app/components/search-trigger.js";
import { ThemeToggle } from "#app/components/theme-toggle.js";
import { t } from "#app/lib/i18n.js";
import type { PostAlternate } from "#app/lib/posts.js";

const GRAVATAR_URL =
  "https://www.gravatar.com/avatar/997c72f0b7ca0fc26bdf60ca27cb4194?s=128";

interface HeaderProps {
  theme: "light" | "dark" | "system";
  themeExplicit: boolean;
  locale: "en-US" | "pt-BR";
  alternates: PostAlternate[];
}

export const Header = ({
  theme,
  themeExplicit,
  locale,
  alternates,
}: HeaderProps) => (
  <header className="sticky top-0 z-40 border-b border-border bg-surface-0/80 backdrop-blur-lg">
    <div className="flex items-center justify-between px-4 py-4 max-w-prose mx-auto">
      <a
        href="/"
        aria-label="Home"
        className="flex items-center gap-3 hover:opacity-80 motion-safe:transition-opacity motion-safe:duration-150"
      >
        <img
          src={GRAVATAR_URL}
          alt="Douglas Moura"
          width={48}
          height={48}
          decoding="async"
          className="rounded-full ring-[3px] ring-accent"
        />
        <span className="hidden sm:inline text-sm font-medium text-text-strong">
          Douglas Moura
        </span>
      </a>
      <nav className="flex items-center gap-4 sm:gap-6">
        <a
          href="/about"
          className="hidden sm:inline-flex items-center justify-center h-12 px-4 text-sm text-text-muted hover:text-text-strong active:scale-[0.97] motion-safe:transition-[color,transform] motion-safe:duration-150"
        >
          {t("About")}
        </a>
        <a
          href="/talks"
          className="hidden sm:inline-flex items-center justify-center h-12 px-4 text-sm text-text-muted hover:text-text-strong active:scale-[0.97] motion-safe:transition-[color,transform] motion-safe:duration-150"
        >
          {t("Talks")}
        </a>
        <SearchTrigger
          locale={locale}
          label={t("Search")}
          placeholder={t("Search posts…")}
          emptyText={t("No results found")}
          navItems={[
            {
              href: "/about",
              icon: <UserIcon size={16} />,
              label: t("About"),
              shortcut: "1",
            },
            {
              href: "/talks",
              icon: <MicrophoneIcon size={16} />,
              label: t("Talks"),
              shortcut: "2",
            },
            {
              href: "/bookmarks",
              icon: <BookmarksIcon size={16} />,
              label: t("Bookmarks"),
              shortcut: "3",
            },
          ]}
        />
        <ThemeToggle
          initialTheme={theme}
          initialExplicit={themeExplicit}
          label={t("Theme")}
        />
        <LocaleToggle
          initialLocale={locale}
          label={t("Language")}
          alternates={alternates}
        />
      </nav>
    </div>
  </header>
);
